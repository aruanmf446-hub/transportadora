import type { SiteConfigInput } from './schema';

/** Type helper for client presets (autocomplete + type checking). */
export function defineClient(config: SiteConfigInput): SiteConfigInput {
  return config;
}

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain => !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * Deep-merge helper to derive a preset from another one.
 * Objects are merged recursively; arrays and primitives are replaced.
 */
export function extendClient<T extends Plain>(base: T, override: DeepPartial<T>): T {
  const out: Plain = { ...base };
  for (const [k, v] of Object.entries(override as Plain)) {
    if (v === undefined) continue;
    out[k] = isPlain(v) && isPlain(out[k]) ? extendClient(out[k] as Plain, v as Plain) : v;
  }
  return out as T;
}

export type DeepPartial<T> = T extends unknown[] ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
