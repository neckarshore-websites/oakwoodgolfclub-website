import { formatUpdatedAtDe, SITE_UPDATED } from "@/lib/site-config";

/**
 * Visible "Zuletzt aktualisiert" stamp.
 *
 * Renders a muted, single-line freshness signal in the page body. Pairs
 * with the `dateModified` JSON-LD entries on Homepage / FAQ / Über-uns
 * — visible UI for humans, structured data for AI search engines.
 *
 * Default uses the global SITE_UPDATED. Pass `date` to override per page
 * if a specific section deserves its own freshness marker.
 *
 * Renders a `<time dateTime="...">` element so screen readers and
 * crawlers can parse the ISO date directly without locale ambiguity.
 */
export function UpdatedAt({
  date = SITE_UPDATED,
  className = "",
}: {
  date?: string;
  className?: string;
}) {
  return (
    <p
      className={`mt-16 text-center text-xs uppercase tracking-[0.18em] text-[var(--color-ink)]/45 ${className}`}
    >
      Zuletzt aktualisiert:{" "}
      <time dateTime={date}>{formatUpdatedAtDe(date)}</time>
    </p>
  );
}
