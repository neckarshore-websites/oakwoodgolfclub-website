"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitSignupAction } from "@/app/mitglied-werden/actions";
import {
  TextField,
  TextareaField,
  SelectField,
  RadioGroupField,
  ConsentField,
  HoneypotField,
} from "@/components/forms/FormField";
import {
  FormStatus,
  FormSuccessPanel,
  SubmitButton,
  type FormActionState,
} from "@/components/forms/FormStatus";
import { COUNTRY_VALUES } from "@/lib/forms/schemas";

const INITIAL: FormActionState = { ok: null };

const SALUTATION_OPTIONS = [
  { value: "herr", label: "Herr" },
  { value: "frau", label: "Frau" },
  { value: "divers", label: "Divers" },
  { value: "keine_angabe", label: "Möchte ich nicht sagen" },
] as const;

const REFERRAL_SOURCE_OPTIONS = [
  { value: "empfehlung", label: "Empfehlung" },
  { value: "internet", label: "Internet" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

const COUNTRY_OPTIONS = COUNTRY_VALUES.map((country) => ({
  value: country,
  label: country,
}));

function todayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function SignupForm() {
  const [state, formAction] = useActionState(submitSignupAction, INITIAL);
  const errors = state.fieldErrors ?? {};

  if (state.ok === true && state.status === "success") {
    return (
      <FormSuccessPanel
        title="Vielen Dank für deine Anmeldung."
        description="Wir prüfen deine Angaben und schicken dir innerhalb von 48 Stunden per E-Mail die Zahlungsdetails. Sobald deine Mitgliedschaft aktiv ist, kommt die Mitgliederkarte per Post."
      />
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-6"
      aria-labelledby="signup-heading"
    >
      <HoneypotField />

      <RadioGroupField
        name="salutation"
        label="Anrede"
        inline
        options={SALUTATION_OPTIONS}
        error={errors.salutation}
      />

      <TextField
        name="name"
        label="Name"
        required
        placeholder="Vorname Nachname"
        autoComplete="name"
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
        error={errors.email}
      />

      <TextField
        name="handicap"
        label="Hcp"
        required
        placeholder="18,5"
        inputMode="decimal"
        error={errors.handicap}
      />

      <TextField
        name="startDate"
        label="Gewünschtes Startdatum"
        type="date"
        required
        defaultValue={todayString()}
        error={errors.startDate}
      />

      <div className="flex flex-col gap-4 rounded-sm border border-[var(--color-ink)]/10 bg-[var(--color-parchment)] p-5">
        <p className="text-sm font-medium text-[var(--color-ink)]">
          Postanschrift
          <span
            className="ml-1 text-[var(--color-gold-deep)]"
            aria-hidden
          >
            *
          </span>
        </p>
        <TextField
          name="street"
          label="Straße und Hausnummer"
          required
          placeholder="Beispielstraße 42"
          autoComplete="street-address"
          error={errors.street}
        />
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          <TextField
            name="postalCode"
            label="PLZ"
            required
            placeholder="12345"
            autoComplete="postal-code"
            inputMode="numeric"
            error={errors.postalCode}
          />
          <TextField
            name="city"
            label="Ort"
            required
            placeholder="Stuttgart"
            autoComplete="address-level2"
            error={errors.city}
          />
        </div>
        <SelectField
          name="country"
          label="Land"
          required
          defaultValue="Deutschland"
          options={COUNTRY_OPTIONS}
          error={errors.country}
        />
      </div>

      <RadioGroupField
        name="referralSource"
        label="Wie hast Du von uns erfahren?"
        options={REFERRAL_SOURCE_OPTIONS}
        inline
        error={errors.referralSource}
      />

      <TextField
        name="referredBy"
        label="Geworben durch"
        placeholder="Name des Mitglieds (optional)"
        autoComplete="off"
        error={errors.referredBy}
      />

      <TextField
        name="group"
        label="Gruppe"
        placeholder="Gruppenanmeldung? Name der Gruppe (optional)"
        autoComplete="off"
        error={errors.group}
      />

      <TextareaField
        name="message"
        label="Nachricht"
        placeholder="Was sollten wir noch wissen?"
        rows={4}
        error={errors.message}
      />

      <ConsentField name="consent" error={errors.consent}>
        Ich habe die{" "}
        <Link
          href="/agb"
          className="text-[var(--color-fairway)] underline underline-offset-2 hover:text-[var(--color-fairway-hover)]"
        >
          AGB
        </Link>{" "}
        und die{" "}
        <Link
          href="/datenschutz"
          className="text-[var(--color-fairway)] underline underline-offset-2 hover:text-[var(--color-fairway-hover)]"
        >
          Datenschutzerklärung
        </Link>{" "}
        gelesen und stimme zu.
      </ConsentField>

      <FormStatus state={state} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <SubmitButton label="Anmeldung absenden" />
        <p className="text-xs text-[var(--color-muted)]">
          Nach der Anmeldung schicken wir dir Zahlungsdetails per E-Mail.
          Die Mitgliedschaft wird mit Zahlungseingang aktiv.
        </p>
      </div>
    </form>
  );
}
