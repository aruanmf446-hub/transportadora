/**
 * MERIDIAN — "Logística Internacional" profile (fictitious).
 * Globe on the home page, cool blue identity, IBM Plex typography.
 */
import { defineClient, extendClient } from '../../define';
import base from '../ortiva';
import { international } from '../service-profiles';
import type { SiteConfigInput } from '../../schema';

type Page = SiteConfigInput['pages'][number];
const pages: Page[] = base.pages.map((p) => {
  if (p.id !== 'home') return p;
  const s = (p.sections ?? []).filter((sec) => sec.type !== 'scroll-vehicle' && sec.type !== 'truck-3d');
  s[0] = { ...s[0], content: { ...s[0].content, eyebrow: 'Agenciamento de cargas · Multimodal · Desembaraço', title: 'Conectamos|portos e pessoas.', lead: 'Operações porta a porta entre o Brasil e os principais centros logísticos do mundo, com parceiros marítimos e aéreos.' } };
  return { ...p, sections: s };
});

export default defineClient(
  extendClient(base, {
    id: 'meridian',
    demo: { enabled: true, notice: 'Site demonstrativo — Meridian é uma empresa fictícia.' },
    brand: { name: 'Meridian', legalName: 'Meridian Global Logistics (fictícia)', tagline: 'Conectamos portos e pessoas.', segment: 'Logística internacional e multimodal', description: 'Logística internacional porta a porta com parceiros marítimos e aéreos.', logo: { mark: 'orbit', width: 140 } },
    theme: {
      colors: {
        bg: '#F4F5F7', surface: '#E7EAF0', surfaceStrong: '#D5DAE3', ink: '#0E1525', inkSoft: '#26304A', muted: '#68718A', line: '#CBD1DC',
        accent: '#2F5BFF', onAccent: '#FFFFFF', inverseBg: '#0A1020', inverseInk: '#EEF1F7', inverseMuted: '#8A93AB', inverseLine: '#1E2740',
      },
      fonts: { display: 'ibm-plex-sans', body: 'ibm-plex-sans', mono: 'ibm-plex-mono' },
      type: { displayWeight: 500, displayTracking: '-0.035em', uppercaseEyebrows: true },
      radius: 'round',
      buttons: 'pill',
    },
    seo: { siteUrl: 'https://meridian.example', titleTemplate: '%s — Meridian', defaultTitle: 'Meridian — Logística internacional', description: 'Logística internacional porta a porta. Site demonstrativo de empresa fictícia.' },
    scene3d: { truck: { cabColor: '#0E1525', bodyColor: '#F4F5F7', livery: { text: 'MERIDIAN', subtext: 'LOGÍSTICA GLOBAL', stripe: true }, palette: [{ name: 'Azul', value: '#2F5BFF' }, { name: 'Marinho', value: '#0E1525' }] } },
    data: { services: international },
    pages,
    footer: { statement: 'Conectamos portos e pessoas.' },
  }),
);
