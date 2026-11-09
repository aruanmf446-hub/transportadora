/**
 * Section registry — maps every section `type` from the config to its
 * component. To add a new section: create the component in this folder,
 * add its type to SECTION_TYPES (src/config/schema.ts) and register it here.
 */
import type { SectionType } from '../config/schema';

const modules = import.meta.glob<{ default: unknown }>('./*.astro', { eager: true });
const byFile = (name: string) => modules[`./${name}.astro`]?.default;

export const registry: Partial<Record<SectionType, unknown>> = {
  hero: byFile('Hero'),
  'page-header': byFile('PageHeader'),
  manifesto: byFile('Manifesto'),
  about: byFile('About'),
  history: byFile('History'),
  solutions: byFile('Solutions'),
  'road-transport': byFile('ServiceFeature'),
  'special-cargo': byFile('ServiceFeature'),
  multimodal: byFile('ServiceFeature'),
  'service-feature': byFile('ServiceFeature'),
  operations: byFile('Operations'),
  fleet: byFile('Fleet'),
  'truck-3d': byFile('TruckExperience'),
  'hub-3d': byFile('HubExperience'),
  regions: byFile('Regions'),
  'routes-map': byFile('RoutesMap'),
  globe: byFile('Globe'),
  'scroll-vehicle': byFile('ScrollVehicle'),
  metrics: byFile('Metrics'),
  segments: byFile('Segments'),
  technology: byFile('Pillars'),
  safety: byFile('Pillars'),
  sustainability: byFile('Sustainability'),
  certifications: byFile('Certifications'),
  clients: byFile('Clients'),
  cases: byFile('Cases'),
  insights: byFile('Insights'),
  gallery: byFile('Gallery'),
  careers: byFile('Careers'),
  quote: byFile('Quote'),
  tracking: byFile('Tracking'),
  contact: byFile('Contact'),
  cta: byFile('FinalCTA'),
};
