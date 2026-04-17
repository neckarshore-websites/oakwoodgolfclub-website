import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Blog des Oakwood Golf Club: Handicapverwaltung, Golfplätze, Equipment, Training und Golfkultur.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <PagePlaceholder
      title="Blog"
      blurb="Das Blog-System (Markdown-in-Repo + Kategorie-Filter) wird in B8 gebaut. Anschließend werden in B9 die 20 bestehenden Blog-Posts aus 2020–2025 aus WordPress migriert (inkl. SEO-Optimierung A+B+D und URL-Redirects)."
      plannedBlock="Phase 1, B8+B9"
    />
  );
}
