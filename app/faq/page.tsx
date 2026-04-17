import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import {
  getFaqsByCategory,
  getPublishedCount,
  getPublishedFaqs,
} from "@/lib/faqs/items";
import { CATEGORY_LABEL } from "@/lib/faqs/types";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Häufig gestellte Fragen",
  description:
    "Antworten auf die häufigsten Fragen zur Fernmitgliedschaft im Oakwood Golf Club — Mitgliedschaft, Mitgliederkarte, Anerkennung, Handicap.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ · ${SITE.name}`,
    description: "Mitgliedschaft, Mitgliederkarte, Anerkennung — in Kurzform.",
    url: `${SITE.url}/faq`,
    type: "website",
  },
};

export default function FaqPage() {
  const grouped = getFaqsByCategory();
  const all = getPublishedFaqs();
  const count = getPublishedCount();

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd id="faq-page-schema" data={faqPageSchema} />

      <article className="container-page py-20 md:py-24">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
          FAQ
        </p>
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl">
          Häufig gestellte Fragen.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
          {count} Antworten zur Fernmitgliedschaft im Oakwood Golf Club.
          Keine Frage gefunden? Schreib uns direkt — wir melden uns
          meist innerhalb von 48 Stunden.
        </p>

        {/* Category anchor nav — simple inline list, no sidebar. */}
        <nav
          aria-label="FAQ-Kategorien"
          className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--color-border)] pt-6 text-sm"
        >
          <span className="text-[var(--color-muted)]">Springen zu:</span>
          {grouped.map(({ category, items }) => (
            <a
              key={category}
              href={`#kategorie-${category}`}
              className="text-[var(--color-fairway)] underline-offset-4 hover:underline hover:text-[var(--color-fairway-hover)]"
            >
              {CATEGORY_LABEL[category]}{" "}
              <span className="text-xs text-[var(--color-muted)]">
                ({items.length})
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-20 space-y-20 md:space-y-24">
          {grouped.map(({ category, items }) => (
            <section
              key={category}
              id={`kategorie-${category}`}
              aria-labelledby={`heading-${category}`}
              className="scroll-mt-24"
            >
              <h2
                id={`heading-${category}`}
                className="mb-8 font-heading text-xl tracking-tight md:text-2xl"
              >
                {CATEGORY_LABEL[category]}
              </h2>
              <FaqAccordion items={items} headingLevel="h3" />
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <footer className="mt-20 rounded-sm border border-[var(--color-border)] bg-[var(--color-sand)] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
            Frage nicht dabei?
          </p>
          <h2 className="mt-2 font-heading text-2xl tracking-tight">
            Schreib uns direkt.
          </h2>
          <p className="mt-3 max-w-xl text-base text-[var(--color-ink)]/75">
            Kontaktformular oder E-Mail an{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[var(--color-fairway)] underline-offset-4 hover:underline"
            >
              {SITE.email}
            </a>
            . Antwort meist innerhalb von 48 Stunden.
          </p>
          <a
            href="/kontakt"
            className="mt-6 inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)]"
          >
            Zum Kontaktformular
          </a>
        </footer>
      </article>
    </>
  );
}
