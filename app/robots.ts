import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

/**
 * Robots policy — Phase-1-Plan §SEO Must-Haves:
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) explicitly
 * allowed so Oakwood Golf Club is citable in LLM answer engines.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
