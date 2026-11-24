import assert from "node:assert/strict";
import { buildPostMetadata } from "../../lib/blog/post-metadata";
import type { Post } from "../../lib/blog/types";

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

const post: Post = {
  slug: "wedges",
  title: "Welche Wedges gehören ins Bag?",
  date: "2024-04-05",
  excerpt: "Welche Wedges ins Bag gehören.",
  categories: ["Technik"],
  author: "Oakwood Golf Club",
  draft: false,
  content: "",
  html: '<p>x</p><img src="/blog/images/w.jpg" alt="w">',
  readingTime: 1,
};

check("twitter tags follow the article, not the layout pitch", () => {
  const m = buildPostMetadata(post);
  const tw = m.twitter as { title: string; description: string; images: string[] };
  assert.equal(tw.title, post.title);
  assert.equal(tw.description, post.excerpt);
  assert.doesNotMatch(JSON.stringify(tw), /55 Euro/);
});

check("og:image and twitter:image are the post's lead image", () => {
  const m = buildPostMetadata(post);
  const og = m.openGraph as { images: Array<{ url: string }> };
  assert.equal(og.images[0].url, "https://oakwoodgolfclub.de/blog/images/w.jpg");
  assert.deepEqual((m.twitter as { images: string[] }).images, [
    "https://oakwoodgolfclub.de/blog/images/w.jpg",
  ]);
});

check("a post without an image falls back to the site card", () => {
  const m = buildPostMetadata({ ...post, html: "<p>no image</p>" });
  const og = m.openGraph as { images: Array<{ url: string }> };
  assert.equal(og.images[0].url, "https://oakwoodgolfclub.de/opengraph-image");
});

check("metaTitle drives the snippet; the headline stays the fallback", () => {
  const m = buildPostMetadata({ ...post, metaTitle: "Kurzer Titel" });
  assert.equal(m.title, "Kurzer Titel");
  assert.equal((m.openGraph as { title: string }).title, "Kurzer Titel");
  assert.equal((m.twitter as { title: string }).title, "Kurzer Titel");
  assert.equal(buildPostMetadata(post).title, post.title);
});

check("og:url and canonical point at the post", () => {
  const m = buildPostMetadata(post);
  assert.equal((m.openGraph as { url: string }).url, "https://oakwoodgolfclub.de/blog/wedges");
  assert.equal((m.alternates as { canonical: string }).canonical, "/blog/wedges");
});

console.log(`post-metadata: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
