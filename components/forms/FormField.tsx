import type { ReactNode } from "react";

/**
 * Form field primitives — label, input, error. Consistent spacing + error
 * handling so every form feels identical.
 *
 * All fields use server-validated errors surfaced via `useActionState`.
 * Client-side `required`/`type=email`/`minLength` are kept for free native
 * hints (helps screen-readers) but the authoritative check is the Zod schema.
 */

type BaseProps = {
  name: string;
  label: string;
  /** Human-readable description below the label, e.g. "Max 100 Zeichen." */
  hint?: string;
  /** Server-side error for this field. */
  error?: string | string[];
  required?: boolean;
  defaultValue?: string;
};

type TextProps = BaseProps & {
  type?: "text" | "email" | "tel" | "month";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
};

type TextareaProps = BaseProps & {
  rows?: number;
};

function FieldShell({
  name,
  label,
  hint,
  error,
  required,
  children,
}: BaseProps & { children: ReactNode }) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint ? `${name}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const normalisedError = Array.isArray(error) ? error[0] : error;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-sm font-medium text-[var(--color-ink)]"
      >
        {label}
        {required && (
          <span className="ml-1 text-[var(--color-gold-deep)]" aria-hidden>
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-[var(--color-muted)]">
          {hint}
        </p>
      )}
      <div data-described-by={describedBy}>{children}</div>
      {normalisedError && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-700"
        >
          {normalisedError}
        </p>
      )}
    </div>
  );
}

export function TextField({
  type = "text",
  autoComplete,
  inputMode,
  ...base
}: TextProps) {
  const errorId = base.error ? `${base.name}-error` : undefined;
  const hintId = base.hint ? `${base.name}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldShell {...base}>
      <input
        id={base.name}
        name={base.name}
        type={type}
        required={base.required}
        defaultValue={base.defaultValue}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={base.error ? true : undefined}
        aria-describedby={describedBy}
        className="w-full rounded-sm border border-[var(--color-ink)]/15 bg-[var(--color-parchment)] px-3 py-2 text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-fairway)] focus:outline-none focus:ring-1 focus:ring-[var(--color-fairway)]"
      />
    </FieldShell>
  );
}

export function TextareaField({ rows = 5, ...base }: TextareaProps) {
  const errorId = base.error ? `${base.name}-error` : undefined;
  const hintId = base.hint ? `${base.name}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldShell {...base}>
      <textarea
        id={base.name}
        name={base.name}
        required={base.required}
        defaultValue={base.defaultValue}
        rows={rows}
        aria-invalid={base.error ? true : undefined}
        aria-describedby={describedBy}
        className="w-full resize-y rounded-sm border border-[var(--color-ink)]/15 bg-[var(--color-parchment)] px-3 py-2 text-base leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-fairway)] focus:outline-none focus:ring-1 focus:ring-[var(--color-fairway)]"
      />
    </FieldShell>
  );
}

type SelectProps = BaseProps & {
  options: ReadonlyArray<{ value: string; label: string }>;
};

export function SelectField({ options, ...base }: SelectProps) {
  const errorId = base.error ? `${base.name}-error` : undefined;
  const hintId = base.hint ? `${base.name}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldShell {...base}>
      <select
        id={base.name}
        name={base.name}
        required={base.required}
        defaultValue={base.defaultValue}
        aria-invalid={base.error ? true : undefined}
        aria-describedby={describedBy}
        className="w-full rounded-sm border border-[var(--color-ink)]/15 bg-[var(--color-parchment)] px-3 py-2 text-base text-[var(--color-ink)] focus:border-[var(--color-fairway)] focus:outline-none focus:ring-1 focus:ring-[var(--color-fairway)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type RadioProps = {
  name: string;
  label: string;
  options: ReadonlyArray<{ value: string; label: string; hint?: string }>;
  defaultValue?: string;
  error?: string | string[];
  required?: boolean;
};

export function RadioGroupField({
  name,
  label,
  options,
  defaultValue,
  error,
  required,
}: RadioProps) {
  const errorId = error ? `${name}-error` : undefined;
  const normalisedError = Array.isArray(error) ? error[0] : error;

  return (
    <fieldset
      className="flex flex-col gap-2"
      aria-invalid={error ? true : undefined}
      aria-describedby={errorId}
    >
      <legend className="mb-1 text-sm font-medium text-[var(--color-ink)]">
        {label}
        {required && (
          <span className="ml-1 text-[var(--color-gold-deep)]" aria-hidden>
            *
          </span>
        )}
      </legend>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-start gap-3 rounded-sm border border-[var(--color-ink)]/15 bg-[var(--color-parchment)] px-3 py-2.5 text-sm hover:border-[var(--color-fairway)]/50"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={defaultValue === opt.value}
            required={required}
            className="mt-0.5 accent-[var(--color-fairway)]"
          />
          <span className="flex-1">
            <span className="font-medium">{opt.label}</span>
            {opt.hint && (
              <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
                {opt.hint}
              </span>
            )}
          </span>
        </label>
      ))}
      {normalisedError && (
        <p id={errorId} role="alert" className="text-xs text-red-700">
          {normalisedError}
        </p>
      )}
    </fieldset>
  );
}

type ConsentProps = {
  name: string;
  children: ReactNode;
  error?: string | string[];
};

export function ConsentField({ name, children, error }: ConsentProps) {
  const errorId = error ? `${name}-error` : undefined;
  const normalisedError = Array.isArray(error) ? error[0] : error;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-3 text-sm text-[var(--color-ink)]/85">
        <input
          type="checkbox"
          name={name}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="mt-0.5 accent-[var(--color-fairway)]"
        />
        <span>{children}</span>
      </label>
      {normalisedError && (
        <p id={errorId} role="alert" className="text-xs text-red-700">
          {normalisedError}
        </p>
      )}
    </div>
  );
}

/**
 * Honeypot — always hidden from real users (off-screen, tab-index-negative,
 * aria-hidden, autocomplete=off). A bot auto-filling every field leaves a
 * non-empty value here; the server silently drops those submissions.
 */
export function HoneypotField() {
  return (
    <div
      aria-hidden
      className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
    >
      <label>
        Website (leer lassen)
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
