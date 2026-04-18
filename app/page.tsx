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

export const metadata: Metadata = {
  title: `${SITE.name} — Fernmitgliedschaft im Golfclub für 55 Euro`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroOverlay />
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
