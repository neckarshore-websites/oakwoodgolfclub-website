import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MiniSearch from "minisearch";
import { buildSearchDocs } from "../../lib/search/index-data";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

/** Slugs of posts currently marked `draft: true`, derived at run time. */
function currentDraftSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .flatMap((f) => {
      const data = matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8")).data as {
        slug?: string;
        draft?: boolean;
      };
      return data.draft === true ? [data.slug ?? f.replace(/\.md$/, "")] : [];
    });
}

let pass = 0, fail = 0;
function check(label: string, fn: () => void) {
  try { fn(); pass++; } catch (e) { fail++; console.error(`  ✗ ${label}\n    ${(e as Error).message.split("\n")[0]}`); }
}
const docs = buildSearchDocs();

check("has blog + faq docs", () => {
  assert.ok(docs.some((d) => d.type === "blog"));
  assert.ok(docs.some((d) => d.type === "faq"));
});
check("blog url is /blog/<slug>, faq url is /faq#<slug>", () => {
  assert.ok(docs.find((d) => d.id === "blog:kuerzester-golfwitz-der-welt")?.url === "/blog/kuerzester-golfwitz-der-welt");
  assert.ok(docs.find((d) => d.type === "faq")!.url.startsWith("/faq#"));
});
check("text is plaintext (no markdown link/heading syntax)", () => {
  assert.ok(!docs.some((d) => d.text.includes("](") || /(^|\s)#{1,6}\s/.test(d.text)));
});
check("drafts excluded under production", () => {
  // Invariant instead of a pinned slug. The original form asserted that ONE
  // hardcoded slug ("was-soll-man-trainieren") was absent from the index. That
  // post was later PUBLISHED (`draft: false`, commit dd2347a), so the suite went
  // red for a STALE FIXTURE — not a product bug: the prod filter in
  // lib/blog/posts.ts (`if (isDraft && IS_PROD) continue`) is correct and was
  // verified so. The red suite is why this file sat outside CI. This form is
  // strictly stronger (catches ANY leaked draft, not one slug) and self-
  // maintaining across future publishes.
  //
  // HONEST LIMITATION: the repo currently holds zero `draft: true` posts, so
  // this assertion is vacuously true today — it would still pass if the filter
  // broke. Making it non-vacuous needs an injection seam in buildSearchDocs()
  // (product-code change, deliberately out of scope here). It regains teeth the
  // moment a draft exists, which is exactly when the regression could bite.
  for (const slug of currentDraftSlugs()) {
    assert.equal(
      docs.find((d) => d.id === `blog:${slug}`),
      undefined,
      `draft leaked into the production search index: ${slug}`,
    );
  }
});
check("minisearch finds the ballmarker post with a typo (fuzzy)", () => {
  const mini = new MiniSearch({ fields: ["title", "text"], storeFields: ["url", "type"] });
  mini.addAll(docs);
  const hits = mini.search("ballmarkr", { fuzzy: 0.2, prefix: true });
  assert.ok(hits.some((h) => String(h.url).includes("magnetischer-ballmarker")));
});

console.log(`index-data: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
