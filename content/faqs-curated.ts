/**
 * Hand-kuratierte FAQs — pflegt der Mensch, NICHT das Migrations-Script.
 *
 * Für Inhalte, die
 *   - von uns neu formuliert sind (statt WP-Migration),
 *   - die WP-Version truth-align-kritisch ersetzen (siehe D9: wir
 *     verarbeiten aktuell keine Handicaps), oder
 *   - zusätzlich zum WP-Stand neu aufgenommen werden.
 *
 * Diese Einträge erscheinen zusammen mit WP_FAQS aus faqs-wp.ts in der
 * öffentlichen FAQ-Seite (siehe content/faqs.ts als Aggregator).
 */

import type { FaqItem } from "@/lib/faqs/types";

export const CURATED_FAQS: FaqItem[] = [
  {
    slug: "warum-aktuell-keine-handicap-verwaltung",
    question: "Warum verarbeitet ihr aktuell keine Handicaps?",
    answer: `Handicap-Verwaltung war über Jahre Teil der Mitgliedschaft, wird aktuell aber nicht aktiv angeboten.

Dein Handicap erfasst du beim Signup selbst — ohne Verifizierung. Wenn du ein offizielles Handicap führst, nutze dafür die Systeme deines Heimat- oder Gastplatzes. Eine eigene Recreational-Handicap-Lösung ist in Planung, hat aber keinen festen Termin.

Die Mitgliederkarte bleibt auf rund 95 % der österreichischen Plätze als Clubnachweis anerkannt — unabhängig von der Handicap-Frage.`,
    category: "handicap",
    published: true,
  },
  {
    slug: "gibt-es-ein-auto-renewal",
    question: "Gibt es ein Auto-Renewal?",
    answer: `Nein. Deine Mitgliedschaft läuft nach 12 Monaten automatisch aus.

Du entscheidest aktiv, ob du verlängern möchtest. Keine Kündigung nötig, keine versteckten Gebühren, keine Lastschrift.`,
    category: "mitgliedschaft",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // B6.1 Content-Pass (2026-04-17): rewrites for 3 WP-migrated handicap FAQs.
  // Slugs match faqs-wp.ts so the aggregator dedupes the WP copy out.
  // 5 additional handicap FAQs were dropped — they remain in faqs-wp.ts with
  // needsReview=true, published=false, and never surface on /faq.
  // ---------------------------------------------------------------------------
  {
    slug: "wie-uebermittle-ich-mein-erstes-handicap-bzw-meine-platzreife",
    question: "Wie übermittle ich mein erstes Handicap oder meine Platzreife?",
    answer: `Dein Handicap gibst du beim Signup-Formular selbst an — als Selbstauskunft, ohne Verifizierung durch uns. Diese Zahl drucken wir unverändert auf deine Mitgliederkarte.

Du brauchst keinen Nachweis einzureichen: kein Scan, kein Fax, keine Mail. Wir gleichen deine Angabe nicht mit offiziellen Handicap-Datenbanken ab. Dadurch ist die Karte schnell zu produzieren, aber sie dokumentiert dein Handicap nicht im Sinne einer vorgabewirksamen Verwaltung.

Bei der jährlichen Verlängerung trägst du deine aktuelle Handicap-Zahl wieder ein. Wie du diese Zahl im Laufe des Jahres fortschreibst, bleibt dir überlassen — etwa über deinen Heimatplatz, eine App oder eigene Tabellen.

Wenn du ein offiziell verwaltetes Handicap brauchst (etwa für DGV- oder ÖGV-Turniere), ist ein Club mit aktiver Handicap-Führung der richtige Weg. Unsere Mitgliederkarte ersetzt das nicht.`,
    category: "handicap",
    published: true,
  },
  {
    slug: "wer-braucht-ein-aktuelles-handicap",
    question: "Wer braucht ein aktuelles Handicap?",
    answer: `Ein aktuelles Handicap brauchst du dort, wo Plätze oder Turniere es als Voraussetzung verlangen. In drei typischen Situationen wird danach gefragt:

Für Turniere und Wettbewerbe — jede vorgabewirksame Runde verlangt ein laufend geführtes Handicap über deinen Heimat- oder einen offiziell anerkannten Club.

Für handicap-beschränkte Plätze — manche Kurse erwarten z. B. Hcp 36 am Wochenende, internationale Plätze in Spanien teilweise Hcp 28. Vor-Ort-Kulanz hängt von der Tagesauslastung ab.

Als persönlicher Leistungsmesser — wer gern Statistiken führt oder seine Entwicklung dokumentiert, profitiert von einem fortlaufend berechneten Wert.

Für Greenfee-Spiel auf rund 95 % der österreichischen Plätze reicht deine Oakwood-Mitgliederkarte als Clubnachweis — dort wird dein Handicap zwar als Selbstauskunft akzeptiert, aber nicht automatisch verlangt. Für alles darüber hinaus nutze einen Club mit aktiver Handicap-Führung.`,
    category: "handicap",
    published: true,
  },
  {
    slug: "was-ist-ein-recreational-hcp-wie-unterscheidet-es-sich-vom-hcp-des-dgv",
    question: "Was ist ein Recreational-Handicap? Wie unterscheidet es sich vom Hcp des DGV?",
    answer: `Ein Recreational-Handicap ist ein Handicap-System, das alle gespielten Runden in die Berechnung einbezieht — nicht nur Turniere und ausgewiesene vorgabewirksame Runden.

Im DACH-Raum (DGV, ÖGV) ist die Handicap-Führung klassisch strenger: meist zählen Turniere und Extra-Day-Scores, der Rest bleibt außen vor. Im angelsächsischen Raum — USGA und viele internationale Verbände — fließen Heimrunden, Auswärtsrunden, 18er, 9er, alle regulären Runden mit ein.

Vorteil des Recreational-Modells: Dein Handicap wird über die Zeit realistischer. Wer wenig Turniere spielt, hängt nicht jahrelang bei Hcp 54 fest. Der Spaß an der eigenen Leistungsentwicklung steht im Vordergrund.

Beim Oakwood Golf Club ist ein eigenes Recreational-Handicap-Produkt aktuell nicht aktiv. Eine schlanke Lösung ist in Planung, hat aber keinen festen Termin. Bis dahin: nutze ein offizielles Handicap-System oder führe deine Runden privat.`,
    category: "handicap",
    published: true,
  },
  {
    slug: "welche-app-fuer-scorecard-und-handicap-tracking",
    question: "Welche App empfehlt ihr fürs Scorecard- und Handicap-Tracking?",
    answer: `Für Scorecard- und Handicap-Tracking empfehlen wir [StrokesIn](https://www.golfsoft.ch/scorekarte-golf-strokesin) von golfsoft.ch. Keine Notlösung, sondern eine wirklich gute App, die wir unseren Mitgliedern mit gutem Gewissen ans Herz legen.

Die Stärke der App liegt bei den Statistiken: Drive-Distanzen, Putt-Zahlen, Schlag-Richtungen, Multi-Runden-Analyse mit Mustererkennung und Schwächen-Diagnose — das ist eigenständig durchdacht und kein Abfallprodukt eines Scorekarten-Tools. Wer seine eigene Entwicklung verstehen will, hat hier echtes Material.

Dazu: digitale Scorekarte per Eingabe, Foto-Scan oder Voice-Diktat. Automatische Stableford-Berechnung. Handicap-Führung nach dem World Handicap System (WHS), inklusive 9-Loch-Rechner. Turniere und Casual-Runden werden sauber getrennt. Die Kurs-Datenbank ist global — brauchbar für DACH und für Reisen.

Verfügbar für iOS und Android, Deutsch und Englisch, zu einem niedrigen Preispunkt. Wir stehen im Austausch mit dem Hersteller.

Mehr zur App im [Blog-Beitrag zu StrokesIn](/blog/strokesin-app-empfehlung).`,
    category: "handicap",
    published: true,
  },
];
