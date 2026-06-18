import assert from "node:assert/strict";
import {
  SITE_URL,
  blogUrl,
  deriveSlug,
  isBlogPostPath,
} from "../../scripts/indexnow-submit.mjs";

/**
 * IndexNow URL-derivation unit test (SEO-audit 2026-06-18 #68).
 * Covers the pure helpers — the fs/network paths are exercised by the
 * `--dry-run` smoke in CI, not here.
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

// --- deriveSlug ----------------------------------------------------------

check("slug falls back to the filename without .md", () => {
  assert.equal(deriveSlug("content/blog/mein-post.md"), "mein-post");
});

check("frontmatter slug overrides the filename", () => {
  assert.equal(
    deriveSlug("content/blog/raw-file-name.md", { slug: "kanonischer-slug" }),
    "kanonischer-slug",
  );
});

check("bare filename (no dir) still resolves", () => {
  assert.equal(deriveSlug("mein-post.md"), "mein-post");
});

// --- blogUrl -------------------------------------------------------------

check("builds the canonical blog URL", () => {
  assert.equal(blogUrl("mein-post"), `${SITE_URL}/blog/mein-post`);
});

check("honours a custom base", () => {
  assert.equal(
    blogUrl("x", "https://oakwoodgolfclub-website.vercel.app"),
    "https://oakwoodgolfclub-website.vercel.app/blog/x",
  );
});

// --- isBlogPostPath ------------------------------------------------------

check("accepts a content/blog markdown path", () => {
  assert.ok(isBlogPostPath("content/blog/post.md"));
});

check("accepts a ./-prefixed path", () => {
  assert.ok(isBlogPostPath("./content/blog/post.md"));
});

check("rejects non-markdown in content/blog", () => {
  assert.ok(!isBlogPostPath("content/blog/image.webp"));
});

check("rejects markdown outside content/blog", () => {
  assert.ok(!isBlogPostPath("docs/notes.md"));
  assert.ok(!isBlogPostPath("README.md"));
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
