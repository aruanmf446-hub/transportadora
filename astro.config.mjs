import { defineConfig } from 'astro/config';

// `site` is used for canonical URLs; the real domain comes from the client
// config (seo.siteUrl) at render time. Set SITE_URL to override here.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  // Sub-path deployments (e.g. GitHub Pages project site): BASE_PATH=/transportadora
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { build: { chunkSizeWarningLimit: 900 } },
});
