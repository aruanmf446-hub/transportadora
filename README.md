# Logistics Experience — template white-label para transportadoras

Site estático para transportadoras, operadores logísticos e empresas B2B de transporte de diferentes portes.
A apresentação padrão é leve e funciona sem estatísticas, tamanho de frota ou listas de clientes.
**Uma base técnica, várias identidades comerciais**: tudo o que muda de um cliente para outro
(marca, cores, fontes, textos, números, imagens, modelos 3D, seções, páginas e integrações)
fica em arquivos de configuração locais — sem banco de dados, sem backend, sem CMS.

> A demonstração usa a empresa **fictícia** “Ortiva”. Números, clientes, cases e depoimentos
> são ilustrativos e aparecem marcados como tal (`demo.enabled`).

## Stack

| | |
|---|---|
| Framework | Astro 7 (saída 100% estática) + TypeScript |
| Motion | GSAP 3 (ScrollTrigger, SplitText) + Lenis (scroll suave) |
| 3D | Three.js — caminhão procedural original, hub logístico, globo, sequência na estrada; aceita GLB/GLTF do cliente |
| Mapa | Mapa de rotas em SVG gerado no build (sem tiles, sem chave de API) |
| Fontes | Geist, Inter, Manrope, Space Grotesk, IBM Plex (todas OFL, self-hosted) |
| Hospedagem | Cloudflare Pages, Vercel, Netlify ou qualquer host estático |

## Começando

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Gerar o site de outro cliente:

```bash
CLIENT=meridian npm run build
```

Presets incluídos (mesmo código, só configuração):

| Preset | Perfil | Destaques |
|---|---|---|
| `ortiva` (padrão) | Transportadora rodoviária + multimodal | Apresentação leve, atendimento direto, dados opcionais |
| `nordhaven` | Operador logístico | Imagem estática, armazenagem e distribuição |
| `ferrum` | Transporte industrial / cargas especiais | Imagem estática, transporte industrial |
| `meridian` | Logística internacional | Imagem estática, tipografia IBM Plex |

## Testes e validações

```bash
npm test
```

Executa build + `scripts/check-links.mjs` (links, âncoras, segredos) + `scripts/e2e.mjs`
(Playwright: todas as páginas do sitemap em desktop e mobile sem erros de console nem overflow,
menu, formulário de cotação → WhatsApp, widget WhatsApp, fallback sem WebGL e `prefers-reduced-motion`).
O e2e requer Playwright com Chromium instalados no ambiente.

## Estrutura

```
src/
  config/
    schema.ts            ← contrato tipado e validado (zod) de toda a configuração
    index.ts             ← escolhe o preset via CLIENT e valida no build
    clients/<id>/        ← um diretório por cliente (marca, tema, dados, páginas)
  sections/              ← biblioteca de 30+ seções independentes + registry.ts
  components/            ← header, menu, footer, botões, imagem responsiva, widget WhatsApp…
  scripts/motion/        ← sistema de motion (tokens, reveals declarativos, scroll suave)
  scripts/three/         ← stage WebGL, caminhão procedural, cenas (hero, configurador, estrada, hub, globo)
  pages/[...slug].astro  ← rota única: gera páginas habilitadas + páginas de serviço e case
  assets/media/          ← imagens otimizadas no build (AVIF/WebP + srcset)
public/                  ← vídeo, PDF, favicon, og.jpg
scripts/                 ← check-links, e2e, render-assets
docs/GUIA-PERSONALIZACAO.md
```

O guia completo de configuração e comercialização para novos clientes está em
**[docs/GUIA-PERSONALIZACAO.md](docs/GUIA-PERSONALIZACAO.md)**.

## Limites do template

- Não calcula frete: a cotação gera uma mensagem para WhatsApp ou e-mail (`mailto:`).
- Não simula rastreamento: o componente redireciona para a plataforma oficial configurada.
- Não exibe dados “ao vivo”: todos os números vêm da configuração e são marcados como fictícios no modo demo.
- Não armazena dados de formulário no navegador.
