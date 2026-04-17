import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen für Mitglieder des Oakwood Golf Club.",
  alternates: { canonical: "/agb" },
  robots: { index: true, follow: true },
};

export default function AgbPage() {
  return (
    <PagePlaceholder
      title="Allgemeine Geschäftsbedingungen"
      blurb="AGB für Mitglieder des Oakwood Golf Club. Der finale Text wird in einer dedizierten Legal-Session eingepflegt — inklusive Leistungsumfang, Zahlungsbedingungen, Widerrufsrecht und Streitschlichtungshinweis."
      plannedBlock="Phase 1, B11"
    />
  );
}
