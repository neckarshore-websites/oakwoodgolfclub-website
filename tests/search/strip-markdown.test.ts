import assert from "node:assert/strict";
import { stripMarkdown } from "../../lib/search/strip-markdown";

let pass = 0, fail = 0;
function check(label: string, fn: () => void) {
  try { fn(); pass++; } catch (e) { fail++; console.error(`  ✗ ${label}\n    ${(e as Error).message.split("\n")[0]}`); }
}

check("strips headings, emphasis, keeps link text", () => {
  assert.equal(stripMarkdown("## Heading\n\nSome **bold** and [a link](/x)."), "Heading Some bold and a link.");
});
check("removes images entirely", () => {
  assert.equal(stripMarkdown("![alt](/img.png) text"), "text");
});
check("strips html tags", () => {
  assert.equal(stripMarkdown("<img src=x> hi <b>there</b>"), "hi there");
});

console.log(`strip-markdown: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
