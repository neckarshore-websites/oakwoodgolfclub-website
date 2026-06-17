import assert from "node:assert/strict";
import MiniSearch from "minisearch";
import { buildSearchDocs } from "../../lib/search/index-data";

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
  assert.equal(docs.find((d) => d.id === "blog:was-soll-man-trainieren"), undefined);
});
check("minisearch finds the ballmarker post with a typo (fuzzy)", () => {
  const mini = new MiniSearch({ fields: ["title", "text"], storeFields: ["url", "type"] });
  mini.addAll(docs);
  const hits = mini.search("ballmarkr", { fuzzy: 0.2, prefix: true });
  assert.ok(hits.some((h) => String(h.url).includes("magnetischer-ballmarker")));
});

console.log(`index-data: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
