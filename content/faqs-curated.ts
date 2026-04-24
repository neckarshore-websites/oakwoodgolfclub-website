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
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 66 W -> ~143 W. User-correction:
  // initial v1 blamed "Aufwand" as reason for pause — that was factually
  // wrong. Real reason: the 2021 WHS (World Handicap System) transition
  // caused "Verwerfungen" that the club is still sorting out. Tone kept
  // slightly self-deprecating per user's own phrasing ("in Anführungs-
  // zeichen leiden"). Deliberate: "Verwerfungen" stays vague — no
  // concrete detail that would invite detail-questions we can't cleanly
  // answer.
  // ---------------------------------------------------------------------------
  {
    slug: "warum-aktuell-keine-handicap-verwaltung",
    question: "Warum verarbeitet ihr aktuell keine Handicaps?",
    answer: `Handicap-Verwaltung war über Jahre Teil der Mitgliedschaft, wird aktuell aber nicht aktiv angeboten. Operativ könnten wir das grundsätzlich wieder anbieten — die Pause hat einen anderen Grund: Mit der Umstellung auf das WHS (World Handicap System) 2021 gab es im Hintergrund Verwerfungen, unter denen wir bis heute „leiden". Bevor wir eine Handicap-Führung offiziell wieder anbieten, müssen diese Nachwirkungen sauber aufgearbeitet sein.

Für dich heißt das: Dein Handicap erfasst du beim Signup selbst — als Selbstauskunft, ohne Verifizierung durch uns. Wenn du ein offiziell geführtes Handicap brauchst (Turniere, handicap-limitierte Plätze, DGV-/ÖGV-Wertungen), nutze dafür die Systeme deines Heimat- oder Gastplatzes.

Eine eigene Recreational-Handicap-Lösung — alle gespielten Runden einbeziehen, nicht nur Turniere — ist in Planung, hat aber keinen festen Termin. Sobald sie reif ist, hörst du davon.

Die Mitgliederkarte bleibt bis dahin auf rund 95 % der österreichischen Plätze als Clubnachweis anerkannt — unabhängig von der Handicap-Frage.`,
    category: "handicap",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 24 W -> 121 W expansion. Trust-Signale
  // ("ohne Lastschrift", "ohne Kündigung") preserved in P1. New content:
  // the "why" behind the no-auto-renewal decision (Lebensphasen,
  // konkrete Beispiele: Schulter-Op, Umzug, Prioritäten) + the
  // Rückkehrer-Signal. AI-citation-ready for "oakwood auto renewal"
  // query.
  // ---------------------------------------------------------------------------
  {
    slug: "gibt-es-ein-auto-renewal",
    question: "Gibt es ein Auto-Renewal?",
    answer: `Nein. Deine Mitgliedschaft läuft nach 12 Monaten automatisch aus — ohne automatische Verlängerung, ohne Lastschrift, ohne Kündigung.

Du entscheidest aktiv, ob du verlängern möchtest. Rechtzeitig vor Ablauf schreiben wir dich 1–2 Mal per E-Mail an; antwortest du nicht, endet die Mitgliedschaft einfach.

Wir machen das bewusst so, weil sich Lebensphasen ändern. Manche Mitglieder pausieren nach einem Jahr — wegen einer Schulter-Op, eines Umzugs, wegen anderer Prioritäten oder schlicht, weil dieses Jahr weniger Reisezeit da ist. Ein Auto-Renewal würde die Mitgliedschaft dann weiterlaufen lassen, obwohl der Nutzen gerade nicht da ist.

Wer zurückkommt, entscheidet aktiv und mit frischem Kopf. Ein Jahr Pause, dann wieder dabei — das kommt bei unseren Mitgliedern immer wieder vor, ohne Drama, ohne Vertragsakrobatik. Für die Wiederanmeldung reicht das normale Anmeldeformular.`,
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
    answer: `Die Mitgliederkarte ist eine Plastikkarte im Kreditkartenformat (DIN ID-1, 85,6 × 54 mm) — beidseitig farbig bedruckt, hochwertige Oberfläche, robust für einen 12-Monats-Einsatz in Bag-Seitentasche und Portemonnaie.

Auf der Vorderseite stehen dein Name, Mitgliedsnummer, das Gültigkeitsdatum und dein Handicap — alles im Golddruck. Logo, Layout und Farben sind auf dem Kartenrohling schon vorgedruckt; die persönlichen Daten werden vor dem Versand in Gold aufgebracht.

Die Rückseite zeigt ein Unterschriftsfeld und das Logo des Thailändischen Golfverbands, dem der Club historisch angehört (Gründung 2007). Das visuelle Design der Karte folgt dem Corporate Design der Webseite und entwickelt sich über die Jahre mit. Unverändert ist das Format selbst — Kreditkartengröße, seit Beginn dasselbe.

Die Karte ist das, was du im Pro-Shop oder am Counter vorzeigst — kompakt, wiedererkennbar, seit über 15 Jahren im Kreditkartenformat im Einsatz.`,
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
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 60 W -> ~121 W. User-corrections 2026-04-23:
  // (1) Gründungsjahr = 2007 (not "gut 15 Jahre", exact); (2) die Exoten
  // waren echte Einzelfälle, keine Pattern — ursprünglicher Expat/Reisende-
  // Entwurf war Spekulation und wurde verworfen. Neue Frame: internationale
  // Spannbreite ist Nebeneffekt der Bauart, nicht Marketingziel.
  // Abgrenzung zu FAQ 396 (Wieviele Mitglieder): dort Fokus auf Zahl +
  // Community-Größe, hier Fokus auf Geografie + "warum die Leute hier landen".
  // ---------------------------------------------------------------------------
  {
    slug: "wo-kommen-die-mitglieder-her",
    question: "Wo kommen die Mitglieder her?",
    answer: `Die Mehrheit unserer Mitglieder lebt im DACH-Raum — Deutschland, Österreich, Schweiz — mit einem leichten Schwerpunkt in Österreich. Historisch gehört Thailand dazu: der Club ist dort 2007 gegründet worden, die Handicap-Verwaltung hatte lange ihren Sitz vor Ort.

Dazu kommen über die Jahre einzelne Exoten: Mitglieder in Brasilien, Italien, England, Dänemark, Indien. Das waren echte Einzelfälle — keine Gruppe, kein Muster, keine Community, die sich über Mundpropaganda fortsetzt. Jede dieser Mitgliedschaften hat ihre eigene, unwiederholbare Geschichte. Diese Reichweite ist kein strategisches Marketingziel, sondern ein reiner Nebeneffekt der Bauart: Wer mit der Oakwood-Fernmitgliedschaft Golf spielen möchte, kann das von überall auf der Welt aus — wir verschicken die Mitgliederkarte weltweit.

Gemeinsam ist allen Mitgliedern: eine klassische lokale Vereinsbindung passt nicht zur eigenen Situation. Die Fernmitgliedschaft schon.`,
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
    answer: `Am einfachsten über das [Anmeldeformular](/mitglied-werden) — dort fragen wir alle nötigen Angaben ab und du bekommst nach dem Absenden eine Bestätigung per E-Mail. Kein Telefongespräch, kein Probemonat, keine Interviewrunde — das Formular ist der ganze Weg rein.

Wir brauchen:

- Name — so, wie er auf der Mitgliederkarte stehen soll
- Eigene E-Mail-Adresse — möglichst privat, nicht beruflich. Berufliche Adressen wechseln, wir wollen dich auch in einem Jahr für die Verlängerung erreichen können.
- Postanschrift für den Kartenversand
- Dein Handicap — als Selbstauskunft, ohne Verifizierung durch uns
- Dein gewünschtes Startdatum — das Enddatum ergibt sich daraus automatisch (12 Monate, plus die Rundungs-Regel auf das Monatsende des Folgemonats)

Nach dem Absenden: Bestätigung per Mail, Zahlung auf dem gewählten Weg, Karte im wöchentlichen Druck-Rhythmus und per Post. Ab dem Startdatum bist du Mitglied — der richtige Moment, um die Karte das erste Mal einzusetzen.`,
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
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 71 W -> ~145 W. Additions: reminder-mail
  // signal im Intro (customer load low), Handicap-Selbstauskunft-Hinweis
  // (D9-consistent), Pause-Optionen erweitert auf Jahreswechsel + Reiseplan,
  // Post-Submit-Ablauf transparent (consistent with FAQ #2, #6), alte
  // Karte behalten mit user-confirmed Begründung (Ablaufdatum = natural
  // invalidation, daher unkritisch als Andenken).
  // ---------------------------------------------------------------------------
  {
    slug: "wie-kann-ich-die-mitgliedschaft-verlaengern",
    question: "Wie kann ich die Mitgliedschaft verlängern?",
    answer: `Am einfachsten über das [Verlängerungsformular](/mitgliedschaft-verlaengern) — aktuelle Daten eintragen, absenden, Bestätigung per E-Mail. Vor Ablauf erinnern wir dich per E-Mail, du musst dir nichts im Kalender merken.

Wir brauchen:

- Aktuelle E-Mail-Adresse — möglichst privat, nicht beruflich. Berufliche Adressen wechseln, wir wollen dich auch im nächsten Jahr für die Verlängerung erreichen können.
- Aktuelle Postanschrift — falls sich diese in den letzten 12 Monaten geändert hat
- Dein Handicap — als Selbstauskunft wie beim ersten Signup
- Wunsch-Startdatum der neuen 12 Monate — nahtlos oder mit Pause, z. B. zum nächsten Frühling oder passend zu deinem Reiseplan

Nach dem Absenden: Bestätigung per Mail, Zahlung auf dem gewählten Weg, Karte im wöchentlichen Druck-Rhythmus. Die neue Karte kommt per Post; die alte kannst du behalten — auf ihr steht ein Ablaufdatum, sie verliert ihre Funktion. In 15 Jahren hat kein Mitglied eine Karte zurückgeschickt — als Andenken offenbar willkommener als im Papierkorb.`,
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
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 63 W -> ~123 W. User-corrections:
  // (1) Karten sind vorgedruckte Rohlinge mit Logo/Layout/Farben drauf,
  //     nur Name/Handicap/Enddatum werden in Gold aufgedruckt (NICHT
  //     "beidseitig farbig in Deutschland gedruckt" — das war Spekulation).
  // (2) "Per Post" statt "Mit der Deutschen Post" (Carrier-neutral).
  // (3) International: 1-2 Wochen (nicht 1-3).
  // New content: Personalisierungs-Absatz erklärt den Druck-Prozess, plus
  // international-Bullet + international-Fallback im Eskalations-Satz
  // (konsistent mit FAQ wo-kommen-die-mitglieder-her, die internationale
  // Mitglieder referenziert).
  // ---------------------------------------------------------------------------
  {
    slug: "wie-lange-dauert-es-bis-die-clubkarte-bei-mir-eintrifft",
    question: "Wie lange dauert es, bis die Mitgliederkarte bei mir ankommt?",
    answer: `Nach Zahlungseingang drucken und verschicken wir in der Regel einmal pro Woche — bei Bedarf auch schneller. Wichtig für die Gesamt-Zeitrechnung: Bei Banküberweisung dauert der Zahlungseingang 2–3 Werktage; bei sofortigen Zahlungsarten geht der Versandprozess direkt los.

Wie die Personalisierung läuft: Die Karten liegen als vorgedruckte Rohlinge bereit — Logo, Layout und Farben sind schon drauf. Aufgebracht wird nur noch dein Name, dein Handicap und das Enddatum deiner Mitgliedschaft, und zwar in Golddruck. Das dauert pro Karte wenige Minuten, wir bündeln sie aber zu einem wöchentlichen Druck- und Versand-Rhythmus.

Lieferzeit per Post:

- Deutschland: 2–3 Werktage
- Österreich / Schweiz: 3–7 Werktage
- Außerhalb DACH: 1–2 Wochen je nach Zielland

Wenn du nach 7–10 Tagen innerhalb DACH (bzw. 2 Wochen international) noch keine Karte hast, [melde dich](/kontakt) — wir schauen nach.`,
    category: "karte",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // B13 Content-Pass (2026-04-18): rewrite for wpId 394 "Wie kann ich
  // die Mitgliedschaft kündigen". Original had typo ("scheibt" statt
  // "schreibt"), Grammatik-Bug ("zum Enddatum dass" → "das"), Stil-Mix
  // (3. Person + "Ihr" gemischt statt Du). User decisions 2026-04-18:
  // (1B) 1-2× Reminder wie Original; (2A) Kernaussage wiederholen obwohl
  // Auto-Renewal-FAQ ähnliches sagt — FAQs sind Intent-basiert, nicht
  // DRY-basiert; (3A) /kontakt-Link; (4A) "keine Lastschrift" als
  // Trust-Signal explizit drinlassen.
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 66 W -> ~146 W. User-confirmed policy:
  // vorzeitig aussteigen geht via Geld-zurück-Garantie "ohne Wenn und Aber",
  // in 15 Jahren 3-4x insgesamt genutzt. Das Trust-Signal wird prominent
  // nach vorn gezogen statt als defensive Ausnahme erwähnt. P2-Tonalität
  // ("Kein Entkommen-Gefühl, keine Schuldfrage") betont die bewusste
  // Design-Entscheidung gegen Retention-Dark-Patterns.
  // ---------------------------------------------------------------------------
  {
    slug: "wie-kann-ich-die-mitgliedschaft-kuendigen",
    question: "Wie kann ich die Mitgliedschaft kündigen?",
    answer: `Eine Kündigung ist nicht notwendig. Die Mitgliedschaft läuft auf 12 Monate und endet automatisch zum Enddatum, das auf deiner Karte angedruckt ist. Keine automatische Verlängerung, keine Fristen, keine Lastschrift — du musst nichts aktiv abbestellen.

Rechtzeitig vor Ablauf schreiben wir dich 1–2 Mal per E-Mail an und bieten dir die Verlängerung an. Antwortest du nicht, läuft die Mitgliedschaft einfach aus. Kein Entkommen-Gefühl, kein erzwungenes Nein, keine Schuldfrage — das ist gewollt.

Wenn du trotzdem ausdrücklich schriftlich kündigen möchtest (z. B. für dein Privataktenarchiv oder weil dein Firmenadministrator eine formale Abmeldung braucht): Eine [kurze Mail über das Kontaktformular](/kontakt) reicht. Wir bestätigen per Antwort.

Vorzeitig aus einer laufenden Mitgliedschaft aussteigen geht — wir haben eine Geld-zurück-Garantie ohne Wenn und Aber. In der Praxis wird das extrem selten genutzt: in 15 Jahren drei- bis viermal insgesamt. Aber die Tür steht offen, wenn dir etwas Wichtiges dazwischenkommt. [Melde dich](/kontakt), wir regeln das unbürokratisch.`,
    category: "mitgliedschaft",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 120-150-word expansion for AI-citation
  // sweet spot. Previous version (8 words) was too thin for citation-
  // readiness. Draws on the same DACH/Thailand/Exoten geography as FAQ 181
  // but adds Community-Stability-Signal (churn roughly neutral) and
  // positioning ("überschaubare gewachsene Community"). Kept honest:
  // "rund zehn Länder" is a claim worth verifying if the number drifts.
  // ---------------------------------------------------------------------------
  {
    slug: "wieviele-mitglieder-hat-der-club-im-deutschsprachigen-raum",
    question: "Wie viele Mitglieder hat der Club im deutschsprachigen Raum?",
    answer: `Im DACH-Raum sind es rund 300 aktive Mitglieder — verteilt über Deutschland, Österreich und die Schweiz mit einem leichten Schwerpunkt in Österreich. Diese Zahl ist über die letzten Jahre stabil geblieben: in etwa so viele Neuzugänge wie Austritte pro Jahr, was dafür spricht, dass Mitglieder, die einmal dabei sind, gerne bleiben. Zum Vergleich: 300 Mitglieder entspricht etwa der Größe eines mittelgroßen Lokalclubs — nur dass unsere Mitglieder über drei Kontinente verteilt spielen.

Dazu kommen historisch Mitglieder in Thailand — dem Ursprungsland des Clubs — sowie vereinzelte Mitglieder in Brasilien, Italien, England, Dänemark und Indien. Weltweit ist die Fernmitgliedschaft damit in rund zehn Ländern präsent, das DACH-Segment bleibt das mit Abstand größte und aktivste.

Du trittst also einer überschaubaren, über die Jahre gewachsenen Community bei — nicht einem anonymen Massenverband.`,
    category: "mitglieder",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): 120-150-word expansion over B13's
  // polish-only pass. Adds the date-mechanic ("ein Monat Bonus" framing)
  // with concrete example (10. Juni -> Ende Juli Folgejahr) and the
  // Pro-Rata / Saison-Kappung clarification that was implicit before.
  // Closer to "Portugal im Winter, Alpen im Sommer, Thailand ganzjährig"
  // echoes the club's Thailand-origin DNA.
  // ---------------------------------------------------------------------------
  {
    slug: "laeuft-die-mitgliedschaft-fuer-ein-kalenderjahr-1-1-31-12-oder-fuer-ein-jahr-ab-",
    question: "Läuft die Mitgliedschaft für ein Kalenderjahr (1.1.–31.12.) oder für ein Jahr ab Eintrittsdatum?",
    answer: `Die Mitgliedschaft läuft nicht nach Kalenderjahr (also nicht von Januar bis Dezember), sondern ab deinem Wunsch-Eintrittsdatum für mindestens 12 Monate. Den Anfang wählst du, das Enddatum ergibt sich daraus.

Zur Datums-Mechanik: Wir runden das Enddatum im Normalfall auf das Monatsende des folgenden Monats auf. Ein Beispiel — trittst du am 10. Juni bei, läuft die Mitgliedschaft bis Ende Juli des Folgejahres. Das sind rund 13 statt 12 Monate. Diese Ein-Monat-Bonus-Regel gilt seit Gründung für jede Mitgliedschaft; pünktlich am Ersten beitreten bringt dir also keine Vorteile.

Praktisch heißt das: Du kannst jederzeit einsteigen und spielst zwölf Monate am Stück Golf — ohne Pro-Rata-Logik, ohne Saison-Kappung, ohne gebrochenes Erstjahr. Schließlich ist immer irgendwo gerade Saison — Portugal im Winter, Alpen im Sommer, Thailand ganzjährig.`,
    category: "mitgliedschaft",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // B13 Content-Pass (2026-04-18): polish for wpId 231 "Wird die
  // Fernmitgliedschaft akzeptiert". Original hatte "Ägypten" in der
  // Länderliste (post-2023 stale), "99%/1% der Clubs"-Framing
  // (stilistisch zu forsch für die eigentliche Message), "Du/Dein"-
  // Großschreibung statt lowercase. Behält den Greenfee-Spieler-mit-
  // Golfbag-Opener (charmant + spricht Zielgruppe an), aber glättet
  // den Rest.
  // ---------------------------------------------------------------------------
  {
    slug: "wird-die-fernmitgliedschaft-von-anderen-clubs-in-deutschland-und-international-p",
    question: "Wird die Fernmitgliedschaft von anderen Clubs in Deutschland und international akzeptiert?",
    answer: `Du bist Greenfee-Spieler, der gerne unterschiedliche Plätze spielt und oft unterwegs ist? Immer mit dem Golfbag im Kofferraum oder im Fluggepäck? Die Fernmitgliedschaft passt dazu. Unsere Mitglieder spielen in Deutschland, Österreich, Schweiz, Frankreich, Portugal, Spanien, Irland und weltweit.

Die meisten Clubs sind wirtschaftlich am Greenfee-Spiel interessiert und fragen nicht viel, solange ein Clubnachweis vorliegt — die Mitgliederkarte reicht. Der Pro-Shop prüft kurz, bucht die Runde, fertig. Das ist in Deutschland und international die Regel.

Eine kleine Minderheit bleibt bewusst auf eigene Mitglieder und deren Gäste beschränkt — private Member-Only-Clubs, High-End-Resortkurse mit Hotelbuchungspflicht, gelegentlich einzelne Matchplay-Tage, an denen grundsätzlich keine Gäste spielen. Das betrifft in der Praxis die wenigsten Plätze, und auch eine DGV- oder ÖGV-Mitgliedschaft würde dich dort nicht automatisch hineinbringen.

Faustregel: Wer Golfreise-tauglich unterwegs ist, kommt mit unserer Karte praktisch überall rein.`,
    category: "akzeptanz",
    published: true,
  },
  // ---------------------------------------------------------------------------
  // L9 Content-Pass (2026-04-23): rewrite for wpId 1065 "ÖGV-Anerkennung".
  // Original (29 words) was thin and covered only the 95% coverage claim.
  // New version answers the real user intent: "Wird ÖGV das anerkennen,
  // und komme ich auf die Plätze?" — separates the formal ÖGV-recognition
  // question (No, we're historically Thai-affiliated) from the practical
  // access question (Yes, ~95% coverage, ~5% elitär-Clubs geschlossen).
  // Same slug as faqs-wp.ts so the aggregator dedupes the WP copy.
  // ---------------------------------------------------------------------------
  {
    slug: "wird-die-mitgliedschaft-vom-oesterreichischen-golfverband-anerkannt-kann-man-ueb",
    question: "Wird die Mitgliedschaft vom Österreichischen Golfverband anerkannt? Kann man überall in Österreich spielen?",
    answer: `Eine formelle Anerkennung durch den Österreichischen Golfverband (ÖGV) gibt es nicht. Wir sind kein ÖGV-Mitgliedsclub, sondern historisch Teil des Thailändischen Golfverbands — das Logo auf der Rückseite deiner Mitgliederkarte zeigt diese Herkunft.

Praktisch heißt das: Rund 95 % der Plätze in Österreich akzeptieren die Mitgliederkarte als Clubnachweis und lassen dich als Greenfee-Spieler auf die Runde. Einige unserer Mitglieder spielen seit Jahren quer durch Österreich und haben selten Probleme — zuverlässig klappt das in allen touristisch ausgerichteten Regionen.

Die verbleibenden rund 5 % sind meist kleinere, bewusst elitär geführte Clubs, die ausschließlich eigene Mitglieder und deren Gäste zulassen. Dort würde auch eine ÖGV-Mitgliedschaft dich nicht automatisch ins Clubhaus bringen — das ist keine Oakwood-Einschränkung, sondern Clubpolitik.

Wenn du unsicher bist: ein Anruf beim Zielplatz vor der Anfahrt klärt es in zwei Minuten.`,
    category: "akzeptanz",
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
