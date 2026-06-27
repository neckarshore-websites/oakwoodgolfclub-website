import assert from "node:assert/strict";
import {
  getAllCategories,
  getAllPosts,
  getPostsByCategorySlug,
} from "../../lib/blog/posts";

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

/**
 * Asserts a post list is in strict newest-first order (date descending).
 * Content-robust: it hardcodes no slugs or dates, only the invariant — so it
 * keeps holding as posts come and go. This is the guard for "newest beitrag
 * oben in jeder Kategorie" (2026-06-27, German Rauhut) and against any
 * re-introduction of a pinning override that lifts an older post to the top.
 */
function assertDateDesc(
  posts: { slug: string; date: string }[],
  context: string,
) {
  for (let i = 1; i < posts.length; i++) {
    const prev = posts[i - 1];
    const cur = posts[i];
    assert.ok(
      prev.date.localeCompare(cur.date) >= 0,
      `${context}: "${prev.slug}" (${prev.date}) sits above newer "${cur.slug}" (${cur.date}) — must be newest-first`,
    );
  }
}

// --- global /blog listing ------------------------------------------------

check("getAllPosts() is strictly newest-first (no pin override)", () => {
  assertDateDesc(getAllPosts(), "/blog");
});

// --- every category page -------------------------------------------------

const categories = getAllCategories();
assert.ok(categories.length > 0, "expected at least one category to test");

for (const cat of categories) {
  check(`category "${cat.name}" is strictly newest-first`, () => {
    const posts = getPostsByCategorySlug(cat.slug);
    assert.ok(posts.length > 0, `category ${cat.slug} unexpectedly empty`);
    assertDateDesc(posts, `category ${cat.slug}`);
  });
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
