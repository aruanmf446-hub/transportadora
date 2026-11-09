/**
 * Active configuration loader.
 *
 * Select the client preset with the CLIENT environment variable:
 *   CLIENT=nordhaven npm run build
 * Without it, `defaultClient` below is used.
 */
import { SiteConfigSchema, type SiteConfig, type SiteConfigInput } from './schema';

export const defaultClient = 'ortiva';

const presets = import.meta.glob<{ default: SiteConfigInput }>('./clients/*/index.ts', { eager: true });

const registry: Record<string, SiteConfigInput> = {};
for (const [path, mod] of Object.entries(presets)) {
  const id = path.split('/')[2];
  registry[id] = mod.default;
}

const requested = (typeof process !== 'undefined' && process.env?.CLIENT) || import.meta.env.CLIENT || defaultClient;

if (!registry[requested]) {
  throw new Error(
    `[config] Client preset "${requested}" not found. Available: ${Object.keys(registry).join(', ')}`,
  );
}

const parsed = SiteConfigSchema.safeParse(registry[requested]);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`[config] Invalid configuration for client "${requested}":\n${issues}`);
}

/**
 * Deployment adjustments (no edits to the client preset needed):
 *  - BASE_URL (Astro `base`, e.g. "/transportadora" on GitHub Pages) is
 *    prefixed to every public path in the config that starts with "/".
 *  - SITE_URL overrides seo.siteUrl (canonical, sitemap, Open Graph).
 */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
const withBase = (v: unknown): unknown => {
  if (typeof v === 'string') return BASE && v.startsWith('/') && !v.startsWith('//') && !v.startsWith(BASE + '/') ? BASE + v : v;
  if (Array.isArray(v)) return v.map(withBase);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withBase(x)]));
  return v;
};
const resolved = withBase(parsed.data) as SiteConfig;
const siteUrlOverride = (typeof process !== 'undefined' && process.env?.SITE_URL) || undefined;
if (siteUrlOverride) resolved.seo.siteUrl = siteUrlOverride;

export const site: SiteConfig = resolved;
export const availableClients = Object.keys(registry);
export type { SiteConfig };
