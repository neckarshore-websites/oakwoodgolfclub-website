import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Rechtliche Angaben gemäß § 5 TMG für den Oakwood Golf Club.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <PagePlaceholder
      title="Impressum"
      blurb="Rechtliche Angaben gemäß § 5 TMG. Der finale Impressums-Text wird in einer dedizierten Legal-Session eingepflegt — inklusive korrekter Anschrift, Vertretungsberechtigung und Haftungsausschluss."
      plannedBlock="Phase 1, B11"
    />
  );
}
