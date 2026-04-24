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
            Der Oakwood Golf Club wurde {SITE.founded} in Thailand gegründet,
            ursprünglich unter dem Dach des Thailändischen Golfverbands, zu
            dem der Club bis heute historisch gehört. Die Idee dahinter war
            einfach: Golferinnen und Golfern ein offizielles Handicap und eine
            anerkannte Vereinsmitgliedschaft geben — ohne dass sie Teil eines
            traditionellen Heimatclubs sein müssen.
          </p>
          <p>
            Betrieben wird der Club heute aus Deutschland heraus. Die
            Mitgliederbasis hat sich über die Jahre in den DACH-Raum
            verlagert, mit einem leichten Überhang in Österreich, weil die
            Mitgliederkarte dort auf rund 95 % der Golfplätze als
            Vereinsnachweis anerkannt ist. Einzelne Mitglieder leben in
            Thailand, Brasilien, Großbritannien, Indien, Dänemark und Italien
            — echte Einzelfälle, kein Muster, kein Marketing-Ziel. Aktuell
            sind rund {SITE.memberCount} Mitglieder aktiv. Seit{" "}
            {SITE.founded} ist die Fernmitgliedschaft das Grundkonzept; alles
            andere hat sich drumherum entwickelt.
          </p>

          <h2 className="mt-10 font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
            Was uns anders macht
          </h2>
          <p>
            Keine Warteliste, keine Umlage, keine versteckten Gebühren. Die
            Jahresmitgliedschaft ist eine klare Sache: ein fester Preis, ein
            fester Zeitraum, kein Auto-Renewal am Ende. Das Startdatum wählt
            das Mitglied selbst, die Laufzeit beträgt ab dann genau zwölf
            Monate. Wer nicht verlängern will, tut schlicht nichts.
          </p>
          <p>
            Kernstück ist die offizielle Mitgliederkarte im Kreditkartenformat
            — sie wird auf rund 95 % der österreichischen Golfplätze als
            Vereinsnachweis anerkannt. Das Format ist seit über 15 Jahren
            unverändert; das visuelle Design folgt dem Corporate Design der
            Webseite und entwickelt sich über die Jahre mit. Und wenn die
            Mitgliedschaft nicht passt:{" "}
            <strong>Geld-zurück-Garantie, ohne Wenn und Aber</strong>. In 15
            Jahren haben das drei oder vier Mitglieder genutzt. Details zur
            Handicap-Frage — aktuell pausiert wegen WHS-2021-Verwerfungen —
            in den{" "}
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
          Bereit für eine Mitgliedschaft, die einfach funktioniert?
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/75">
          Signup in unter fünf Minuten. Startdatum wählst du selbst, danach
          zwölf Monate feste Laufzeit — kein Auto-Renewal. Bei Rückfragen
          antworten wir zeitnah, in der Regel innerhalb weniger Tage.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/mitglied-werden"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-parchment)] hover:bg-[var(--color-fairway-hover)] transition-colors"
          >
            Mitglied werden
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-fairway)] transition-colors hover:bg-[var(--color-fairway)]/5"
          >
            Kontaktformular
          </Link>
        </div>
      </div>
    </article>
  );
}
