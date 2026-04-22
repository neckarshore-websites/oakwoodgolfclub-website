import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { pageOpenGraph, SITE, SITE_UPDATED } from "@/lib/site-config";

const PAGE_TITLE = "Über uns";
const PAGE_DESCRIPTION = `Die Geschichte hinter dem ${SITE.name}. Gegründet ${SITE.founded}. Betrieben aus Deutschland. Mitglieder in der DACH-Region.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/ueber-uns" },
  openGraph: pageOpenGraph({
    path: "/ueber-uns",
    title: `${PAGE_TITLE} — ${SITE.name}`,
    description: PAGE_DESCRIPTION,
  }),
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE.url}/ueber-uns`,
  name: `Über uns — ${SITE.name}`,
  dateModified: SITE_UPDATED,
};

/**
 * Über uns — Eckdaten + Geschichte + Differenzierung. Finale Founder-Bio
 * + Fotos folgen in dedizierter Session, der bestehende Text ist eine
 * faktenbasierte Kurzfassung aus BRIEFING.md ohne Platzhalter-Marker
 * (User-Direktive 2026-04-19).
 */
export default function UeberUnsPage() {
  return (
    <article className="container-page py-20 md:py-24">
      <JsonLd id="about-page-schema" data={aboutPageSchema} />
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Über uns
      </p>
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl">
        Ein Golfclub für Spieler ohne Heimatplatz.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Der <strong>{SITE.name}</strong> ist seit {SITE.founded} eine
        Fernmitgliedschaft für Golferinnen und Golfer in der DACH-Region, die
        keinen klassischen Heimatplatz brauchen oder wollen. Aktuell betreuen
        wir rund {SITE.memberCount} aktive Mitglieder.
      </p>

      <hr className="my-14 border-[var(--color-ink)]/10" />

      <div className="grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6 text-base leading-relaxed text-[var(--color-ink)]/75">
          <h2 className="font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
            Die Geschichte
          </h2>
          <p>
            Der Club wurde {SITE.founded} gegründet, um eine einfache Idee
            umzusetzen: Golferinnen und Golfer sollten ein offizielles Handicap
            und eine anerkannte Vereinsmitgliedschaft haben können, ohne Teil
            eines traditionellen Clubs zu sein.
          </p>
          <p>
            Heute wird der Club aus Deutschland heraus betrieben. Die
            Mitgliederbasis ist primär in Deutschland, Österreich und der
            Schweiz, mit einzelnen Mitgliedern in Thailand, Brasilien,
            Großbritannien, Indien, Dänemark und Italien.
          </p>

          <h2 className="mt-10 font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
            Was uns anders macht
          </h2>
          <p>
            Keine Warteliste, keine Umlage, keine versteckten Gebühren. Eine
            klare Jahresmitgliedschaft zu einem festen Preis und eine
            offizielle Mitgliederkarte, die auf rund 95 % der österreichischen
            Golfplätze akzeptiert wird. Handicap-Verwaltung ist aktuell nicht
            Teil des Angebots — Details dazu in den{" "}
            <Link
              href="/faq"
              className="text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
            >
              FAQs
            </Link>
            .
          </p>
        </div>

        <aside className="space-y-6 border-l border-[var(--color-ink)]/10 pl-8 text-sm text-[var(--color-ink)]/70">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Gegründet
            </p>
            <p className="mt-1 font-heading text-2xl tracking-tight text-[var(--color-ink)]">
              {SITE.founded}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Mitglieder
            </p>
            <p className="mt-1 font-heading text-2xl tracking-tight text-[var(--color-ink)]">
              {SITE.memberCount}+
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Hauptmarkt
            </p>
            <p className="mt-1 font-heading text-2xl tracking-tight text-[var(--color-ink)]">
              DACH
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Betrieb
            </p>
            <p className="mt-1 font-heading text-2xl tracking-tight text-[var(--color-ink)]">
              Deutschland
            </p>
          </div>
        </aside>
      </div>

      <hr className="my-14 border-[var(--color-ink)]/10" />

      <div>
        <h2 className="font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
          Fragen? Sprich direkt mit uns.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/75">
          Antwort zeitnah, in der Regel innerhalb weniger Tage.
        </p>
        <div className="mt-8">
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-parchment)] hover:bg-[var(--color-fairway-hover)] transition-colors"
          >
            Kontaktformular öffnen
          </Link>
        </div>
      </div>
    </article>
  );
}
