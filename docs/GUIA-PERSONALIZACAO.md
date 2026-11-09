# Guia de personalização e comercialização

Este guia mostra como transformar o template no site de uma nova empresa **sem editar componentes**.
Toda a personalização acontece em `src/config/clients/<cliente>/`. A configuração é validada no
build: se algo estiver errado (cor inválida, número de WhatsApp mal formatado, tipo de seção
inexistente…), o build para com uma mensagem indicando o campo.

---

## 0. Criar o cliente

1. Copie um preset parecido com o perfil do cliente:
   ```bash
   cp -r src/config/clients/ortiva src/config/clients/acme
   ```
2. Em `src/config/clients/acme/index.ts`, troque `id: 'acme'`.
3. Gere o site:
   ```bash
   CLIENT=acme npm run build
   ```

Para um cliente com configuração semelhante à de outro, use `extendClient(base, { …só o que muda… })`
(veja `clients/nordhaven/index.ts`): objetos são mesclados, listas são substituídas.

Desligue o modo demonstração quando os dados forem reais: `demo: { enabled: false }`.

---

## 1. Nome e logotipo

```ts
brand: {
  name: 'Acme',
  legalName: 'Acme Transportes Ltda.',
  tagline: 'Sua carga, nosso compromisso.',
  segment: 'Transporte rodoviário de cargas',
  description: '…',
  logo: { src: '/brand/logo.svg', srcInverse: '/brand/logo-branco.svg', width: 140 },
  favicon: '/brand/favicon.svg',
}
```

- Coloque os arquivos em `public/brand/`.
- Sem `logo.src`, o template gera um logo tipográfico com uma marca geométrica
  (`mark: 'vector' | 'chevron' | 'grid' | 'orbit' | 'none'`).

## 2. Trocar todas as cores

`theme.colors` controla **toda** a paleta (UI, seções escuras, 3D, mapa, gráficos):

| Chave | Uso |
|---|---|
| `bg`, `surface`, `surfaceStrong` | fundo, superfícies e áreas de mídia |
| `ink`, `inkSoft`, `muted`, `line` | texto principal, secundário, apoio e linhas |
| `accent`, `onAccent` | cor de destaque e o texto exibido sobre ela |
| `inverseBg`, `inverseInk`, `inverseMuted`, `inverseLine` | seções escuras, menu e rodapé |

Verifique o contraste de `ink` sobre `bg` e de `onAccent` sobre `accent` (mínimo 4.5:1 para texto).

## 3. Modificar fontes

```ts
theme: {
  fonts: { display: 'space-grotesk', body: 'inter', mono: 'ibm-plex-mono' },
  type: { displayWeight: 600, displayTracking: '-0.04em', uppercaseEyebrows: true },
}
```

Fontes disponíveis (todas OFL, redistribuíveis comercialmente e servidas localmente):
`geist`, `inter`, `manrope`, `space-grotesk`, `ibm-plex-sans`, `ibm-plex-mono`.
O navegador só baixa as famílias usadas. Para adicionar outra família: instale o pacote
`@fontsource…`, importe-o em `src/styles/global.css` e registre o nome em `src/lib/theme.ts → FONT_FAMILIES`.

Outras preferências visuais: `theme.radius` (`none|soft|round`), `theme.buttons` (`pill|square|soft`),
`theme.nav.style` (`floating|bar`), `theme.nav.showSectionIndex`.

## 4. Substituir veículos e modelos GLB

```ts
scene3d: {
  enabled: true,                 // false desliga TODAS as experiências 3D (ficam as imagens)
  mobileQuality: 'low',          // 'off' | 'low' | 'full'
  truck: {
    model: '/models/caminhao.glb', // vazio = veículo procedural original
    modelScale: 1,
    modelRotationY: 0,           // radianos, para corrigir a orientação
    cabColor: '#16181B',
    bodyColor: '#EDEDEA',
    palette: [{ name: 'Grafite', value: '#16181B' }],  // cores do configurador
    livery: { text: 'ACME', subtext: 'TRANSPORTES', stripe: true },
  },
}
```

Convenções para o GLB do cliente (`public/models/`):

- Veículo apontando para **+X**, eixo **Y para cima**, origem no chão (o template normaliza escala
  e posição automaticamente).
- Materiais com `paint` ou `cab` no nome são recoloridos pelo configurador.
- Objetos com `wheel` no nome giram com o movimento.
- Use modelos licenciados para uso comercial; prefira GLB comprimido (meshopt/Draco) abaixo de 5 MB.
- Se o arquivo falhar ao carregar, o veículo procedural é usado automaticamente.

O veículo procedural é genérico e original — não representa nenhum fabricante real.

## 5. Trocar imagens e vídeos

- Imagens otimizadas: coloque em `src/assets/…` e referencie **sem** barra inicial:
  `{ src: 'media/frota.jpg', alt: 'Descrição da imagem', focus: '50% 40%' }`.
  O build gera AVIF/WebP em vários tamanhos com `srcset`.
- Arquivos estáticos (`public/`) usam caminho absoluto: `'/fotos/x.jpg'`. URLs remotas também funcionam.
- Imagem ausente não quebra o build: aparece um placeholder técnico e um aviso no terminal.
- As imagens da demo são renders originais das cenas 3D (`npm run render:assets` + `scripts/render-assets.mjs`).
  Substitua-as por fotografia real do cliente.
- Vídeo do hero: `hero.video = { src: '/video/hero.mp4', srcWebm: '/video/hero.webm', poster: '/video/poster.jpg' }`.
  Recomenda-se H.264, 1280–1920 px, 6–12 s em loop, sem áudio, abaixo de 4 MB.

## 6. Atualizar estatísticas

```ts
data: {
  stats: [
    { id: 'fleet', value: 420, suffix: '+', label: 'Veículos próprios', detail: 'Cavalos e implementos' },
    { id: 'otd', value: 98.4, decimals: 1, suffix: '%', label: 'Entregas no prazo' },
  ],
}
```

Os contadores animam até o valor configurado (o valor final já está no HTML para SEO e para visitantes cujo navegador
não executa JavaScript). Use apenas números fornecidos e comprováveis pelo cliente. Uma seção `metrics`
pode exibir um subconjunto: `content: { options: { stats: ['fleet', 'otd'] } }`.

## 7. Regiões atendidas e mapa de rotas

Em `data.geo` (veja `clients/ortiva/geo.ts`):

- `cities`: `{ id, name, state, region, lat, lon, kind: 'hub'|'unit'|'served'|'port', note }`
- `routes`: `{ from, to, kind: 'road'|'multimodal'|'dedicated'|'international', leadTime: 'D+1' }`
- `regions`: `{ id, name, coverage (0–100), detail, states }` — usado pela seção `regions` e pelos filtros do mapa.
- `outline`: `'brazil'` (mapa pontilhado estilizado) ou `'none'` (apenas cidades e rotas, para atuação fora do Brasil).
- `globe`: pontos e arcos do globo 3D (opcional — só para empresas com atuação internacional).

## 8. Remover ou adicionar seções

Cada página tem `sections: [...]`. Cada seção aceita:

| Campo | Função |
|---|---|
| `type` | tipo da seção (lista abaixo) |
| `enabled` | `false` desliga a seção |
| `order` | ordem de exibição (número; empates seguem a ordem do array) |
| `variant` | variante visual (ex.: `cases: 'featured'|'list'`, `page-header: 'compact'`, `service-feature: 'reverse'`, `truck-3d: 'compact'`, `routes-map: 'full'`) |
| `animation` | `none|subtle|standard|cinematic` (sobrepõe o nível global) |
| `theme` | `light|surface|dark|accent` |
| `navLabel` | rótulo no índice lateral e no menu |
| `id` | âncora (ex.: `'cotacao'`) |
| `content` | `eyebrow`, `title` (use `|` para quebrar linha), `lead`, `body`, `image`, `cta`, `secondaryCta`, `items`, `options` |

Ao remover uma seção, o template remove a renderização, o link no índice/menu, as animações e
scripts associados — sem espaços vazios. Seções que dependem de dados somem sozinhas quando os dados
não estão disponíveis (ex.: `cases` sem cases, `tracking` sem integração de rastreamento).

**Tipos disponíveis:** `hero`, `page-header`, `manifesto`, `about`, `history`, `solutions`,
`road-transport`, `special-cargo`, `multimodal`, `service-feature`, `operations`, `fleet`, `truck-3d`,
`hub-3d`, `regions`, `routes-map`, `globe`, `scroll-vehicle`, `metrics`, `segments`, `technology`,
`safety`, `certifications`, `sustainability`, `clients`, `cases`, `insights`, `gallery`, `careers`,
`quote`, `tracking`, `contact`, `cta`.

Nova seção: crie o componente em `src/sections/`, adicione o tipo em `SECTION_TYPES`
(`src/config/schema.ts`) e registre-o em `src/sections/registry.ts`.

**Páginas inteiras:** `pages[].enabled = false` remove a página, os links do menu, do rodapé, dos
CTAs e do sitemap. Páginas com `kind: 'services'` geram uma página por serviço (`data.services[].page`);
`kind: 'cases'` gera uma página por case.

### Links nos CTAs

| Valor | Resultado |
|---|---|
| `'contato'` | página com esse `path` (some se a página estiver desativada) |
| `'#cotacao'` | âncora nesta página ou na primeira página que tiver essa âncora |
| `'@whatsapp'`, `'@portal'`, `'@careers'`, `'@presentation'`, `'@quote'`, `'@tracking'` | integrações configuradas (some se não configuradas) |
| `'https://…'`, `'mailto:'`, `'tel:'` | link externo |

## 9. Mudar a ordem das seções

Reordene o array ou use `order`:

```ts
{ type: 'cases', order: 2.5, … }   // entra entre a 3ª e a 4ª seção
```

## 10. Alterar o hero

```ts
hero: {
  mode: '3d',  // '3d' | 'video' | 'image'
  image: { src: 'media/hero.jpg', alt: '…' },
  video: { src: '/video/hero.mp4', srcWebm: '/video/hero.webm', poster: '/video/hero-poster.jpg' },
  fallbackImage: { src: 'media/hero.jpg', alt: '…' },   // pôster do modo 3D
}
```

No modo 3D, o pôster aparece primeiro e é mantido quando o dispositivo não suporta WebGL, quando
`Save-Data` está ativo ou quando `scene3d.mobileQuality = 'off'` em telas pequenas. O texto do hero vem
da seção `hero` da página inicial (`title: 'Movimento|é precisão.'`).

## 11. Links e integrações

```ts
integrations: {
  whatsapp: { enabled: true, number: '5511999999999', greeting: 'Olá!', floatingButton: true },
  quote: { enabled: true, channels: ['whatsapp', 'email'], email: 'cotacao@empresa.com', cargoTypes: ['…'] },
  tracking: { enabled: true, url: 'https://rastreio.empresa.com/?nf={code}' },
  clientPortal: { url: 'https://portal.empresa.com' },
  externalQuote: { url: 'https://cotacao.empresa.com' },
  presentation: { url: '/docs/apresentacao.pdf' },
  careers: { url: 'https://empresa.gupy.io' },
  analytics: { ga4MeasurementId: 'G-XXXXXXX', searchConsoleVerification: 'token' },
}
```

- Número de WhatsApp apenas com dígitos e DDI (`55…`).
- Cotação: não há cálculo de frete. Os dados são convertidos em uma mensagem codificada para WhatsApp e/ou `mailto:`.
  Nada é armazenado no navegador.
- Rastreamento: com `{code}` na URL, o visitante digita o código e é levado ao sistema oficial;
  sem `{code}`, o botão apenas abre a URL. O site nunca exibe status de carga.
- GA4 só é carregado se `ga4MeasurementId` existir. Avalie a necessidade de banner de consentimento (LGPD).
- Unidades (`company.units`) geram links “Ver no mapa” e “Como chegar” do Google Maps automaticamente
  (ou use `mapsUrl` próprio).
- Redes sociais: `company.social`.

Nenhuma integração exige servidor, chave privada ou serviço pago.

## 12. SEO

```ts
seo: {
  siteUrl: 'https://www.empresa.com.br',
  titleTemplate: '%s — Empresa',
  defaultTitle: 'Empresa — Transporte rodoviário',
  description: '…',
  locale: 'pt-BR',
  ogImage: '/og.jpg',          // 1200×630
  keywords: ['transportadora', '…'],
}
```

Gerado automaticamente: `<title>`, descrição por página, canonical, Open Graph, Twitter card,
JSON-LD `Organization`, `sitemap.xml` (só páginas habilitadas) e `robots.txt`.
Cada página aceita `description`; páginas de serviço/case usam o resumo do item.

## 13. Publicar um novo cliente

1. Configure o preset e rode:
   ```bash
   CLIENT=acme npm test
   ```
2. **Cloudflare Pages**: build command `npm run build`, output `dist`, variável `CLIENT=acme`
   (Node 22.23+). O arquivo `public/_headers` já define cache dos assets.
3. **Vercel**: framework “Astro”, mesmas variáveis; saída estática, sem funções.
4. **GitHub Pages**: o workflow `.github/workflows/deploy-pages.yml` publica a cada push na `main`
   (Settings → Pages → Source: *GitHub Actions*). Em site de projeto (`usuario.github.io/repo/`),
   o workflow define `BASE_PATH=/repo` e `SITE_URL`; todos os caminhos da configuração que começam
   com `/` recebem o prefixo automaticamente.
5. Aponte o domínio e atualize `seo.siteUrl` (ou a variável `SITE_URL`).
6. Envie o sitemap no Google Search Console.

### Checklist antes de publicar

- [ ] `demo.enabled: false` e todos os dados conferidos com o cliente
- [ ] Imagens próprias ou licenciadas, com `alt` descritivo
- [ ] Contraste de cores verificado
- [ ] WhatsApp, e-mail, rastreamento e portal testados
- [ ] `seo.siteUrl` e `og.jpg` do cliente
- [ ] `npm test` sem falhas

---

## Sistema de motion

Definido em `src/scripts/motion/core.ts`:

- **Tokens**: durações (`DUR`), easings (`EASE`) e intensidade (`theme.motion.level` → `none|subtle|standard|cinematic`).
- **Vocabulário declarativo** usado pelas seções: `data-reveal="lines|words|chars|fade|mask|clip-x|rule|stagger|scale"`,
  `data-parallax`, `data-counter`, `data-magnetic`.
- Hierarquia: títulos revelam por linha/palavra; mídia por máscara; listas em cascata; números contam; linhas desenham.
- `prefers-reduced-motion` desliga reveals, parallax, autorrotação, ticker e scroll suave; o conteúdo continua visível.
- Transições entre páginas usam View Transitions nativas (progressivo) e uma cortina de entrada.
- Cenas 3D só carregam perto da viewport, pausam fora dela e são descartadas ao sair da página.
