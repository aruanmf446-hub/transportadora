/**
 * Pages & sections. Each section accepts:
 *   type · enabled · order · variant · animation · theme · navLabel · content
 * Remove a section by deleting it or setting `enabled: false`.
 * Remove a page by setting `enabled: false` — links, menu and sitemap update.
 */
import type { SiteConfigInput } from '../../schema';

type Pages = SiteConfigInput['pages'];

export const pages: Pages = [
  {
    id: 'home',
    kind: 'home',
    path: '',
    title: 'Início',
    navLabel: 'Início',
    showInNav: false,
    sections: [
      {
        type: 'hero',
        navLabel: 'Início',
        content: {
          eyebrow: 'Transporte rodoviário · Multimodal · Cargas especiais',
          title: 'Movimento|é precisão.',
          lead: 'Malha própria, engenharia de transporte e acompanhamento em cada etapa. Precisão para manter sua operação em movimento.',
          cta: { label: 'Solicitar cotação', href: '#cotacao' },
          secondaryCta: { label: 'Conheça as soluções', href: 'solucoes' },
        },
      },
      {
        type: 'manifesto',
        navLabel: 'Manifesto',
        content: {
          eyebrow: 'Manifesto',
          title:
            'Precisão no trajeto. Compromisso na entrega.',
          options: { signature: 'Desde 1998, em movimento.' },
        },
      },
      {
        type: 'metrics',
        navLabel: 'Números',
        theme: 'dark',
        content: {
          eyebrow: 'Capacidade operacional',
          title: 'Capacidade que sustenta a operação.',
        },
      },
      {
        type: 'solutions',
        navLabel: 'Soluções',
        content: {
          eyebrow: 'Soluções',
          title: 'Cada carga, uma operação.',
          cta: { label: 'Todas as soluções', href: 'solucoes' },
        },
      },
      {
        type: 'scroll-vehicle',
        navLabel: 'Operação',
        theme: 'dark',
        content: {
          eyebrow: 'Da coleta à entrega',
          title: 'Cuidado em cada etapa.',
          items: [
            { meta: '01 — Coleta', title: 'Coleta na janela agendada', text: 'Conferência digital, lacre e documento emitido na origem.' },
            { meta: '02 — Trânsito', title: 'Acompanhamento durante o trajeto', text: 'Telemetria, gestão de risco e alertas proativos pela torre de controle.' },
            { meta: '03 — Conexão', title: 'Conexões entre modais', text: 'Ferrovia e cabotagem conforme a rota e o perfil da carga.' },
            { meta: '04 — Entrega', title: 'Registro da entrega', text: 'Canhoto digital e indicadores por embarque.' },
          ],
        },
      },
      {
        type: 'routes-map',
        navLabel: 'Malha',
        content: {
          eyebrow: 'Malha operacional',
          title: 'Nossa rede de conexões.',
          lead: 'Selecione uma unidade ou região para ver as conexões. Os prazos são indicativos e variam conforme a operação.',
        },
      },
      {
        type: 'truck-3d',
        navLabel: 'Frota 3D',
        theme: 'surface',
        content: {
          eyebrow: 'Frota',
          title: 'Frota em cada detalhe.',
          lead: 'Gire o modelo, escolha a cor da cabine e conheça seus componentes. Veículo ilustrativo.',
        },
      },
      {
        type: 'segments',
        navLabel: 'Segmentos',
        content: { eyebrow: 'Segmentos atendidos', title: 'Setores que movimentamos.' },
      },
      {
        type: 'cases',
        navLabel: 'Cases',
        variant: 'featured',
        content: { eyebrow: 'Projetos', title: 'Projetos em perspectiva.', cta: { label: 'Ver todos os cases', href: 'cases' } },
      },
      {
        type: 'clients',
        navLabel: 'Clientes',
        content: { eyebrow: 'Clientes e parceiros' },
      },
      {
        type: 'quote',
        id: 'cotacao',
        navLabel: 'Cotação',
        theme: 'surface',
        content: {
          eyebrow: 'Solicitação de cotação',
          title: 'Qual é a sua rota?',
          lead: 'Envie os dados da operação pelo WhatsApp ou por e-mail. Um especialista responde com a proposta — não calculamos frete automaticamente.',
        },
      },
      {
        type: 'cta',
        navLabel: 'Contato',
        theme: 'dark',
        content: {
          title: 'Sua próxima rota|começa no planejamento.',
          cta: { label: 'Falar com um especialista', href: 'contato' },
          secondaryCta: { label: 'Trabalhe conosco', href: 'trabalhe-conosco' },
        },
      },
    ],
  },

  {
    id: 'about',
    path: 'sobre',
    title: 'Sobre a empresa',
    navLabel: 'Empresa',
    description: 'História, valores, certificações e compromisso ambiental.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Empresa', title: 'Vinte e sete anos|em movimento.', lead: 'Começamos com três caminhões e uma rota. O compromisso com cada entrega orienta nossa trajetória.', image: { src: 'media/truck-34.jpg', alt: 'Conjunto rodoviário da frota' } } },
      {
        type: 'about',
        navLabel: 'Quem somos',
        content: {
          eyebrow: 'Quem somos',
          title: 'Transporte orientado pela engenharia.',
          body: 'A Ortiva (fictícia) é um operador rodoviário B2B que combina frota própria, armazenagem e conexões multimodais. Trabalhamos com contratos de longo prazo, indicadores compartilhados e equipes dedicadas a cada cliente.\n\nNossa operação é construída sobre três princípios: planejamento antes da execução, visibilidade em tempo integral e melhoria contínua orientada por dados.',
          image: { src: 'media/hub-aerial.jpg', alt: 'Vista aérea do hub de Campinas' },
          items: [
            { title: 'Planejar', text: 'Rotas, janelas e riscos definidos antes da coleta.' },
            { title: 'Acompanhar', text: 'Cada embarque monitorado do início ao fim.' },
            { title: 'Melhorar', text: 'Indicadores revisados mensalmente com o cliente.' },
          ],
        },
      },
      { type: 'history', navLabel: 'História', theme: 'dark', content: { eyebrow: 'Nossa história', title: 'Marcos de uma trajetória.' } },
      { type: 'certifications', navLabel: 'Certificações', content: { eyebrow: 'Certificações', title: 'Certificações e registros.', lead: 'Certificações exibidas como exemplo. Substitua pelas certificações vigentes da empresa.' } },
      {
        type: 'sustainability',
        navLabel: 'Sustentabilidade',
        theme: 'surface',
        content: {
          eyebrow: 'Sustentabilidade',
          title: 'Eficiência em cada percurso.',
          image: { src: 'media/road.jpg', alt: 'Estrada ao amanhecer' },
          items: [
            { meta: 'Frota', title: 'Renovação contínua', text: 'Idade média da frota abaixo de 4 anos, motores Euro 6 (exemplo).' },
            { meta: 'Multimodal', title: 'Modal certo para cada distância', text: 'Ferrovia e cabotagem reduzem emissões em longas distâncias.' },
            { meta: 'Rotas', title: 'Otimização de retorno', text: 'Planejamento para reduzir viagens sem carga.' },
            { meta: 'Pessoas', title: 'Atenção aos motoristas', text: 'Programa de direção econômica e jornada controlada.' },
          ],
        },
      },
      { type: 'cta', theme: 'dark', content: { title: 'Conheça a estrutura|por dentro.', cta: { label: 'Estrutura e frota', href: 'estrutura' } } },
    ],
  },

  {
    id: 'solutions',
    kind: 'services',
    path: 'solucoes',
    title: 'Soluções',
    navLabel: 'Soluções',
    description: 'Transporte rodoviário, cargas especiais, multimodal e armazenagem.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Soluções', title: 'Da origem|ao destino.', lead: 'Operações planejadas conforme o tipo de carga, a distância e o nível de serviço.' } },
      { type: 'solutions', variant: 'index', navLabel: 'Índice', content: { eyebrow: 'Índice de soluções', title: 'Encontre o serviço adequado.' } },
      { type: 'road-transport', navLabel: 'Rodoviário', content: { options: { service: 'transporte-rodoviario' } } },
      { type: 'special-cargo', navLabel: 'Cargas especiais', variant: 'reverse', theme: 'dark', content: { options: { service: 'cargas-especiais' } } },
      { type: 'multimodal', navLabel: 'Multimodal', content: { options: { service: 'multimodal' } } },
      {
        type: 'technology',
        navLabel: 'Tecnologia',
        theme: 'surface',
        content: {
          eyebrow: 'Tecnologia e inovação',
          title: 'Informação em cada etapa.',
          items: [
            { meta: 'TC-01', title: 'Torre de controle 24/7', text: 'Equipe dedicada acompanhando desvios, paradas e janelas.' },
            { meta: 'TC-02', title: 'Telemetria embarcada', text: 'Dados de condução, consumo e posição em 100% da frota.' },
            { meta: 'TC-03', title: 'Integração EDI / API', text: 'Pedidos, ocorrências e comprovantes integrados ao ERP do cliente.' },
            { meta: 'TC-04', title: 'Comprovante digital', text: 'Canhoto digital com geolocalização e foto.' },
          ],
          cta: { label: 'Acessar portal do cliente', href: '@portal' },
        },
      },
      { type: 'cta', theme: 'dark', content: { title: 'Precisa de uma|operação sob medida?', cta: { label: 'Solicitar cotação', href: 'contato' } } },
    ],
    detailSections: [
      { type: 'quote', id: 'cotacao', theme: 'surface', content: { eyebrow: 'Cotação', title: 'Converse sobre a sua operação.' } },
    ],
  },

  {
    id: 'structure',
    path: 'estrutura',
    title: 'Estrutura e frota',
    navLabel: 'Estrutura',
    description: 'Centros logísticos, frota e segurança operacional.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Estrutura e frota', title: 'Estrutura para|cada etapa.', lead: 'Centros logísticos, frota própria e protocolos de segurança definidos para operações críticas.', image: { src: 'media/hub-docks.jpg', alt: 'Docas do centro de distribuição' } } },
      {
        type: 'operations',
        navLabel: 'Estrutura',
        content: {
          eyebrow: 'Estrutura operacional',
          title: 'Cinco unidades, uma operação.',
          lead: 'Centros de cross-docking, armazéns e bases operacionais conectados à mesma torre de controle.',
        },
      },
      { type: 'hub-3d', navLabel: 'Centro logístico 3D', theme: 'surface', content: { eyebrow: 'Centro logístico', title: 'Conheça o centro logístico.', lead: 'Explore as áreas do centro de distribuição. Cena ilustrativa.' } },
      { type: 'fleet', navLabel: 'Frota', content: { eyebrow: 'Nossa frota', title: 'Equipamento certo para cada carga.', lead: 'Quantidades ilustrativas.' } },
      { type: 'truck-3d', navLabel: 'Veículo 3D', theme: 'dark', variant: 'compact', content: { eyebrow: 'Configurador', title: 'O conjunto em detalhe.' } },
      {
        type: 'safety',
        navLabel: 'Segurança',
        content: {
          eyebrow: 'Segurança e conformidade',
          title: 'Segurança em toda a operação.',
          items: [
            { meta: '01', title: 'Gerenciamento de risco', text: 'Planos por rota, iscas, escolta e protocolos de parada.' },
            { meta: '02', title: 'Jornada controlada', text: 'Controle eletrônico de jornada e pontos de parada homologados.' },
            { meta: '03', title: 'Treinamento contínuo', text: 'Direção defensiva, MOPP e reciclagem anual.' },
            { meta: '04', title: 'Conformidade documental', text: 'RNTRC, seguros RCTR-C e RC-DC, licenças ambientais.' },
            { meta: '05', title: 'Manutenção preditiva', text: 'Telemetria aplicada a desgaste e paradas programadas.' },
            { meta: '06', title: 'Conduta e integridade', text: 'Código de conduta e canal de ética para toda a cadeia.' },
          ],
        },
      },
      { type: 'gallery', navLabel: 'Galeria', theme: 'dark', content: { eyebrow: 'Galeria', title: 'Operação em imagens.' } },
    ],
  },

  {
    id: 'coverage',
    path: 'atuacao',
    title: 'Área de atuação',
    navLabel: 'Atuação',
    description: 'Regiões atendidas, malha de rotas e conexões internacionais.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Área de atuação', title: 'Presença onde|a indústria está.', lead: 'Malha rodoviária própria no Sul, Sudeste e Centro-Oeste, com conexões multimodais com o Nordeste e rotas internacionais.' } },
      { type: 'regions', navLabel: 'Regiões', content: { eyebrow: 'Regiões atendidas', title: 'Cobertura por região.', lead: 'Percentual de municípios atendidos com operação regular (valores fictícios).' } },
      { type: 'routes-map', navLabel: 'Mapa de rotas', variant: 'full', theme: 'dark', content: { eyebrow: 'Mapa de rotas', title: 'A malha completa.' } },
      { type: 'globe', navLabel: 'Conexões globais', content: { eyebrow: 'Conexões internacionais', title: 'Do porto para o mundo.', lead: 'Coordenamos o transporte rodoviário entre os polos industriais e os principais portos, conectando cargas a rotas marítimas internacionais operadas por parceiros.' } },
      { type: 'tracking', navLabel: 'Rastreamento', theme: 'surface', content: { eyebrow: 'Rastreamento', title: 'Acompanhe sua carga.' } },
    ],
  },

  {
    id: 'cases',
    kind: 'cases',
    path: 'cases',
    title: 'Cases',
    navLabel: 'Cases',
    description: 'Projetos e operações de referência.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Cases e projetos', title: 'Projetos e|resultados.', lead: 'Operações de referência em diferentes setores (projetos fictícios para demonstração).' } },
      { type: 'cases', variant: 'list', navLabel: 'Projetos', content: {} },
      { type: 'insights', navLabel: 'Indicadores', theme: 'surface', content: { eyebrow: 'Perfil da operação', title: 'Participação por setor.', lead: 'Participação por segmento na receita operacional (valores fictícios).' } },
      { type: 'clients', navLabel: 'Clientes', variant: 'testimonials', content: { eyebrow: 'Quem confia' } },
      { type: 'cta', theme: 'dark', content: { title: 'Vamos planejar|seu próximo projeto?', cta: { label: 'Fale com nossa equipe', href: 'contato' } } },
    ],
    detailSections: [
      { type: 'cta', theme: 'dark', content: { title: 'Vamos planejar|a sua operação?', cta: { label: 'Solicitar cotação', href: 'contato' } } },
    ],
  },

  {
    id: 'careers',
    path: 'trabalhe-conosco',
    title: 'Trabalhe conosco',
    navLabel: 'Carreiras',
    description: 'Vagas e cultura.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Trabalhe conosco', title: 'Quem move a carga|move a empresa.', lead: 'Buscamos pessoas comprometidas com o trabalho e com a equipe — na estrada, no armazém e no escritório.' } },
      {
        type: 'careers',
        navLabel: 'Vagas',
        content: {
          eyebrow: 'Vagas em destaque',
          title: 'Oportunidades abertas.',
          lead: 'Lista ilustrativa. Envie sua candidatura pela plataforma oficial de recrutamento.',
          items: [
            { title: 'Plano de carreira', text: 'Percursos de desenvolvimento para motoristas, instrutores, analistas e coordenadores.' },
            { title: 'Segurança em primeiro lugar', text: 'Jornada controlada e pontos de parada homologados.' },
            { title: 'Treinamento contínuo', text: 'Academia interna com certificações.' },
          ],
        },
      },
      { type: 'cta', theme: 'dark', content: { title: 'Não encontrou|a sua vaga?', cta: { label: 'Cadastre seu currículo', href: '@careers' } } },
    ],
  },

  {
    id: 'contact',
    path: 'contato',
    title: 'Contato',
    navLabel: 'Contato',
    description: 'Unidades, telefones, cotação e rastreamento.',
    sections: [
      { type: 'page-header', variant: 'compact', content: { eyebrow: 'Contato', title: 'Converse com|nossa equipe.', lead: 'Comercial, unidades e atendimento ao cliente.' } },
      { type: 'contact', navLabel: 'Unidades', content: { eyebrow: 'Unidades', title: 'Onde estamos.' } },
      { type: 'quote', id: 'cotacao', navLabel: 'Cotação', theme: 'surface', content: { eyebrow: 'Cotação', title: 'Solicite uma proposta.', lead: 'Sem cálculo automático: um especialista analisa sua operação e responde com uma proposta.' } },
      { type: 'tracking', navLabel: 'Rastreamento', content: { eyebrow: 'Rastreamento', title: 'Já é cliente?' } },
    ],
  },
];
