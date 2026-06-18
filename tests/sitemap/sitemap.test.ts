import assert from "node:assert/strict";
import sitemap from "../../app/sitemap";
import { getAllPosts } from "../../lib/blog/posts";
import { SITE, SITE_UPDATED } from "../../lib/site-config";

/**
 * Sitemap unit test (SEO-audit 2026-06-18 #69).
 *
 * Run with NODE_ENV=production so draft handling matches the real build
 * (drafts excluded), the same way the search unit tests run.
 */

let pass = 0,
  fail = 0;
function check(label: string, fn: () => void) {
  try {
    fn();
    pass++;
  } catch (e) {
    fail++;
    console.error(`  ✗ ${label}\n    ${(e as Error).message.split("\n")[0]}`);
  }
}

const entries = sitemap();
const byUrl = (suffix: string) =>
  entries.find((e) => e.url === `${SITE.url}${suffix}`);

const posts = getAllPosts();
const postDate = (p: { modified?: string; date: string }) =>
  new Date(p.modified ?? p.date);
const newestPostTime = Math.max(...posts.map((p) => postDate(p).getTime()));
const siteUpdatedTime = new Date(SITE_UPDATED).getTime();

// --- deprecated fields removed ------------------------------------------

check("no entry carries changeFrequency", () => {
  const offenders = entries.filter((e) => "changeFrequency" in e);
  assert.equal(offenders.length, 0, `${offenders.length} entries still have changeFrequency`);
});

check("no entry carries priority", () => {
  const offenders = entries.filter((e) => "priority" in e);
  assert.equal(offenders.length, 0, `${offenders.length} entries still have priority`);
});

// --- every entry has a lastModified -------------------------------------

check("every entry has a lastModified date", () => {
  const missing = entries.filter((e) => !e.lastModified);
  assert.equal(missing.length, 0, `${missing.length} entries missing lastModified`);
});

// --- stable, content-derived dates --------------------------------------

check("static content pages use SITE_UPDATED", () => {
  for (const path of ["/", "/impressum", "/datenschutz", "/agb", "/faq"]) {
    const entry = byUrl(path);
    assert.ok(entry, `missing entry for ${path}`);
    assert.equal(
      new Date(entry!.lastModified!).getTime(),
      siteUpdatedTime,
      `${path} lastModified != SITE_UPDATED`,
    );
  }
});

check("/blog uses the newest post date", () => {
  const entry = byUrl("/blog");
  assert.ok(entry, "missing /blog entry");
  assert.equal(new Date(entry!.lastModified!).getTime(), newestPostTime);
});

check("no static entry uses the volatile build time (today)", () => {
  // SITE_UPDATED is a fixed past date; if any static page still stamped
  // `new Date()` it would be far newer than SITE_UPDATED.
  const homepage = byUrl("/");
  assert.ok(
    new Date(homepage!.lastModified!).getTime() <= newestPostTime,
    "homepage lastModified looks like a build timestamp, not SITE_UPDATED",
  );
});

check("blog post entries carry their own post date", () => {
  const first = posts[0];
  const entry = byUrl(`/blog/${first.slug}`);
  assert.ok(entry, `missing entry for /blog/${first.slug}`);
  assert.equal(
    new Date(entry!.lastModified!).getTime(),
    postDate(first).getTime(),
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
