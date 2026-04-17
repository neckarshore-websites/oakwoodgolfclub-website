import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktformular und direkte E-Mail-Adresse des Oakwood Golf Club.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <PagePlaceholder
      title="Kontakt"
      blurb="Kontaktformular wird in B5 gebaut. Bis dahin erreichst du uns direkt per E-Mail an info@oakwoodgolfclub.de — Antwort in der Regel innerhalb von 24 Stunden."
      plannedBlock="Phase 1, B5"
    />
  );
}
