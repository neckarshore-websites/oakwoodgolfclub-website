import type {
  ContactFormData,
  SignupFormData,
  RenewalFormData,
} from "@/lib/forms/schemas";
import { SITE } from "@/lib/site-config";

/**
 * Plain-text email templates — intentionally no HTML.
 *
 * Two flavours:
 *
 * 1) Notification templates (compose*Email)        — go to info@oakwoodgolfclub.de.
 *    The receiving Outlook on the user's side is CRM, not a design target;
 *    plain text survives every quoting/forwarding flow and is easier to parse
 *    into CRM-templates. Lines are wrapped at ~76 chars where practical.
 *
 * 2) Autoresponder templates (compose*Autoresponse) — go to the form-submitter.
 *    Same rationale: plain text reads correctly in every mail client,
 *    survives Spam-filters better than HTML-only mails, and matches the
 *    "small business, real reply" tone we want.
 *    Reply-To stays at info@ so a user-reply lands in the OGC inbox, not
 *    bouncing back to themselves.
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
  divers: "Divers",
  keine_angabe: "Keine Angabe",
  "": "",
};

const REFERRAL_LABEL: Record<SignupFormData["referralSource"], string> = {
  empfehlung: "Empfehlung",
  internet: "Internet",
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

// ---------------------------------------------------------------------------
// Autoresponder templates — sent back to the form-submitter as a confirmation.
//
// Rules:
//   - Reply-To = info@oakwoodgolfclub.de (so user-replies land in OGC inbox).
//   - Plain text only.
//   - Echo back the user's own data so they have a record without having to
//     dig in their browser history.
//   - Keep the tone warm-but-businesslike. No marketing copy.

const SIGNATURE = `Viele Grüße
Oakwood Golf Club
${SITE.url.replace(/^https?:\/\//, "")}
${SITE.email}`;

function autoresponseFooter(): string {
  return (
    "\n" +
    divider +
    "\n" +
    "Diese E-Mail wurde automatisch versendet als Bestätigung deiner\n" +
    "Eingabe auf oakwoodgolfclub.de. Falls du dieses Formular nicht\n" +
    "selbst abgeschickt hast, kannst du diese E-Mail einfach ignorieren\n" +
    "— wir verarbeiten ohne Antwort keine Daten weiter.\n"
  );
}

export function composeContactAutoresponse(
  data: ContactFormData,
): EmailComposition {
  const text =
    `Hallo ${data.name},\n\n` +
    "danke für deine Nachricht. Sie ist bei uns angekommen.\n\n" +
    "Wir melden uns in der Regel innerhalb von 48 Stunden persönlich\n" +
    "bei dir. Falls es dringender ist, kannst du auch direkt auf diese\n" +
    "E-Mail antworten — sie wird gelesen.\n\n" +
    SIGNATURE +
    "\n" +
    divider +
    "\n" +
    "Deine Nachricht zur Erinnerung:\n\n" +
    data.message +
    "\n" +
    autoresponseFooter();

  return {
    subject: "Wir haben deine Nachricht erhalten — Oakwood Golf Club",
    text,
    replyTo: SITE.email,
  };
}

export function composeSignupAutoresponse(
  data: SignupFormData,
): EmailComposition {
  const recap =
    `Name: ${data.name}\n` +
    `E-Mail: ${data.email}\n` +
    `Handicap: ${data.handicap}\n` +
    `Gewünschtes Startdatum: ${formatStartDate(data.startDate)}\n\n` +
    "Postanschrift:\n" +
    formatAddress(data) +
    "\n";

  const text =
    `Hallo ${data.name},\n\n` +
    "vielen Dank für deine Anmeldung beim Oakwood Golf Club. Wir haben\n" +
    "deine Daten erhalten und prüfen sie gerade.\n\n" +
    "Innerhalb von 48 Stunden bekommst du von uns eine zweite E-Mail mit\n" +
    "den Zahlungsdetails. Sobald deine Mitgliedschaft aktiv ist, schicken\n" +
    "wir dir die Mitgliederkarte per Post an die angegebene Adresse.\n\n" +
    "Falls du Fragen hast oder etwas korrigieren möchtest, antworte\n" +
    "einfach auf diese E-Mail.\n\n" +
    SIGNATURE +
    "\n" +
    divider +
    "\n" +
    "Übersicht deiner Anmeldedaten:\n\n" +
    recap +
    autoresponseFooter();

  return {
    subject: "Anmeldung erhalten — Oakwood Golf Club",
    text,
    replyTo: SITE.email,
  };
}

export function composeRenewalAutoresponse(
  data: RenewalFormData,
): EmailComposition {
  const recap =
    `Name: ${data.name}\n` +
    `Mitgliedsnummer: ${data.memberNumber}\n` +
    `E-Mail: ${data.email}\n` +
    `Aktuelles Handicap: ${data.handicap}\n\n` +
    "Aktuelle Postanschrift:\n" +
    formatRenewalAddress(data) +
    "\n";

  const text =
    `Hallo ${data.name},\n\n` +
    "danke für deine Verlängerung beim Oakwood Golf Club. Deine Anfrage\n" +
    "ist bei uns angekommen.\n\n" +
    "Innerhalb von 48 Stunden bekommst du von uns eine zweite E-Mail mit\n" +
    "den Zahlungsdetails für die neue Saison. Auf Wunsch schicken wir dir\n" +
    "nach erfolgter Zahlung eine aktualisierte Mitgliederkarte zu.\n\n" +
    "Falls sich seit dem letzten Jahr etwas geändert hat (Adresse, E-Mail,\n" +
    "Bankverbindung) oder du Fragen hast, antworte einfach auf diese\n" +
    "E-Mail.\n\n" +
    SIGNATURE +
    "\n" +
    divider +
    "\n" +
    "Übersicht deiner Daten:\n\n" +
    recap +
    autoresponseFooter();

  return {
    subject: "Verlängerung erhalten — Oakwood Golf Club",
    text,
    replyTo: SITE.email,
  };
}
