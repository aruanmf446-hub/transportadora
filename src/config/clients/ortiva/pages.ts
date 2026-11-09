import type { SiteConfigInput } from '../../schema';

/** A complete starting point without requiring statistics, a large fleet or client logos.
 * Optional sections can be added with enabled: true and the company's own data.
 */
export const pages: SiteConfigInput['pages'] = [
  {
    id: 'home', kind: 'home', path: '', title: 'Início', showInNav: false,
    sections: [
      { type: 'hero', navLabel: 'Início', content: {
        eyebrow: 'Transporte rodoviário de cargas', title: 'Sua carga.|Nosso cuidado.',
        lead: 'Conte o que precisa transportar e para onde. Nossa equipe combina com você a coleta, o percurso e a entrega.',
        cta: { label: 'Solicitar cotação', href: '#cotacao' },
        secondaryCta: { label: 'Conhecer os serviços', href: 'solucoes' },
      } },
      { type: 'solutions', navLabel: 'Serviços', content: { eyebrow: 'O que fazemos', title: 'Transporte para a sua necessidade.', cta: { label: 'Conheça os serviços', href: 'solucoes' } } },
      { type: 'technology', navLabel: 'Como funciona', theme: 'surface', content: {
        eyebrow: 'Da primeira conversa à entrega', title: 'Tudo começa com uma conversa.',
        items: [
          { meta: '01', title: 'Entendemos sua carga', text: 'Origem, destino, dimensões e cuidados necessários para o transporte.' },
          { meta: '02', title: 'Combinamos a operação', text: 'Nossa equipe avalia a disponibilidade e apresenta as condições da viagem.' },
          { meta: '03', title: 'Mantemos o contato', text: 'Você sabe com quem falar para tirar dúvidas sobre a coleta e a entrega.' },
        ],
      } },
      { type: 'about', navLabel: 'Empresa', content: { eyebrow: 'Quem somos', title: 'Proximidade em cada transporte.', body: 'Somos uma empresa de logística e transporte (fictícia). Acreditamos em acordos claros, atenção à carga e uma conversa direta com quem contrata.\n\nCada solicitação é avaliada pela nossa equipe, conforme o percurso e as necessidades do cliente.', image: { src: 'media/truck-34.jpg', alt: 'Caminhão e semirreboque em vista lateral' }, cta: { label: 'Conheça a empresa', href: 'sobre' } } },
      { type: 'quote', id: 'cotacao', navLabel: 'Cotação', theme: 'surface', content: { eyebrow: 'Vamos conversar', title: 'Qual é a sua rota?', lead: 'Envie os dados da carga pelo WhatsApp ou por e-mail. Nossa equipe analisa a solicitação e responde com uma proposta, sem cálculo automático de frete.' } },
      { type: 'cta', navLabel: 'Contato', theme: 'dark', content: { title: 'Vamos combinar|seu transporte?', cta: { label: 'Falar com a equipe', href: 'contato' } } },
      { type: 'metrics', enabled: false, navLabel: 'Números', content: { eyebrow: 'A empresa em números', title: 'Dados da nossa operação.' } },
      { type: 'clients', enabled: false, navLabel: 'Clientes', content: { eyebrow: 'Clientes e parceiros' } },
      { type: 'cases', enabled: false, navLabel: 'Projetos', content: { eyebrow: 'Projetos', title: 'Transportes realizados.' } },
    ],
  },
  { id: 'about', path: 'sobre', title: 'Sobre a empresa', navLabel: 'Empresa', description: 'Conheça nossa forma de trabalhar.', sections: [
    { type: 'page-header', variant: 'compact', content: { eyebrow: 'A empresa', title: 'Transporte com|atenção de perto.', lead: 'Uma relação de confiança começa com uma conversa clara sobre o que você precisa.' } },
    { type: 'about', content: { eyebrow: 'Nosso jeito de trabalhar', title: 'Acordos claros. Contato direto.', body: 'Somos uma empresa de logística e transporte (fictícia). Atendemos cada solicitação com atenção à origem, ao destino e aos cuidados que a carga exige.\n\nAntes da contratação, alinhamos disponibilidade, condições de transporte e canais de atendimento.', image: { src: 'media/truck-side.jpg', alt: 'Vista lateral de um caminhão com semirreboque' }, items: [{ title: 'Ouvir', text: 'Entender a necessidade antes de apresentar uma proposta.' }, { title: 'Combinar', text: 'Definir as condições de coleta e entrega com o cliente.' }, { title: 'Informar', text: 'Manter um canal de contato durante o transporte.' }] } },
    { type: 'certifications', enabled: false, content: { eyebrow: 'Documentação', title: 'Registros e certificações.' } },
    { type: 'history', enabled: false, content: { eyebrow: 'Nossa história', title: 'Nosso caminho até aqui.' } },
    { type: 'cta', theme: 'dark', content: { title: 'Conte com|uma conversa direta.', cta: { label: 'Entre em contato', href: 'contato' } } },
  ] },
  { id: 'solutions', kind: 'services', path: 'solucoes', title: 'Serviços', navLabel: 'Serviços', description: 'Conheça os serviços e converse sobre a sua carga.', sections: [
    { type: 'page-header', variant: 'compact', content: { eyebrow: 'Serviços', title: 'O transporte|que você precisa.', lead: 'Cada carga pede um planejamento. Conheça os serviços e consulte nossa equipe sobre a sua operação.' } },
    { type: 'solutions', variant: 'index', content: { eyebrow: 'Como podemos ajudar', title: 'Escolha seu serviço.' } },
    { type: 'cta', theme: 'dark', content: { title: 'Tem uma carga|para transportar?', cta: { label: 'Solicitar cotação', href: 'contato' } } },
  ], detailSections: [{ type: 'quote', id: 'cotacao', theme: 'surface', content: { eyebrow: 'Cotação', title: 'Converse sobre a sua operação.', lead: 'Envie sua solicitação. Nossa equipe avalia os detalhes e informa as condições do transporte.' } }] },
  { id: 'coverage', path: 'atuacao', title: 'Área de atendimento', navLabel: 'Atendimento', description: 'Consulte o atendimento para sua origem e destino.', sections: [
    { type: 'page-header', variant: 'compact', content: { eyebrow: 'Área de atendimento', title: 'De onde sai?|Para onde vai?', lead: 'O atendimento depende da origem, do destino e do tipo de carga. Consulte a disponibilidade para o seu percurso.' } },
    { type: 'technology', content: { eyebrow: 'Antes de contratar', title: 'Planeje sua próxima viagem.', items: [{ title: 'Origem e destino', text: 'Informe as cidades de coleta e entrega para avaliarmos o percurso.' }, { title: 'Tipo de carga', text: 'Compartilhe peso, dimensões e os cuidados necessários.' }, { title: 'Data desejada', text: 'Conte quando pretende transportar para consultarmos a disponibilidade.' }] } },
    { type: 'cta', theme: 'dark', content: { title: 'Consulte|a sua rota.', cta: { label: 'Falar com a equipe', href: 'contato' } } },
  ] },
  { id: 'contact', path: 'contato', title: 'Contato', navLabel: 'Contato', description: 'Fale com a equipe e solicite uma cotação.', sections: [
    { type: 'page-header', variant: 'compact', content: { eyebrow: 'Contato', title: 'Pode falar|com a gente.', lead: 'Tire suas dúvidas ou conte o que precisa transportar.' } },
    { type: 'contact', content: { eyebrow: 'Canais de atendimento', title: 'Vamos conversar.' } },
    { type: 'quote', id: 'cotacao', theme: 'surface', content: { eyebrow: 'Cotação', title: 'Solicite uma proposta.', lead: 'Um especialista analisa sua solicitação e responde com as condições do transporte. O site não calcula frete automaticamente.' } },
    { type: 'tracking', content: { eyebrow: 'Rastreamento', title: 'Acesse o sistema de consulta.' } },
  ] },
];
