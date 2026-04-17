import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Häufige Fragen zur Fernmitgliedschaft im Oakwood Golf Club — Handicap, Mitgliederkarte, Plätze, Verlängerung.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <PagePlaceholder
      title="Häufig gestellte Fragen"
      blurb="Die vollständige FAQ mit 15 Fragen und FAQPage-Schema.org-JSON-LD wird in B6 gebaut. Vier Kurz-Antworten findest du aktuell schon auf der Startseite."
      plannedBlock="Phase 1, B6"
    />
  );
}
