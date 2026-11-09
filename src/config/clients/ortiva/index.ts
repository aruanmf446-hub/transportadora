import { defineClient, extendClient } from '../../define';
import showcase from './showcase';
import { pages } from './pages';

/** Lean default. Optional company data stays empty until supplied by the client.
 * The former, large-operator demonstration remains available in ./showcase.ts.
 */
const { clientPortal, presentation, careers, ...integrations } = showcase.integrations!;
const { foundedYear, ...company } = showcase.company;
const base = { ...showcase, company, integrations };

export default defineClient(extendClient(base, {
  brand: {
    tagline: 'Sua carga. Nosso cuidado.',
    segment: 'Transporte rodoviário de cargas',
    description: 'Transporte de cargas com atendimento direto. Consulte as condições para a sua origem e destino.',
  },
  theme: {
    nav: { style: 'bar', showSectionIndex: false },
    motion: { level: 'none', smoothScroll: false, pageTransitions: false, magneticButtons: false },
  },
  company: {
    contact: { hours: 'Consulte os horários de atendimento' },
    units: [{ id: 'campinas', name: 'Base de atendimento', kind: 'Atendimento', city: 'Campinas', state: 'SP', address: 'Rodovia Exemplo, km 00 — Campinas/SP (endereço fictício)', hq: true }],
    social: [],
  },
  hero: { mode: 'image', image: { src: 'media/truck-34.jpg', alt: 'Caminhão com semirreboque em vista lateral', focus: '65% 50%' } },
  scene3d: { enabled: false, mobileQuality: 'off' },
  integrations: {
    tracking: { enabled: false },
    quote: { cargoTypes: ['Carga geral', 'Carga fracionada', 'Carga dedicada', 'Outro tipo de carga'] },
  },
  seo: { defaultTitle: 'Ortiva — Transporte de cargas', description: 'Transporte de cargas e atendimento direto. Consulte a disponibilidade para a sua rota. Site demonstrativo de empresa fictícia.' },
  data: {
    stats: [], cases: [], fleet: [], segments: [], timeline: [], certifications: [], clients: [], testimonials: [], jobs: [],
    geo: { cities: [], routes: [], regions: [], globe: { points: [], arcs: [] } },
    services: [
      { slug: 'transporte-rodoviario', title: 'Transporte de cargas', kicker: 'Coleta e entrega', short: 'Transporte rodoviário conforme o perfil da carga e a disponibilidade para a rota.', description: 'Converse com nossa equipe sobre o que precisa transportar. Avaliamos o percurso e as características da carga para apresentar as condições de coleta e entrega.', image: { src: 'media/truck-side.jpg', alt: 'Caminhão com semirreboque visto de lado' }, features: ['Avaliação da origem e do destino', 'Alinhamento dos cuidados com a carga', 'Coleta e entrega combinadas com o cliente', 'Canal direto de atendimento'], process: [{ title: 'Solicitação', text: 'Você informa os dados da carga e a rota desejada.' }, { title: 'Proposta', text: 'Nossa equipe consulta a disponibilidade e apresenta as condições.' }, { title: 'Transporte', text: 'A coleta e a entrega seguem o que foi combinado na contratação.' }] },
      { slug: 'transporte-dedicado', title: 'Transporte dedicado', kicker: 'Conforme a sua necessidade', short: 'Consulte a disponibilidade de um veículo para atender sua operação de forma dedicada.', description: 'Para cargas que precisam de uma viagem dedicada, avaliamos a necessidade de veículo, o percurso e a programação. As condições são definidas com você antes da contratação.', image: { src: 'media/truck-34.jpg', alt: 'Conjunto rodoviário com cabine e semirreboque' }, features: ['Consulta de disponibilidade', 'Planejamento conforme a carga', 'Condições alinhadas antes da coleta', 'Contato com a equipe responsável'] },
    ],
  },
  pages,
  footer: { statement: 'Sua carga. Nosso cuidado.', showUnits: false },
}));
