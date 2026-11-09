/**
 * ORTIVA LOGÍSTICA — demonstration preset (fictitious company)
 * Profile: road carrier with multimodal and special cargo operations.
 *
 * Every number, client and testimonial below is FICTITIOUS and exists only to
 * demonstrate the template. Replace before publishing a real client.
 */
import { defineClient } from '../../define';
import { geo } from './geo';
import { pages } from './showcase-pages';

export default defineClient({
  id: 'ortiva',
  demo: {
    enabled: true,
    notice: 'Site demonstrativo — Ortiva é uma empresa fictícia. Números, clientes e depoimentos são ilustrativos.',
  },

  brand: {
    name: 'Ortiva',
    legalName: 'Ortiva Logística Ltda. (fictícia)',
    tagline: 'Movimento é precisão.',
    segment: 'Transporte rodoviário, multimodal e cargas especiais',
    description:
      'Operador de transporte rodoviário B2B com malha própria no Sul, Sudeste e Centro-Oeste, conexões multimodais com portos e engenharia para cargas especiais.',
    logo: { mark: 'vector', width: 128 },
  },

  theme: {
    colors: {
      bg: '#F5F4F0',
      surface: '#E9EAEC',
      surfaceStrong: '#DADCE0',
      ink: '#141618',
      inkSoft: '#2B2F33',
      muted: '#6C7177',
      line: '#CDD0D4',
      accent: '#E9561B',
      onAccent: '#FFFFFF',
      inverseBg: '#111315',
      inverseInk: '#F2F1ED',
      inverseMuted: '#8D9298',
      inverseLine: '#2A2E32',
    },
    fonts: { display: 'geist', body: 'geist', mono: 'ibm-plex-mono' },
    type: { displayWeight: 500, displayTracking: '-0.05em', uppercaseEyebrows: true },
    radius: 'soft',
    buttons: 'pill',
    nav: { style: 'floating', showSectionIndex: true },
    motion: { level: 'cinematic', smoothScroll: true, pageTransitions: true, magneticButtons: true },
  },

  company: {
    foundedYear: 1998,
    registration: 'CNPJ 00.000.000/0001-00 (fictício)',
    contact: {
      phone: '+55 19 0000-0000',
      email: 'comercial@ortiva.example',
      whatsapp: '5519900000000',
      hours: 'Seg–Sex · 7h às 19h | Operação 24/7',
    },
    units: [
      {
        id: 'campinas',
        name: 'Matriz e centro logístico Campinas',
        kind: 'Matriz · Cross-docking',
        city: 'Campinas',
        state: 'SP',
        address: 'Rodovia Exemplo, km 00 — Distrito Industrial, Campinas/SP',
        phone: '+55 19 0000-0000',
        email: 'campinas@ortiva.example',
        hours: '24 horas',
        lat: -22.9,
        lon: -47.06,
        hq: true,
      },
      {
        id: 'cajamar',
        name: 'Centro de Distribuição Cajamar',
        kind: 'Armazenagem · Fulfillment B2B',
        city: 'Cajamar',
        state: 'SP',
        address: 'Av. Demonstração, 1000 — Cajamar/SP',
        phone: '+55 11 0000-0000',
        lat: -23.35,
        lon: -46.88,
      },
      {
        id: 'curitiba',
        name: 'Filial Curitiba',
        kind: 'Filial · Distribuição Sul',
        city: 'São José dos Pinhais',
        state: 'PR',
        address: 'Rua Ilustrativa, 250 — São José dos Pinhais/PR',
        phone: '+55 41 0000-0000',
        lat: -25.53,
        lon: -49.2,
      },
      {
        id: 'betim',
        name: 'Filial Betim',
        kind: 'Filial · Automotivo',
        city: 'Betim',
        state: 'MG',
        address: 'Av. Modelo, 4500 — Betim/MG',
        phone: '+55 31 0000-0000',
        lat: -19.97,
        lon: -44.2,
      },
      {
        id: 'goiania',
        name: 'Base Goiânia',
        kind: 'Base operacional · Agro',
        city: 'Aparecida de Goiânia',
        state: 'GO',
        address: 'Rod. Fictícia, km 12 — Aparecida de Goiânia/GO',
        lat: -16.82,
        lon: -49.24,
      },
    ],
    social: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { label: 'Instagram', href: 'https://www.instagram.com/' },
      { label: 'YouTube', href: 'https://www.youtube.com/' },
    ],
  },

  integrations: {
    whatsapp: {
      enabled: true,
      number: '5519900000000',
      greeting: 'Olá! Gostaria de falar com a equipe comercial.',
      floatingButton: true,
    },
    quote: {
      enabled: true,
      channels: ['whatsapp', 'email'],
      email: 'cotacao@ortiva.example',
      subject: 'Solicitação de cotação — site',
      cargoTypes: ['Carga geral fracionada', 'Carga lotação (FTL)', 'Carga especial / indivisível', 'Contêiner', 'Carga refrigerada', 'Produtos químicos (com FISPQ)'],
    },
    tracking: {
      enabled: true,
      url: 'https://rastreamento.example.com/consulta?codigo={code}',
      label: 'Rastrear carga',
      inputLabel: 'Nota fiscal, CT-e ou código',
    },
    clientPortal: { url: 'https://portal.example.com/', label: 'Portal do cliente' },
    presentation: { url: '/docs/apresentacao-institucional.pdf', label: 'Apresentação institucional (PDF)' },
    careers: { url: 'https://vagas.example.com/', label: 'Ver vagas na plataforma de recrutamento' },
    analytics: {},
  },

  seo: {
    siteUrl: 'https://ortiva.example',
    titleTemplate: '%s — Ortiva Logística',
    defaultTitle: 'Ortiva Logística — Movimento é precisão',
    description:
      'Transporte rodoviário B2B, multimodal e cargas especiais com malha própria no Sul, Sudeste e Centro-Oeste. Site demonstrativo de empresa fictícia.',
    locale: 'pt-BR',
    ogImage: '/og.jpg',
    keywords: ['transportadora', 'logística', 'transporte rodoviário', 'cargas especiais', 'multimodal'],
  },

  hero: {
    mode: '3d',
    image: { src: 'media/hero.jpg', alt: 'Cavalo mecânico e semirreboque da frota em estúdio, vista três quartos', focus: '60% 55%' },
    video: { src: '/video/hero.mp4', srcWebm: '/video/hero.webm', poster: '/video/hero-poster.jpg' },
    fallbackImage: { src: 'media/hero.jpg', alt: 'Caminhão da frota em vista três quartos' },
  },

  scene3d: {
    enabled: true,
    mobileQuality: 'low',
    truck: {
      bodyColor: '#EDEDEA',
      cabColor: '#16181B',
      palette: [
        { name: 'Grafite', value: '#16181B' },
        { name: 'Branco ártico', value: '#EDEDEA' },
        { name: 'Laranja Ortiva', value: '#E9561B' },
        { name: 'Aço', value: '#8C939A' },
      ],
      livery: { text: 'ORTIVA', subtext: 'MOVIMENTO É PRECISÃO', stripe: true },
      modelScale: 1,
      modelRotationY: 0,
    },
  },

  data: {
    stats: [
      { id: 'fleet', value: 420, suffix: '+', label: 'Veículos próprios', detail: 'Cavalos mecânicos, caminhões rígidos e implementos' },
      { id: 'years', value: 27, label: 'Anos de operação', detail: 'Desde 1998' },
      { id: 'hubs', value: 5, label: 'Unidades operacionais', detail: 'SP, PR, MG e GO' },
      { id: 'area', value: 86, suffix: ' mil m²', label: 'Área de armazenagem', detail: 'Armazenagem alfandegada e geral' },
      { id: 'deliveries', value: 1.2, decimals: 1, suffix: ' mi', label: 'Entregas por ano', detail: 'Média dos últimos 3 anos' },
      { id: 'otd', value: 98.4, decimals: 1, suffix: '%', label: 'Entregas no prazo', detail: 'Indicador interno anual' },
    ],

    services: [
      {
        slug: 'transporte-rodoviario',
        title: 'Transporte rodoviário',
        kicker: 'FTL · LTL · Dedicado',
        short: 'Lotação, fracionado e operações dedicadas com frota própria e monitoramento 24/7.',
        description:
          'Malha rodoviária própria conectando os principais polos industriais do Sul, Sudeste e Centro-Oeste. Planejamento de rotas, janelas de entrega agendadas e equipes dedicadas a cada cliente.',
        image: { src: 'media/truck-side.jpg', alt: 'Vista lateral do conjunto rodoviário' },
        features: ['Carga lotação (FTL) e fracionada (LTL)', 'Operações dedicadas por cliente', 'Agendamento de janelas de entrega', 'Gerenciamento de risco e escolta', 'Torre de controle 24/7'],
        specs: [
          { label: 'Cobertura', value: 'Sul, Sudeste e Centro-Oeste' },
          { label: 'Frota', value: 'Cavalos 6x2 / 6x4, rígidos e VUC' },
          { label: 'Implementos', value: 'Baú, sider, graneleiro, porta-contêiner' },
          { label: 'Monitoramento', value: 'Telemetria e rastreador em 100% da frota' },
        ],
        process: [
          { title: 'Planejamento', text: 'Análise de volume, sazonalidade e janelas do cliente.' },
          { title: 'Coleta', text: 'Agendamento e conferência na origem.' },
          { title: 'Trânsito', text: 'Monitoramento, gestão de risco e comunicação proativa.' },
          { title: 'Entrega', text: 'Comprovante digital e indicadores por embarque.' },
        ],
      },
      {
        slug: 'cargas-especiais',
        title: 'Cargas especiais',
        kicker: 'Indivisíveis · Excesso dimensional',
        short: 'Engenharia de transporte para cargas indivisíveis, pesadas e com excesso dimensional.',
        description:
          'Projetos de transporte para equipamentos industriais, transformadores, estruturas metálicas e máquinas agrícolas. Estudo de rota, licenças especiais (AET), escolta e içamento coordenado.',
        image: { src: 'media/truck-top.jpg', alt: 'Vista superior do conjunto com carga especial' },
        features: ['Estudo de rota e vistoria técnica', 'Obtenção de AET e licenças', 'Pranchas, extensivas e linhas de eixo', 'Escolta credenciada', 'Plano de amarração e içamento'],
        specs: [
          { label: 'Capacidade', value: 'Até 120 t (configuração ilustrativa)' },
          { label: 'Equipamentos', value: 'Pranchas rebaixadas, extensivas, dolly' },
          { label: 'Documentação', value: 'AET, plano de rota, ART' },
        ],
        process: [
          { title: 'Viabilidade', text: 'Medições, peso, centro de gravidade e restrições de rota.' },
          { title: 'Engenharia', text: 'Definição do conjunto, amarração e licenças.' },
          { title: 'Execução', text: 'Escolta, monitoramento e janelas de tráfego.' },
          { title: 'Entrega técnica', text: 'Descarga coordenada e relatório final.' },
        ],
      },
      {
        slug: 'multimodal',
        title: 'Transporte multimodal',
        kicker: 'Rodovia · Ferrovia · Cabotagem',
        short: 'Integração entre rodovia, ferrovia e cabotagem para reduzir custos e emissões em longas distâncias.',
        description:
          'Planejamos operações porta a porta que combinam modais, com coleta e entrega rodoviárias. Integramos terminais ferroviários, portos e gestão documental.',
        image: { src: 'media/hub-yard.jpg', alt: 'Pátio de contêineres do terminal' },
        features: ['Porta a porta com um único contrato', 'Conexão com portos de Santos e Paranaguá', 'Gestão de contêineres e devolução de vazios', 'Comparativo de emissões por modal'],
        specs: [
          { label: 'Modais', value: 'Rodoviário, ferroviário, cabotagem' },
          { label: 'Portos', value: 'Santos (SP), Paranaguá (PR)' },
          { label: 'Contêineres', value: "20', 40', 40' HC e reefer" },
        ],
        process: [
          { title: 'Planejamento', text: 'Combinação de modais por custo, prazo e emissões.' },
          { title: 'Coleta na origem', text: 'Coleta rodoviária e consolidação.' },
          { title: 'Transporte principal', text: 'Ferrovia ou cabotagem com acompanhamento.' },
          { title: 'Distribuição no destino', text: 'Distribuição rodoviária no destino.' },
        ],
      },
      {
        slug: 'armazenagem',
        title: 'Armazenagem e distribuição',
        kicker: 'WMS · Cross-docking',
        short: 'Centros de distribuição com WMS, cross-docking e distribuição B2B integrada ao transporte.',
        description:
          'Armazenagem geral e de produtos controlados, separação de pedidos, montagem de kits e cross-docking. A operação utiliza sistema de gestão de armazém e inventário rotativo.',
        image: { src: 'media/hub-docks.jpg', alt: 'Docas do centro de distribuição' },
        features: ['WMS com inventário rotativo', 'Cross-docking em até 24h', 'Separação de pedidos, montagem de kits e etiquetagem', 'Integração EDI / API com ERP do cliente'],
        specs: [
          { label: 'Área', value: '86 mil m² (ilustrativo)' },
          { label: 'Docas', value: '64 docas niveladoras' },
          { label: 'Certificações', value: 'Licenças sanitárias e ambientais' },
        ],
        process: [],
      },
    ],

    cases: [
      {
        slug: 'linha-automotiva-just-in-time',
        client: 'Montadora Delta (fictícia)',
        title: 'Abastecimento de linha automotiva',
        sector: 'Automotivo',
        year: '2024',
        summary: 'Operação dedicada com janelas de 30 minutos entre fornecedores e linha de montagem.',
        challenge:
          'Reduzir paradas de linha causadas por atrasos de abastecimento de 38 fornecedores distribuídos em três estados.',
        solution:
          'Coletas programadas em rotas fixas, frota dedicada com telemetria, torre de controle exclusiva e estoque de apoio no centro de cross-docking em Betim.',
        results: [
          { value: '−72%', label: 'Paradas de linha por abastecimento' },
          { value: '30 min', label: 'Janela de entrega' },
          { value: '38', label: 'Fornecedores integrados' },
        ],
        image: { src: 'media/truck-34.jpg', alt: 'Conjunto dedicado à operação automotiva' },
        services: ['transporte-rodoviario', 'armazenagem'],
        featured: true,
      },
      {
        slug: 'transformador-210-toneladas',
        client: 'Energia Sul (fictícia)',
        title: 'Transporte de transformador de potência',
        sector: 'Energia',
        year: '2023',
        summary: 'Engenharia de rota de 640 km para equipamento indivisível com excesso dimensional.',
        challenge: 'Deslocar um transformador indivisível do porto até uma subestação, atravessando pontes com restrição de carga.',
        solution: 'Análise estrutural de pontes e viadutos, conjunto com linhas de eixo, escolta e operação noturna planejada com as concessionárias.',
        results: [
          { value: '640 km', label: 'Percurso planejado' },
          { value: '11', label: 'Noites de operação' },
          { value: '0', label: 'Ocorrências' },
        ],
        image: { src: 'media/truck-dark.jpg', alt: 'Conjunto em operação noturna' },
        services: ['cargas-especiais'],
        featured: true,
      },
      {
        slug: 'cabotagem-bens-de-consumo',
        client: 'Grupo Aurora Consumo (fictício)',
        title: 'Rodovia e cabotagem para o Nordeste',
        sector: 'Bens de consumo',
        year: '2025',
        summary: 'Migração de 60% do volume rodoviário de longa distância para cabotagem.',
        challenge: 'Reduzir custos e emissões das transferências entre São Paulo e o Nordeste sem perder previsibilidade.',
        solution: 'Operação multimodal com consolidação em Cajamar, embarque em Santos e distribuição rodoviária no destino.',
        results: [
          { value: '−31%', label: 'Emissões estimadas de CO₂' },
          { value: '−18%', label: 'Custo por tonelada' },
          { value: '60%', label: 'Volume migrado' },
        ],
        image: { src: 'media/hub-aerial.jpg', alt: 'Vista aérea do centro logístico' },
        services: ['multimodal'],
        featured: true,
      },
    ],

    fleet: [
      { id: 'cavalo-6x2', name: 'Cavalo mecânico 6x2', category: 'Longa distância', quantity: 180, capacity: 'PBTC 57 t', dimensions: 'Cabine leito teto alto', use: 'Transferências e lotação', image: { src: 'media/truck-front.jpg', alt: 'Vista frontal do cavalo mecânico' } },
      { id: 'cavalo-6x4', name: 'Cavalo mecânico 6x4', category: 'Pesados', quantity: 42, capacity: 'PBTC 74 t', dimensions: 'Tração total', use: 'Cargas especiais e bitrem', image: { src: 'media/truck-rear.jpg', alt: 'Vista traseira do conjunto' } },
      { id: 'semirreboque-bau', name: 'Semirreboque baú', category: 'Implemento', quantity: 210, capacity: '30 paletes · 90 m³', dimensions: '14,94 × 2,60 × 2,80 m', use: 'Carga geral e industrial' },
      { id: 'sider', name: 'Semirreboque sider', category: 'Implemento', quantity: 96, capacity: '28 paletes · 85 m³', dimensions: '14,94 × 2,60 × 2,70 m', use: 'Carregamento lateral' },
      { id: 'prancha', name: 'Prancha rebaixada extensiva', category: 'Especial', quantity: 14, capacity: 'até 120 t', dimensions: 'Extensível até 25 m', use: 'Cargas indivisíveis' },
      { id: 'vuc', name: 'VUC / Toco', category: 'Urbano', quantity: 64, capacity: '3 a 8 t', dimensions: 'Acesso a ZMRC', use: 'Distribuição urbana' },
    ],

    segments: [
      { name: 'Automotivo', detail: 'Abastecimento de linha e peças', share: 24 },
      { name: 'Bens de consumo', detail: 'Transferências e distribuição', share: 21 },
      { name: 'Agronegócio', detail: 'Insumos e máquinas', share: 17 },
      { name: 'Energia e infraestrutura', detail: 'Cargas especiais', share: 13 },
      { name: 'Químico', detail: 'Produtos controlados', share: 11 },
      { name: 'Varejo e comércio eletrônico B2B', detail: 'Abastecimento de CDs', share: 9 },
      { name: 'Farmacêutico e saúde', detail: 'Temperatura controlada', share: 5 },
    ],

    timeline: [
      { year: '1998', title: 'Fundação', text: 'Três caminhões e uma rota fixa entre Campinas e Curitiba.', image: { src: 'media/truck-side.jpg', alt: '' } },
      { year: '2006', title: 'Primeiro hub', text: 'Inauguração do cross-docking em Campinas e entrada no setor automotivo.', image: { src: 'media/hub-docks.jpg', alt: '' } },
      { year: '2013', title: 'Cargas especiais', text: 'Criação da divisão de engenharia para cargas indivisíveis.', image: { src: 'media/truck-top.jpg', alt: '' } },
      { year: '2019', title: 'Multimodal', text: 'Conexões ferroviárias e de cabotagem com Santos e Paranaguá.', image: { src: 'media/hub-yard.jpg', alt: '' } },
      { year: '2025', title: 'Torre de controle', text: 'Operação 24/7 com telemetria em 100% da frota.', image: { src: 'media/truck-dark.jpg', alt: '' } },
    ],

    certifications: [
      { code: 'ISO 9001', name: 'Gestão da Qualidade', detail: 'Processos de transporte e armazenagem (exemplo).', issuer: 'Organismo certificador' },
      { code: 'ISO 14001', name: 'Gestão Ambiental', detail: 'Controle de emissões e resíduos (exemplo).', issuer: 'Organismo certificador' },
      { code: 'SASSMAQ', name: 'Segurança no transporte químico', detail: 'Avaliação para produtos químicos (exemplo).', issuer: 'Associação setorial' },
      { code: 'ANTT', name: 'Registro RNTRC', detail: 'Registro de transportador rodoviário (exemplo).', issuer: 'Agência reguladora' },
    ],

    clients: [
      { name: 'DELTA MOTORS', sector: 'Automotivo' },
      { name: 'aurora', sector: 'Consumo' },
      { name: 'Energia Sul', sector: 'Energia' },
      { name: 'AGRIVALE', sector: 'Agro' },
      { name: 'Quimtec', sector: 'Químico' },
      { name: 'NORTEFARMA', sector: 'Farma' },
      { name: 'Metalis', sector: 'Industrial' },
      { name: 'campo&co', sector: 'Agro' },
    ],

    testimonials: [
      {
        quote: 'A operação dedicada trouxe mais previsibilidade à linha de montagem. Nossas reuniões passaram a se concentrar nas melhorias do processo.',
        author: 'Mariana Teles',
        role: 'Gerente de Logística',
        company: 'Montadora Delta (fictícia)',
      },
      {
        quote: 'O transporte do transformador foi tratado como um projeto de engenharia, com atenção a cada etapa do percurso.',
        author: 'Rafael Moura',
        role: 'Diretor de Implantação',
        company: 'Energia Sul (fictícia)',
      },
    ],

    gallery: [
      { src: 'media/truck-34.jpg', alt: 'Conjunto rodoviário, vista três quartos', caption: 'Frota · Longa distância' },
      { src: 'media/hub-aerial.jpg', alt: 'Vista aérea do centro logístico', caption: 'Hub Campinas' },
      { src: 'media/truck-front.jpg', alt: 'Frente do cavalo mecânico', caption: 'Cabine' },
      { src: 'media/hub-docks.jpg', alt: 'Docas do centro de distribuição', caption: 'Docas' },
      { src: 'media/truck-dark.jpg', alt: 'Caminhão em operação noturna', caption: 'Operação 24/7' },
      { src: 'media/hub-yard.jpg', alt: 'Pátio de contêineres', caption: 'Pátio multimodal' },
    ],

    jobs: [
      { title: 'Motorista carreteiro', area: 'Operações', location: 'Campinas/SP', type: 'CLT' },
      { title: 'Analista de torre de controle', area: 'Tecnologia e monitoramento', location: 'Campinas/SP', type: 'CLT · Turnos' },
      { title: 'Engenheiro(a) de cargas especiais', area: 'Engenharia', location: 'Curitiba/PR', type: 'CLT' },
      { title: 'Executivo(a) comercial', area: 'Comercial', location: 'Belo Horizonte/MG', type: 'CLT · Híbrido' },
    ],

    geo,
  },

  pages,

  footer: {
    statement: 'Movimento é precisão.',
    legal: [
      { label: 'Política de privacidade', href: '#' },
      { label: 'Código de conduta', href: '#' },
    ],
    showUnits: true,
  },
});
