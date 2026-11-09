import type { APIRoute } from 'astro';
import { site } from '../lib/site';
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site.seo.siteUrl).toString()}\n`, { headers: { 'Content-Type': 'text/plain' } });
