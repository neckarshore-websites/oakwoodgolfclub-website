/**
 * Blog-post export builder — oakwoodgolfclub.de wiring (PER-REPO part).
 *
 * Reads the post's source `.md` (frontmatter + RAW Markdown body via the existing
 * blog loader — not the rendered HTML, so the export round-trips losslessly back into
 * content/blog/<slug>.md) and hands it to the generic serializer. Returns null when no
 * published post exists for the slug (→ the route 404s; drafts resolve to null in prod,
 * so a draft is never exportable on the live site).
 *
 * OGC posts carry no per-post FAQ, so there are no extra sections (unlike the
 * neckarshore product builder). The excerpt becomes the lead blockquote.
 */
import { getPostBySlug } from "@/lib/blog/posts";
import { SITE } from "@/lib/site-config";
import { buildMarkdownDocument } from "../serialize";

export interface ExportResult {
  /** Download filename, site-prefixed, e.g. `oakwoodgolfclub.de - greenfees-als-fernmitglied.md`. */
  filename: string;
  /** The assembled Markdown document. */
  markdown: string;
}

export interface ExportOptions {
  /** Canonical origin for the `source:` frontmatter field (no trailing slash). */
  baseUrl: string;
  /** ISO date (YYYY-MM-DD) for the `exported:` frontmatter field. */
  exportedAt: string;
}

const SITE_NAME = new URL(SITE.url).host;

export function buildBlogMarkdown(slug: string, opts: ExportOptions): ExportResult | null {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const markdown = buildMarkdownDocument({
    frontmatter: {
      title: post.title,
      source: `${opts.baseUrl}/blog/${slug}`,
      site: SITE_NAME,
      exported: opts.exportedAt,
    },
    title: post.title,
    lead: post.excerpt,
    body: post.content,
  });

  // Filename leads with the site host so exports are self-identifying when many
  // sites' .md files land in one Obsidian vault / LLM context (Founder, 2026-06-28).
  return { filename: `${SITE_NAME} - ${slug}.md`, markdown };
}
