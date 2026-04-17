import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts } from "@/lib/blog/posts";
import { SITE } from "@/lib/site-config";

/**
 * Sitemap — Phase-1-Plan §SEO Must-Haves.
 * App-Router-native (not next-sitemap) — decision locked in B3.
 *
 * Dynamic: blog posts + blog categories from /content/blog.
 * Static: all canonical pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: "yearly" | "monthly" | "weekly";
    priority: number;
  }> = [
    { path: "/", changeFrequency: "monthly", priority: 1.0 },
    { path: "/mitglied-werden", changeFrequency: "monthly", priority: 0.95 },
    { path: "/mitgliedschaft-verlaengern", changeFrequency: "monthly", priority: 0.9 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
    { path: "/ueber-uns", changeFrequency: "monthly", priority: 0.7 },
    { path: "/kontakt", changeFrequency: "yearly", priority: 0.5 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/impressum", changeFrequency: "yearly", priority: 0.3 },
    { path: "/datenschutz", changeFrequency: "yearly", priority: 0.3 },
    { path: "/agb", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified: today,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Blog posts — each gets its own entry with its actual modified/date value.
  const posts = getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.modified ?? post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog category pages.
  const categories = getAllCategories();
  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE.url}/blog/kategorie/${cat.slug}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries, ...categoryEntries];
}
