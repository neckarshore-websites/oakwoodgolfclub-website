import assert from "node:assert/strict";
import {
  injectImageDimensions,
  readDimensions,
  type Dimensions,
} from "../../lib/blog/image-dimensions";

/**
 * Blog image-dimension injection unit test (SEO-audit 2026-06-18 #71).
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

// A fake resolver so the transform logic is tested without touching disk.
const fake = (src: string): Dimensions | null =>
  src === "/blog/images/a.webp" ? { width: 800, height: 600 } : null;

// --- injectImageDimensions ----------------------------------------------

check("injects width/height into a dimensionless <img>", () => {
  const out = injectImageDimensions(
    '<img src="/blog/images/a.webp" alt="x">',
    fake,
  );
  assert.match(out, /width="800"/);
  assert.match(out, /height="600"/);
});

check("preserves a self-closing tag's form", () => {
  const out = injectImageDimensions(
    '<img src="/blog/images/a.webp" alt="x" />',
    fake,
  );
  assert.ok(out.endsWith("/>"), `expected self-closing, got: ${out}`);
  assert.match(out, /width="800" height="600" \/>/);
});

check("leaves an already-sized <img> untouched", () => {
  const input = '<img src="/blog/images/a.webp" width="800" height="600" />';
  assert.equal(injectImageDimensions(input, fake), input);
});

check("leaves an <img> untouched when the resolver returns null", () => {
  const input = '<img src="/blog/images/missing.webp" alt="x">';
  assert.equal(injectImageDimensions(input, fake), input);
});

check("never injects a partial size (height present, width missing)", () => {
  // Only inject when BOTH are absent; a half-declared image is the author's.
  const input = '<img src="/blog/images/a.webp" height="600">';
  assert.equal(injectImageDimensions(input, fake), input);
});

check("processes multiple images independently", () => {
  const out = injectImageDimensions(
    '<img src="/blog/images/a.webp" alt="1"><p>x</p><img src="/blog/images/missing.webp" alt="2">',
    fake,
  );
  assert.match(out, /a\.webp" alt="1" width="800" height="600"/);
  assert.match(out, /missing\.webp" alt="2">/); // untouched
});

check("handles src appearing after alt", () => {
  const out = injectImageDimensions(
    '<img alt="x" src="/blog/images/a.webp">',
    fake,
  );
  assert.match(out, /width="800"/);
});

check("ignores a tag with no src", () => {
  const input = "<img alt='broken'>";
  assert.equal(injectImageDimensions(input, fake), input);
});

// --- readDimensions (integration with real files) -----------------------

check("reads real PNG dimensions from /public", () => {
  assert.deepEqual(readDimensions("/blog/images/golf-brain.png"), {
    width: 364,
    height: 287,
  });
});

check("reads real WebP dimensions from /public", () => {
  const d = readDimensions("/blog/images/strokesin-app-icon.webp");
  assert.ok(d && d.width > 0 && d.height > 0, "expected positive webp dims");
});

check("returns null for an external URL (not on disk)", () => {
  assert.equal(readDimensions("https://example.com/x.png"), null);
});

check("returns null (no throw) for a missing local file", () => {
  // The advisor's blocking case: a bad path must not crash next build.
  assert.equal(readDimensions("/blog/images/does-not-exist.webp"), null);
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
