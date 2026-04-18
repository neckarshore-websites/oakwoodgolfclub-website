import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HeroBanner } from "@/components/sections/HeroBanner";
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
 * Hero-Variant-Switch (temporär, User-Vergleich 2026-04-18):
 * - Default (`/`)        → Variant A: schwarzer Header → vollbreites
 *                          Golfplatz-Foto → typographischer Hero-Copy
 * - `?hero=b`            → Variant B: Golfplatz-Foto als Hero-Background
 *                          mit dunklem Gradient + Copy-Overlay
 *
 * Variant B trägt `noindex, nofollow` damit Google keine Duplicate
 * Content sieht. Einer der beiden fliegt nach User-Entscheidung raus.
 */

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const variant = typeof params.hero === "string" ? params.hero : undefined;
  const isPreview = variant === "b";

  return {
    title: `${SITE.name} — Fernmitgliedschaft im Golfclub für 55 Euro`,
    description: SITE.description,
    alternates: { canonical: "/" },
    ...(isPreview && {
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
  const isVariantB = variant === "b";

  return (
    <>
      {isVariantB ? (
        <HeroOverlay />
      ) : (
        <>
          <HeroBanner />
          <Hero />
        </>
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
