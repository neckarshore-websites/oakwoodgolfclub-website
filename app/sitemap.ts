import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

/**
 * Sitemap — Phase-1-Plan §SEO Must-Haves.
 * App-Router-native (not next-sitemap) — decision locked in B3.
 *
 * Blog posts get added in B8/B9 once the Markdown loader lands.
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

  return staticRoutes.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified: today,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
