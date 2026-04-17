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
];
