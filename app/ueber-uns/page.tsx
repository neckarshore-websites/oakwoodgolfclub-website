import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Die Geschichte hinter dem ${SITE.name}. Gegründet ${SITE.founded}. Betrieben aus Thailand. Mitglieder in der DACH-Region.`,
  alternates: { canonical: "/ueber-uns" },
};

/**
 * Über uns — Skelett. Finaler Bio-Text + Fotos in dedizierter Session.
 * Struktur ist gesetzt, Copy ist Platzhalter-Prosa mit den Eckdaten aus
 * BRIEFING.md (darf zitiert werden, ist nicht "echter" Founder-Text).
 */
export default function UeberUnsPage() {
  return (
    <article className="container-page py-20 md:py-24">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
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
          <h2 className="font-heading text-2xl tracking-tight">
            Die Geschichte
          </h2>
          <p>
            <em>[Platzhalter — finaler Text folgt.]</em> Der Club wurde {SITE.founded}
            gegründet, um eine einfache Idee umzusetzen: Golferinnen und Golfer
            sollten ein offizielles Handicap und eine anerkannte Vereinsmitgliedschaft
            haben können, ohne Teil eines traditionellen Clubs zu sein.
          </p>
          <p>
            Heute wird der Club aus Thailand heraus betrieben. Die Mitgliederbasis
            ist primär in Deutschland, Österreich und der Schweiz, mit einzelnen
            Mitgliedern in Thailand, Brasilien, Großbritannien, Indien, Dänemark
            und Italien.
          </p>

          <h2 className="mt-10 font-heading text-2xl tracking-tight">
            Was uns anders macht
          </h2>
          <p>
            <em>[Platzhalter.]</em> Keine Warteliste, keine Umlage, keine versteckten
            Gebühren. Eine klare Jahresmitgliedschaft zu einem festen Preis und
            eine offizielle Mitgliederkarte, die auf rund 95 % der österreichischen
            Golfplätze akzeptiert wird. Handicap-Verwaltung ist aktuell nicht Teil
            des Angebots — siehe FAQ.
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
              Thailand
            </p>
          </div>
        </aside>
      </div>

      <hr className="my-14 border-[var(--color-ink)]/10" />

      <div>
        <h2 className="font-heading text-2xl tracking-tight">
          Fragen? Sprich direkt mit uns.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/75">
          Antwort in der Regel innerhalb von 24 Stunden. Per E-Mail an{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
          >
            {SITE.email}
          </a>
          .
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
