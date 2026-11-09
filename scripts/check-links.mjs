/**
 * Static checks on a built site (no dependencies):
 *  - every internal href/src points to an existing file
 *  - every same-page "#anchor" exists
 *  - no obvious secrets in the source tree
 * Usage: node scripts/check-links.mjs [distDir]
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] || 'dist';
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(dist);
const html = files.filter((f) => f.endsWith('.html'));
let errors = 0;

for (const file of html) {
  const src = readFileSync(file, 'utf8');
  const ids = new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, attr, raw] of src.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const url = raw.replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url)) continue;
    if (url.startsWith('#')) {
      if (url.length > 1 && !ids.has(decodeURIComponent(url.slice(1)))) { console.error(`✗ ${relative(dist, file)}: missing anchor ${url}`); errors++; }
      continue;
    }
    let [path] = url.split(/[?#]/);
    if (BASE && path.startsWith(BASE + '/')) path = path.slice(BASE.length);
    else if (BASE && path === BASE) path = '/';
    const target = join(dist, decodeURIComponent(path));
    const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
    if (!ok) { console.error(`✗ ${relative(dist, file)}: broken ${attr} ${url}`); errors++; }
  }
}

// secrets scan (source)
const SECRET = /(sk_live_[0-9a-zA-Z]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY-----|ghp_[0-9A-Za-z]{30,}|xox[baprs]-[0-9A-Za-z-]{10,})/;
for (const f of walk('src').concat(walk('public').filter((x) => /\.(js|json|txt|html|svg)$/.test(x)))) {
  if (SECRET.test(readFileSync(f, 'utf8'))) { console.error(`✗ possible secret in ${f}`); errors++; }
}

console.log(`${html.length} pages checked in ${dist} — ${errors ? errors + ' problem(s)' : 'no broken links, anchors or secrets'}`);
process.exit(errors ? 1 : 0);
