"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitSignupAction } from "@/app/mitglied-werden/actions";
import {
  TextField,
  TextareaField,
  RadioGroupField,
  ConsentField,
  HoneypotField,
} from "@/components/forms/FormField";
import {
  FormStatus,
  SubmitButton,
  type FormActionState,
} from "@/components/forms/FormStatus";
import { PRICING } from "@/lib/site-config";

const INITIAL: FormActionState = { ok: null };

const TIER_OPTIONS = [
  {
    value: "individual",
    label: `${PRICING.individual.label} — €${PRICING.individual.priceEur} / 12 Monate`,
    hint: "1 Person, 1 Mitgliederkarte.",
  },
  {
    value: "flight",
    label: `${PRICING.flight.label} — €${PRICING.flight.priceEur} / 12 Monate`,
    hint: "4 Personen, 4 Mitgliederkarten. €35,75 pro Person statt €220.",
  },
] as const;

function nextMonthString(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function SignupForm() {
  const [state, formAction] = useActionState(submitSignupAction, INITIAL);
  const errors = state.fieldErrors ?? {};
  const [tier, setTier] = useState<string>("individual");

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-6"
      aria-labelledby="signup-heading"
    >
      <HoneypotField />

      <div className="grid gap-6 md:grid-cols-2">
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
      </div>

      <TextareaField
        name="address"
        label="Postanschrift"
        required
        hint="Straße, PLZ, Ort, Land — für den Versand der Mitgliederkarte."
        rows={3}
        error={errors.address}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          name="phone"
          label="Telefon (optional)"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone}
        />
        <TextField
          name="handicap"
          label="Dein Handicap (optional)"
          hint="Self-reported — wir übernehmen die Zahl ohne Verifizierung."
          error={errors.handicap}
        />
      </div>

      <div onChange={(e) => {
        const target = e.target as HTMLInputElement;
        if (target.name === "tier") setTier(target.value);
      }}>
        <RadioGroupField
          name="tier"
          label="Mitgliedschaftstyp"
          required
          defaultValue="individual"
          options={TIER_OPTIONS}
          error={errors.tier}
        />
      </div>

      {tier === "flight" && (
        <TextareaField
          name="additionalNames"
          label="Namen der 3 weiteren Personen"
          required
          hint="Komma-getrennt — je 1 Name pro Person."
          rows={2}
          error={errors.additionalNames}
        />
      )}

      <TextField
        name="startMonth"
        label="Gewünschter Startmonat"
        type="month"
        required
        defaultValue={nextMonthString()}
        hint="Die 12-Monats-Laufzeit beginnt an diesem Monatsersten."
        error={errors.startMonth}
      />

      <TextareaField
        name="message"
        label="Nachricht (optional)"
        rows={3}
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
