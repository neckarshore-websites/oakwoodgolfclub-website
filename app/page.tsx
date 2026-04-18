import type { Metadata } from "next";
import { HeroOverlay } from "@/components/sections/HeroOverlay";
import { ValueProp } from "@/components/sections/ValueProp";
import { PricingCards } from "@/components/sections/PricingCards";
import { MoneyBackGuarantee } from "@/components/sections/MoneyBackGuarantee";
import { FAQTeaser } from "@/components/sections/FAQTeaser";
import { Tools } from "@/components/sections/Tools";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd, offersSchema } from "@/components/JsonLd";
import { SITE } from "@/lib/site-config";

type SearchParams = Promise<{ hero?: string | string[] }>;

/**
 * Homepage-Hero-A/B (temporär, User-Vergleich 2026-04-18):
 * - Default (`/`)          → Sonnenaufgang-Fairway (topimage.jpg aus
 *                             der Live-WordPress-Site, canonical,
 *                             indexable)
 * - `?hero=vintage`        → 1906 B&W "Opening of Dollar Golf
 *                             Course" (noindex preview)
 *
 * Einer bleibt nach User-Entscheidung; der andere wird entfernt.
 */

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const variant = typeof params.hero === "string" ? params.hero : undefined;
  const isVintagePreview = variant === "vintage";

  return {
    title: `${SITE.name} — Fernmitgliedschaft im Golfclub für 55 Euro`,
    description: SITE.description,
    alternates: { canonical: "/" },
    ...(isVintagePreview && {
      robots: { index: false, follow: false },
    }),
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const variant = typeof params.hero === "string" ? params.hero : undefined;
  const isVintage = variant === "vintage";

  return (
    <>
      {isVintage ? (
        <HeroOverlay
          imageSrc="/brand/hero-golfplatz.webp"
          objectPosition="50% 20%"
        />
      ) : (
        <HeroOverlay />
      )}
      <ValueProp />
      <PricingCards />
      <FAQTeaser />
      <Tools />
      <CTASection />
      <MoneyBackGuarantee />
      <JsonLd id="offer-schema" data={offersSchema()} />
    </>
  );
}
