import type {
  ContactFormData,
  SignupFormData,
  RenewalFormData,
} from "@/lib/forms/schemas";

/**
 * Plain-text email templates — intentionally no HTML.
 *
 * The receiving Outlook on the user's side is CRM, not a design target;
 * plain text survives every quoting/forwarding flow and is easier to parse
 * into CRM-templates. Lines are wrapped at ~76 chars where practical.
 */

const divider = "-".repeat(60);

export type EmailComposition = {
  subject: string;
  text: string;
  replyTo: string;
};

function header(title: string): string {
  return `${divider}\n${title}\n${divider}\n`;
}

function field(label: string, value: string | undefined | null): string {
  if (!value || value.trim().length === 0) return "";
  return `${label}: ${value}\n`;
}

function multilineField(
  label: string,
  value: string | undefined | null,
): string {
  if (!value || value.trim().length === 0) return "";
  return `${label}:\n${value}\n\n`;
}

function receivedAt(): string {
  const now = new Date();
  const iso = now.toISOString();
  return `Empfangen: ${iso}\n`;
}

// ---------------------------------------------------------------------------
// Kontakt

export function composeContactEmail(data: ContactFormData): EmailComposition {
  const text =
    header("Neue Kontaktanfrage — oakwoodgolfclub.de") +
    field("Name", data.name) +
    field("E-Mail", data.email) +
    receivedAt() +
    "\n" +
    multilineField("Nachricht", data.message);

  return {
    subject: `[Kontakt] ${data.name}`,
    text,
    replyTo: data.email,
  };
}

// ---------------------------------------------------------------------------
// Signup — mirrors the legacy WordPress form field-for-field.

const SALUTATION_LABEL: Record<NonNullable<SignupFormData["salutation"]>, string> = {
  herr: "Herr",
  frau: "Frau",
  "": "",
};

const REFERRAL_LABEL: Record<SignupFormData["referralSource"], string> = {
  persoenliche_empfehlung: "Persönliche Empfehlung",
  internetsuche: "Internetsuche",
  google: "Google",
  sonstiges: "Sonstiges",
};

function formatAddress(data: SignupFormData): string {
  return [
    data.street,
    `${data.postalCode} ${data.city}`,
    data.country,
  ].join("\n");
}

function formatStartDate(iso: string): string {
  // Convert YYYY-MM-DD → DD.MM.YYYY for the email (matches the legacy format).
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

export function composeSignupEmail(data: SignupFormData): EmailComposition {
  const salutationLabel = data.salutation
    ? SALUTATION_LABEL[data.salutation]
    : "";

  const text =
    header("Neue Mitgliedschafts-Anmeldung — oakwoodgolfclub.de") +
    field("Anrede", salutationLabel) +
    field("Name", data.name) +
    field("E-Mail", data.email) +
    field("Handicap", data.handicap) +
    field("Gewünschtes Startdatum", formatStartDate(data.startDate)) +
    receivedAt() +
    "\n" +
    multilineField("Postanschrift", formatAddress(data)) +
    field("Wie gefunden", REFERRAL_LABEL[data.referralSource]) +
    field("Geworben durch", data.referredBy) +
    field("Gruppe", data.group) +
    "\n" +
    multilineField("Nachricht", data.message);

  return {
    subject: `[Signup] ${data.name}${
      data.group ? ` — ${data.group}` : ""
    }`,
    text,
    replyTo: data.email,
  };
}

// ---------------------------------------------------------------------------
// Renewal — mirrors the legacy WordPress renewal form.
// Key differences from the old flow: address is captured as 4 structured
// fields (easier CRM entry) and the Hcp is confirmed annually.

function formatRenewalAddress(data: RenewalFormData): string {
  return [
    data.street,
    `${data.postalCode} ${data.city}`,
    data.country,
  ].join("\n");
}

export function composeRenewalEmail(
  data: RenewalFormData,
): EmailComposition {
  const text =
    header("Mitgliedschaft — Verlängerung — oakwoodgolfclub.de") +
    field("Name", data.name) +
    field("Mitgliedsnummer", data.memberNumber) +
    field("Aktuelle E-Mail", data.email) +
    field("Aktuelles Handicap", data.handicap) +
    receivedAt() +
    "\n" +
    multilineField("Aktuelle Postanschrift", formatRenewalAddress(data)) +
    multilineField("Nachricht", data.message);

  return {
    subject: `[Renewal] ${data.name}`,
    text,
    replyTo: data.email,
  };
}
