/**
 * Site helpers: pages, navigation, link resolution and section resolution.
 * Everything that depends on "is this page/section enabled?" goes through
 * here, so disabling something in the config never leaves a broken link.
 */
import { site } from '../config';
import type { PageConfig, SectionConfig, Service, Case } from '../config/schema';

export { site };

const BASE = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

/** Build an internal URL from a page path */
export function url(path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${BASE}${clean}/` : BASE;
}

export const enabledPages = (): PageConfig[] => site.pages.filter((p) => p.enabled);

export const homePage = (): PageConfig | undefined => enabledPages().find((p) => p.kind === 'home' || p.path === '');

export const pageByKind = (kind: PageConfig['kind']) => enabledPages().find((p) => p.kind === kind);
export const pageById = (id: string) => enabledPages().find((p) => p.id === id);
export const pageByPath = (path: string) => enabledPages().find((p) => p.path === path.replace(/^\/+|\/+$/g, ''));

/* ── Detail pages (generated from data) ───────────────────────────────────── */

export function servicePages(): { page: PageConfig; service: Service; path: string }[] {
  const parent = pageByKind('services');
  if (!parent) return [];
  return site.data.services.filter((s) => s.page).map((service) => ({ page: parent, service, path: `${parent.path}/${service.slug}` }));
}

export function casePages(): { page: PageConfig; item: Case; path: string }[] {
  const parent = pageByKind('cases');
  if (!parent) return [];
  return site.data.cases.filter((c) => c.page).map((item) => ({ page: parent, item, path: `${parent.path}/${item.slug}` }));
}

export const serviceUrl = (slug: string): string | null => {
  const found = servicePages().find((s) => s.service.slug === slug);
  return found ? url(found.path) : null;
};
export const caseUrl = (slug: string): string | null => {
  const found = casePages().find((s) => s.item.slug === slug);
  return found ? url(found.path) : null;
};

/* ── Sections ─────────────────────────────────────────────────────────────── */

export interface ResolvedSection extends SectionConfig {
  anchor: string;
  index: number;
}

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Filters disabled sections, sorts by `order` and assigns unique anchors. */
export function resolveSections(sections: SectionConfig[]): ResolvedSection[] {
  const used = new Set<string>();
  return sections
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.enabled && isSectionAvailable(s))
    .sort((a, b) => (a.s.order ?? a.i) - (b.s.order ?? b.i) || a.i - b.i)
    .map(({ s }, index) => {
      let anchor = s.id || slugify(s.navLabel || s.type);
      while (used.has(anchor)) anchor = `${anchor}-${index}`;
      used.add(anchor);
      return { ...s, anchor, index };
    });
}

/** Some sections depend on data or integrations; hide them when unavailable
 *  so that the page never shows an empty block. */
export function isSectionAvailable(s: SectionConfig): boolean {
  const d = site.data;
  const i = site.integrations;
  switch (s.type) {
    case 'metrics':
      return d.stats.length > 0;
    case 'solutions':
      return d.services.length > 0;
    case 'road-transport':
    case 'special-cargo':
    case 'multimodal':
    case 'service-feature':
      return !!findService(s);
    case 'fleet':
      return d.fleet.length > 0;
    case 'history':
      return d.timeline.length > 0;
    case 'certifications':
      return d.certifications.length > 0;
    case 'clients':
      return d.clients.length > 0 || d.testimonials.length > 0;
    case 'cases':
      return d.cases.length > 0;
    case 'segments':
    case 'insights':
      return d.segments.length > 0;
    case 'gallery':
      return d.gallery.length > 0;
    case 'routes-map':
      return d.geo.cities.length > 0;
    case 'regions':
      return d.geo.regions.length > 0;
    case 'globe':
      return d.geo.globe.points.length > 1;
    case 'quote':
      return !!(i.quote?.enabled && (i.quote.channels.includes('whatsapp') ? i.whatsapp?.number : true) && (i.quote.channels.includes('email') ? i.quote.email : true));
    case 'tracking':
      return !!i.tracking?.enabled;
    case 'contact':
      return site.company.units.length > 0 || !!site.company.contact.email;
    default:
      return true;
  }
}

const DEFAULT_SERVICE: Partial<Record<SectionConfig['type'], number>> = { 'road-transport': 0, 'special-cargo': 1, multimodal: 2 };

export function findService(s: SectionConfig): Service | undefined {
  const slug = s.content?.options?.service as string | undefined;
  if (slug) return site.data.services.find((x) => x.slug === slug);
  const idx = DEFAULT_SERVICE[s.type];
  return idx !== undefined ? site.data.services[idx] : undefined;
}

/* ── Links ────────────────────────────────────────────────────────────────── */

/**
 * Resolves a configured href. Returns null when the target does not exist, so
 * components can hide the link instead of rendering a dead one.
 *   "contato"        → page path (null if page disabled)
 *   "#cotacao"       → anchor (null if not on this page and no fallback)
 *   "@whatsapp"      → WhatsApp link     "@portal"  → client portal
 *   "@careers"       → recruiting page   "@tracking"/"@presentation"/"@quote"
 *   "https://…", "mailto:", "tel:" → returned as-is
 */
export function resolveHref(href: string | undefined, anchors: string[] = []): string | null {
  if (!href) return null;
  const i = site.integrations;
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;
  if (href.startsWith('#')) {
    const id = href.slice(1);
    if (anchors.includes(id)) return href;
    // fallback: an enabled page containing that anchor
    for (const p of enabledPages()) {
      if (resolveSections(p.sections).some((s) => s.anchor === id)) return `${url(p.path)}#${id}`;
    }
    return null;
  }
  if (href.startsWith('@')) {
    switch (href.slice(1)) {
      case 'whatsapp':
        return i.whatsapp?.enabled ? whatsappLink(i.whatsapp.greeting) : null;
      case 'portal':
        return i.clientPortal?.url ?? null;
      case 'careers':
        return i.careers?.url ?? null;
      case 'presentation':
        return i.presentation?.url ?? null;
      case 'quote':
        return i.externalQuote?.url ?? null;
      case 'tracking':
        return i.tracking?.enabled ? i.tracking.url.replace(/[?&][^?&]*\{code\}.*/, '').replace('{code}', '') : null;
      default:
        return null;
    }
  }
  if (href.startsWith('/')) return href;
  const [path, hash] = href.split('#');
  const page = pageByPath(path);
  return page ? url(page.path) + (hash ? `#${hash}` : '') : null;
}

export const isExternal = (href: string) => /^https?:/.test(href) && !href.startsWith(site.seo.siteUrl);

export function whatsappLink(message: string, number = site.integrations.whatsapp?.number): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function mapsLink(address: string, custom?: string) {
  return custom || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
export function directionsLink(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

/* ── Navigation ───────────────────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  path: string;
  description?: string;
}

export function navItems(): NavItem[] {
  return enabledPages()
    .filter((p) => p.showInNav && p.kind !== 'home')
    .map((p) => ({ label: p.navLabel || p.title, href: url(p.path), path: p.path, description: p.description }));
}

/** Title helper */
export function pageTitle(title?: string) {
  if (!title) return site.seo.defaultTitle;
  return site.seo.titleTemplate.replace('%s', title).replace('{brand}', site.brand.name);
}

export const pad = (n: number, l = 2) => String(n).padStart(l, '0');

/** Split "Line one|Line two" titles into lines (editorial line breaks) */
export const lines = (t?: string) => (t ? t.split('|') : []);
