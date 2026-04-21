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
 *  - Spam-Schutz auf Formularen: serverseitige Zod-Validierung + TLD-Block
 *    auf dem E-Mail-Feld (.ru/.cn/.in/.id) + Honeypot. KEIN externer Captcha-
 *    Anbieter live (Friendly-Captcha-Code ist im Repo für Phase 2 ready,
 *    aktiviert sich erst wenn NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITEKEY +
 *    FRIENDLY_CAPTCHA_API_KEY in Vercel gesetzt sind — graceful degrade).
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

const STAND = "19. April 2026";

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
          Rotebühlstr. 176
          <br />
          70197 Stuttgart, Deutschland
        </p>
        <p>
          E-Mail: <a href={MAILTO_FEEDBACK}>{SITE.email}</a>
          <br />
          Telefon: <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
        </p>

        {/* DSB: nicht benannt. Begründung: kein Betrieb mit 20+ Personen,
            die ständig mit automatisierter Verarbeitung personenbezogener
            Daten befasst sind (§ 38 Abs. 1 BDSG). Einzelunternehmer mit
            Admin-Workflow durch Inhaber selbst. User-bestätigt 2026-04-19. */}

        <h2>2. Aufruf der Webseite (Server-Logs)</h2>
        <p>
          Wenn du unsere Webseite besuchst, übermittelt dein Browser aus
          technischen Gründen automatisch Daten an die Server unseres
          Hosting-Dienstleisters Vercel Inc. (siehe Abschnitt 6). Diese
          Daten werden in sogenannten Server-Logs vorgehalten und
          umfassen:
        </p>
        <ul>
          <li>
            IP-Adresse (wird nur in technischen Server-Logs kurzfristig
            vorgehalten, siehe Speicherdauer)
          </li>
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
          <strong>Speicherdauer:</strong>
        </p>
        <ul>
          <li>
            <strong>
              Mitglieder-Stammdaten (Name, Anschrift, E-Mail,
              Mitgliedsnummer):
            </strong>{" "}
            Dauer der aktiven Mitgliedschaft zzgl. 3 Jahre nach
            Vertragsende (regelmäßige Verjährung vertraglicher Ansprüche,
            § 195 BGB).
          </li>
          <li>
            <strong>Zahlungs- und Buchungsbelege:</strong> 10 Jahre ab
            Ende des Kalenderjahres der Leistungserbringung
            (§ 147 Abs. 1 Nr. 4 AO, § 257 Abs. 4 HGB).
          </li>
          <li>
            <strong>Allgemeine Kontaktanfragen ohne Vertragsbezug:</strong>{" "}
            6 Monate nach letzter Interaktion.
          </li>
          <li>
            <strong>Abgelehnte Anmeldungen:</strong> 3 Monate nach
            Ablehnungs-Entscheidung.
          </li>
          <li>
            <strong>Server-Logs (IP, Zugriffszeit):</strong> wenige Tage
            (Vercel-Default).
          </li>
        </ul>

        <h2>6. Empfänger personenbezogener Daten</h2>
        <p>
          Für den technischen Betrieb der Webseite, die E-Mail-Kommunikation,
          das Mitglieder-CRM und die Zahlungsabwicklung nutzen wir externe
          Dienstleister. Wir unterscheiden zwei Rollen:
          <strong> Auftragsverarbeiter</strong> verarbeiten deine Daten
          weisungsgebunden in unserem Auftrag (Art. 28 DSGVO);{" "}
          <strong>eigenverantwortliche Empfänger</strong> verarbeiten
          deine Daten in eigener Verantwortung für eigene Zwecke (Art. 4
          Nr. 7 DSGVO).
        </p>

        <h3>6.1 Auftragsverarbeiter (Art. 28 DSGVO)</h3>
        <p>
          Folgende Dienstleister verarbeiten Daten weisungsgebunden in
          unserem Auftrag auf Basis eines Auftragsverarbeitungsvertrags
          bzw. einer äquivalenten vertraglichen Regelung:
        </p>

        <h4>Vercel Inc. (Hosting + Web Analytics)</h4>
        <p>
          440 N Barranca Avenue #4133, Covina, CA 91723, USA. Vercel
          stellt die technische Infrastruktur für die Auslieferung dieser
          Webseite bereit (Edge Network, Function-Hosting). Die
          Auslieferung erfolgt soweit möglich aus EU-Regionen.
          Datenschutz: <a href="https://vercel.com/legal/privacy-policy" rel="noopener noreferrer" target="_blank">vercel.com/legal/privacy-policy</a>.
        </p>

        <h4>IONOS SE (E-Mail-Versand)</h4>
        <p>
          Elgendorfer Straße 57, 56410 Montabaur, Deutschland. IONOS
          versendet und empfängt unsere Geschäfts-E-Mails (info@ und
          alle Form-Submissions). Datenschutz:{" "}
          <a href="https://www.ionos.de/terms-gtc/datenschutzerklaerung" rel="noopener noreferrer" target="_blank">
            ionos.de/terms-gtc/datenschutzerklaerung
          </a>
          .
        </p>

        <h4>Microsoft Corporation (CRM via Outlook)</h4>
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
          <strong>Microsoft 365 Copilot</strong> ist in unserem
          M365-Abonnement aktiv. Wir setzen Copilot nicht gezielt für
          die Verarbeitung von OGC-Mitgliederdaten ein. Bei der Nutzung
          von Outlook in der Administrator-Umgebung kann Copilot als
          integrierte Assistenzfunktion eingreifen. Copilot läuft
          innerhalb derselben Microsoft-365-Infrastruktur und des
          gleichen Auftragsverarbeitungsvertrags wie in diesem Abschnitt
          &bdquo;Microsoft Corporation (CRM via Outlook)&ldquo;
          beschrieben.
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

        <h4>Anthropic PBC (KI-Assistenz für internen Workflow)</h4>
        <p>
          Anthropic PBC, 548 Market Street PMB 90375, San Francisco,
          CA 94104, USA. Wir nutzen Claude-KI-Assistenz zur internen
          Textaufbereitung (Formulierungsvorschläge, Übersetzungsentwürfe,
          Antwort-Drafts). Dabei können einzelne Nachrichten-Inhalte oder
          Mitgliederdaten zur Bearbeitung an Anthropic übermittelt werden;
          es werden keine kompletten Datensätze hochgeladen und keine
          Modelle mit deinen Daten trainiert.
        </p>
        <p>
          Wir nutzen die Anthropic-API auf Basis der Commercial Terms.
          Eingaben werden von Anthropic bis zu 30 Tage zur
          Missbrauchserkennung gespeichert und anschließend gelöscht.
          Eine Nutzung zu Trainingszwecken findet nicht statt.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
          (Vertragsdurchführung) sowie Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an einer effizienten Bearbeitung).
          Anthropic agiert auf Basis des Auftragsverarbeitungsvertrags
          als Auftragsverarbeiter nach Art. 28 DSGVO.
        </p>
        <p>
          Datenschutz:{" "}
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
        </p>

        <h3>6.2 Eigenverantwortliche Empfänger (Art. 4 Nr. 7 DSGVO)</h3>
        <p>
          Folgende Empfänger verarbeiten personenbezogene Daten in
          eigener Verantwortung für eigene Zwecke und auf Basis eigener
          Rechtsgrundlagen. Es besteht kein Auftragsverarbeitungsverhältnis
          mit uns.
        </p>

        <h4>PayPal (Europe) S.à r.l. et Cie, S.C.A. — Zahlungsdienstleister</h4>
        <p>
          22-24 Boulevard Royal, L-2449 Luxembourg. Wenn du den
          Mitgliedsbeitrag per PayPal zahlst, übermittelst du im Zuge
          der Zahlung folgende Daten an PayPal: Name, E-Mail-Adresse,
          Zahlungsbetrag, ggf. weitere PayPal-Konto-Identifikatoren sowie
          deine IP-Adresse.
        </p>
        <p>
          <strong>
            PayPal ist eigenverantwortlicher Verantwortlicher im Sinne
            von Art. 4 Nr. 7 DSGVO.
          </strong>{" "}
          PayPal verarbeitet die Daten zur Abwicklung der Zahlung, zur
          Betrugsprävention und zur Erfüllung eigener gesetzlicher
          Aufbewahrungs- und Meldepflichten — auf Grundlage der
          PayPal-eigenen Datenschutzerklärung.
        </p>
        <p>
          <strong>Rechtsgrundlage auf unserer Seite:</strong> Art. 6
          Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1
          lit. c DSGVO (rechtliche Verpflichtung aus Steuer- und
          Buchhaltungsrecht).
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

        <h4>Apple Inc. — Apple Intelligence (OS-Funktion)</h4>
        <p>
          Apple Inc., One Apple Park Way, Cupertino, CA 95014, USA.
          Apple Intelligence ist in der macOS/iOS-Umgebung des
          Administrators aktiv. Wir setzen diese Funktion nicht gezielt
          für die Verarbeitung von OGC-Mitgliederdaten ein. Bei der
          Nutzung der Administrator-Endgeräte kann Apple Intelligence als
          Betriebssystem-Funktion eingreifen.
        </p>
        <p>
          Apple Intelligence verarbeitet Eingaben primär on-device;
          rechenintensivere Anfragen werden über Apples
          &bdquo;Private Cloud Compute&ldquo; ausgeführt, ohne
          persistente Speicherung außerhalb der Laufzeit der Anfrage.
        </p>
        <p>
          <strong>
            Apple agiert dabei als eigenverantwortlicher Anbieter einer
            OS-Funktion im Sinne von Art. 4 Nr. 7 DSGVO; es besteht kein
            Auftragsverarbeitungsverhältnis mit uns.
          </strong>{" "}
          Zu den mit der Nutzung verbundenen Drittlandtransfers siehe
          Abschnitt 7.
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
