/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LOGISTICS EXPERIENCE — Configuration schema
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every editable piece of the website is described here. A client preset
 *  (src/config/clients/<id>/index.ts) must satisfy `SiteConfigSchema`.
 *  The configuration is validated at build time: an invalid preset fails the
 *  build with a readable message instead of producing a broken website.
 */
import { z } from 'astro/zod';

/* ── Primitives ──────────────────────────────────────────────────────────── */

const color = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Use hex colors, e.g. #E9561B');

/** Image reference. `src` can be:
 *  - a path relative to `src/assets/` (optimized at build: AVIF/WebP + srcset)
 *  - an absolute path in `public/` starting with "/"
 *  - a remote URL (https://…) */
export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string().default(''),
  caption: z.string().optional(),
  /** Focal point used for object-position, e.g. "50% 40%" */
  focus: z.string().optional(),
});
export type ImageRef = z.infer<typeof ImageSchema>;

export const FONT_KEYS = ['geist', 'inter', 'manrope', 'space-grotesk', 'ibm-plex-sans', 'ibm-plex-mono'] as const;
const fontKey = z.enum(FONT_KEYS);

export const MOTION_LEVELS = ['none', 'subtle', 'standard', 'cinematic'] as const;
const motionLevel = z.enum(MOTION_LEVELS);

export const SECTION_THEMES = ['light', 'surface', 'dark', 'accent'] as const;
const sectionTheme = z.enum(SECTION_THEMES);

const link = z.object({ label: z.string(), href: z.string() });

/* ── Brand & identity ────────────────────────────────────────────────────── */

const BrandSchema = z.object({
  name: z.string(),
  shortName: z.string().optional(),
  legalName: z.string().optional(),
  tagline: z.string(),
  segment: z.string(),
  description: z.string(),
  logo: z
    .object({
      /** Path to an SVG/PNG in public/ (e.g. "/brand/logo.svg"). If empty the
       *  generated typographic logo (mark + name) is used. */
      src: z.string().optional(),
      /** Light version for dark backgrounds */
      srcInverse: z.string().optional(),
      /** Built-in geometric mark used by the typographic logo */
      mark: z.enum(['vector', 'chevron', 'grid', 'orbit', 'none']).default('vector'),
      width: z.number().default(132),
    })
    .default({ mark: 'vector', width: 132 }),
  favicon: z.string().default('/favicon.svg'),
});

const ThemeSchema = z.object({
  colors: z.object({
    bg: color,
    surface: color,
    surfaceStrong: color,
    ink: color,
    inkSoft: color,
    muted: color,
    line: color,
    accent: color,
    /** Text color used on top of the accent color */
    onAccent: color,
    inverseBg: color,
    inverseInk: color,
    inverseMuted: color,
    inverseLine: color,
  }),
  fonts: z.object({ display: fontKey, body: fontKey, mono: fontKey }),
  /** Typographic personality */
  type: z
    .object({
      displayWeight: z.number().min(300).max(900).default(500),
      displayTracking: z.string().default('-0.045em'),
      uppercaseEyebrows: z.boolean().default(true),
    })
    .default({ displayWeight: 500, displayTracking: '-0.045em', uppercaseEyebrows: true }),
  radius: z.enum(['none', 'soft', 'round']).default('soft'),
  buttons: z.enum(['pill', 'square', 'soft']).default('pill'),
  nav: z
    .object({
      style: z.enum(['floating', 'bar']).default('floating'),
      showSectionIndex: z.boolean().default(true),
    })
    .default({ style: 'floating', showSectionIndex: true }),
  motion: z
    .object({
      level: motionLevel.default('standard'),
      smoothScroll: z.boolean().default(true),
      pageTransitions: z.boolean().default(true),
      magneticButtons: z.boolean().default(true),
    })
    .default({ level: 'standard', smoothScroll: true, pageTransitions: true, magneticButtons: true }),
});

/* ── Company ─────────────────────────────────────────────────────────────── */

const UnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string().default('Unidade'),
  city: z.string(),
  state: z.string().optional(),
  country: z.string().default('Brasil'),
  address: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  whatsapp: z.string().optional(),
  hours: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  /** Custom Google Maps link. Generated from the address when omitted. */
  mapsUrl: z.string().optional(),
  hq: z.boolean().default(false),
});
export type Unit = z.infer<typeof UnitSchema>;

const CompanySchema = z.object({
  foundedYear: z.number(),
  registration: z.string().optional(),
  contact: z.object({
    phone: z.string(),
    email: z.string(),
    whatsapp: z.string().optional(),
    hours: z.string().optional(),
  }),
  units: z.array(UnitSchema).default([]),
  social: z.array(link).default([]),
});

/* ── Integrations (all optional, no backend) ─────────────────────────────── */

const IntegrationsSchema = z.object({
  whatsapp: z
    .object({
      enabled: z.boolean().default(true),
      /** International format, digits only: 5511999999999 */
      number: z.string().regex(/^\d{10,15}$/, 'WhatsApp number: digits only, with country code'),
      greeting: z.string().default('Olá! Gostaria de falar com a equipe comercial.'),
      floatingButton: z.boolean().default(true),
    })
    .optional(),
  quote: z
    .object({
      enabled: z.boolean().default(true),
      channels: z.array(z.enum(['whatsapp', 'email'])).min(1).default(['whatsapp', 'email']),
      email: z.string().optional(),
      subject: z.string().default('Solicitação de cotação'),
      cargoTypes: z.array(z.string()).default([]),
    })
    .optional(),
  tracking: z
    .object({
      enabled: z.boolean().default(false),
      /** Official tracking URL. Use {code} as placeholder for the tracking code
       *  (e.g. https://rastreio.empresa.com/?nf={code}). Without the placeholder
       *  the visitor is simply redirected to the URL. */
      url: z.string().url(),
      label: z.string().default('Rastrear carga'),
      inputLabel: z.string().default('Nota fiscal, CT-e ou código de rastreio'),
    })
    .optional(),
  clientPortal: z.object({ url: z.string().url(), label: z.string().default('Portal do cliente') }).optional(),
  externalQuote: z.object({ url: z.string().url(), label: z.string().default('Sistema de cotação') }).optional(),
  presentation: z.object({ url: z.string(), label: z.string().default('Apresentação institucional (PDF)') }).optional(),
  careers: z.object({ url: z.string().url(), label: z.string().default('Ver vagas abertas') }).optional(),
  analytics: z
    .object({
      ga4MeasurementId: z.string().regex(/^G-[A-Z0-9]+$/).optional(),
      searchConsoleVerification: z.string().optional(),
    })
    .default({}),
});

/* ── SEO ─────────────────────────────────────────────────────────────────── */

const SeoSchema = z.object({
  siteUrl: z.string().url(),
  titleTemplate: z.string().default('%s — {brand}'),
  defaultTitle: z.string(),
  description: z.string(),
  locale: z.string().default('pt-BR'),
  ogImage: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  twitterHandle: z.string().optional(),
});

/* ── Hero ────────────────────────────────────────────────────────────────── */

const HeroSchema = z.object({
  mode: z.enum(['3d', 'video', 'image']).default('3d'),
  video: z.object({ src: z.string(), srcWebm: z.string().optional(), poster: z.string().optional() }).optional(),
  image: ImageSchema.optional(),
  /** Image/poster shown while/if WebGL is not available */
  fallbackImage: ImageSchema.optional(),
});

/* ── 3D assets ───────────────────────────────────────────────────────────── */

const Scene3DSchema = z.object({
  truck: z
    .object({
      /** GLB/GLTF provided by the client (public/ path). When empty, the
       *  original procedural vehicle is used. */
      model: z.string().optional(),
      /** Uniform scale/rotation corrections for client models */
      modelScale: z.number().default(1),
      modelRotationY: z.number().default(0),
      bodyColor: color.optional(),
      cabColor: color.optional(),
      /** Colors offered in the interactive configurator */
      palette: z.array(z.object({ name: z.string(), value: color })).default([]),
      livery: z
        .object({
          text: z.string().optional(),
          subtext: z.string().optional(),
          stripe: z.boolean().default(true),
        })
        .default({ stripe: true }),
    })
    .default({ modelScale: 1, modelRotationY: 0, palette: [], livery: { stripe: true } }),
  /** Disable all WebGL experiences at once (fallback images are used) */
  enabled: z.boolean().default(true),
  /** Reduce WebGL quality on small screens */
  mobileQuality: z.enum(['off', 'low', 'full']).default('low'),
});

/* ── Data collections ────────────────────────────────────────────────────── */

const StatSchema = z.object({
  id: z.string(),
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  decimals: z.number().default(0),
  label: z.string(),
  detail: z.string().optional(),
});
export type Stat = z.infer<typeof StatSchema>;

const ServiceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  short: z.string(),
  kicker: z.string().optional(),
  description: z.string(),
  image: ImageSchema.optional(),
  features: z.array(z.string()).default([]),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  process: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  /** Create an individual page for this service */
  page: z.boolean().default(true),
});
export type Service = z.infer<typeof ServiceSchema>;

const CaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: z.string(),
  title: z.string(),
  sector: z.string(),
  year: z.string(),
  summary: z.string(),
  challenge: z.string(),
  solution: z.string(),
  results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  image: ImageSchema.optional(),
  services: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  page: z.boolean().default(true),
});
export type Case = z.infer<typeof CaseSchema>;

const FleetSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  quantity: z.number().optional(),
  capacity: z.string(),
  dimensions: z.string().optional(),
  use: z.string(),
  image: ImageSchema.optional(),
});

const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.string().optional(),
  region: z.string().optional(),
  lat: z.number(),
  lon: z.number(),
  kind: z.enum(['hub', 'unit', 'served', 'port']).default('served'),
  note: z.string().optional(),
});

const RouteSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  kind: z.enum(['road', 'multimodal', 'dedicated', 'international']).default('road'),
  /** e.g. "D+2" — informative, provided by the company */
  leadTime: z.string().optional(),
});

const GeoSchema = z.object({
  /** Built-in outline for the stylized dot map */
  outline: z.enum(['brazil', 'none']).default('brazil'),
  cities: z.array(CitySchema).default([]),
  routes: z.array(RouteSchema).default([]),
  regions: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        coverage: z.number().min(0).max(100).optional(),
        detail: z.string().optional(),
        states: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  /** International connections for the 3D globe */
  globe: z
    .object({
      origin: z.string().optional(),
      points: z.array(z.object({ id: z.string(), name: z.string(), lat: z.number(), lon: z.number() })).default([]),
      arcs: z.array(z.object({ from: z.string(), to: z.string() })).default([]),
    })
    .default({ points: [], arcs: [] }),
});

const DataSchema = z.object({
  stats: z.array(StatSchema).default([]),
  services: z.array(ServiceSchema).default([]),
  cases: z.array(CaseSchema).default([]),
  fleet: z.array(FleetSchema).default([]),
  segments: z.array(z.object({ name: z.string(), detail: z.string().optional(), share: z.number().optional() })).default([]),
  timeline: z.array(z.object({ year: z.string(), title: z.string(), text: z.string(), image: ImageSchema.optional() })).default([]),
  certifications: z.array(z.object({ code: z.string(), name: z.string(), detail: z.string(), issuer: z.string().optional() })).default([]),
  clients: z.array(z.object({ name: z.string(), logo: z.string().optional(), sector: z.string().optional() })).default([]),
  testimonials: z.array(z.object({ quote: z.string(), author: z.string(), role: z.string(), company: z.string() })).default([]),
  gallery: z.array(ImageSchema).default([]),
  jobs: z.array(z.object({ title: z.string(), area: z.string(), location: z.string(), type: z.string(), url: z.string().optional() })).default([]),
  geo: GeoSchema.default({ outline: 'brazil', cities: [], routes: [], regions: [], globe: { points: [], arcs: [] } }),
});

/* ── Sections ────────────────────────────────────────────────────────────── */

const Base = {
  /** Anchor id (used by section index / menu). Auto-generated when omitted. */
  id: z.string().optional(),
  enabled: z.boolean().default(true),
  /** Display order inside the page (ascending). Array order is used for ties. */
  order: z.number().optional(),
  variant: z.string().optional(),
  animation: motionLevel.optional(),
  theme: sectionTheme.optional(),
  /** Label used in the section index and the expanded menu */
  navLabel: z.string().optional(),
  /** Hide from the section index */
  hideFromIndex: z.boolean().default(false),
};

/** Common editorial copy available to every section */
const Copy = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    lead: z.string().optional(),
    body: z.string().optional(),
    image: ImageSchema.optional(),
    cta: link.optional(),
    secondaryCta: link.optional(),
    items: z.array(z.object({ title: z.string(), text: z.string().optional(), meta: z.string().optional() })).optional(),
    /** Free-form section specific options (validated inside each section) */
    options: z.record(z.string(), z.any()).optional(),
  })
  .default({});

/** Registry of section types. Add a type here + a component in
 *  src/sections/registry.ts to extend the library. */
export const SECTION_TYPES = [
  'hero',
  'page-header',
  'manifesto',
  'about',
  'history',
  'solutions',
  'road-transport',
  'special-cargo',
  'multimodal',
  'service-feature',
  'operations',
  'fleet',
  'truck-3d',
  'hub-3d',
  'regions',
  'routes-map',
  'globe',
  'scroll-vehicle',
  'metrics',
  'segments',
  'technology',
  'safety',
  'certifications',
  'sustainability',
  'clients',
  'cases',
  'insights',
  'gallery',
  'careers',
  'quote',
  'tracking',
  'contact',
  'cta',
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export const SectionSchema = z.object({
  type: z.enum(SECTION_TYPES),
  ...Base,
  content: Copy,
});
export type SectionConfig = z.infer<typeof SectionSchema>;

/* ── Pages ───────────────────────────────────────────────────────────────── */

export const PAGE_KINDS = ['home', 'standard', 'services', 'cases'] as const;

const PageSchema = z.object({
  id: z.string(),
  enabled: z.boolean().default(true),
  kind: z.enum(PAGE_KINDS).default('standard'),
  /** URL path without slashes. Empty string = home. */
  path: z.string().regex(/^[a-z0-9-/]*$/),
  title: z.string(),
  navLabel: z.string().optional(),
  showInNav: z.boolean().default(true),
  description: z.string().optional(),
  sections: z.array(SectionSchema).default([]),
  /** Sections rendered on detail pages generated from data (services/cases) */
  detailSections: z.array(SectionSchema).default([]),
});
export type PageConfig = z.infer<typeof PageSchema>;

/* ── Root ────────────────────────────────────────────────────────────────── */

export const SiteConfigSchema = z.object({
  id: z.string(),
  /** Demo mode shows "dados fictícios" labels on figures and a notice. */
  demo: z
    .object({ enabled: z.boolean().default(false), notice: z.string().default('Conteúdo demonstrativo — empresa, números e clientes fictícios.') })
    .default({ enabled: false, notice: '' }),
  brand: BrandSchema,
  theme: ThemeSchema,
  company: CompanySchema,
  integrations: IntegrationsSchema.default({ analytics: {} }),
  seo: SeoSchema,
  hero: HeroSchema.default({ mode: '3d' }),
  scene3d: Scene3DSchema.default({
    truck: { modelScale: 1, modelRotationY: 0, palette: [], livery: { stripe: true } },
    enabled: true,
    mobileQuality: 'low',
  }),
  data: DataSchema,
  pages: z.array(PageSchema).min(1),
  footer: z
    .object({
      statement: z.string().optional(),
      legal: z.array(link).default([]),
      showUnits: z.boolean().default(true),
    })
    .default({ legal: [], showUnits: true }),
});

export type SiteConfigInput = z.input<typeof SiteConfigSchema>;
export type SiteConfig = z.output<typeof SiteConfigSchema>;
