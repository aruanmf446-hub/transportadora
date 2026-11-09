/**
 * Browser checks on a built site (requires Playwright + Chromium).
 * Usage: node scripts/e2e.mjs [distDir]
 *  - every page in sitemap.xml: no console errors / page errors, desktop + mobile
 *  - menu opens/closes, Escape works, focus returns
 *  - quote form validates and builds a wa.me URL (window.open stubbed)
 *  - WhatsApp widget builds an encoded message
 *  - no-WebGL fallback & reduced motion keep content visible
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const dist = process.argv[2] || 'dist';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let p = join(dist, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(readFileSync(join(dist, '404.html'))); }
  res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let failures = 0;
const fail = (msg) => { failures++; console.error('✗', msg); };
const ok = (msg) => console.log('✓', msg);

async function visit(ctxOpts, path, label) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await page.waitForTimeout(600);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (errs.length) fail(`${label} ${path}: ${errs.join(' | ')}`);
  if (overflow > 1) fail(`${label} ${path}: horizontal overflow ${overflow}px`);
  await ctx.close();
  return errs.length === 0 && overflow <= 1;
}

let clean = 0;
for (const p of paths) {
  if (await visit({ viewport: { width: 1440, height: 900 } }, p, 'desktop')) clean++;
  if (await visit({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, p, 'mobile')) clean++;
}
ok(`${clean}/${paths.length * 2} page renders without console errors or horizontal overflow`);

// Interactions
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  // menu
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(900);
  const open = await page.getAttribute('[data-menu-toggle]', 'aria-expanded');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  const closed = await page.getAttribute('[data-menu-toggle]', 'aria-expanded');
  open === 'true' && closed === 'false' ? ok('menu opens and closes with Escape') : fail('menu toggle');
  // quote form
  if (await page.$('[data-qt-form]')) {
    await page.evaluate(() => document.querySelector('[data-qt-form] button[value="whatsapp"]').click());
    const err = await page.textContent('[data-error-for="cargo"]');
    err ? ok('quote form shows validation errors') : fail('quote validation');
    await page.evaluate(() => {
      const f = document.querySelector('[data-qt-form]');
      f.querySelector('input[name="cargo"]').checked = true;
      for (const [k, v] of Object.entries({ origin: 'Campinas/SP', destination: 'Recife/PE', name: 'Teste & Cia', phone: '11 99999-0000', notes: 'Carga #1 – 50% frágil' })) f.querySelector(`[name="${k}"]`).value = v;
      f.querySelector('button[value="whatsapp"]').click();
    });
    const url = (await page.evaluate(() => window.__opened))[0] || '';
    const text = decodeURIComponent(url.split('text=')[1] || '');
    url.startsWith('https://wa.me/') && text.includes('Recife/PE') && text.includes('Teste & Cia') && text.includes('50% frágil') ? ok('quote → WhatsApp URL correctly encoded') : fail(`quote URL ${url}`);
  }
  // whatsapp widget
  if (await page.$('[data-wa-open]')) {
    await page.click('[data-wa-open]');
    await page.fill('[data-wa-form] [name="name"]', 'Ana');
    await page.fill('[data-wa-form] [name="origin"]', 'Curitiba');
    await page.click('[data-wa-form] button[type="submit"]');
    const u = (await page.evaluate(() => window.__opened)).at(-1) || '';
    u.includes('wa.me') && decodeURIComponent(u).includes('Curitiba') ? ok('WhatsApp widget builds message') : fail('whatsapp widget');
  }
  await ctx.close();
}

// No WebGL → fallback images remain, no errors
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : g.call(this, t, ...a); }; });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const canvases = await page.$$eval('canvas.stage-canvas', (c) => c.length);
  const poster = await page.$('[data-hero-poster] img, .hero__image img, .hero__video video');
  !errs.length && canvases === 0 && poster ? ok('no-WebGL fallback: posters shown, no canvas, no errors') : fail(`webgl fallback errs=${errs} canvases=${canvases}`);
  await ctx.close();
}

// Reduced motion → content visible without animations
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const hidden = await page.$$eval('[data-reveal]', (els) => els.filter((e) => getComputedStyle(e).visibility === 'hidden').length);
  hidden === 0 ? ok('reduced motion: all content visible') : fail(`${hidden} elements hidden with reduced motion`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(failures ? `\n${failures} failure(s)` : '\nAll browser checks passed');
process.exit(failures ? 1 : 0);
