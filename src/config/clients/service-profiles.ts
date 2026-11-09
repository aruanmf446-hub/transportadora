import type { SiteConfigInput } from '../schema';

type Services = NonNullable<SiteConfigInput['data']>['services'];

/** Examples describe service scope without inventing fleet size or performance figures. */
export const warehousing: Services = [
  { slug: 'armazenagem', title: 'Armazenagem', kicker: 'Recebimento e organização', short: 'Consulte as condições para receber, armazenar e preparar seus produtos para expedição.', description: 'A operação é definida conforme o tipo de produto, o volume e os cuidados necessários. Nossa equipe avalia a disponibilidade de espaço e as condições de recebimento e expedição.', image: { src: 'media/hub-docks.jpg', alt: 'Docas de um centro de distribuição' }, features: ['Avaliação do perfil dos produtos', 'Condições de armazenagem alinhadas com o cliente', 'Organização de recebimento e expedição', 'Contato com a equipe responsável'] },
  { slug: 'distribuicao', title: 'Distribuição', kicker: 'Do estoque ao destino', short: 'Planejamento das saídas e entregas conforme a necessidade do cliente.', description: 'Converse sobre os destinos, a frequência e os cuidados com seus produtos. A equipe avalia as condições para integrar a expedição ao transporte.', image: { src: 'media/truck-side.jpg', alt: 'Caminhão e semirreboque vistos de lado' }, features: ['Consulta de rotas e disponibilidade', 'Programação combinada com o cliente', 'Alinhamento dos cuidados com os produtos'] },
];
export const specialCargo: Services = [
  { slug: 'cargas-especiais', title: 'Cargas especiais', kicker: 'Planejamento de transporte', short: 'Avaliação técnica para o transporte de equipamentos e cargas com necessidades específicas.', description: 'Cada projeto começa pela avaliação da carga e do percurso. Veículo, documentação, licenças e condições de transporte são definidos conforme a necessidade da operação.', image: { src: 'media/truck-top.jpg', alt: 'Vista superior de um conjunto rodoviário' }, features: ['Avaliação das dimensões e do peso', 'Consulta de viabilidade da rota', 'Definição da documentação necessária', 'Planejamento da coleta e da entrega'] },
];
export const international: Services = [
  { slug: 'logistica-internacional', title: 'Logística internacional', kicker: 'Origem, conexão e destino', short: 'Coordenação de etapas do transporte internacional com agentes e parceiros.', description: 'Nossa equipe avalia origem, destino e características da carga para planejar as conexões com os parceiros envolvidos. Escopo, documentação e condições são alinhados antes da contratação.', image: { src: 'media/hub-yard.jpg', alt: 'Contêineres em um pátio logístico' }, features: ['Avaliação da origem e do destino', 'Planejamento das conexões', 'Alinhamento documental', 'Contato com a equipe responsável'] },
];
