/**
 * Reusable form result + submit-button components.
 *
 * `FormStatus`       — inline success/failure banner (shown in-place of the
 *                       submit area while the form stays visible).
 * `FormSuccessPanel` — takes over the form entirely on success: clears the
 *                       visible form state and shows a prominent Thank-You.
 * `SubmitButton`     — pending state via `useFormStatus` — no flicker,
 *                       no double-submit.
 */

"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

export type FormActionState = {
  ok: boolean | null;
  /** Machine-readable outcome surfaced by the Server Action. */
  status?: "success" | "validation-error" | "server-error" | "blocked";
  /** Field-level Zod errors, keyed by field name. */
  fieldErrors?: Record<string, string[] | undefined>;
  /** Human-facing message for banner display. */
  message?: string;
};

export function FormStatus({ state }: { state: FormActionState }) {
  if (state.ok === null) return null;

  if (state.ok) {
    // Success is handled via FormSuccessPanel one level up; the inline banner
    // stays only as a fallback (e.g. honeypot-blocked which returns ok=true
    // but shouldn't show the big "Thank-you" panel).
    return (
      <div
        role="status"
        className="rounded-sm border border-[var(--color-fairway)]/40 bg-[var(--color-fairway)]/5 px-4 py-3 text-sm text-[var(--color-fairway)]"
      >
        <p className="font-medium">Danke — Nachricht angekommen.</p>
        <p className="mt-1 text-[var(--color-ink)]/75">
          {state.message ||
            "Wir melden uns in der Regel innerhalb von 48 Stunden per E-Mail."}
        </p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-sm border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <p className="font-medium">
        Das hat nicht geklappt.
      </p>
      <p className="mt-1 text-red-900/80">
        {state.message ||
          "Bitte prüfe die markierten Felder und versuche es noch einmal."}
      </p>
    </div>
  );
}

/**
 * Big success panel that REPLACES the form after a successful submit.
 *
 * User-Feedback 2026-04-18: Eine leere Form nach erfolgreichem Submit war
 * verwirrend — sah aus als sei nichts passiert. Stattdessen ersetzen wir
 * die Form durch einen expliziten Thank-You-Block mit:
 *   - großer Überschrift zum Formular-Kontext ("Vielen Dank für deine …")
 *   - kurzer Erklärung was als Nächstes passiert (48h + E-Mail)
 *   - Link zurück zur Startseite
 *
 * Dadurch ist aus User-Sicht klar: Die Eingabe ist angekommen und verarbeitet.
 */
export function FormSuccessPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-sm border border-[var(--color-fairway)]/30 bg-[var(--color-fairway)]/5 px-6 py-10 text-center md:px-10 md:py-14"
    >
      <div
        aria-hidden
        className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-fairway)]/15"
      >
        <svg
          className="h-6 w-6 text-[var(--color-fairway)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="font-heading text-2xl leading-tight tracking-tight text-[var(--color-ink)] md:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/75 md:text-lg">
        {description}
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[var(--color-fairway)] underline underline-offset-4 hover:text-[var(--color-fairway-hover)]"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </section>
  );
}

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex items-center justify-center rounded-sm bg-[var(--color-fairway)] px-6 py-3 text-base font-medium text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-fairway-hover)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Wird gesendet…" : label}
    </button>
  );
}
