import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung gemäß DSGVO für den Oakwood Golf Club.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <PagePlaceholder
      title="Datenschutzerklärung"
      blurb="Datenschutzerklärung gemäß DSGVO. Der finale Text wird in einer dedizierten Legal-Session eingepflegt — inklusive Auflistung aller Drittanbieter (Vercel Web Analytics, Resend in Phase 2), Speicherfristen und Betroffenenrechten."
      plannedBlock="Phase 1, B11"
    />
  );
}
