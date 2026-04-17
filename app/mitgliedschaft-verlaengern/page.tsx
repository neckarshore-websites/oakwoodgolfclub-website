import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Mitgliedschaft verlängern",
  description: "Bestehende Oakwood-Golf-Club-Mitgliedschaft für weitere 12 Monate verlängern.",
  alternates: { canonical: "/mitgliedschaft-verlaengern" },
};

export default function VerlaengernPage() {
  return (
    <PagePlaceholder
      title="Mitgliedschaft verlängern"
      blurb="Das Renewal-Formular wird in B5 gebaut (Server Action → E-Mail an info@). Kein Auto-Renewal — deine Verlängerung wird aktiv durch dich ausgelöst."
      plannedBlock="Phase 1, B5"
    />
  );
}
