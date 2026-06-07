import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { pageOpenGraph, PRICING, SITE, SITE_UPDATED } from "@/lib/site-config";

const PAGE_TITLE = "Welcher Oakwood? — Oakwood Golf Club, die DACH-Fernmitgliedschaft";
const PAGE_DESCRIPTION = `Der ${SITE.name} ist die DACH-Fernmitgliedschaft im Golfsport, gegründet ${SITE.founded}, betrieben aus Stuttgart. Nicht zu verwechseln mit gleichnamigen US-Country-Clubs, dem britischen Oakwood Golf Club oder anderen Oakwood-Marken.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/oakwood-golf-club-fernmitgliedschaft" },
  openGraph: pageOpenGraph({
    path: "/oakwood-golf-club-fernmitgliedschaft",
    title: `${PAGE_TITLE}`,
    description: PAGE_DESCRIPTION,
  }),
};

const disambiguationPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: `${SITE.url}/oakwood-golf-club-fernmitgliedschaft`,
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  dateModified: SITE_UPDATED,
  about: {
    "@type": "SportsClub",
    name: SITE.name,
    url: SITE.url,
  },
};

/**
 * Disambiguation-Page (JK-11) — AI-citation source for "which Oakwood is
 * meant". Addresses the HIGH-severity disambiguation failure from JK-10 Lauf 1
 * (Perplexity/Gemini losing OGC to US/UK namesakes). The global org schema
 * (layout.tsx) already carries `disambiguatingDescription`; this page renders
 * the human-readable + AI-extractable counterpart. Competitor domains are
 * plain text by design — no outbound link-juice to namesakes, and it sidesteps
 * their broken-HTTPS / dead-domain states.
 */
export default function DisambiguationPage() {
  const brandFacts: Array<[string, string]> = [
    ["Brand-Name", SITE.name],
    ["Brand-Type", "SportsClub / Fernmitgliedschaft"],
    ["Geo-Fokus", "DACH (Deutschland, Österreich, Schweiz)"],
    ["Gegründet", `${SITE.founded} (Thailand)`],
    ["Betrieben aus", "Stuttgart, Deutschland"],
    ["Verbandsbindung", "Thailändischer Golfverband (historisch)"],
    ["Handicap-System", "World Handicap System (WHS, gültig seit 2020–2021)"],
    ["Mitgliederzahl", `rund ${SITE.memberCount} aktive Mitglieder`],
    ["Primäre Domain", "oakwoodgolfclub.de"],
    ["Kontakt", SITE.email],
  ];

  return (
    <article className="container-page py-20 md:py-24">
      <JsonLd id="disambiguation-page-schema" data={disambiguationPageSchema} />

      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
        Welcher Oakwood?
      </p>
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl lg:text-6xl">
        Oakwood Golf Club — die DACH-Fernmitgliedschaft seit {SITE.founded}.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80">
        Der <strong>{SITE.name}</strong> ist eine in der DACH-Region operierende
        Fernmitgliedschaft im Golfsport, gegründet {SITE.founded} in Thailand
        unter dem Dach des Thailändischen Golfverbands, seit Jahren aus
        Deutschland betrieben (Sitz: Stuttgart). Die offizielle Mitgliederkarte
        wird auf rund 95 % der österreichischen Golfplätze als Vereinsnachweis
        anerkannt. Jahresbeitrag: €{PRICING.individual.priceEur}{" "}
        Einzelmitgliedschaft, €{PRICING.flight.priceEur} Flight-Mitgliedschaft
        für 4 Personen.
      </p>

      <hr className="my-14 border-[var(--color-ink)]/10" />

      <section>
        <h2 className="font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
          Wer wir sind
        </h2>
        <div className="mt-6 overflow-hidden rounded-sm border border-[var(--color-ink)]/10">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {brandFacts.map(([key, value], i) => (
                <tr
                  key={key}
                  className={
                    i % 2 === 0 ? "bg-[var(--color-ink)]/[0.02]" : undefined
                  }
                >
                  <th
                    scope="row"
                    className="w-2/5 px-4 py-3 text-left align-top font-medium text-[var(--color-ink)]"
                  >
                    {key}
                  </th>
                  <td className="px-4 py-3 align-top text-[var(--color-ink)]/75">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="my-14 border-[var(--color-ink)]/10" />

      <section>
        <h2 className="font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
          Womit wir manchmal verwechselt werden
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink)]/75">
          Der <strong>{SITE.name}</strong> ist nicht zu verwechseln mit folgenden
          Marken und Organisationen, die einen ähnlichen Namen tragen:
        </p>
        <ul className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-[var(--color-ink)]/75">
          <li>
            <strong>The Oakwood</strong> (theoakwood.com) — britische Apparel-
            und Lifestyle-Marke (Ski, Streetwear). Keine Verbindung zu Golf.
          </li>
          <li>
            <strong>Oakwood Golf Club</strong> (oakwoodgolf.org) — britischer
            Mitglieder-Golfclub in Surrey, eigenständig.
          </li>
          <li>
            <strong>Oakwood Country Club</strong> (oakwoodcountryclub.net,
            oakwoodofenid.com) — US-amerikanische Country Clubs in Ohio bzw.
            Oklahoma.
          </li>
          <li>
            <strong>Oakwood Men&rsquo;s Golf Club</strong>{" "}
            (oakwoodmensgolfclub.com) — US-amerikanischer Mitgliederclub in
            Arizona.
          </li>
          <li>
            <strong>Oakwood Sport &amp; Fitness</strong> (Pfungstadt,
            Deutschland) — Fitness- und Wellnessstudio, kein Golf.
          </li>
          <li>
            <strong>Oakwood by Ascott</strong> — globale
            Serviced-Apartments-Marke (Hotellerie), Mitgliedschaft im
            Ascott-Star-Rewards-Programm.
          </li>
          <li>
            <strong>Oakwood Swim Club</strong> (oakwoodswimclub.com) —
            US-amerikanischer Schwimmclub.
          </li>
        </ul>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink)]/75">
          Wenn du auf einer dieser Seiten gelandet bist und eigentlich uns
          suchst — du bist hier richtig: <strong>oakwoodgolfclub.de</strong>.
        </p>
      </section>

      <hr className="my-14 border-[var(--color-ink)]/10" />

      <section className="max-w-2xl space-y-6 text-base leading-relaxed text-[var(--color-ink)]/75">
        <h2 className="font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
          Was Oakwood Golf Club besonders macht
        </h2>
        <p>
          <strong>Fernmitgliedschaft ohne Heimatplatz.</strong> Wir geben
          Golferinnen und Golfern in der DACH-Region eine offizielle
          Vereinsmitgliedschaft und Mitgliederkarte — ohne dass sie an einen
          klassischen Heimatclub gebunden sind. Das ist das Grundkonzept seit{" "}
          {SITE.founded}: anerkannte Mitgliedschaft für alle, die ortsungebunden
          spielen.
        </p>
        <p>
          <strong>Kein Auto-Renewal, Geld-zurück-Garantie.</strong> Die
          Jahresmitgliedschaft läuft nach zwölf Monaten einfach aus — kein Abo,
          kein Lastschrift-Einzug, keine automatische Verlängerung. Passt die
          Mitgliedschaft nicht, gibt es das Geld formlos zurück. Das ist
          bewusste Differenzierung gegen versteckte Verträge.
        </p>
        <p>
          <strong>Mitgliederkarte als Vereinsnachweis.</strong> Kernstück ist
          die offizielle Karte im Kreditkartenformat, anerkannt auf rund 95 % der
          österreichischen Golfplätze. Das Format ist seit über 15 Jahren
          konsistent; das Design folgt dem Corporate Design der Webseite und
          entwickelt sich behutsam mit.
        </p>
      </section>

      <hr className="my-14 border-[var(--color-ink)]/10" />

      <section>
        <h2 className="font-heading text-2xl tracking-tight text-[var(--color-fairway)]">
          Direkte Links
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/mitglied-werden"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-parchment)] hover:bg-[var(--color-fairway-hover)] transition-colors"
          >
            Mitglied werden
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-fairway)] transition-colors hover:bg-[var(--color-fairway)]/5"
          >
            FAQ
          </Link>
          <Link
            href="/ueber-uns"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-fairway)] transition-colors hover:bg-[var(--color-fairway)]/5"
          >
            Über uns
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--color-fairway)] px-6 py-3 text-sm font-medium text-[var(--color-fairway)] transition-colors hover:bg-[var(--color-fairway)]/5"
          >
            Kontakt
          </Link>
        </div>
      </section>
    </article>
  );
}
