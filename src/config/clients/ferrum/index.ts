/**
 * FERRUM — "Transporte Industrial / cargas especiais" profile (fictitious).
 * Hero in cinematic video mode, industrial yellow, square buttons.
 */
import { defineClient, extendClient } from '../../define';
import base from '../ortiva';
import type { SiteConfigInput } from '../../schema';

type Page = SiteConfigInput['pages'][number];
const pages: Page[] = base.pages.map((p) => {
  if (p.id === 'careers') return { ...p, enabled: false }; // page disabled
  if (p.id !== 'home') return p;
  const s = (p.sections ?? []).map((sec) => {
    if (sec.type === 'hero') return { ...sec, content: { ...sec.content, eyebrow: 'Cargas especiais · Projetos · Equipamentos', title: 'Engenharia para|mover grandes cargas.', lead: 'Engenharia de transporte para cargas indivisíveis, equipamentos industriais e projetos de infraestrutura.' } };
    if (sec.type === 'segments' || sec.type === 'clients') return { ...sec, enabled: false };
    if (sec.type === 'cases') return { ...sec, order: 2.5 };
    return sec;
  });
  return { ...p, sections: s };
});

export default defineClient(
  extendClient(base, {
    id: 'ferrum',
    demo: { enabled: true, notice: 'Site demonstrativo — Ferrum é uma empresa fictícia.' },
    brand: { name: 'Ferrum', legalName: 'Ferrum Transportes Especiais Ltda. (fictícia)', tagline: 'Engenharia para mover grandes cargas.', segment: 'Transporte industrial e cargas especiais', description: 'Engenharia de transporte para cargas indivisíveis e projetos industriais.', logo: { mark: 'chevron', width: 120 } },
    theme: {
      colors: {
        bg: '#F2F1EC', surface: '#E6E4DC', surfaceStrong: '#D6D3C8', ink: '#141414', inkSoft: '#2A2A28', muted: '#6E6C66', line: '#CFCCC2',
        accent: '#F2B705', onAccent: '#141414', inverseBg: '#121212', inverseInk: '#F2F1EC', inverseMuted: '#8F8D86', inverseLine: '#2B2B29',
      },
      fonts: { display: 'space-grotesk', body: 'ibm-plex-sans', mono: 'ibm-plex-mono' },
      type: { displayWeight: 600, displayTracking: '-0.045em', uppercaseEyebrows: true },
      radius: 'none',
      buttons: 'square',
      motion: { level: 'standard', smoothScroll: true, pageTransitions: true, magneticButtons: true },
    },
    hero: { mode: 'video' },
    seo: { siteUrl: 'https://ferrum.example', titleTemplate: '%s — Ferrum', defaultTitle: 'Ferrum — Transporte industrial', description: 'Cargas especiais, indivisíveis e projetos industriais. Site demonstrativo de empresa fictícia.' },
    scene3d: { truck: { cabColor: '#F2B705', bodyColor: '#E9E7E0', livery: { text: 'FERRUM', subtext: 'CARGAS PESADAS E ESPECIAIS', stripe: true }, palette: [{ name: 'Amarelo', value: '#F2B705' }, { name: 'Preto', value: '#141414' }] } },
    pages,
    footer: { statement: 'Engenharia para mover grandes cargas.' },
  }),
);
