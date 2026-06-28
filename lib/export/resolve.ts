/**
 * Export resolver — maps a site path to the builder that can export it (PER-REPO part).
 *
 * The single place that decides "is this page exportable, and how": a small, ordered
 * set of path patterns. On OGC the only exportable surface is blog posts (the Founder's
 * blog-extraction use case); hand-written JSX pages (home, FAQ, Über-uns, legal) have no
 * `.md` source and are intentionally not exportable. Adding a new exportable content type
 * later is additive — one matcher + one builder, no rewrite (AP-1: add, don't replace).
 *
 * The blog slug charset is locked to `[a-z0-9-]`, which also closes path-traversal
 * (`/blog/../x` never matches) — defence in depth alongside the loader's fixed content root.
 */
import { buildBlogMarkdown, type ExportOptions, type ExportResult } from "./builders/blog";

const BLOG_PATH = /^\/blog\/([a-z0-9-]+)\/?$/;

export function resolveExport(pathname: string, opts: ExportOptions): ExportResult | null {
  const blog = pathname.match(BLOG_PATH);
  if (blog) return buildBlogMarkdown(blog[1], opts);

  return null;
}
