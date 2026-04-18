/**
 * Blog type-system. Frontmatter schema matches content/blog/*.md files —
 * if you change shape here, run through every post under content/blog/.
 *
 * `draft: true` hides a post from listings, sitemap, and direct URL in prod.
 * In development the drafts are visible so authors can proofread.
 */

export type PostMeta = {
  /** URL slug — defaults to filename without .md. */
  slug: string;
  /** Headline — H1 on the post page, link text in listings. */
  title: string;
  /** ISO 8601 date (YYYY-MM-DD). First-published. */
  date: string;
  /** Optional ISO date. Signals freshness to AI crawlers + search engines. */
  modified?: string;
  /** 140–200 char summary. Used for meta description + listing teasers. */
  excerpt: string;
  /** Taxonomy — min 1 category, used for /blog/kategorie/[slug] pages. */
  categories: string[];
  /** Optional free-form tags — no tag-listing page in v1. */
  tags?: string[];
  /** Author name. Defaults to "Oakwood Golf Club" if not set. */
  author: string;
  /** Optional cover image path (relative to /public). */
  coverImage?: string;
  /** Hide from public in prod when true. */
  draft: boolean;
  /**
   * When true, this post is pinned to the very top of all listings,
   * regardless of date. Used sparingly for evergreen "always front-page"
   * recommendations (e.g. our preferred handicap-tracking app, where
   * every visitor benefits from seeing it first). Tied to the prev/next
   * navigation semantics: pinned posts behave exactly like any other
   * post in the sorted order, just at position 0.
   */
  pinned?: boolean;
};

export type Post = PostMeta & {
  /** Raw markdown body. Kept around for RSS/future re-render. */
  content: string;
  /** Pre-rendered HTML from `marked`. Safe because source is version-controlled. */
  html: string;
  /** Estimated reading time in minutes (≥ 1). */
  readingTime: number;
};

export type Category = {
  /** Display name as authored in frontmatter. */
  name: string;
  /** Lower-case, umlaut-normalised URL slug. */
  slug: string;
  /** Post count — sort by this for "popular" listings. */
  count: number;
};
