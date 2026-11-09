/**
 * Renders the ORIGINAL demo imagery (photos, poster, OG image, hero video)
 * from the procedural 3D scenes. Replace these with real client photography.
 *
 * Requirements: Playwright + Chromium, ffmpeg (for the video).
 * Usage:
 *   STUDIO=1 npm run build && npx astro preview --port 4329 &
 *   node scripts/render-assets.mjs http://localhost:4329
 */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:4329';
const root = new URL('..', import.meta.url).pathname;
const media = join(root, 'src/assets/media');
const pub = join(root, 'public');
mkdirSync(media, { recursive: true });
mkdirSync(join(pub, 'video'), { recursive: true });

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function open(scene, w, h, video) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...(video ? { recordVideo: { dir: join(root, '.video-tmp'), size: { width: w, height: h } } } : {}) });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.goto(`${base}/studio/?capture&scene=${scene}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.studio);
  await page.waitForTimeout(1500);
  return { ctx, page };
}
const shot = async (page, file, quality = 88) => {
  await page.screenshot({ path: file, type: 'jpeg', quality });
  console.log('✓', file.replace(root, ''));
};

// 1 · Studio views (configurator scene)
{
  const { ctx, page } = await open('config', 1800, 1200);
  for (const [view, name] of [['three', 'truck-34'], ['side', 'truck-side'], ['front', 'truck-front'], ['rear', 'truck-rear'], ['top', 'truck-top']]) {
    await page.evaluate((v) => document.getElementById('s').__scene.view(v), view);
    await page.waitForTimeout(2600);
    await shot(page, join(media, `${name}.jpg`));
  }
  await ctx.close();
}

// 2 · Hero editorial image + OG image
{
  const { ctx, page } = await open('hero', 2200, 1240);
  await page.evaluate(() => { const s = document.getElementById('s').__scene; s.setDims(0); s.setLabelsVisible(false); s.setPose('hero'); });
  await page.waitForTimeout(1200);
  await shot(page, join(media, 'hero.jpg'));
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.waitForTimeout(1200);
  await shot(page, join(pub, 'og.jpg'), 85);
  await ctx.close();
}

// 3 · Night road
{
  const { ctx, page } = await open('road', 2000, 1250);
  await page.evaluate(() => document.getElementById('s').__scene.setProgress(0));
  await page.waitForTimeout(1500);
  await shot(page, join(media, 'truck-dark.jpg'));
  await page.evaluate(() => document.getElementById('s').__scene.setProgress(0.62));
  await page.waitForTimeout(1500);
  await shot(page, join(media, 'road.jpg'));
  await ctx.close();
}

// 4 · Logistics hub
{
  const { ctx, page } = await open('hub', 1800, 1120);
  for (const [area, name] of [['overview', 'hub-aerial'], ['docks', 'hub-docks'], ['yard', 'hub-yard']]) {
    await page.evaluate((a) => document.getElementById('s').__scene.goto(a), area);
    await page.waitForTimeout(9000);
    await shot(page, join(media, `${name}.jpg`));
  }
  await ctx.close();
}

// 5 · Hero video (cinematic camera move on the night road) + poster
try {
  rmSync(join(root, '.video-tmp'), { recursive: true, force: true });
  const { ctx, page } = await open('road', 1280, 720, true);
  await page.evaluate(async () => {
    const s = document.getElementById('s').__scene;
    const t0 = performance.now();
    await new Promise((res) => {
      const tick = () => { const p = Math.min(1, (performance.now() - t0) / 9000); s.setProgress(p * 0.36); p < 1 ? requestAnimationFrame(tick) : res(); };
      tick();
    });
  });
  await shot(page, join(pub, 'video/hero-poster.jpg'), 82);
  await ctx.close();
  const raw = join(root, '.video-tmp', readdirSync(join(root, '.video-tmp'))[0]);
  const mp4 = join(pub, 'video/hero.mp4');
  const webm = join(pub, 'video/hero.webm');
  execSync(`ffmpeg -y -loglevel error -ss 1.8 -i "${raw}" -t 8 -an -c:v libx264 -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart "${mp4}"`);
  execSync(`ffmpeg -y -loglevel error -ss 1.8 -i "${raw}" -t 8 -an -c:v libvpx-vp9 -b:v 0 -crf 40 "${webm}"`);
  rmSync(join(root, '.video-tmp'), { recursive: true, force: true });
  console.log('✓ video');
} catch (e) {
  console.warn('video skipped:', e.message);
}

await browser.close();
void renameSync;
