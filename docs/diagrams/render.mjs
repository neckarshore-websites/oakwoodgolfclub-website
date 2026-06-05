#!/usr/bin/env node
/**
 * Render the diagram HTML files in this folder to PNG.
 *
 * HTML is the source of truth; the PNGs are rendered exports for Markdown
 * embedding (GitHub READMEs cannot embed interactive HTML). Re-run this after
 * changing any *.html here.
 *
 * Modes:
 *   default     clip to the first <svg> region  -> <name>.png
 *   --full      full editorial page screenshot  -> <name>-full.png
 *   --publish   no render; copy all *.html + *.png here -> ../../public/diagrams/
 *               so the assets page (/assets) can serve them at /diagrams/<file>
 *
 * Usage:
 *   node docs/diagrams/render.mjs                      # all *.html -> region PNGs
 *   node docs/diagrams/render.mjs architecture.html    # one file, region
 *   node docs/diagrams/render.mjs --full               # all *.html -> *-full.png
 *   node docs/diagrams/render.mjs architecture.html --full
 *   node docs/diagrams/render.mjs --publish            # sync html+png to public/diagrams
 *
 * Requires: playwright (already a devDependency) + the Chromium browser binary
 * (`npx playwright install chromium`). Output is rendered at 2x for retina sharpness.
 */
import { chromium } from 'playwright';
import { readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const full = args.includes('--full');
const publish = args.includes('--publish');
const named = args.filter((a) => !a.startsWith('--'));

// --publish: copy the diagram artifacts into public/ so Next.js serves them
// (docs/diagrams/ is outside the build). Source of truth stays in docs/diagrams.
if (publish) {
  const dest = join(here, '..', '..', 'public', 'diagrams');
  mkdirSync(dest, { recursive: true });
  const artifacts = readdirSync(here).filter((f) => f.endsWith('.html') || f.endsWith('.png'));
  for (const f of artifacts) {
    copyFileSync(join(here, f), join(dest, f));
    console.log('published', `public/diagrams/${f}`);
  }
  console.log(`\n${artifacts.length} artifacts published to public/diagrams/.`);
  process.exit(0);
}

const files = named.length
  ? named.map((f) => basename(f))
  : readdirSync(here).filter((f) => f.endsWith('.html'));

if (files.length === 0) {
  console.error('No .html files to render in', here);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1280, height: 900 } });

let rendered = 0;
let skipped = 0;

for (const file of files) {
  const htmlPath = join(here, file);
  const base = file.replace(/\.html$/, '');

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); // ensure webfonts are painted

  if (full) {
    const out = join(here, `${base}-full.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log('rendered (full)  ', `${base}-full.png`);
    rendered++;
  } else {
    const svg = page.locator('svg').first();
    if ((await svg.count()) === 0) {
      console.warn('skipped (no <svg>)', file, '— use --full for non-SVG diagrams');
      skipped++;
      continue;
    }
    const out = join(here, `${base}.png`);
    await svg.screenshot({ path: out });
    console.log('rendered (region)', `${base}.png`);
    rendered++;
  }
}

await browser.close();
console.log(`\n${rendered} rendered, ${skipped} skipped.`);
