/**
 * Unit tests for the Markdown-export core (lib/export/*) — OGC blog port.
 *
 * The feature (ported from neckarshore.ai, design doc in that repo's
 * docs/superpowers/specs/2026-06-28-markdown-export-design.md): a server-side
 * endpoint serves the CLEAN SOURCE markdown of a blog post (frontmatter header +
 * raw body), so the export round-trips losslessly back into content/blog/<slug>.md
 * and is ideal for Obsidian / LLM use. These tests pin the three pure pieces:
 *   - serialize.ts        → buildMarkdownDocument(), faqToMarkdown(), tableToMarkdown() (copied verbatim, content-agnostic core)
 *   - builders/blog.ts    → buildBlogMarkdown() (OGC blog wiring)
 *   - resolve.ts          → resolveExport() (path → builder, null for non-exportable)
 *
 * Run: `npm run test:export:unit`
 */
import assert from "node:assert/strict";
import { buildMarkdownDocument, faqToMarkdown, tableToMarkdown } from "../../lib/export/serialize";
import { buildBlogMarkdown } from "../../lib/export/builders/blog";
import { resolveExport } from "../../lib/export/resolve";
import { getPostBySlug } from "../../lib/blog/posts";

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

const OPTS = { baseUrl: "https://oakwoodgolfclub.de", exportedAt: "2026-06-28" };
const TEST_SLUG = "greenfees-als-fernmitglied"; // stable, non-draft blog post

// ── serialize.ts (copied verbatim — smoke coverage of the core) ──────────────

check("TC-EXP-U01: buildMarkdownDocument emits frontmatter, H1, lead blockquote, body and sections in order", () => {
  const md = buildMarkdownDocument({
    frontmatter: {
      title: "Greenfees",
      source: "https://oakwoodgolfclub.de/blog/greenfees-als-fernmitglied",
      site: "oakwoodgolfclub.de",
      exported: "2026-06-28",
    },
    title: "Greenfees als Fernmitglied",
    lead: "Worum es geht.",
    body: "## Das Problem\nText.",
    sections: [{ heading: "Häufige Fragen", body: "### Was?\n\nEine Antwort." }],
  });

  assert.match(md, /^---\n/, "must open with a YAML frontmatter fence");
  assert.match(md, /\nsite: "oakwoodgolfclub\.de"\n/);
  const h1 = md.indexOf("# Greenfees als Fernmitglied");
  const lead = md.indexOf("> Worum es geht.");
  const body = md.indexOf("## Das Problem");
  const faq = md.indexOf("## Häufige Fragen");
  assert.ok(h1 < lead && lead < body && body < faq, "order: H1 → lead → body → section");
  assert.ok(md.endsWith("\n"), "file ends with a single trailing newline");
});

check("TC-EXP-U02: faqToMarkdown renders each Q as H3 and the answer below it", () => {
  const out = faqToMarkdown([{ q: "Was?", a: "Antwort." }]);
  assert.equal(out, "### Was?\n\nAntwort.");
});

check("TC-EXP-U03: buildMarkdownDocument omits the lead blockquote when no lead is given", () => {
  const md = buildMarkdownDocument({ frontmatter: { title: "x" }, title: "Title", body: "Body." });
  assert.doesNotMatch(md, /\n> /, "no blockquote when lead is absent");
});

check("TC-EXP-U04: tableToMarkdown renders a GFM table and escapes pipes in cells", () => {
  const out = tableToMarkdown(["A", "B"], [["1", "2"], ["x|y", "z"]]);
  assert.equal(out, "| A | B |\n| --- | --- |\n| 1 | 2 |\n| x\\|y | z |");
});

// ── builders/blog.ts ─────────────────────────────────────────────────────────

check("TC-EXP-U05: buildBlogMarkdown assembles a real post from its content/blog/*.md source", () => {
  const post = getPostBySlug(TEST_SLUG);
  assert.ok(post, `${TEST_SLUG} must exist as a non-draft post`);
  const result = buildBlogMarkdown(TEST_SLUG, OPTS);
  assert.ok(result, "a real post must export");

  const md = result.markdown;
  assert.match(md, /^---\n/);
  assert.match(md, new RegExp(`\\nsource: "https://oakwoodgolfclub\\.de/blog/${TEST_SLUG}"\\n`));
  assert.match(md, /\nsite: "oakwoodgolfclub\.de"\n/);
  assert.match(md, /\nexported: "2026-06-28"\n/);
  assert.ok(md.includes(`# ${post.title}`), "H1 is the post title");
  assert.ok(md.includes(`> ${post.excerpt.trim()}`), "lead blockquote is the post excerpt");
});

check("TC-EXP-U06: buildBlogMarkdown returns null for a slug with no .md source", () => {
  assert.equal(buildBlogMarkdown("does-not-exist", OPTS), null);
});

check("TC-EXP-U07: buildBlogMarkdown filename leads with the site host (self-identifying across vaults)", () => {
  // Founder convention 2026-06-28 (ported from neckarshore): "<host> - <slug>.md".
  const result = buildBlogMarkdown(TEST_SLUG, OPTS);
  assert.ok(result);
  assert.equal(result.filename, `oakwoodgolfclub.de - ${TEST_SLUG}.md`);
});

check("TC-EXP-U08: a blog export has no FAQ section (OGC posts carry no per-post FAQ)", () => {
  const md = buildBlogMarkdown(TEST_SLUG, OPTS)!.markdown;
  assert.doesNotMatch(md, /## Häufige Fragen/, "blog posts have no FAQ section to serialize");
});

// ── resolve.ts ───────────────────────────────────────────────────────────────

check("TC-EXP-U09: resolveExport maps a blog path (with or without trailing slash) to the blog builder", () => {
  const a = resolveExport(`/blog/${TEST_SLUG}`, OPTS);
  assert.ok(a, "/blog/<slug> must resolve");
  assert.equal(a.filename, `oakwoodgolfclub.de - ${TEST_SLUG}.md`);
  assert.ok(resolveExport(`/blog/${TEST_SLUG}/`, OPTS), "trailing slash must still resolve");
});

check("TC-EXP-U10: resolveExport returns null for non-exportable or malicious paths", () => {
  assert.equal(resolveExport("/", OPTS), null, "home has no .md source");
  assert.equal(resolveExport("/blog", OPTS), null, "blog index has no slug");
  assert.equal(resolveExport("/blog/", OPTS), null, "blog index slash has no slug");
  assert.equal(resolveExport("/faq", OPTS), null, "FAQ is hand-written JSX");
  assert.equal(resolveExport("/ueber-uns", OPTS), null, "about is hand-written JSX");
  assert.equal(resolveExport("/blog/../../etc/passwd", OPTS), null, "no path traversal");
  assert.equal(resolveExport(`/blog/Greenfees`, OPTS), null, "slug charset is lowercase a-z0-9-");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
