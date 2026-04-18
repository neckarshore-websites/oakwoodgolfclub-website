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

const divider = "-".repeat(72);

export type EmailComposition = {
  subject: string;
  text: string;
  replyTo: string;
};

function header(title: string): string {
  return `${divider}\n${title}\n${divider}\n`;
}

const EMPTY_PLACEHOLDER = "—";

/**
 * Always-render single-line field. Leere Werte werden als "—" gezeigt,
 * damit der Admin in der CRM-Ansicht ALLE Felder sieht (User-Feedback
 * 2026-04-18 nach UAT: fehlende optionale Felder waren im Plaintext
 * unsichtbar → man konnte nicht unterscheiden ob der User nichts
 * angegeben hat oder ob das Feld vom Backend verschluckt wurde).
 */
function field(label: string, value: string | undefined | null): string {
  const display =
    value && String(value).trim().length > 0 ? value : EMPTY_PLACEHOLDER;
  return `${label}: ${display}\n`;
}

function multilineField(
  label: string,
  value: string | undefined | null,
): string {
  const hasContent = value && String(value).trim().length > 0;
  return `${label}:\n${hasContent ? value : EMPTY_PLACEHOLDER}\n\n`;
}

function receivedAt(): string {
  const now = new Date();
  const iso = now.toISOString();
  return `Empfangen: ${iso}\n`;
}

/**
 * Rohdatensatz-Block fürs Admin-Ende: Divider + Label + Divider + JSON.
 * Erlaubt Copy-Paste in CRM / Script ohne Parsing des Plain-Text-Layouts.
 *
 * `expectedKeys` definiert die stabile Schlüsselliste pro Formular, damit
 * der Admin IMMER alle Felder sieht — leere / nicht ausgefüllte Werte
 * stehen als leerer String `""` im JSON statt komplett zu fehlen
 * (User-Feedback 2026-04-18 nach UAT). Honeypot-Feld `website` wird
 * NICHT in die Keys aufgenommen.
 */
function rawDataBlock<T extends Record<string, unknown>>(
  data: T,
  expectedKeys: ReadonlyArray<keyof T>,
): string {
  const normalized: Record<string, unknown> = {};
  for (const key of expectedKeys) {
    const value = data[key];
    normalized[String(key)] = value === undefined || value === null ? "" : value;
  }
  const json = JSON.stringify(normalized, null, 2);
  return (
    "\n" +
    divider +
    "\nRohdatensatz (JSON)\n" +
    divider +
    "\n" +
    json +
    "\n"
  );
}

const CONTACT_DATA_KEYS = [
  "name",
  "email",
  "message",
  "consent",
] as const satisfies ReadonlyArray<keyof ContactFormData>;

const SIGNUP_DATA_KEYS = [
  "salutation",
  "name",
  "email",
  "handicap",
  "startDate",
  "street",
  "postalCode",
  "city",
  "country",
  "referralSource",
  "referredBy",
  "group",
  "message",
  "consent",
] as const satisfies ReadonlyArray<keyof SignupFormData>;

const RENEWAL_DATA_KEYS = [
  "name",
  "memberNumber",
  "email",
  "handicap",
  "street",
  "postalCode",
  "city",
  "country",
  "message",
  "consent",
] as const satisfies ReadonlyArray<keyof RenewalFormData>;

// ---------------------------------------------------------------------------
// Kontakt

export function composeContactEmail(data: ContactFormData): EmailComposition {
  const text =
    header("Kontakt / Contact — oakwoodgolfclub.de") +
    field("Name", data.name) +
    field("E-Mail", data.email) +
    receivedAt() +
    field("Datenschutz zugestimmt", data.consent ? "Ja" : "Nein") +
    "\n" +
    multilineField("Nachricht", data.message) +
    rawDataBlock(data, CONTACT_DATA_KEYS);

  return {
    subject: "OGC - Kontakt / Contact",
    text,
    replyTo: data.email,
  };
}

// ---------------------------------------------------------------------------
// Signup — mirrors the legacy WordPress form field-for-field.

const SALUTATION_LABEL: Record<SignupFormData["salutation"], string> = {
  herr: "Herr",
  frau: "Frau",
  divers: "Divers",
  keine_angabe: "Keine Angabe",
};

// referralSource is optional (Session D: user may skip — schema is
// `.enum(...).optional().or(z.literal(""))`, so the type unions in `""` and
// `undefined`). The lookup below is guarded by a truthy check before use;
// the `""` entry is kept defensively and mirrors SALUTATION_LABEL's style.
const REFERRAL_LABEL: Record<NonNullable<SignupFormData["referralSource"]>, string> = {
  empfehlung: "Empfehlung",
  internet: "Internet",
  sonstiges: "Sonstiges",
  "": "",
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

  const referralLabel = data.referralSource
    ? REFERRAL_LABEL[data.referralSource]
    : "";

  const text =
    header("Neuanmeldung / Signup — oakwoodgolfclub.de") +
    field("Anrede", salutationLabel) +
    field("Name", data.name) +
    field("E-Mail", data.email) +
    field("Handicap", data.handicap) +
    field("Gewünschtes Startdatum", formatStartDate(data.startDate)) +
    receivedAt() +
    field("AGB + Datenschutz zugestimmt", data.consent ? "Ja" : "Nein") +
    "\n" +
    multilineField("Postanschrift", formatAddress(data)) +
    field("Wie gefunden", referralLabel) +
    field("Geworben durch", data.referredBy) +
    field("Gruppe", data.group) +
    "\n" +
    multilineField("Nachricht", data.message) +
    rawDataBlock(data, SIGNUP_DATA_KEYS);

  return {
    subject: "OGC - Neuanmeldung / Signup",
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
    header("Verlängerung / Renewal — oakwoodgolfclub.de") +
    field("Name", data.name) +
    field("Mitgliedsnummer", data.memberNumber) +
    field("Aktuelle E-Mail", data.email) +
    field("Aktuelles Handicap", data.handicap) +
    receivedAt() +
    field("AGB + Datenschutz zugestimmt", data.consent ? "Ja" : "Nein") +
    "\n" +
    multilineField("Aktuelle Postanschrift", formatRenewalAddress(data)) +
    multilineField("Nachricht", data.message) +
    rawDataBlock(data, RENEWAL_DATA_KEYS);

  return {
    subject: "OGC - Verlängerung / Renewal",
    text,
    replyTo: data.email,
  };
}

// ---------------------------------------------------------------------------
// Autoresponder templates — sent back to the form-submitter as a confirmation.
//
// Rules (User-Briefing 2026-04-18 after Signup UAT):
//   - Reply-To = info@oakwoodgolfclub.de (so user-replies land in OGC inbox).
//   - Plain text only.
//   - Sentences are single logical lines — NO hard `\n` inside sentences.
//     Email clients wrap responsively. Hard-wraps at ~68 chars look broken
//     on wide mail clients and narrow phones alike.
//   - Paragraphs separated by blank line (`\n\n`).
//   - One paragraph per thought — "48h" and "Mitgliederkarte" are two
//     separate ideas, not one run-on sentence.
//   - FAQ-Link (`/faq`) für generelle Fragen, Reply-to-Mail nur für
//     Korrekturen — sonst landet alles in der Inbox und jeder Tipp-Fehler
//     löst Admin-Arbeit aus.
//   - Recap (unten nach Divider) spiegelt ALLE Formularfelder zurück, die
//     der User ausgefüllt hat, inkl. der Einwilligung. Optional-Felder mit
//     leerem Wert werden per `field()`-Helper automatisch übersprungen.
//   - Subject folgt dem Muster:
//       `oakwoodgolfclub.de - <Form> erhalten - Wie geht es weiter?`

const SIGNATURE = `Viele Grüße
Oakwood Golf Club
${SITE.url.replace(/^https?:\/\//, "")}
${SITE.email}`;

const FAQ_URL = `${SITE.url}/faq`;

/** Standard-Closing für Autoresponder — FAQ-Link + Korrekturen-Hinweis. */
const nextStepsBlock =
  `Falls du Fragen hast, schau bitte in unserer FAQ vorbei:\n` +
  `${FAQ_URL}\n\n` +
  `Bei Korrekturen antworte einfach auf diese E-Mail.`;

function autoresponseFooter(): string {
  return (
    "\n" +
    divider +
    "\n" +
    "Diese E-Mail wurde automatisch versendet als Bestätigung deiner Eingabe auf oakwoodgolfclub.de. Falls du dieses Formular nicht selbst abgeschickt hast, kannst du diese E-Mail einfach ignorieren — wir verarbeiten ohne Antwort keine Daten weiter.\n"
  );
}

export function composeContactAutoresponse(
  data: ContactFormData,
): EmailComposition {
  const recap =
    field("Name", data.name) +
    field("E-Mail", data.email) +
    "\n" +
    multilineField("Nachricht", data.message) +
    field("Datenschutz zugestimmt", data.consent ? "Ja" : "Nein");

  const text =
    `Hallo ${data.name},\n\n` +
    "danke für deine Nachricht. Sie ist bei uns angekommen.\n\n" +
    "Wir melden uns in der Regel innerhalb von 48 Stunden persönlich bei dir.\n\n" +
    nextStepsBlock +
    "\n\n" +
    SIGNATURE +
    "\n" +
    divider +
    "\nÜbersicht deiner Anfrage:\n\n" +
    recap +
    autoresponseFooter();

  return {
    subject: "oakwoodgolfclub.de - Nachricht erhalten - Wie geht es weiter?",
    text,
    replyTo: SITE.email,
  };
}

export function composeSignupAutoresponse(
  data: SignupFormData,
): EmailComposition {
  const salutationLabel = data.salutation
    ? SALUTATION_LABEL[data.salutation]
    : "";

  const referralLabel = data.referralSource
    ? REFERRAL_LABEL[data.referralSource]
    : "";

  const recap =
    field("Anrede", salutationLabel) +
    field("Name", data.name) +
    field("E-Mail", data.email) +
    field("Handicap", data.handicap) +
    field("Gewünschtes Startdatum", formatStartDate(data.startDate)) +
    "\n" +
    multilineField("Postanschrift", formatAddress(data)) +
    field("Wie gefunden", referralLabel) +
    field("Geworben durch", data.referredBy) +
    field("Gruppe", data.group) +
    "\n" +
    multilineField("Nachricht", data.message) +
    field("AGB + Datenschutz zugestimmt", data.consent ? "Ja" : "Nein");

  const text =
    `Hallo ${data.name},\n\n` +
    "vielen Dank für deine Anmeldung beim Oakwood Golf Club. Wir haben deine Daten erhalten und prüfen sie gerade.\n\n" +
    "Innerhalb von 48 Stunden bekommst du von uns eine zweite E-Mail mit den Zahlungsdetails.\n\n" +
    "Sobald deine Mitgliedschaft aktiv ist, schicken wir dir die Mitgliederkarte per Post an die angegebene Adresse.\n\n" +
    nextStepsBlock +
    "\n\n" +
    SIGNATURE +
    "\n" +
    divider +
    "\nÜbersicht deiner Anmeldedaten:\n\n" +
    recap +
    autoresponseFooter();

  return {
    subject:
      "oakwoodgolfclub.de - Neuanmeldung erhalten - Wie geht es weiter?",
    text,
    replyTo: SITE.email,
  };
}

export function composeRenewalAutoresponse(
  data: RenewalFormData,
): EmailComposition {
  const recap =
    field("Name", data.name) +
    field("Mitgliedsnummer", data.memberNumber) +
    field("E-Mail", data.email) +
    field("Aktuelles Handicap", data.handicap) +
    "\n" +
    multilineField("Aktuelle Postanschrift", formatRenewalAddress(data)) +
    multilineField("Nachricht", data.message) +
    field("AGB + Datenschutz zugestimmt", data.consent ? "Ja" : "Nein");

  const text =
    `Hallo ${data.name},\n\n` +
    "danke für deine Verlängerung beim Oakwood Golf Club. Deine Anfrage ist bei uns angekommen.\n\n" +
    "Innerhalb von 48 Stunden bekommst du von uns eine zweite E-Mail mit den Zahlungsdetails für die neue Saison.\n\n" +
    "Auf Wunsch schicken wir dir nach erfolgter Zahlung eine aktualisierte Mitgliederkarte zu.\n\n" +
    nextStepsBlock +
    "\n\n" +
    "Bei Änderungen (Adresse, E-Mail, Bankverbindung) antworte ebenfalls einfach auf diese E-Mail.\n\n" +
    SIGNATURE +
    "\n" +
    divider +
    "\nÜbersicht deiner Daten:\n\n" +
    recap +
    autoresponseFooter();

  return {
    subject:
      "oakwoodgolfclub.de - Verlängerung erhalten - Wie geht es weiter?",
    text,
    replyTo: SITE.email,
  };
}
