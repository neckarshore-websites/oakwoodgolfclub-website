"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitContactAction } from "@/app/kontakt/actions";
import {
  TextField,
  TextareaField,
  ConsentField,
  HoneypotField,
} from "@/components/forms/FormField";
import {
  FormStatus,
  SubmitButton,
  type FormActionState,
} from "@/components/forms/FormStatus";

const INITIAL: FormActionState = { ok: null };

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, INITIAL);
  const errors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-6"
      aria-labelledby="kontakt-heading"
    >
      <HoneypotField />

      <TextField
        name="name"
        label="Name"
        required
        autoComplete="name"
        error={errors.name}
      />
      <TextField
        name="email"
        label="E-Mail"
        type="email"
        inputMode="email"
        required
        autoComplete="email"
        error={errors.email}
      />
      <TextareaField
        name="message"
        label="Nachricht"
        required
        hint="Was möchtest du wissen?"
        rows={6}
        error={errors.message}
      />

      <ConsentField name="consent" error={errors.consent}>
        Ich willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage
        verwendet werden. Es erfolgt keine Weitergabe an Dritte. Siehe{" "}
        <Link
          href="/datenschutz"
          className="text-[var(--color-fairway)] underline underline-offset-2 hover:text-[var(--color-fairway-hover)]"
        >
          Datenschutzerklärung
        </Link>
        .
      </ConsentField>

      <FormStatus state={state} />

      <div className="flex items-center gap-4">
        <SubmitButton label="Nachricht senden" />
        <p className="text-xs text-[var(--color-muted)]">
          Wir antworten meist innerhalb von 24 Stunden.
        </p>
      </div>
    </form>
  );
}
