#!/usr/bin/env node
/**
 * IndexNow submitter (SEO-audit 2026-06-18 #68).
 *
 * Pushes new/changed blog-post URLs to the IndexNow API so Bing + Yandex
 * (both DACH-relevant) re-crawl within minutes instead of waiting for the
 * next sitemap poll. Google does NOT participate in IndexNow — it keeps
 * relying on the sitemap.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs --all                 # all published posts
 *   node scripts/indexnow-submit.mjs <file.md> [<file.md>] # specific changed files
 *   add --dry-run to print the payload without POSTing
 *
 * The key lives in a single `public/<key>.txt` file (served at the site root,
 * which is how IndexNow verifies ownership). The key itself is public by
 * design — no secret handling needed.
 *
 * Exported helpers are unit-tested in tests/seo/indexnow.test.ts.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const SITE_URL = "https://oakwoodgolfclub.de";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const POSTS_DIR = "content/blog";
const PUBLIC_DIR = "public";

// --- pure helpers --------------------------------------------------------

/** Derive the public slug for a blog markdown file (frontmatter `slug` wins). */
export function deriveSlug(filename, frontmatter = {}) {
  return frontmatter.slug ?? path.basename(filename).replace(/\.md$/, "");
}

/** Map a slug to its canonical blog URL. */
export function blogUrl(slug, base = SITE_URL) {
  return `${base}/blog/${slug}`;
}

/** Is this a blog markdown path we care about? */
export function isBlogPostPath(file, postsDir = POSTS_DIR) {
  const norm = file.replace(/^\.\//, "");
  return norm.startsWith(`${postsDir}/`) && norm.endsWith(".md");
}

// --- fs-backed helpers ---------------------------------------------------

/** Find the single IndexNow key file in /public → { key, keyLocation }. */
export function findKey(publicDir = PUBLIC_DIR, siteUrl = SITE_URL) {
  const files = fs
    .readdirSync(publicDir)
    .filter((f) => /^[a-f0-9]{8,128}\.txt$/.test(f));
  if (files.length !== 1) {
    throw new Error(
      `expected exactly one IndexNow key file (<key>.txt) in ${publicDir}, found ${files.length}`,
    );
  }
  return { key: files[0].replace(/\.txt$/, ""), keyLocation: `${siteUrl}/${files[0]}` };
}

/** All published (non-draft) blog posts → canonical URLs. */
export function allPublishedUrls(postsDir = POSTS_DIR) {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(postsDir, f))
    .filter((p) => matter(fs.readFileSync(p, "utf8")).data.draft !== true)
    .map((p) => blogUrl(deriveSlug(p, matter(fs.readFileSync(p, "utf8")).data)))
    .sort();
}

/**
 * Changed blog files → URLs, skipping non-blog paths, drafts, and deleted
 * files (a deleted post 404s — submitting it would be wrong).
 */
export function changedPostUrls(changedFiles, postsDir = POSTS_DIR) {
  const urls = [];
  for (const f of changedFiles) {
    if (!isBlogPostPath(f, postsDir)) continue;
    if (!fs.existsSync(f)) continue; // deleted / renamed-away
    const fm = matter(fs.readFileSync(f, "utf8")).data;
    if (fm.draft === true) continue;
    urls.push(blogUrl(deriveSlug(f, fm)));
  }
  return [...new Set(urls)].sort();
}

// --- network -------------------------------------------------------------

/** Best-effort: wait until the first URL responds 200 (deploy may lag). */
async function waitForLive(url, { attempts = 8, delayMs = 15000 } = {}) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return true;
    } catch {
      /* not reachable yet */
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

async function submit(urlList, { dryRun = false } = {}) {
  const { key, keyLocation } = findKey();
  const host = new URL(SITE_URL).host;
  const payload = { host, key, keyLocation, urlList };

  if (dryRun) {
    console.log("[indexnow] dry-run, payload:");
    console.log(JSON.stringify(payload, null, 2));
    return 0;
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  // IndexNow returns 200 or 202 on success.
  console.log(`[indexnow] POST ${INDEXNOW_ENDPOINT} → ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    const text = await res.text().catch(() => "");
    console.error(`[indexnow] non-success response: ${text.slice(0, 300)}`);
    return 1;
  }
  return 0;
}

// --- CLI -----------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const rest = args.filter((a) => a !== "--dry-run");

  const urls = rest.includes("--all")
    ? allPublishedUrls()
    : changedPostUrls(rest);

  if (urls.length === 0) {
    console.log("[indexnow] no published blog URLs to submit — nothing to do.");
    return 0;
  }

  console.log(`[indexnow] ${urls.length} URL(s):`);
  urls.forEach((u) => console.log(`  - ${u}`));

  if (!dryRun) {
    const live = await waitForLive(urls[0]);
    if (!live) {
      console.warn(
        `[indexnow] ${urls[0]} not yet 200 after polling — submitting anyway (engines re-crawl on their own schedule).`,
      );
    }
  }

  return submit(urls, { dryRun });
}

// Only run when invoked directly, not when imported by the test.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((code) => process.exit(code));
}
