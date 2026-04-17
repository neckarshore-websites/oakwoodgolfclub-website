"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitRenewalAction } from "@/app/mitgliedschaft-verlaengern/actions";
import {
  TextField,
  TextareaField,
  SelectField,
  ConsentField,
  HoneypotField,
} from "@/components/forms/FormField";
import {
  FormStatus,
  SubmitButton,
  type FormActionState,
} from "@/components/forms/FormStatus";
import { COUNTRY_VALUES } from "@/lib/forms/schemas";

const INITIAL: FormActionState = { ok: null };

const COUNTRY_OPTIONS = COUNTRY_VALUES.map((country) => ({
  value: country,
  label: country,
}));

export function RenewalForm() {
  const [state, formAction] = useActionState(submitRenewalAction, INITIAL);
  const errors = state.fieldErrors ?? {};

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-6"
      aria-labelledby="renewal-heading"
    >
      <HoneypotField />

      <TextField
        name="name"
        label="Name"
        required
        placeholder="Vorname Nachname"
        autoComplete="name"
        error={errors.name}
      />

      <TextField
        name="memberNumber"
        label="Mitgliedsnummer"
        required
        placeholder="Nummer unbekannt? Beliebige Zahl reicht — wir finden dich über Name + E-Mail."
        error={errors.memberNumber}
      />

      <TextField
        name="email"
        label="Aktuelle E-Mail-Adresse"
        type="email"
        inputMode="email"
        required
        placeholder="name@example.de"
        autoComplete="email"
        error={errors.email}
      />

      <TextField
        name="handicap"
        label="Aktuelles Hcp"
        required
        placeholder="z. B. 18,5"
        inputMode="decimal"
        error={errors.handicap}
      />

      <div className="flex flex-col gap-4 rounded-sm border border-[var(--color-ink)]/10 bg-[var(--color-parchment)] p-5">
        <p className="text-sm font-medium text-[var(--color-ink)]">
          Aktuelle Postanschrift
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
        <SubmitButton label="Verlängerung absenden" />
        <p className="text-xs text-[var(--color-muted)]">
          Wir prüfen deine Anfrage und schicken die aktualisierten
          Zahlungsdetails per E-Mail.
        </p>
      </div>
    </form>
  );
}
