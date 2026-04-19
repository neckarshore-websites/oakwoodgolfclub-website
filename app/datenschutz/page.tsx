import type { Metadata } from "next";
import Link from "next/link";

import { MAILTO_FEEDBACK, SITE } from "@/lib/site-config";

/**
 * Datenschutzerklärung — DSGVO-konformer Volltext.
 *
 * Komplettüberarbeitung der WP-Vorgängerseite (oakwoodgolfclub.de/datenschutz,
 * Stand 2021), die GDPR nicht vollständig umsetzte. Neue Struktur orientiert
 * sich am Aufbau Verantwortlicher → Verarbeitungstätigkeiten →
 * Speicherdauer → Drittlandtransfer → Betroffenenrechte → Beschwerderecht.
 *
 * Architektur-Wahrheiten dieser Site (Stand 04-2026), die hier sauber
 * abgebildet werden:
 *  - Hosting: Vercel Inc., USA (mit EU-Region für die Auslieferung).
 *  - Web Analytics: Vercel Web Analytics — cookieless, keine PII.
 *  - E-Mail: IONOS SE, Deutschland (SMTP für info@ + Form-Notifications).
 *  - Zahlungen aktuell: Banküberweisung an DKB-Konto (kein AV — normale
 *    Bankkundenbeziehung) ODER PayPal (IST Auftragsverarbeiter, in §6
 *    dokumentiert). Stripe ist NICHT live; kommt → Backlog #25.
 *  - CRM: Microsoft Outlook (Member-Kontakte + Mail-Historie). Microsoft
 *    agiert unter den Online Services Terms / DPA als Auftragsverarbeiter.
 *  - KI-Assistenz für den internen Workflow (Formulierung von
 *    E-Mail-Antworten, Übersetzungs-Drafts): Anthropic PBC (Claude
 *    via API, Zero-Retention-Tarif) als primärer Anbieter. Gelegentlich
 *    Apple Intelligence auf macOS/iOS (on-device / Private Cloud
 *    Compute) und ggf. Microsoft 365 Copilot innerhalb der bestehenden
 *    Microsoft-Outlook-Umgebung. Details in §6 "KI-Assistenz".
 *  - Keine Cookies, keine Werbung, kein Tracking, kein Google Analytics,
 *    kein Facebook-Pixel.
 *  - Verantwortlicher: German Rauhut, Deutschland (kein Drittland-
 *    Operator-Setup mehr).
 */

const STAND = "18. April 2026";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung gemäß DSGVO für oakwoodgolfclub.de — " +
    "Verantwortlicher, Verarbeitungstätigkeiten, Speicherdauer, " +
    "Drittlandtransfer, Betroffenenrechte und Beschwerderecht.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <article className="container-page py-16 md:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
          Rechtliches
        </p>
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-4 text-sm text-[var(--color-ink)]/60">
          Stand: {STAND}
        </p>
      </header>

      <div className="ogc-prose">
        <p>
          Wir freuen uns über deinen Besuch auf {SITE.url.replace(/^https?:\/\//, "")}.
          Personenbezogene Daten verarbeiten wir nur dort, wo es für den
          Betrieb der Site und die Erfüllung der Mitgliedschaft notwendig
          ist. Diese Erklärung beschreibt im Detail, welche Daten in
          welchem Schritt verarbeitet werden, auf welcher Rechtsgrundlage,
          wie lange sie gespeichert werden und welche Rechte du als
          betroffene Person hast.
        </p>

        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO ist:
        </p>
        <p>
          German Rauhut – IT Consulting &amp; Digital Ventures
          <br />
          Geschäftsbereich Oakwood Golf Club
          <br />
          Stuttgart, Deutschland
        </p>
        <p>
          Die ladungsfähige Anschrift wird auf schriftliche Anfrage per
          E-Mail innerhalb von 24 Stunden übermittelt.
        </p>
        <p>
          E-Mail: <a href={MAILTO_FEEDBACK}>{SITE.email}</a>
          <br />
          Telefon: <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
        </p>

        {/* TODO USER-CHECK: Datenschutzbeauftragter (DSB).
            Annahme: Es ist KEIN DSB benannt, weil keine 20+ Personen
            ständig mit der automatisierten Verarbeitung personenbezogener
            Daten beschäftigt sind (§ 38 Abs. 1 BDSG). Falls anders,
            DSB-Block hier ergänzen. */}

        <h2>2. Aufruf der Webseite (Server-Logs)</h2>
        <p>
          Wenn du unsere Webseite besuchst, übermittelt dein Browser aus
          technischen Gründen automatisch Daten an die Server unseres
          Hosting-Dienstleisters Vercel Inc. (siehe Abschnitt 6). Diese
          Daten werden in sogenannten Server-Logs vorgehalten und
          umfassen:
        </p>
        <ul>
          <li>IP-Adresse (gekürzt bzw. nur in technischen Logs)</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Aufgerufene URL und HTTP-Statuscode</li>
          <li>Übertragene Datenmenge</li>
          <li>Browsertyp, Browser-Version, Betriebssystem</li>
          <li>Referrer-URL (die zuvor besuchte Seite)</li>
        </ul>
        <p>
          <strong>Zweck:</strong> Sicherstellung des störungsfreien
          Betriebs der Webseite, Auslieferung der angefragten Inhalte,
          Auswertung der Systemsicherheit und -stabilität.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse am störungsfreien Betrieb und an der
          Sicherheit der Webseite).
        </p>
        <p>
          <strong>Speicherdauer:</strong> Server-Logs werden bei Vercel
          regelmäßig nach kurzer Zeit (typischerweise wenige Tage)
          automatisch gelöscht. Eine Verknüpfung dieser Daten mit anderen
          Datenquellen findet nicht statt.
        </p>

        <h2>3. Cookies</h2>
        <p>
          <strong>
            Wir verwenden auf dieser Webseite keine Cookies.
          </strong>{" "}
          Es werden weder technisch notwendige noch funktionale,
          analytische oder werbliche Cookies gesetzt. Du brauchst keine
          Einwilligung zu erteilen und es erscheint kein Cookie-Banner.
        </p>

        <h2>4. Web Analytics</h2>
        <p>
          Zur Reichweitenmessung setzen wir{" "}
          <strong>Vercel Web Analytics</strong> ein. Dieser Dienst arbeitet
          ohne Cookies und ohne Speicherung personenbezogener Daten. Es
          werden ausschließlich aggregierte, anonyme Kennzahlen erhoben
          (z.&nbsp;B. Anzahl der Seitenaufrufe pro URL, Land, Gerätetyp).
          Eine Identifikation einzelner Besucher ist nicht möglich.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an einer datenschutzfreundlichen
          Reichweitenmessung).
        </p>
        <p>
          Anbieter: Vercel Inc., 440 N Barranca Avenue #4133, Covina,
          CA 91723, USA. Mehr Informationen:{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            vercel.com/legal/privacy-policy
          </a>
          .
        </p>

        <h2>5. Kontaktformulare und Mitgliedschafts-Formulare</h2>
        <p>
          Auf dieser Seite werden drei Formulare angeboten:
        </p>
        <ul>
          <li>
            <Link href="/kontakt">Kontaktformular</Link> für allgemeine
            Anfragen
          </li>
          <li>
            <Link href="/mitglied-werden">Mitgliedschafts-Anmeldung</Link>{" "}
            für neue Mitglieder
          </li>
          <li>
            <Link href="/mitgliedschaft-verlaengern">
              Mitgliedschafts-Verlängerung
            </Link>{" "}
            für bestehende Mitglieder
          </li>
        </ul>
        <p>
          <strong>Welche Daten:</strong> Je nach Formular Name, E-Mail,
          Postanschrift, Handicap (selbstangegeben), gewünschtes
          Startdatum, freier Nachrichtentext sowie ggf.
          Mitgliedsnummer. Eine Übersicht der Pflicht- und freiwilligen
          Felder findest du im jeweiligen Formular selbst.
        </p>
        <p>
          <strong>Zweck:</strong> Beantwortung deiner Anfrage,
          Anbahnung und Durchführung der Mitgliedschaft, Versand der
          gedruckten Mitgliederkarte sowie der Zahlungsdetails.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong>
        </p>
        <ul>
          <li>
            Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung und
            Vertragsdurchführung) für Anmeldung und Verlängerung.
          </li>
          <li>
            Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
            Beantwortung deiner Anfrage) für allgemeine
            Kontaktnachrichten.
          </li>
        </ul>
        <p>
          <strong>Übermittlung:</strong> Die Formulardaten werden per
          E-Mail an unsere Adresse{" "}
          <a href={MAILTO_FEEDBACK}>{SITE.email}</a> übermittelt.
          Der E-Mail-Versand erfolgt verschlüsselt (STARTTLS bzw. TLS) über
          den E-Mail-Anbieter IONOS SE (siehe Abschnitt 6). Eine
          Speicherung in einer Datenbank dieser Webseite findet nicht
          statt — die Daten werden ausschließlich als E-Mail an unser
          Postfach gesendet und dort verarbeitet.
        </p>
        <p>
          <strong>Speicherdauer:</strong> Mitglieder-Stammdaten werden so
          lange gespeichert, wie eine aktive Mitgliedschaft besteht und
          darüber hinaus für die gesetzlichen Aufbewahrungsfristen
          (insbesondere § 147 AO, § 257 HGB; bis zu 10 Jahre für
          buchungsrelevante Unterlagen). Allgemeine Kontaktanfragen werden
          gelöscht, sobald die Bearbeitung abgeschlossen ist und keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>

        <h2>6. Auftragsverarbeiter und Empfänger</h2>
        <p>
          Wir setzen für den technischen Betrieb der Webseite, für
          E-Mail-Kommunikation und für die Abwicklung von Zahlungen
          folgende Dienstleister ein, mit denen ein
          Auftragsverarbeitungsvertrag (Art. 28 DSGVO) besteht oder die
          nach den jeweiligen Anbieter-AGB als Auftragsverarbeiter agieren:
        </p>

        <h3>Vercel Inc. (Hosting + Web Analytics)</h3>
        <p>
          440 N Barranca Avenue #4133, Covina, CA 91723, USA. Vercel
          stellt die technische Infrastruktur für die Auslieferung dieser
          Webseite bereit (Edge Network, Function-Hosting). Die
          Auslieferung erfolgt soweit möglich aus EU-Regionen.
          Datenschutz: <a href="https://vercel.com/legal/privacy-policy" rel="noopener noreferrer" target="_blank">vercel.com/legal/privacy-policy</a>.
        </p>

        <h3>IONOS SE (E-Mail-Versand)</h3>
        <p>
          Elgendorfer Straße 57, 56410 Montabaur, Deutschland. IONOS
          versendet und empfängt unsere Geschäfts-E-Mails (info@ und
          alle Form-Submissions). Datenschutz:{" "}
          <a href="https://www.ionos.de/terms-gtc/datenschutzerklaerung" rel="noopener noreferrer" target="_blank">
            ionos.de/terms-gtc/datenschutzerklaerung
          </a>
          .
        </p>

        <h3>Microsoft Corporation (CRM via Outlook)</h3>
        <p>
          Microsoft Corporation, One Microsoft Way, Redmond, WA 98052,
          USA (vertreten in der EU durch Microsoft Ireland Operations
          Limited, One Microsoft Place, South County Business Park,
          Leopardstown, Dublin 18, Irland). Wir verwenden Microsoft
          Outlook als CRM-System, um Mitgliederanfragen, Vertragshistorie
          und Kommunikation zu verwalten. In Outlook werden dabei
          Stammdaten (Name, Anschrift, E-Mail, Mitgliedsnummer,
          Mitgliedschaftsstatus) sowie die gesamte E-Mail-Historie
          abgelegt.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
          (Vertragsdurchführung) und Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an einem strukturierten
          Mitgliedermanagement). Microsoft agiert als
          Auftragsverarbeiter nach Art. 28 DSGVO unter den Microsoft
          Online Services Terms / Data Protection Addendum.
        </p>
        <p>
          Datenschutz:{" "}
          <a href="https://privacy.microsoft.com/de-de/privacystatement" rel="noopener noreferrer" target="_blank">
            privacy.microsoft.com
          </a>
          .
        </p>

        <h3>KI-Assistenz für internen Workflow</h3>
        <p>
          Zur effizienten Beantwortung von Mitgliederanfragen und zur
          Formulierung von Standardtexten setzen wir ergänzend
          KI-basierte Assistenz-Tools ein. Dabei können einzelne
          Nachrichten-Inhalte oder Mitgliederdaten zur Bearbeitung an den
          jeweiligen Anbieter übermittelt werden; es werden keine
          kompletten Datensätze hochgeladen und keine Modelle mit deinen
          Daten trainiert.
        </p>
        <p>
          <strong>Eingesetzter Anbieter:</strong>
        </p>
        <ul>
          <li>
            <strong>Anthropic PBC</strong>, 548 Market Street PMB 90375,
            San Francisco, CA 94104, USA — Claude-KI-Assistenz zur
            internen Textaufbereitung (Formulierungsvorschläge,
            Übersetzungsentwürfe, Antwort-Drafts). Wir nutzen den
            API-Tarif mit &bdquo;Zero Retention&ldquo;-Zusicherung:
            Anthropic verarbeitet Eingaben ausschließlich zur
            Antwortgenerierung und löscht sie im Anschluss; keine
            Trainingsnutzung. Datenschutz:{" "}
            <a
              href="https://www.anthropic.com/legal/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              anthropic.com/legal/privacy
            </a>
            . Auftragsverarbeitungsvertrag:{" "}
            <a
              href="https://www.anthropic.com/legal/dpa"
              rel="noopener noreferrer"
              target="_blank"
            >
              anthropic.com/legal/dpa
            </a>
            .
          </li>
        </ul>
        <p>
          Darüber hinaus kann beim Verfassen von Mails auf macOS/iOS
          gelegentlich <strong>Apple Intelligence</strong> (Apple Inc.,
          One Apple Park Way, Cupertino, CA 95014, USA) als integrierte
          System-Assistenz eingreifen. Apple Intelligence verarbeitet
          Eingaben primär on-device; rechenintensivere Anfragen werden
          über Apples &bdquo;Private Cloud Compute&ldquo; ausgeführt,
          ohne persistente Speicherung außerhalb der Laufzeit der
          Anfrage. Falls künftig <strong>Microsoft 365 Copilot</strong>
          in Microsoft Outlook zum Einsatz kommt, ist Microsoft bereits
          in Abschnitt &bdquo;Microsoft (E-Mail-Infrastruktur)&ldquo;
          als Auftragsverarbeiter genannt; Copilot läuft innerhalb
          derselben Microsoft-365-Umgebung und derselben DPA.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
          (Vertragsdurchführung) sowie Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an einer effizienten Bearbeitung).
          Die eingesetzten Anbieter agieren auf Basis ihrer jeweiligen
          Auftragsverarbeitungsverträge als Auftragsverarbeiter nach
          Art. 28 DSGVO. Wir nutzen dabei ausschließlich Tarife mit
          &bdquo;Zero Retention&ldquo;- bzw. &bdquo;No Training&ldquo;-Zusicherung,
          soweit der Anbieter dies anbietet.
        </p>

        <h3>PayPal (Zahlungsdienstleister)</h3>
        <p>
          PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal,
          L-2449 Luxembourg. Wenn du den Mitgliedsbeitrag per PayPal
          zahlst, übermittelst du im Zuge der Zahlung folgende Daten an
          PayPal: Name, E-Mail-Adresse, Zahlungsbetrag, ggf. weitere
          PayPal-Konto-Identifikatoren sowie deine IP-Adresse.
        </p>
        <p>
          <strong>Zweck:</strong> Abwicklung der Beitragszahlung,
          Betrugsprävention und Erfüllung gesetzlicher Aufbewahrungspflichten.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. c DSGVO
          (rechtliche Verpflichtung aus Steuer- und Buchhaltungsrecht).
        </p>
        <p>
          PayPal kann die Daten an Wirtschaftsauskunfteien zur
          Identitäts- und Bonitätsprüfung weitergeben — Details und deine
          Rechte siehe{" "}
          <a href="https://www.paypal.com/de/legalhub/privacy-full" rel="noopener noreferrer" target="_blank">
            paypal.com/de/legalhub/privacy-full
          </a>
          .
        </p>
        <p>
          <strong>Hinweis:</strong> Wenn du stattdessen per Banküberweisung
          auf unser Geschäftskonto zahlst, ist deine Hausbank kein
          Auftragsverarbeiter unsererseits — es handelt sich um eine
          normale Bankkundenbeziehung. Wir sehen in diesem Fall lediglich
          die Standard-Überweisungsdaten (Name, IBAN, Verwendungszweck,
          Betrag) zu Buchhaltungszwecken.
        </p>

        <h2>7. Übermittlung in Drittländer</h2>
        <p>
          Eine Verarbeitung deiner Daten findet teilweise außerhalb des
          Europäischen Wirtschaftsraums (EWR) statt:
        </p>
        <ul>
          <li>
            <strong>Vercel Inc., USA</strong> — als Hosting-Anbieter.
            Datenübermittlungen in die USA erfolgen auf Basis der
            EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) sowie
            ergänzender Schutzmaßnahmen (Verschlüsselung in Transit und at
            Rest, EU-Region-Auslieferung wo verfügbar).
          </li>
          <li>
            <strong>PayPal</strong> — Konzerngesellschaften außerhalb des
            EWR (insbesondere USA). PayPal stützt diese Übermittlungen
            ebenfalls auf EU-Standardvertragsklauseln. Details siehe
            PayPal-Datenschutzerklärung.
          </li>
          <li>
            <strong>Microsoft</strong> — auch wenn wir Microsoft Ireland
            als EU-Vertragspartner nutzen, kann eine technische
            Verarbeitung durch Microsoft Corporation in den USA nicht
            ausgeschlossen werden. Microsoft stützt diese Verarbeitung
            auf EU-Standardvertragsklauseln und eigene technische
            Schutzmaßnahmen (u.&nbsp;a. EU Data Boundary für M365).
          </li>
          <li>
            <strong>Anthropic PBC, USA</strong> — als KI-Assistenz-
            Anbieter. Die Übermittlung in die USA erfolgt auf Basis der
            EU-Standardvertragsklauseln im Anthropic-DPA sowie
            ergänzender technischer Schutzmaßnahmen (Verschlüsselung in
            Transit und at Rest, &bdquo;Zero Retention&ldquo;-Tarif).
          </li>
          <li>
            <strong>Apple Inc., USA</strong> — sofern Apple Intelligence
            beim Verfassen von Mails auf macOS/iOS genutzt wird.
            Komplexere Anfragen werden über &bdquo;Private Cloud
            Compute&ldquo; in Apple-Infrastruktur ohne persistente
            Speicherung verarbeitet. Übermittlung auf Basis der
            Apple-Standardvertragsklauseln.
          </li>
        </ul>

        <h2>8. Deine Rechte als betroffene Person</h2>
        <p>
          Nach der DSGVO stehen dir uns gegenüber folgende Rechte zu:
        </p>
        <ul>
          <li>
            <strong>Auskunft</strong> über die zu deiner Person
            gespeicherten Daten (Art. 15 DSGVO).
          </li>
          <li>
            <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO).
          </li>
          <li>
            <strong>Löschung</strong> deiner Daten, soweit keine
            gesetzlichen Aufbewahrungspflichten entgegenstehen (Art. 17
            DSGVO).
          </li>
          <li>
            <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO).
          </li>
          <li>
            <strong>Datenübertragbarkeit</strong> in einem strukturierten,
            gängigen und maschinenlesbaren Format (Art. 20 DSGVO).
          </li>
          <li>
            <strong>Widerspruch</strong> gegen Verarbeitungen, die wir auf
            Art. 6 Abs. 1 lit. f DSGVO stützen (Art. 21 DSGVO).
          </li>
          <li>
            <strong>Widerruf</strong> einer erteilten Einwilligung mit
            Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).
          </li>
        </ul>
        <p>
          Zur Wahrnehmung deiner Rechte genügt eine formlose E-Mail an{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>9. Beschwerderecht bei einer Aufsichtsbehörde</h2>
        <p>
          Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde
          über die Verarbeitung deiner personenbezogenen Daten durch uns
          zu beschweren. Zuständig ist in der Regel die Aufsichtsbehörde
          deines gewöhnlichen Aufenthaltsorts. Eine Übersicht der
          Aufsichtsbehörden in Deutschland findest du beim{" "}
          <a
            href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Bundesbeauftragten für den Datenschutz und die
            Informationsfreiheit
          </a>
          .
        </p>

        <h2>10. Aktualität dieser Erklärung</h2>
        <p>
          Diese Datenschutzerklärung wurde zuletzt am {STAND} aktualisiert.
          Wir behalten uns vor, sie anzupassen, wenn sich die rechtliche
          Lage oder die technische Verarbeitung ändert. Die jeweils
          aktuelle Version ist immer auf dieser Seite abrufbar.
        </p>
      </div>
    </article>
  );
}
