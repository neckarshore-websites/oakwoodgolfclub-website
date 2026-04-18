import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ValueProp } from "@/components/sections/ValueProp";
import { PricingCards } from "@/components/sections/PricingCards";
import { FAQTeaser } from "@/components/sections/FAQTeaser";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd, offersSchema } from "@/components/JsonLd";
import { UpdatedAt } from "@/components/UpdatedAt";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${SITE.name} — Fernmitgliedschaft im Golfclub für 55 Euro`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProp />
      <PricingCards />
      <FAQTeaser />
      <CTASection />
      <div className="container-page pb-12">
        <UpdatedAt />
      </div>
      <JsonLd id="offer-schema" data={offersSchema()} />
    </>
  );
}
