/**
 * Lead-image helpers for blog-post structured data.
 *
 * `BlogPosting.image` is sourced automatically from the first inline image
 * of the rendered post HTML (User decision 2026-06-18, SEO-audit H2) — posts
 * carry no `coverImage` frontmatter, so the lead visual is whatever image
 * opens the article body.
 */

/**
 * Return the `src` of the first `<img>` in rendered post HTML, or `null`
 * when the post has no image. Works on `marked` output, where both
 * `![]()` markdown and raw `<figure><img>` collapse to plain `<img>` tags.
 * Matches `src` wherever it sits in the tag (e.g. after `alt`); deliberately
 * does NOT match `data-src` / `srcset` (only a real, whitespace-delimited
 * `src=` attribute).
 */
export function firstImageSrc(html: string): string | null {
  const match = html.match(/<img\b[^>]*?\ssrc=(["'])(.*?)\1/i);
  return match ? match[2] : null;
}

/**
 * Resolve an image path to an absolute URL for structured data. Root-relative
 * paths ("/blog/images/x.webp") are prefixed with the site URL; already-absolute
 * `http(s)` URLs pass through unchanged.
 */
export function absoluteImageUrl(src: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${siteUrl}${src.startsWith("/") ? "" : "/"}${src}`;
}
