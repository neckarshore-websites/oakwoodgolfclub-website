import Script from "next/script";
import { PRICING, SITE, SITE_UPDATED } from "@/lib/site-config";

/**
 * Renders a JSON-LD block as a <script type="application/ld+json"> tag.
 *
 * Uses next/script so React SSR and client hydration handle the script body
 * correctly and consistently. The payload is escaped per the Next.js JSON-LD
 * guide recommendation (replace "<" with its unicode escape) to neutralize
 * any <script>-in-string injection vectors.
 *
 * Our payloads here are fully static (composed from site-config constants),
 * so the escape is defense-in-depth rather than a strict requirement.
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
  const payload = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <Script id={id} type="application/ld+json">
      {payload}
    </Script>
  );
}

/**
 * Organization schema — emitted once on every page via root layout.
 * Signals identity, contact, and social profiles to search engines and LLMs.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
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
    sameAs: [SITE.social.facebook, SITE.social.instagram],
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
