import assert from "node:assert/strict";
import { absoluteImageUrl, firstImageSrc } from "../../lib/blog/lead-image";

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

// --- firstImageSrc -------------------------------------------------------

check("returns the src of a bare <img>", () => {
  assert.equal(
    firstImageSrc('<p>hi</p><img src="/blog/images/a.webp" alt="x">'),
    "/blog/images/a.webp",
  );
});

check("returns the src of an <img> inside a <figure>", () => {
  assert.equal(
    firstImageSrc(
      '<figure><img src="/b.webp" width="600" height="400" /><figcaption>c</figcaption></figure>',
    ),
    "/b.webp",
  );
});

check("returns the FIRST image when several exist", () => {
  assert.equal(
    firstImageSrc('<img src="/one.webp"><p>x</p><img src="/two.webp">'),
    "/one.webp",
  );
});

check("finds src even when other attributes precede it", () => {
  assert.equal(firstImageSrc('<img alt="before" src="/c.webp">'), "/c.webp");
});

check("returns null when there is no image", () => {
  assert.equal(firstImageSrc("<p>no image here</p>"), null);
});

check("handles a single-quoted src", () => {
  assert.equal(firstImageSrc("<img src='/d.webp'>"), "/d.webp");
});

check("ignores data-src / srcset (no real src= attribute)", () => {
  assert.equal(
    firstImageSrc('<img data-src="/lazy.webp" srcset="/x.webp 1x">'),
    null,
  );
});

// --- absoluteImageUrl ----------------------------------------------------

check("prefixes a root-relative path with the site URL", () => {
  assert.equal(
    absoluteImageUrl("/blog/images/a.webp", "https://oakwoodgolfclub.de"),
    "https://oakwoodgolfclub.de/blog/images/a.webp",
  );
});

check("leaves an already-absolute URL untouched", () => {
  assert.equal(
    absoluteImageUrl("https://cdn.example.com/x.png", "https://oakwoodgolfclub.de"),
    "https://cdn.example.com/x.png",
  );
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
