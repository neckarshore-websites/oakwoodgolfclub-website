import { Download } from "lucide-react";

/**
 * "Als Markdown" export action.
 *
 * A plain server-rendered `<a download>` pointing at the /api/export endpoint, which
 * returns the post's clean source markdown as a downloadable `.md` file. No client
 * component, no JS — it stays a link, so it costs nothing on the Lighthouse budget.
 *
 * Rendered only on blog-post pages (the only exportable surface on OGC); the endpoint
 * 404s for anything resolveExport() doesn't recognise.
 */
export function ExportButton({ path, className }: { path: string; className?: string }) {
  const href = `/api/export?path=${encodeURIComponent(path)}`;

  return (
    <a
      href={href}
      download
      aria-label="Beitrag als Markdown-Datei herunterladen"
      title="Beitrag als Markdown-Datei herunterladen"
      className={`inline-flex items-center gap-1.5 rounded-sm border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-fairway)] hover:text-[var(--color-fairway)]${
        className ? ` ${className}` : ""
      }`}
    >
      <Download size={15} aria-hidden="true" />
      Als Markdown
    </a>
  );
}
