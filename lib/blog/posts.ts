/**
 * Blog post loader — reads /content/blog/*.md at build time, parses
 * frontmatter with gray-matter, renders markdown with marked.
 *
 * All functions are Server-Component safe (use `node:fs`). Result is cached
 * in-process via a memoised `loadAll()` — Next.js caches per-build anyway,
 * but the memo makes repeated `getAllCategories() + getAllPosts()` cheap in
 * a single request.
 *
 * DSGVO note: posts live in the repo (versioned, public). No member data
 * touches this path.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { injectImageDimensions } from "./image-dimensions";
import type { Category, Post, PostMeta } from "./types";

/**
 * Allowed HTML after markdown rendering.
 * Explicit allow-list — even though markdown source is trusted (version-
 * controlled repo, no user input), sanitizing is defence-in-depth: a typo
 * that accidentally embeds <script> never slips through.
 */
const SANITIZE_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "blockquote", "hr", "br",
    "ul", "ol", "li",
    "strong", "em", "code", "pre", "del", "sup", "sub",
    "a", "img",
    "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    code: ["class"], // language- hints from fenced code blocks
    pre: ["class"],
    th: ["scope"],
    // `div` and `p` get class permission so the post-render TL;DR
    // wrapper (div.ogc-tldr containing two classed <p> children) can
    // survive sanitisation. The risk surface is tiny because the markdown
    // source path can't authentically introduce class attributes anyway —
    // only the TLDR-wrapper transformation does.
    div: ["class"],
    p: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Links out of our origin open in new tab with noopener by default.
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const isExternal = /^https?:\/\//.test(href);
      return {
        tagName,
        attribs: {
          ...attribs,
          ...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {}),
        },
      };
    },
  },
};

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const IS_PROD = process.env.NODE_ENV === "production";

// ---------------------------------------------------------------------------
// TL;DR / Zusammenfassung wrapper.
//
// Posts that open with a "## TL;DR / Zusammenfassung" section get the
// rendered HTML of that section wrapped in a <div class="ogc-tldr"> so
// .ogc-prose CSS can give it the standfirst callout treatment. Pure HTML
// rewrite — no frontmatter changes needed, posts without the TL;DR remain
// untouched.
//
// The regex deliberately requires the "TL;DR" phrase plus a subtitle
// (Zusammenfassung | Fazit — latter kept for legacy posts during any
// transition window) so a post with a coincidental first H2 ("## Was
// ist X?") doesn't get the callout styling. Separator accepts slash,
// en-dash, or hyphen.
const TLDR_BLOCK_RE =
  /^(\s*)<h2[^>]*>TL;DR\s*[\/–-]\s*(?:Zusammenfassung|Fazit)<\/h2>\s*<p>([\s\S]*?)<\/p>/;

function wrapTldr(html: string): string {
  const match = html.match(TLDR_BLOCK_RE);
  if (!match) return html;
  const [full, leadingWhitespace, paragraphInner] = match;
  const wrapper =
    `${leadingWhitespace}<div class="ogc-tldr">` +
    `<p class="ogc-tldr__eyebrow">TL;DR / Zusammenfassung</p>` +
    `<p class="ogc-tldr__body">${paragraphInner}</p>` +
    `</div>`;
  return wrapper + html.slice(full.length);
}

// ---------------------------------------------------------------------------
// Slug normalisation — German umlauts → ASCII, lowercase, hyphen-separated.

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Core loader — memoised per-process.

type CachedAll = {
  posts: Post[];
  categories: Category[];
};

let cache: CachedAll | null = null;

function loadAll(): CachedAll {
  if (cache) return cache;

  // Tolerate missing dir so first-time scaffolding doesn't crash the build.
  if (!fs.existsSync(POSTS_DIR)) {
    cache = { posts: [], categories: [] };
    return cache;
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"));

  const posts: Post[] = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data as Partial<PostMeta>;

    // Required fields — skip with console-warn instead of hard-fail so
    // a bad post doesn't take down the whole build during editing.
    if (!data.title || !data.date || !data.excerpt) {
      console.warn(`[blog] skipping ${file}: missing title/date/excerpt`);
      continue;
    }
    if (!Array.isArray(data.categories) || data.categories.length === 0) {
      console.warn(`[blog] skipping ${file}: missing categories`);
      continue;
    }

    const slug = data.slug ?? file.replace(/\.md$/, "");
    const isDraft = data.draft === true;

    // Hide drafts in production — still visible in dev for proofreading.
    if (isDraft && IS_PROD) continue;

    const rawHtml = marked.parse(parsed.content, { async: false }) as string;
    const wrappedHtml = wrapTldr(rawHtml);
    const sanitized = sanitizeHtml(wrappedHtml, SANITIZE_CONFIG);
    // Inject intrinsic width/height on dimensionless <img>s to prevent CLS
    // (#71). Runs AFTER sanitize; values are build-time-computed integers
    // (width/height are also in the sanitiser allow-list), so this adds no
    // injection surface.
    const html = injectImageDimensions(sanitized);
    const readingTime = Math.max(
      1,
      Math.round(parsed.content.split(/\s+/).length / 200),
    );

    posts.push({
      slug,
      title: data.title,
      date: data.date,
      modified: data.modified,
      reviewed: data.reviewed,
      excerpt: data.excerpt,
      categories: data.categories,
      tags: data.tags,
      author: data.author ?? "Oakwood Golf Club",
      coverImage: data.coverImage,
      draft: isDraft,
      content: parsed.content,
      html,
      readingTime,
    });
  }

  // Sort strictly by date, newest first — no pinning override (German Rauhut
  // directive 2026-06-27: "der jeweils neueste Beitrag oben in jeder
  // Kategorie"). The same order is reused by the adjacent-posts (prev/next)
  // helper so blog navigation matches the listing order.
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // Aggregate categories with counts.
  const catMap = new Map<string, { name: string; count: number }>();
  for (const post of posts) {
    for (const cat of post.categories) {
      const existing = catMap.get(cat);
      if (existing) existing.count += 1;
      else catMap.set(cat, { name: cat, count: 1 });
    }
  }
  const categories: Category[] = Array.from(catMap.values())
    .map((c) => ({ ...c, slug: categorySlug(c.name) }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

  cache = { posts, categories };
  return cache;
}

// ---------------------------------------------------------------------------
// Public API.

/** All published posts, newest first. Excludes drafts in production. */
export function getAllPosts(): PostMeta[] {
  return loadAll().posts.map(({ content: _c, html: _h, ...meta }) => {
    void _c;
    void _h;
    return meta;
  });
}

/** One post by slug, or null when not found (or draft in prod). */
export function getPostBySlug(slug: string): Post | null {
  return loadAll().posts.find((p) => p.slug === slug) ?? null;
}

/** All categories with post counts, alphabetically sorted. */
export function getAllCategories(): Category[] {
  return loadAll().categories;
}

/** Posts that belong to a given category slug. */
export function getPostsByCategorySlug(slug: string): PostMeta[] {
  return loadAll()
    .posts.filter((p) => p.categories.some((c) => categorySlug(c) === slug))
    .map(({ content: _c, html: _h, ...meta }) => {
      void _c;
      void _h;
      return meta;
    });
}

/** Find the display name of a category from its slug. */
export function getCategoryBySlug(slug: string): Category | null {
  return loadAll().categories.find((c) => c.slug === slug) ?? null;
}

/**
 * Adjacent posts in the same global sort order shown on /blog.
 * `prev` is the post directly above the current one in the listing;
 * `next` is the one directly below. Either side may be `null` at the
 * ends of the list. We deliberately do NOT wrap around — readers
 * understand "first post" / "last post" as a natural stop signal.
 */
export function getAdjacentPosts(
  slug: string,
): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = loadAll().posts;
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  const stripBody = (p: Post): PostMeta => {
    const { content: _c, html: _h, ...meta } = p;
    void _c;
    void _h;
    return meta;
  };
  return {
    prev: idx > 0 ? stripBody(posts[idx - 1]) : null,
    next: idx < posts.length - 1 ? stripBody(posts[idx + 1]) : null,
  };
}
