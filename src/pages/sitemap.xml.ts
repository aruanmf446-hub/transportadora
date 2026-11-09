import type { APIRoute } from 'astro';
import { site, enabledPages, servicePages, casePages, url } from '../lib/site';

/** Sitemap generated from enabled pages + data detail pages. */
export const GET: APIRoute = () => {
  const paths = [...enabledPages().map((p) => p.path), ...servicePages().map((s) => s.path), ...casePages().map((c) => c.path)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${new URL(url(p), site.seo.siteUrl).toString()}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
