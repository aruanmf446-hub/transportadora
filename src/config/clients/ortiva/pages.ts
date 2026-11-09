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
          lead: 'Malha própria, engenharia de transporte e uma torre de controle que não dorme. Para indústrias que não podem parar.',
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
            'Cada carga é um compromisso com o tempo de alguém. Por isso planejamos cada quilômetro como engenheiros, operamos como relojoeiros e entregamos como parceiros.',
          options: { signature: 'Desde 1998, em movimento.' },
        },
      },
      {
        type: 'metrics',
        navLabel: 'Números',
        theme: 'dark',
        content: {
          eyebrow: 'Capacidade operacional',
          title: 'Escala para operar. Precisão para cumprir.',
        },
      },
      {
        type: 'solutions',
        navLabel: 'Soluções',
        content: {
          eyebrow: 'Soluções',
          title: 'Uma operação para cada tipo de carga.',
          cta: { label: 'Todas as soluções', href: 'solucoes' },
        },
      },
      {
        type: 'scroll-vehicle',
        navLabel: 'Operação',
        theme: 'dark',
        content: {
          eyebrow: 'Da coleta à entrega',
          title: 'Um percurso, quatro garantias.',
          items: [
            { meta: '01 — Coleta', title: 'Agendada na sua janela', text: 'Conferência digital, lacre e documento emitido na origem.' },
            { meta: '02 — Trânsito', title: 'Monitorado em tempo integral', text: 'Telemetria, gestão de risco e alertas proativos pela torre de controle.' },
            { meta: '03 — Conexão', title: 'Integrado a outros modais', text: 'Ferrovia e cabotagem quando a distância pede eficiência.' },
            { meta: '04 — Entrega', title: 'Comprovada em minutos', text: 'Canhoto digital e indicadores por embarque.' },
          ],
        },
      },
      {
        type: 'routes-map',
        navLabel: 'Malha',
        content: {
          eyebrow: 'Malha operacional',
          title: 'Onde a gente opera.',
          lead: 'Selecione uma unidade ou região para ver as conexões. Prazos indicativos, sujeitos a cada operação.',
        },
      },
      {
        type: 'truck-3d',
        navLabel: 'Frota 3D',
        theme: 'surface',
        content: {
          eyebrow: 'Frota',
          title: 'Engenharia que você pode girar.',
          lead: 'Explore o conjunto, troque a cor da cabine e veja os componentes que tornam cada viagem mais segura.',
        },
      },
      {
        type: 'segments',
        navLabel: 'Segmentos',
        content: { eyebrow: 'Segmentos atendidos', title: 'Indústrias que confiam no nosso tempo.' },
      },
      {
        type: 'cases',
        navLabel: 'Cases',
        variant: 'featured',
        content: { eyebrow: 'Projetos', title: 'Problemas reais. Soluções medidas.', cta: { label: 'Ver todos os cases', href: 'cases' } },
      },
      {
        type: 'clients',
        navLabel: 'Clientes',
        content: { eyebrow: 'Clientes & parceiros' },
      },
      {
        type: 'quote',
        id: 'cotacao',
        navLabel: 'Cotação',
        theme: 'surface',
        content: {
          eyebrow: 'Solicitação de cotação',
          title: 'Conte para onde a sua carga vai.',
          lead: 'Envie os dados da operação pelo WhatsApp ou por e-mail. Um especialista responde com a proposta — não calculamos frete automaticamente.',
        },
      },
      {
        type: 'cta',
        navLabel: 'Contato',
        theme: 'dark',
        content: {
          title: 'Vamos colocar|sua carga em movimento.',
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
      { type: 'page-header', content: { eyebrow: 'Empresa', title: 'Vinte e sete anos|em movimento.', lead: 'Nascemos com três caminhões e uma rota. Crescemos com a mesma obsessão: cumprir o que prometemos.', image: { src: 'media/truck-34.jpg', alt: 'Conjunto rodoviário da frota' } } },
      {
        type: 'about',
        navLabel: 'Quem somos',
        content: {
          eyebrow: 'Quem somos',
          title: 'Uma transportadora com cabeça de engenharia.',
          body: 'A Ortiva (fictícia) é um operador rodoviário B2B que combina frota própria, armazenagem e conexões multimodais. Trabalhamos com contratos de longo prazo, indicadores compartilhados e equipes dedicadas por conta.\n\nNossa operação é construída sobre três princípios: planejamento antes da execução, visibilidade em tempo integral e melhoria contínua medida em dados.',
          image: { src: 'media/hub-aerial.jpg', alt: 'Vista aérea do hub de Campinas' },
          items: [
            { title: 'Planejar', text: 'Rotas, janelas e riscos definidos antes da coleta.' },
            { title: 'Ver', text: 'Cada embarque monitorado do início ao fim.' },
            { title: 'Melhorar', text: 'Indicadores revisados mensalmente com o cliente.' },
          ],
        },
      },
      { type: 'history', navLabel: 'História', theme: 'dark', content: { eyebrow: 'Nossa história', title: 'Marcos de uma trajetória.' } },
      { type: 'certifications', navLabel: 'Certificações', content: { eyebrow: 'Certificações', title: 'Conformidade auditada.', lead: 'Certificações exibidas como exemplo. Substitua pelas certificações vigentes da empresa.' } },
      {
        type: 'sustainability',
        navLabel: 'Sustentabilidade',
        theme: 'surface',
        content: {
          eyebrow: 'Sustentabilidade',
          title: 'Menos quilômetros vazios. Mais carga por litro.',
          image: { src: 'media/road.jpg', alt: 'Estrada ao amanhecer' },
          items: [
            { meta: 'Frota', title: 'Renovação contínua', text: 'Idade média de frota abaixo de 4 anos, motores Euro 6 (exemplo).' },
            { meta: 'Multimodal', title: 'Modal certo para cada distância', text: 'Ferrovia e cabotagem reduzem emissões em longas distâncias.' },
            { meta: 'Rotas', title: 'Otimização de retorno', text: 'Planejamento para reduzir viagens sem carga.' },
            { meta: 'Pessoas', title: 'Motoristas no centro', text: 'Programa de direção econômica e jornada controlada.' },
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
      { type: 'page-header', content: { eyebrow: 'Soluções', title: 'Do quilômetro zero|ao último metro.', lead: 'Soluções de transporte desenhadas por tipo de carga, distância e nível de serviço.' } },
      { type: 'solutions', variant: 'index', navLabel: 'Índice', content: { eyebrow: 'Índice de soluções', title: 'Escolha a operação.' } },
      { type: 'road-transport', navLabel: 'Rodoviário', content: { options: { service: 'transporte-rodoviario' } } },
      { type: 'special-cargo', navLabel: 'Cargas especiais', variant: 'reverse', theme: 'dark', content: { options: { service: 'cargas-especiais' } } },
      { type: 'multimodal', navLabel: 'Multimodal', content: { options: { service: 'multimodal' } } },
      {
        type: 'technology',
        navLabel: 'Tecnologia',
        theme: 'surface',
        content: {
          eyebrow: 'Tecnologia & inovação',
          title: 'Visibilidade como padrão de serviço.',
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
      { type: 'quote', id: 'cotacao', theme: 'surface', content: { eyebrow: 'Cotação', title: 'Fale com um especialista nesta solução.' } },
    ],
  },

  {
    id: 'structure',
    path: 'estrutura',
    title: 'Estrutura e Frota',
    navLabel: 'Estrutura',
    description: 'Centros logísticos, frota e segurança operacional.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Estrutura & frota', title: 'Infraestrutura|que sustenta o prazo.', lead: 'Centros logísticos, frota própria e protocolos de segurança desenhados para operações críticas.', image: { src: 'media/hub-docks.jpg', alt: 'Docas do centro de distribuição' } } },
      {
        type: 'operations',
        navLabel: 'Estrutura',
        content: {
          eyebrow: 'Estrutura operacional',
          title: 'Cinco unidades, uma operação.',
          lead: 'Hubs de cross-docking, armazenagem e bases operacionais conectados pela mesma torre de controle.',
        },
      },
      { type: 'hub-3d', navLabel: 'Centro logístico 3D', theme: 'surface', content: { eyebrow: 'Centro logístico', title: 'Por dentro do hub.', lead: 'Explore as áreas do centro de distribuição. Cena ilustrativa.' } },
      { type: 'fleet', navLabel: 'Frota', content: { eyebrow: 'Nossa frota', title: 'Equipamento certo para cada carga.', lead: 'Quantidades ilustrativas.' } },
      { type: 'truck-3d', navLabel: 'Veículo 3D', theme: 'dark', variant: 'compact', content: { eyebrow: 'Configurador', title: 'O conjunto em detalhe.' } },
      {
        type: 'safety',
        navLabel: 'Segurança',
        content: {
          eyebrow: 'Segurança & conformidade',
          title: 'Segurança não é um setor. É o método.',
          items: [
            { meta: '01', title: 'Gerenciamento de risco', text: 'Planos por rota, iscas, escolta e protocolos de parada.' },
            { meta: '02', title: 'Jornada controlada', text: 'Controle eletrônico de jornada e pontos de parada homologados.' },
            { meta: '03', title: 'Treinamento contínuo', text: 'Direção defensiva, MOPP e reciclagem anual.' },
            { meta: '04', title: 'Conformidade documental', text: 'RNTRC, seguros RCTR-C e RC-DC, licenças ambientais.' },
            { meta: '05', title: 'Manutenção preditiva', text: 'Telemetria aplicada a desgaste e paradas programadas.' },
            { meta: '06', title: 'Compliance', text: 'Código de conduta e canal de ética para toda a cadeia.' },
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
      { type: 'page-header', content: { eyebrow: 'Área de atuação', title: 'Presença onde|a indústria está.', lead: 'Malha rodoviária própria no Sul, Sudeste e Centro-Oeste, com conexões multimodais para o Nordeste e para o mundo.' } },
      { type: 'regions', navLabel: 'Regiões', content: { eyebrow: 'Regiões atendidas', title: 'Cobertura por região.', lead: 'Percentual de municípios atendidos com operação regular (valores fictícios).' } },
      { type: 'routes-map', navLabel: 'Mapa de rotas', variant: 'full', theme: 'dark', content: { eyebrow: 'Mapa de rotas', title: 'A malha completa.' } },
      { type: 'globe', navLabel: 'Conexões globais', content: { eyebrow: 'Conexões internacionais', title: 'Do porto para o mundo.', lead: 'Coordenamos o transporte rodoviário de e para os principais portos, conectando cargas a rotas marítimas internacionais operadas por parceiros.' } },
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
      { type: 'page-header', content: { eyebrow: 'Cases & projetos', title: 'Resultados|que se medem.', lead: 'Operações de referência em diferentes setores (projetos fictícios para demonstração).' } },
      { type: 'cases', variant: 'list', navLabel: 'Projetos', content: {} },
      { type: 'insights', navLabel: 'Insights', theme: 'surface', content: { eyebrow: 'Insights institucionais', title: 'Como a nossa operação se distribui.', lead: 'Participação por segmento na receita operacional (valores fictícios).' } },
      { type: 'clients', navLabel: 'Clientes', variant: 'testimonials', content: { eyebrow: 'Quem confia' } },
      { type: 'cta', theme: 'dark', content: { title: 'Seu desafio pode ser|o próximo case.', cta: { label: 'Fale com a gente', href: 'contato' } } },
    ],
    detailSections: [
      { type: 'cta', theme: 'dark', content: { title: 'Vamos desenhar|a sua operação?', cta: { label: 'Solicitar cotação', href: 'contato' } } },
    ],
  },

  {
    id: 'careers',
    path: 'trabalhe-conosco',
    title: 'Trabalhe conosco',
    navLabel: 'Carreiras',
    description: 'Vagas e cultura.',
    sections: [
      { type: 'page-header', content: { eyebrow: 'Trabalhe conosco', title: 'Quem move a carga|move a empresa.', lead: 'Procuramos pessoas que gostam de fazer bem feito — na estrada, no armazém e no escritório.' } },
      {
        type: 'careers',
        navLabel: 'Vagas',
        content: {
          eyebrow: 'Vagas em destaque',
          title: 'Oportunidades abertas.',
          lead: 'Lista ilustrativa. As candidaturas acontecem na plataforma oficial de recrutamento.',
          items: [
            { title: 'Plano de carreira', text: 'Trilhas de motorista a instrutor, de analista a coordenador.' },
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
      { type: 'page-header', variant: 'compact', content: { eyebrow: 'Contato', title: 'Fale com|a operação.', lead: 'Comercial, unidades e atendimento ao cliente.' } },
      { type: 'contact', navLabel: 'Unidades', content: { eyebrow: 'Unidades', title: 'Onde estamos.' } },
      { type: 'quote', id: 'cotacao', navLabel: 'Cotação', theme: 'surface', content: { eyebrow: 'Cotação', title: 'Solicite uma proposta.', lead: 'Sem cálculo automático: um especialista analisa sua operação e responde com uma proposta.' } },
      { type: 'tracking', navLabel: 'Rastreamento', content: { eyebrow: 'Rastreamento', title: 'Já é cliente?' } },
    ],
  },
];
