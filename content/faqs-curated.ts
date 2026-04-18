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
  // ---------------------------------------------------------------------------
  // B13 Content-Pass (2026-04-18): rewrite for wpId 177 "Clubkarte".
  // Dropped Fusion/Avada shortcodes, removed stale "Saison 2012/2013"
  // reference. TGA-Logo bleibt (User-confirmed 2026-04-18: Thailand-
  // historie ist Teil der Karte seit über 10 Jahren, auch wenn Betrieb
  // nach DE verlegt wurde). Golddruck (nicht Prägung). Images sind noch
  // die alten Thumbnails aus dem WP-Export — 250x161 / 180x116.
  //
  // TODO-USER (Backlog): Neue hochaufgelöste Fotos der aktuellen
  // Mitgliederkarte liefern (Vorder- + Rückseite, mind. 1200px breit,
  // neutraler Hintergrund). Die aktuellen Bilder unter
  // public/brand/card/card-2012-*.jpg sind 14 Jahre alte WP-Thumbnails.
  // ---------------------------------------------------------------------------
  {
    slug: "wie-sieht-die-clubkarte-aus-aus-welchem-material-ist-sie",
    question: "Wie sieht die Mitgliederkarte aus? Aus welchem Material ist sie?",
    answer: `Die Mitgliederkarte ist eine Plastikkarte im Kreditkartenformat (DIN ID-1). Beidseitig farbig bedruckt, hochwertige Oberfläche, haltbar.

Auf der Vorderseite stehen dein Name, Mitgliedsnummer, das Gültigkeitsdatum und dein Handicap — alles im Golddruck. Die Rückseite zeigt ein Unterschriftsfeld und das Logo des Thailändischen Golfverbandes, dem der Club historisch angehört.

Die Karte ist das, was du im Pro-Shop oder am Counter vorzeigst — kompakt, wiedererkennbar, seit über 15 Jahren im gleichen Format im Einsatz.`,
    category: "karte",
    published: true,
    images: [
      {
        src: "/brand/card/card-2012-front.jpg",
        alt: "Vorderseite der Oakwood-Mitgliederkarte mit Name, Mitgliedsnummer, Gültigkeitsdatum und Handicap in Golddruck",
        width: 250,
        height: 161,
        caption: "Vorderseite",
      },
      {
        src: "/brand/card/card-2012-back.jpg",
        alt: "Rückseite der Oakwood-Mitgliederkarte mit Unterschriftsfeld und Logo des Thailändischen Golfverbandes",
        width: 180,
        height: 116,
        caption: "Rückseite",
      },
    ],
  },
  // ---------------------------------------------------------------------------
  // B13 Content-Pass (2026-04-18): rewrite for wpId 181 "Wo kommen die
  // Mitglieder her". Dropped Fusion shortcodes AND the base64-encoded
  // Google-My-Maps iframe (it embedded a private map showing member IDs,
  // first names and membership end-dates — DSGVO-untragbar, out).
  // Content: DACH-Schwerpunkt, Thailand als Ursprung, "Exoten"-Charme
  // bleibt (User-confirmed: Zielgruppe sind Golfer, nicht Mittelstand-
  // CTOs — Tonalität darf entspannt sein). Ersatz für die Karte als
  // stilisierte anonymisierte Version ist Backlog-Item #37.
  // ---------------------------------------------------------------------------
  {
    slug: "wo-kommen-die-mitglieder-her",
    question: "Wo kommen die Mitglieder her?",
    answer: `Die Mehrheit unserer Mitglieder lebt im DACH-Raum — Deutschland, Österreich, Schweiz. Dazu gehört historisch Thailand, das Ursprungsland des Clubs, wo die Handicap-Verwaltung lange ihren Sitz hatte.

Dazu kommen über die Jahre einzelne Exoten: Mitglieder in Brasilien, Italien, England, Dänemark, Indien. Golf ist international — eine Fernmitgliedschaft passt zu jemandem, der den eigenen Platz nicht braucht, weil er ohnehin unterwegs ist.`,
    category: "mitglieder",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // B13 Content-Pass (2026-04-18): rewrite for wpId 183 "Wie kann ich
  // Mitglied werden". Old WP-Version had (a) broken nested-list structure
  // (Sub-Bullets flach migriert, Kontext verloren), (b) D9-truth-violation
  // "aktuelles Handicap das Du auf den Platz bringen möchtest" (impliziert
  // Handicap-Verwaltung), (c) Du/Ihr/Eure-Mix, (d) Typo "optinal".
  // User decisions 2026-04-18: Form-Link only (kein /kontakt-Fallback),
  // Handicap ohne Selbstauskunfts-Erklärung (steht separat), Sonderwünsche
  // weggelassen.
  // ---------------------------------------------------------------------------
  {
    slug: "wie-kann-ich-mitglied-werden",
    question: "Wie kann ich Mitglied werden?",
    answer: `Am einfachsten über das [Anmeldeformular](/mitglied-werden) — dort fragen wir alle nötigen Angaben ab und du bekommst nach dem Absenden eine Bestätigung per E-Mail.

Wir brauchen:

- Name — so, wie er auf der Mitgliederkarte stehen soll
- Eigene E-Mail-Adresse — möglichst privat, nicht beruflich. Berufliche Adressen wechseln, wir wollen dich auch in einem Jahr für die Verlängerung erreichen können.
- Postanschrift für den Kartenversand
- Dein Handicap
- Dein gewünschtes Startdatum — das Enddatum ergibt sich daraus automatisch (12 Monate)`,
    category: "mitgliedschaft",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // B13 Content-Pass (2026-04-18): rewrite for wpId 391 "Wie kann ich
  // die Mitgliedschaft verlängern". Same structural issues as wpId 183
  // (broken nested list, D9-violation on Handicap wording, Du/Ihr-Mix,
  // dass/das grammar error). Mirrored user decisions from FAQ 183:
  // Form-Link only, Handicap neutral, Sonderwünsche dropped.
  // ---------------------------------------------------------------------------
  {
    slug: "wie-kann-ich-die-mitgliedschaft-verlaengern",
    question: "Wie kann ich die Mitgliedschaft verlängern?",
    answer: `Am einfachsten über das [Verlängerungsformular](/mitgliedschaft-verlaengern) — aktuelle Daten eintragen, absenden, Bestätigung per E-Mail.

Wir brauchen:

- Aktuelle E-Mail-Adresse — möglichst privat, nicht beruflich. Berufliche Adressen wechseln, wir wollen dich auch im nächsten Jahr für die Verlängerung erreichen können.
- Aktuelle Postanschrift — falls sich diese in den letzten 12 Monaten geändert hat
- Dein Handicap
- Wunsch-Startdatum der neuen 12 Monate — nahtlos oder mit Pause, z.B. bis zum nächsten Frühling`,
    category: "mitgliedschaft",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // B13 Content-Pass (2026-04-18): rewrite for wpId 179 "Wie lange dauert
  // es bis die Clubkarte eintrifft". Original had a WP-export word-break
  // ("Karten i\nn die Post" → rendered as "Karten i n die Post"), used
  // insider-Speak (Kartenrohlinge), and missed key member-relevant info:
  // realistic delivery windows per country + what to do if nothing
  // arrives. User decisions 2026-04-18: (1A) "einmal pro Woche, bei
  // Bedarf schneller"; (2) DE 2-3 Werktage, AT/CH 3-7 Werktage ("die Post
  // spart"); (3A) /kontakt-Escalation ja; (4A) Zahlungs-Nuance erwähnen,
  // aber Payment-Method-agnostisch ("sofortige Zahlungsarten" statt
  // PayPal/Stripe — User erwägt Stripe-Umstieg, FAQ soll zukunftssicher
  // sein).
  // ---------------------------------------------------------------------------
  {
    slug: "wie-lange-dauert-es-bis-die-clubkarte-bei-mir-eintrifft",
    question: "Wie lange dauert es, bis die Mitgliederkarte bei mir ankommt?",
    answer: `Nach Zahlungseingang drucken und verschicken wir in der Regel einmal pro Woche — bei Bedarf auch schneller. Wichtig: Bei Banküberweisung dauert der Zahlungseingang 2–3 Werktage; bei sofortigen Zahlungsarten geht der Versandprozess direkt los.

Lieferzeit mit der Deutschen Post:

- Deutschland: 2–3 Werktage
- Österreich / Schweiz: 3–7 Werktage

Wenn du nach zwei Wochen noch keine Karte hast, [melde dich](/kontakt) — wir schauen nach.`,
    category: "karte",
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
