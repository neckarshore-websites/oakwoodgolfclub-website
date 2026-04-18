import type { Metadata } from "next";
import Link from "next/link";

import { PRICING, SITE } from "@/lib/site-config";

/**
 * Allgemeine Geschäftsbedingungen.
 *
 * Inhaltliche Grundlage: WP-Vorgängerseite (oakwoodgolfclub.de/agb,
 * Stand "31. Januar 2017"). Die alte Fassung war substanziell, aber
 * unvollständig. Diese Version ergänzt die seit 2017 dazugekommenen
 * gesetzlichen Mindestbestandteile bei Fernabsatzverträgen mit
 * Verbrauchern:
 *  - Anbieter in Deutschland (User seit 2026 dort selbstständig).
 *  - Weltweit kostenloser Versand der Mitgliederkarte (alle Länder).
 *  - Zahlungswege: Banküberweisung (DKB) und PayPal.
 *  - Vollständige Widerrufsbelehrung mit Muster-Widerrufsformular
 *    (Pflicht, § 312g BGB + Anlage zu Art. 246a § 1 Abs. 2 EGBGB).
 *  - ZUSÄTZLICH: lebenslange formfreie Money-Back-Garantie als
 *    freiwillige Erweiterung (User-Policy seit 18 Jahren, 4-5 Mal
 *    gezogen). Juristisch eine vertragliche Kulanz, kein Widerruf.
 *  - Haftungsbegrenzung, Salvatorische Klausel.
 *  - OS-Plattform- und VSBG-Hinweis (analog Impressum).
 *  - Gerichtsstand "Bangkok" entfernt (war gegenüber Verbrauchern
 *    ohnehin nicht durchsetzbar, außerdem Anbieter jetzt DE).
 *  - USt-Klausel bewusst neutral gehalten ("ggf. gesetzliche USt"),
 *    weil Steuerstatus noch geklärt wird (Backlog #27).
 */

const STAND = "18. April 2026";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description:
    "Allgemeine Geschäftsbedingungen (AGB) für die Fernmitgliedschaft im " +
    "Oakwood Golf Club — Vertragsschluss, Leistungsumfang, Preise, " +
    "Zahlungsbedingungen, Widerrufsrecht, Geld-zurück-Garantie, " +
    "Laufzeit und Haftung.",
  alternates: { canonical: "/agb" },
  robots: { index: true, follow: true },
};

export default function AgbPage() {
  return (
    <article className="container-page py-16 md:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-deep)]">
          Rechtliches
        </p>
        <h1 className="font-heading text-4xl tracking-tight md:text-5xl">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="mt-4 text-sm text-[var(--color-ink)]/60">
          Stand: {STAND}
        </p>
      </header>

      <div className="ogc-prose">
        <h2>§ 1 Geltungsbereich und Vertragspartner</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) regeln das
          Vertragsverhältnis zwischen dem <strong>Oakwood Golf Club</strong>{" "}
          (Anbieter, im Folgenden &bdquo;OGC&ldquo;) und dem Mitglied (im
          Folgenden &bdquo;du&ldquo; oder &bdquo;Mitglied&ldquo;) im
          Rahmen einer Fernmitgliedschaft.
        </p>
        <p>
          Anbieter ist <strong>German Rauhut – IT Consulting &amp; Digital
          Ventures, Geschäftsbereich Oakwood Golf Club</strong>, Stuttgart,
          Deutschland. Vollständige Anbieter-Angaben siehe{" "}
          <Link href="/impressum">Impressum</Link>.
        </p>
        <p>
          Diese AGB gelten für alle über die Webseite{" "}
          {SITE.url.replace(/^https?:\/\//, "")} angebahnten und
          geschlossenen Verträge.
        </p>

        <h2>§ 2 Leistungsumfang</h2>
        <p>
          OGC bietet eine Fernmitgliedschaft im Golfclub mit folgenden
          Bestandteilen:
        </p>
        <ul>
          <li>
            Eintragung als Mitglied im Mitgliederverzeichnis des Oakwood
            Golf Club.
          </li>
          <li>
            Eine personalisierte, gedruckte Mitgliederkarte mit Namen
            und Gültigkeitsdatum.
          </li>
          <li>
            Versand der Mitgliederkarte an die angegebene Postadresse.
          </li>
        </ul>
        <p>
          Die Mitgliederkarte wird auf Golfplätzen, die externe
          Mitgliedschaften anerkennen, als Spielberechtigung akzeptiert.
          OGC weist darauf hin, dass die Anerkennung im Ermessen des
          jeweiligen Golfplatzes liegt und nicht garantiert werden kann.
        </p>

        <h2>§ 3 Vertragsschluss</h2>
        <p>
          Der Vertrag kommt zustande, sobald
        </p>
        <ol>
          <li>
            das Mitglied das Anmeldeformular auf der Webseite
            ausgefüllt und abgesendet hat,
          </li>
          <li>
            OGC die Anmeldung per E-Mail bestätigt und die Zahlungsdetails
            mitteilt, und
          </li>
          <li>
            der Mitgliedsbeitrag innerhalb der in § 5 genannten Frist
            beim OGC eingegangen ist.
          </li>
        </ol>
        <p>
          Die Darstellung der Mitgliedschafts-Optionen auf der Webseite
          stellt kein bindendes Angebot, sondern eine unverbindliche
          Einladung zur Anmeldung dar.
        </p>

        <h2>§ 4 Preise und Versand</h2>
        <p>
          Es gelten folgende Mitgliedsbeiträge (in Euro):
        </p>
        <ul>
          <li>
            <strong>{PRICING.individual.label}:</strong>{" "}
            {PRICING.individual.priceEur} Euro für{" "}
            {PRICING.individual.term} ({PRICING.individual.people} Person)
          </li>
          <li>
            <strong>{PRICING.flight.label}:</strong>{" "}
            {PRICING.flight.priceEur} Euro für {PRICING.flight.term} (
            {PRICING.flight.people} Personen,{" "}
            {PRICING.flight.note.toLowerCase()})
          </li>
        </ul>
        <p>
          Die genannten Beträge enthalten ggf. die gesetzliche
          Umsatzsteuer. Der <strong>Versand der Mitgliederkarte ist
          kostenlos — weltweit in alle Länder.</strong> Etwaige Zoll-
          oder Einfuhrabgaben bei Versand außerhalb der EU trägt das
          Mitglied.
        </p>

        <h2>§ 5 Zahlung</h2>
        <p>
          Der Mitgliedsbeitrag ist innerhalb von <strong>14 Tagen</strong>{" "}
          nach Erhalt der Anmeldebestätigung zu zahlen. Zur Verfügung
          stehen folgende Zahlungswege, die OGC in der Anmeldebestätigung
          mitteilt:
        </p>
        <ul>
          <li>Banküberweisung auf das Geschäftskonto (DKB, Deutschland)</li>
          <li>Zahlung per <strong>PayPal</strong></li>
        </ul>
        <p>
          Geht der Beitrag nicht innerhalb von 14 Tagen ein, wird die
          Anmeldung kostenfrei storniert; es entstehen keine
          Bearbeitungsgebühren.
        </p>

        <h2>§ 6 Laufzeit und Verlängerung</h2>
        <p>
          Die Mitgliedschaft beginnt mit dem in der Anmeldebestätigung
          genannten Startdatum und läuft <strong>12 Kalendermonate</strong>.
          Sie verlängert sich <strong>nicht automatisch</strong> — eine
          Kündigung ist daher nicht erforderlich.
        </p>
        <p>
          Vor Ablauf der Mitgliedschaft sendet OGC eine Erinnerung mit
          dem Hinweis, dass das Mitglied die Mitgliedschaft aktiv
          verlängern kann. Eine Verlängerung kommt nur zustande, wenn das
          Mitglied das Verlängerungsformular ausfüllt und der neue
          Mitgliedsbeitrag entsprechend § 5 fristgerecht eingeht.
        </p>

        <h2>§ 7 Widerrufsrecht für Verbraucher</h2>
        <h3>Widerrufsbelehrung</h3>
        <p>
          Du hast das Recht, binnen{" "}
          <strong>vierzehn Tagen</strong> ohne Angabe von Gründen diesen
          Vertrag zu widerrufen.
        </p>
        <p>
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
          Vertragsabschlusses (im Sinne von § 3 dieser AGB).
        </p>
        <p>
          Um dein Widerrufsrecht auszuüben, musst du uns
        </p>
        <p>
          German Rauhut – IT Consulting &amp; Digital Ventures
          <br />
          Geschäftsbereich Oakwood Golf Club
          <br />
          Stuttgart, Deutschland
          <br />
          E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
        <p>
          mittels einer eindeutigen Erklärung (z.&nbsp;B. ein mit der Post
          versandter Brief oder eine E-Mail) über deinen Entschluss, diesen
          Vertrag zu widerrufen, informieren. Die ladungsfähige Anschrift
          teilen wir dir auf Anfrage innerhalb von 24 Stunden per E-Mail
          mit. Du kannst für den Widerruf das beigefügte Muster-Widerrufs­
          formular verwenden, das jedoch nicht vorgeschrieben ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass du die
          Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
          Widerrufsfrist absendest.
        </p>

        <h3>Folgen des Widerrufs</h3>
        <p>
          Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen,
          die wir von dir erhalten haben, einschließlich der Lieferkosten
          (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben,
          dass du eine andere Art der Lieferung als die von uns angebotene,
          günstigste Standardlieferung gewählt hast), unverzüglich und
          spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an
          dem die Mitteilung über deinen Widerruf dieses Vertrags bei uns
          eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
          Zahlungsmittel, das du bei der ursprünglichen Transaktion
          eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas
          anderes vereinbart; in keinem Fall werden dir wegen dieser
          Rückzahlung Entgelte berechnet.
        </p>
        <p>
          Soweit dir bereits eine Mitgliederkarte zugesandt wurde, bist du
          verpflichtet, diese unverzüglich, jedenfalls aber spätestens
          binnen vierzehn Tagen ab dem Tag, an dem du uns über den Widerruf
          informierst, an die von uns in der Widerrufsbestätigung
          mitgeteilte Rücksendeanschrift zurückzusenden. Die unmittelbaren
          Kosten der Rücksendung trägst du.
        </p>

        <h3>Muster-Widerrufsformular</h3>
        <p>
          Wenn du den Vertrag widerrufen möchtest, kannst du dieses
          Formular ausfüllen und an uns zurücksenden:
        </p>
        <hr />
        <p>
          An: German Rauhut – IT Consulting &amp; Digital Ventures,
          Geschäftsbereich Oakwood Golf Club, Stuttgart, Deutschland —
          E-Mail: {SITE.email}
        </p>
        <p>
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
          abgeschlossenen Vertrag über die Mitgliedschaft im Oakwood Golf
          Club:
        </p>
        <ul>
          <li>Bestellt am (*) / erhalten am (*): _____________</li>
          <li>Name des/der Verbraucher(s): _____________</li>
          <li>Anschrift des/der Verbraucher(s): _____________</li>
          <li>Unterschrift (nur bei Mitteilung auf Papier): _____________</li>
          <li>Datum: _____________</li>
        </ul>
        <p>(*) Unzutreffendes streichen.</p>
        <hr />

        <h2>§ 8 Zusätzliche Geld-zurück-Garantie (über das gesetzliche Widerrufsrecht hinaus)</h2>
        <p>
          Über das gesetzliche 14-Tage-Widerrufsrecht in § 7 hinaus gewähren
          wir dir eine <strong>lebenslange formfreie Geld-zurück-Garantie</strong>:
        </p>
        <ul>
          <li>
            Du kannst den Mitgliedsbeitrag <strong>jederzeit</strong>{" "}
            während der laufenden Mitgliedschaft zurückfordern.
          </li>
          <li>
            Du musst <strong>keine Gründe nennen</strong> und keine Form
            einhalten — eine kurze formlose Nachricht an{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> genügt.
          </li>
          <li>
            Wir erstatten den gezahlten Beitrag unverzüglich über denselben
            Zahlungsweg, auf dem du ihn überwiesen hast.
          </li>
        </ul>
        <p>
          <em>Hintergrund:</em> OGC existiert seit 2009. In dieser Zeit
          haben wenige Mitglieder von dieser Garantie Gebrauch gemacht —
          aber jeder, der sie gebraucht hat, bekam sein Geld zurück. Uns
          ist wichtiger, dass niemand unzufrieden Mitglied bleibt als dass
          wir jeden Betrag einbehalten.
        </p>
        <p>
          Diese Zusatz-Garantie ist freiwillig und ersetzt nicht dein
          gesetzliches Widerrufsrecht aus § 7 — du kannst frei wählen, auf
          welche Regelung du dich beziehst.
        </p>

        <h2>§ 9 Pflichten des Mitglieds</h2>
        <p>
          Das Mitglied verpflichtet sich, bei der Nutzung der Mitgliedschaft
          auf Golfanlagen die jeweils geltenden Golfregeln und die
          übliche Golfetikette einzuhalten.
        </p>
        <p>
          Adressänderungen, Änderungen des Namens oder der E-Mail-Adresse
          teilt das Mitglied OGC unverzüglich mit, damit die
          Mitgliederkarte und die Verlängerungs-Erinnerung den richtigen
          Empfänger erreichen.
        </p>

        <h2>§ 10 Haftung</h2>
        <p>
          OGC haftet unbeschränkt nur für Vorsatz und grobe Fahrlässigkeit
          sowie für Schäden aus der Verletzung des Lebens, des Körpers
          oder der Gesundheit. Für leichte Fahrlässigkeit haftet OGC nur
          bei Verletzung wesentlicher Vertragspflichten (sog.
          Kardinalpflichten); in diesem Fall ist die Haftung auf den bei
          Vertragsschluss vorhersehbaren, vertragstypischen Schaden
          begrenzt.
        </p>
        <p>
          OGC haftet ausdrücklich nicht für Schäden, die einem Mitglied
          durch das Verhalten Dritter (insbesondere von Golfplatzbetreibern
          oder anderen Spielern) entstehen, oder für Schäden, die aus der
          Nichtanerkennung der Mitgliederkarte durch einen Golfplatz
          resultieren (siehe § 2).
        </p>

        <h2>§ 11 Datenschutz</h2>
        <p>
          Informationen zur Verarbeitung personenbezogener Daten findest
          du in unserer{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </p>

        <h2>§ 12 Streitbeilegung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            rel="noopener noreferrer"
            target="_blank"
          >
            ec.europa.eu/consumers/odr
          </a>
          . OGC ist nicht bereit oder verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
        </p>

        <h2>§ 13 Anwendbares Recht</h2>
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Bei
          Verbrauchern findet diese Rechtswahl nur insoweit Anwendung, als
          dadurch nicht der durch zwingende Bestimmungen des Rechts des
          Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt
          hat, gewährte Schutz entzogen wird (Art. 6 Abs. 2 Rom-I-VO).
        </p>

        <h2>§ 14 Salvatorische Klausel</h2>
        <p>
          Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise
          unwirksam sein oder werden, berührt dies die Wirksamkeit der
          übrigen Bestimmungen nicht. Anstelle der unwirksamen Bestimmung
          gilt die gesetzlich zulässige Regelung, die dem mit der
          unwirksamen Bestimmung verfolgten wirtschaftlichen Zweck am
          nächsten kommt.
        </p>

        <h2>§ 15 Stand</h2>
        <p>Diese AGB gelten in der hier veröffentlichten Fassung ab {STAND}.</p>
      </div>
    </article>
  );
}
