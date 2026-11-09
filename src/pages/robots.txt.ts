import type { APIRoute } from 'astro';
import { site, url } from '../lib/site';
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('sitemap.xml').replace(/\/$/, ''), site.seo.siteUrl).toString()}\n`, { headers: { 'Content-Type': 'text/plain' } });
