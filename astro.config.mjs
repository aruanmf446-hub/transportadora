import { defineConfig } from 'astro/config';

// `site` is used for canonical URLs; the real domain comes from the client
// config (seo.siteUrl) at render time. Set SITE_URL to override here.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { build: { chunkSizeWarningLimit: 900 } },
});
