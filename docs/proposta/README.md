# Proposta visual — Despacho de estrada

Estudo da página inicial, separado da apresentação publicada. Não altera a home atual nem o workflow de deploy.

A composição usa sinalização rodoviária, fotografia, contraste grafite/laranja/papel e uma ficha de transporte. Estatísticas, tamanho de frota e certificações não são necessários para a apresentação.

- `desktop.png`: primeira tela em 1440 px.
- `mobile.png`: primeira tela em 390 px.
- `desktop-completo.png`: página inteira.
- `index.html`: versão independente para baixar e abrir no navegador, com fotografia, fontes, estilos e scripts incorporados. Os links de serviços apontam para as páginas publicadas da demonstração.

## Executar no projeto

```bash
npm run dev
```

Abra `/proposta/`. A rota contém `noindex,nofollow` e não está incluída no menu ou sitemap.

A origem e o destino preenchidos na faixa de percurso são transferidos para a ficha de cotação. O envio prepara uma mensagem no WhatsApp ou no aplicativo de e-mail; não calcula frete e não armazena os dados.

## Fotografia

Imagem ilustrativa obtida do Unsplash:
https://images.unsplash.com/photo-1601584115197-04ecc0da31d7

A fotografia não representa a frota da empresa fictícia. Essa informação também aparece na página. Antes de usar a direção em um cliente real, selecionar fotografia própria ou licenciada adequada à operação.

## Validação

Build dos quatro presets e checagem de links concluídos. A prévia passou nos testes de desktop e celular para menu, âncoras, ausência de overflow, transferência de rota e formação da mensagem do WhatsApp. Nenhum canvas, GSAP ou módulo de cena 3D é carregado nessa página.
