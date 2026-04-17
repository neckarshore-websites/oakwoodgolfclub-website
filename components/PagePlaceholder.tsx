import Link from "next/link";

/**
 * Placeholder for routes that are scaffolded but not yet built (Phase 1).
 * Keeps all header links alive during local review so the user never hits a 404.
 */
export function PagePlaceholder({
  title,
  blurb,
  plannedBlock,
}: {
  title: string;
  blurb: string;
  plannedBlock: string;
}) {
  return (
    <div className="container-page py-24 md:py-32">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]">
        In Bearbeitung · {plannedBlock}
      </p>
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink)]/70">
        {blurb}
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[var(--color-fairway)] hover:text-[var(--color-fairway-hover)]"
        >
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
