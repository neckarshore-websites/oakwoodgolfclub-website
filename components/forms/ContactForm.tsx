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
  FormSuccessPanel,
  SubmitButton,
  type FormActionState,
} from "@/components/forms/FormStatus";
import { FriendlyCaptcha } from "@/components/forms/FriendlyCaptcha";

const INITIAL: FormActionState = { ok: null };

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, INITIAL);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  if (state.ok === true && state.status === "success") {
    return (
      <FormSuccessPanel
        title="Vielen Dank für deine Nachricht."
        description="Deine Anfrage ist bei uns angekommen. Wir melden uns zeitnah per E-Mail bei dir — in der Regel innerhalb weniger Tage."
      />
    );
  }

  // `key` remounts the <form> on jedem submit → DOM-Inputs nehmen die neuen
  // `defaultValue`-Werte auf und die Eingabe des Users geht NICHT verloren.
  return (
    <form
      key={state.submitCount ?? 0}
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
        placeholder="Vorname Nachname"
        autoComplete="name"
        defaultValue={values.name}
        error={errors.name}
      />

      <TextField
        name="email"
        label="E-Mail-Adresse"
        type="email"
        inputMode="email"
        required
        placeholder="name@example.de"
        autoComplete="email"
        defaultValue={values.email}
        error={errors.email}
      />

      <TextareaField
        name="message"
        label="Nachricht"
        required
        placeholder="Was sollten wir noch wissen?"
        rows={6}
        defaultValue={values.message}
        error={errors.message}
      />

      <ConsentField
        name="consent"
        defaultChecked={values.consent === "on"}
        error={errors.consent}
      >
        Ich habe die{" "}
        <Link
          href="/datenschutz"
          className="text-[var(--color-fairway)] underline underline-offset-2 hover:text-[var(--color-fairway-hover)]"
        >
          Datenschutzerklärung
        </Link>{" "}
        zur Kenntnis genommen.
      </ConsentField>

      <FriendlyCaptcha />

      <FormStatus state={state} />

      <div className="flex items-center gap-4">
        <SubmitButton label="Nachricht senden" />
        <p className="text-xs text-[var(--color-muted)]">
          Wir antworten in der Regel innerhalb weniger Tage.
        </p>
      </div>
    </form>
  );
}
