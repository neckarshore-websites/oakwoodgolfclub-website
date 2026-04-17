import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Mitglied werden",
  description:
    "Fernmitgliedschaft im Oakwood Golf Club beantragen. Einzel 55 Euro / Jahr, Flight 143 Euro / Jahr für 4 Personen.",
  alternates: { canonical: "/mitglied-werden" },
};

export default function MitgliedWerdenPage() {
  return (
    <PagePlaceholder
      title="Mitglied werden"
      blurb="Das Signup-Formular wird in B5 gebaut (Server Action → E-Mail an info@). Aktuell ist der Signup-Flow noch auf der bestehenden Website — bitte dort starten oder direkt per E-Mail an info@oakwoodgolfclub.de anfragen."
      plannedBlock="Phase 1, B5"
    />
  );
}
