/**
 * Reusable form result + submit-button components.
 *
 * `FormStatus` renders a success or failure banner based on the action state.
 * `SubmitButton` uses `useFormStatus` to show a pending state while the
 * Server Action is running — no flicker, no double-submit.
 */

"use client";

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
    return (
      <div
        role="status"
        className="rounded-sm border border-[var(--color-fairway)]/40 bg-[var(--color-fairway)]/5 px-4 py-3 text-sm text-[var(--color-fairway)]"
      >
        <p className="font-medium">Danke — Nachricht angekommen.</p>
        <p className="mt-1 text-[var(--color-ink)]/75">
          {state.message ||
            "Wir melden uns in der Regel innerhalb von 24 Stunden per E-Mail."}
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
