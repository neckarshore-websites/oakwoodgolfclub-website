import { PRICING, SITE, SITE_UPDATED } from "@/lib/site-config";

/**
 * Renders a JSON-LD block as a raw <script type="application/ld+json"> tag
 * directly into the SSR HTML output.
 *
 * IMPORTANT: we intentionally do NOT use next/script here. In the App Router
 * (Next.js 16, React Server Components) `next/script` serializes inline
 * script bodies through React Flight (`__next_f.push(...)`), which means the
 * actual `<script type="application/ld+json">` tag only materializes in the
 * DOM after client-side hydration. Googlebot eventually renders JS and picks
 * it up, but non-rendering consumers — the Rich Results / Schema.org
 * validator, GPTBot, ClaudeBot, PerplexityBot, CCBot, curl-based tooling —
 * only read raw HTML and would miss every schema on the site.
 *
 * A plain `<script>` with `dangerouslySetInnerHTML` is the Next.js-official
 * recommendation for structured data in the App Router and renders inline
 * during SSR. See https://nextjs.org/docs/app/guides/json-ld.
 *
 * Safety: `data` is always an object composed from site-config constants
 * (never user input). JSON.stringify produces a strict JSON string, and the
 * subsequent replace of "<" with "<" is the exact defense-in-depth
 * escape from the Next.js docs — it prevents a theoretical `</script>`
 * sequence inside a string value from breaking out of the script tag.
 * No HTML is ever rendered from this payload; the browser parses it as JSON.
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
  const payload = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}

/**
 * Organization schema — emitted once on every page via root layout.
 * Signals identity, contact, and social profiles to search engines and LLMs.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: SITE.name,
    alternateName: "OGC",
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    email: SITE.email,
    telephone: SITE.phoneDisplay,
    foundingDate: String(SITE.founded),
    description: SITE.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      telephone: SITE.phoneDisplay,
      areaServed: ["DE", "AT", "CH"],
      availableLanguage: ["de"],
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.x],
  };
}

/**
 * Product + Offer schema for the two membership tiers.
 * Emitted on the homepage so pricing is machine-readable.
 *
 * `dateModified` signals freshness to AI search engines (Perplexity,
 * ChatGPT-Search, Claude). Driven by SITE_UPDATED so the visible
 * "Zuletzt aktualisiert" stamp and the structured-data freshness signal
 * never drift apart.
 */
export function offersSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Fernmitgliedschaft im Oakwood Golf Club",
    description:
      "Fernmitgliedschaft mit offizieller Mitgliederkarte. Akzeptiert auf rund 95 % der österreichischen Golfplätze.",
    brand: { "@type": "Organization", name: SITE.name },
    dateModified: SITE_UPDATED,
    offers: [
      {
        "@type": "Offer",
        name: PRICING.individual.label,
        price: PRICING.individual.priceEur,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE.url}/mitglied-werden`,
        description:
          "Einzelmitgliedschaft für eine Person, 12 Monate, flexibler Startmonat.",
      },
      {
        "@type": "Offer",
        name: PRICING.flight.label,
        price: PRICING.flight.priceEur,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${SITE.url}/mitglied-werden`,
        description:
          "Flight-Mitgliedschaft für vier Personen, 12 Monate. Spart gegenüber vier Einzelmitgliedschaften.",
      },
    ],
  };
}
