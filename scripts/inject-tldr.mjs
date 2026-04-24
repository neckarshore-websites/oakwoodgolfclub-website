#!/usr/bin/env node
/**
 * One-shot utility: inject "## TL;DR / Zusammenfassung" block into every
 * blog post in content/blog/*.md that doesn't already have one. The body
 * of the TL;DR is the frontmatter `excerpt` — copied verbatim, no bolds
 * (User direction, Phase C of the formatting cleanup pass).
 *
 * Idempotent: posts that already contain "## TL;DR" are left untouched,
 * so re-running is safe. Not wired into the build — meant to be executed
 * once from the repo root:
 *
 *     node scripts/inject-tldr.mjs
 *
 * Prints one line per file (injected / skipped). Exits non-zero on any
 * parse failure.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const postsDir = path.join(repoRoot, "content", "blog");

if (!fs.existsSync(postsDir)) {
  console.error(`[inject-tldr] content dir not found: ${postsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
let injected = 0;
let skipped = 0;
let failed = 0;

for (const file of files) {
  const fp = path.join(postsDir, file);
  const raw = fs.readFileSync(fp, "utf8");

  if (/^##\s+TL;DR/m.test(raw)) {
    console.log(`  skip   ${file}  (already has TL;DR)`);
    skipped += 1;
    continue;
  }

  // Parse frontmatter: must start with `---\n...---\n`.
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) {
    console.error(`  FAIL   ${file}  (no frontmatter)`);
    failed += 1;
    continue;
  }
  const fm = fmMatch[1];
  // Extract excerpt: "excerpt:" then a quoted string or a plain-to-EOL value.
  // We only support the quoted form (consistent across all posts).
  const excerptMatch = fm.match(/^excerpt:\s*"([\s\S]*?)"\s*$/m);
  if (!excerptMatch) {
    console.error(`  FAIL   ${file}  (no quoted excerpt)`);
    failed += 1;
    continue;
  }
  const excerpt = excerptMatch[1];

  const fmEnd = fmMatch[0].length;
  const before = raw.slice(0, fmEnd);
  const after = raw.slice(fmEnd);

  // Strip any leading blank lines from the body so our block sits
  // directly under the frontmatter, matching the existing 8 posts.
  const afterTrimmed = after.replace(/^\s*\n/, "");

  const tldrBlock = `## TL;DR / Zusammenfassung\n${excerpt}\n\n`;
  const next = `${before}${tldrBlock}${afterTrimmed}`;

  fs.writeFileSync(fp, next);
  console.log(`  inject ${file}`);
  injected += 1;
}

console.log(
  `\n[inject-tldr] injected=${injected}  skipped=${skipped}  failed=${failed}`,
);

if (failed > 0) process.exit(1);
