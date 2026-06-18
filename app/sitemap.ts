import type { MetadataRoute } from "next";
import {
  getAllCategories,
  getAllPosts,
  getPostsByCategorySlug,
} from "@/lib/blog/posts";
import { SITE, SITE_UPDATED } from "@/lib/site-config";

/**
 * Sitemap — Phase-1-Plan §SEO Must-Haves.
 * App-Router-native (not next-sitemap) — decision locked in B3.
 *
 * `lastModified` carries a STABLE, content-derived date per route
 * (SEO-audit 2026-06-18 #69). A build-time `new Date()` previously stamped
 * every URL as freshly modified on every deploy — a false freshness signal
 * that erodes a crawler's trust in the whole sitemap. Now:
 *   - blog posts      → the post's own modified/date
 *   - /blog           → the newest post's date
 *   - category pages  → the newest post date within that category
 *   - everything else → SITE_UPDATED (the site-wide content-revision marker)
 *
 * `changeFrequency` and `priority` are intentionally OMITTED: Google has
 * publicly stated it ignores both. Emitting them only bloats the file and
 * implies a precision we don't have. (Both fields are optional in
 * MetadataRoute.Sitemap.)
 */

function postDate(post: { modified?: string; date: string }): Date {
  return new Date(post.modified ?? post.date);
}

/** Newest of the given dates, or `fallback` when the list is empty. */
function latest(dates: Date[], fallback: Date): Date {
  return dates.reduce((a, b) => (b > a ? b : a), fallback);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUpdated = new Date(SITE_UPDATED);
  const posts = getAllPosts();
  const newestPost = latest(
    posts.map(postDate),
    siteUpdated,
  );

  // Logical lead order kept (home → conversion funnel → info → legal);
  // priority is gone, but a human-readable URL order is still nice to have.
  const staticRoutes: Array<{ path: string; lastModified: Date }> = [
    { path: "/", lastModified: siteUpdated },
    { path: "/mitglied-werden", lastModified: siteUpdated },
    { path: "/mitgliedschaft-verlaengern", lastModified: siteUpdated },
    { path: "/faq", lastModified: siteUpdated },
    { path: "/ueber-uns", lastModified: siteUpdated },
    {
      path: "/oakwood-golf-club-fernmitgliedschaft",
      lastModified: siteUpdated,
    },
    { path: "/kontakt", lastModified: siteUpdated },
    { path: "/blog", lastModified: newestPost },
    { path: "/impressum", lastModified: siteUpdated },
    { path: "/datenschutz", lastModified: siteUpdated },
    { path: "/agb", lastModified: siteUpdated },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified: route.lastModified,
  }));

  // Blog posts — each gets its own entry with its actual modified/date value.
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: postDate(post),
  }));

  // Blog category pages — lastModified derived from the newest post in the
  // category, so a category's freshness tracks its content.
  const categories = getAllCategories();
  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE.url}/blog/kategorie/${cat.slug}`,
    lastModified: latest(
      getPostsByCategorySlug(cat.slug).map(postDate),
      siteUpdated,
    ),
  }));

  return [...staticEntries, ...postEntries, ...categoryEntries];
}
