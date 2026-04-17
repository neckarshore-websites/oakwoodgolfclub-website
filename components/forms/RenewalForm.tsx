"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitRenewalAction } from "@/app/mitgliedschaft-verlaengern/actions";
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
    value: "same",
    label: "Gleiche Mitgliedschaft wie letztes Jahr",
    hint: "Einzel oder Flight — wir übernehmen die bisherige Option.",
  },
  {
    value: "individual",
    label: `Wechsel auf Einzelmitgliedschaft — €${PRICING.individual.priceEur}`,
    hint: "1 Person, 12 Monate.",
  },
  {
    value: "flight",
    label: `Wechsel auf Flight-Mitgliedschaft — €${PRICING.flight.priceEur}`,
    hint: "4 Personen, 12 Monate.",
  },
] as const;

function nextMonthString(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

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
          label="E-Mail (aktuell)"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          error={errors.email}
        />
      </div>

      <TextField
        name="memberReference"
        label="Mitglieds-Referenz"
        required
        hint="Mitglieds-ID (falls bekannt) oder bisherige E-Mail-Adresse — damit wir dich im Bestand finden."
        error={errors.memberReference}
      />

      <RadioGroupField
        name="tierChoice"
        label="Mitgliedschafts-Option"
        required
        defaultValue="same"
        options={TIER_OPTIONS}
        error={errors.tierChoice}
      />

      <TextField
        name="startMonth"
        label="Neuer Startmonat"
        type="month"
        required
        defaultValue={nextMonthString()}
        hint="Die neue 12-Monats-Laufzeit beginnt an diesem Monatsersten."
        error={errors.startMonth}
      />

      <TextareaField
        name="message"
        label="Nachricht (optional)"
        rows={3}
        hint="Adress-Änderung, neue Telefonnummer, Hinweise für die Verlängerung — hier rein."
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
