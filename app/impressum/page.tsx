import type { Metadata } from "next";
import Link from "next/link";

import { MAILTO_FEEDBACK, SITE } from "@/lib/site-config";

/**
 * Impressum — § 5 TMG.
 *
 * Inhalt basiert auf der WordPress-Vorgängerseite (oakwoodgolfclub.de/impressum,
 * Stand 2021), neu strukturiert für 2026:
 *  - Anbieter-Sitz auf Deutschland aktualisiert (User ist seit 2026
 *    selbstständig in Deutschland und versteuert hier — Thai-Adresse aus
 *    der Vorgängerseite ist nicht mehr aktuell).
 *  - Anbieter-Bezeichnung: "German Rauhut – IT Consulting & Digital
 *    Ventures, Geschäftsbereich Oakwood Golf Club" — laut User-Aussage
 *    04-18 fällt OGC in den Bereich "Digital Ventures" des angemeldeten
 *    Gewerbes.
 *  - Anschrift: Stuttgart + "ladungsfähige Anschrift auf Anfrage" —
 *    konsistent mit rauhut.com-Pattern. **Bekanntes Risiko (Backlog #28):**
 *    bei einer commercial-Site mit zahlenden Mitgliedern ist § 5 TMG
 *    strenger interpretierbar als bei einem Portfolio. User hat das
 *    Risiko zur Abwägung im Backlog.
 *  - USt-IdNr. (§ 5 Abs. 1 Nr. 6 TMG): noch nicht geklärt — Backlog #27.
 *    Im Draft komplett weggelassen, bis Steuerstatus feststeht.
 *  - OS-Plattform-Hinweis (EU-Verordnung 524/2013) ergänzt.
 *  - VSBG-Hinweis (§ 36 Abs. 1 VSBG) ergänzt.
 *  - TGA-Kontaktblock entfernt (gehört in "Über uns", nicht ins Impressum).
 *  - Cookie-Hinweis entfernt — die neue Site verwendet keine Cookies.
 */

const STAND = "18. April 2026";

export const metadata: Metadata = {
  title: "Impressum",
  description:
    "Rechtliche Angaben gemäß § 5 TMG für oakwoodgolfclub.de — Anbieter, " +
    "Anschrift, Kontakt, Verantwortlicher, Hinweise zur Streitbeilegung.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <article className="container-page py-16 md:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
          Rechtliches
        </p>
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl">
          Impressum
        </h1>
        <p className="mt-4 text-sm text-[var(--color-ink)]/60">
          Stand: {STAND}
        </p>
      </header>

      <div className="ogc-prose">
        <h2>Anbieter im Sinne des § 5 TMG</h2>
        <p>
          German Rauhut – IT Consulting &amp; Digital Ventures
          <br />
          <strong>Geschäftsbereich: Oakwood Golf Club</strong>
          <br />
          Stuttgart
          <br />
          Deutschland
        </p>
        <p>
          Die ladungsfähige Anschrift wird auf schriftliche Anfrage per
          E-Mail innerhalb von 24 Stunden übermittelt.
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
          <br />
          E-Mail: <a href={MAILTO_FEEDBACK}>{SITE.email}</a>
          <br />
          Web: <a href={SITE.url}>{SITE.url.replace(/^https?:\/\//, "")}</a>
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>German Rauhut (Anschrift wie oben).</p>

        {/* TODO Backlog #27: USt-IdNr. einsetzen sobald Steuerstatus
            geklärt ist (Kleinunternehmer §19 UStG vs. Regelbesteuerung).
            Pflichtbestandteil nach § 5 Abs. 1 Nr. 6 TMG bei Regelbesteuerung. */}

        <h2>Streitbeilegung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse findest du oben im Impressum.
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an
          Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1
          VSBG).
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Seite werden mit größtmöglicher Sorgfalt
          erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der
          Inhalte können wir jedoch keine Gewähr übernehmen. Als
          Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
          Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen
          zu überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Webseiten Dritter, auf
          deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
          diese fremden Inhalte auch keine Gewähr übernehmen. Für die
          Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
          oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
          wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
          überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
          Verlinkung nicht erkennbar.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
          diesen Seiten unterliegen dem deutschen Urheberrecht.
          Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
          Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der
          schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>

        <h2>Datenschutz</h2>
        <p>
          Hinweise zum Umgang mit personenbezogenen Daten findest du in
          unserer{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </p>
      </div>
    </article>
  );
}
