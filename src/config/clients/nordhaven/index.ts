/**
 * NORDHAVEN — "Operador Logístico" profile (fictitious).
 * Same template, different identity: palette, fonts, buttons, navigation,
 * hero in editorial-photo mode, warehouse-first section selection.
 */
import { defineClient, extendClient } from '../../define';
import base from '../ortiva';
import { warehousing } from '../service-profiles';
import type { SiteConfigInput } from '../../schema';

type Page = SiteConfigInput['pages'][number];
const pages: Page[] = base.pages
  .filter((p) => p.id !== 'cases') // cases page removed entirely → menu, links & sitemap update
  .map((p) => {
    if (p.id !== 'home') return p;
    const pick = ['hero', 'solutions', 'technology', 'about', 'quote', 'cta', 'metrics', 'clients', 'cases'];
    const sections = (p.sections ?? [])
      .filter((s) => pick.includes(s.type))
;
    sections[0] = { ...sections[0], content: { ...sections[0].content, title: 'Estoque em|fluxo contínuo.', eyebrow: 'Armazenagem · Gestão de pedidos B2B · Distribuição', lead: 'Centros de distribuição com WMS, cross-docking e distribuição integrada para indústrias e varejo.' } };
    return { ...p, sections: sections.map((s) => (s.type === 'cases' ? { ...s, enabled: false } : s)) };
  });

export default defineClient(
  extendClient(base, {
    id: 'nordhaven',
    demo: { enabled: true, notice: 'Site demonstrativo — Nordhaven é uma empresa fictícia. Números e clientes são ilustrativos.' },
    brand: {
      name: 'Nordhaven',
      legalName: 'Nordhaven Armazéns Gerais Ltda. (fictícia)',
      tagline: 'Estoque em fluxo contínuo.',
      segment: 'Operador logístico · Armazenagem e distribuição',
      description: 'Operador logístico com centros de distribuição, WMS e distribuição B2B integrada.',
      logo: { mark: 'grid', width: 150 },
    },
    theme: {
      colors: {
        bg: '#F3F4F1', surface: '#E5E8E4', surfaceStrong: '#D3D8D2', ink: '#10201C', inkSoft: '#26352F', muted: '#5F6E68', line: '#C9D0CB',
        accent: '#0F7B63', onAccent: '#FFFFFF', inverseBg: '#0B1714', inverseInk: '#EEF2EE', inverseMuted: '#86958F', inverseLine: '#203029',
      },
      fonts: { display: 'manrope', body: 'inter', mono: 'ibm-plex-mono' },
      type: { displayWeight: 600, displayTracking: '-0.04em', uppercaseEyebrows: true },
      radius: 'none',
      buttons: 'soft',
      nav: { style: 'bar', showSectionIndex: false },
      motion: { level: 'none', smoothScroll: false, pageTransitions: false, magneticButtons: false },
    },
    hero: { mode: 'image', image: { src: 'media/hub-aerial.jpg', alt: 'Vista aérea do centro de distribuição', focus: '60% 50%' } },
    seo: { siteUrl: 'https://nordhaven.example', titleTemplate: '%s — Nordhaven', defaultTitle: 'Nordhaven — Operador logístico', description: 'Armazenagem, gestão de pedidos B2B e distribuição. Site demonstrativo de empresa fictícia.' },
    scene3d: { truck: { cabColor: '#10201C', bodyColor: '#F3F4F1', livery: { text: 'NORDHAVEN', subtext: 'LOGÍSTICA CONTÍNUA', stripe: true }, palette: [{ name: 'Verde', value: '#0F7B63' }, { name: 'Grafite', value: '#10201C' }, { name: 'Branco', value: '#F3F4F1' }] } },
    integrations: { tracking: { enabled: false, url: 'https://rastreamento.example.com/', label: 'Rastrear', inputLabel: 'Código' } },
    data: { services: warehousing },
    pages,
    footer: { statement: 'Estoque em fluxo contínuo.' },
  }),
);
