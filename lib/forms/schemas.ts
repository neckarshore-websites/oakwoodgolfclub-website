import { z } from "zod";

/**
 * Zod schemas for the three Phase-1 forms (Kontakt, Signup, Renewal).
 *
 * Rules shared across all forms:
 *   - Honeypot field is named `website` — real users never fill it.
 *     Bots that auto-fill every field submit with a non-empty value and get
 *     dropped silently on the server.
 *   - `consent` must equal "on" (the DSGVO-acknowledgement checkbox).
 *   - All free-text fields are length-capped to keep the email payload small
 *     and prevent accidental log-blowup.
 *   - The `message` field on every form is additionally word-capped at
 *     MAX_MESSAGE_WORDS (User-Direktive 2026-04-19): keeps the inbox-noise
 *     low and aligns with the small-business-real-reply tone of the auto-
 *     responders. Char-cap stays as a safety net for absurd input shapes
 *     (e.g. one massive whitespace-free token).
 */

export const MAX_MESSAGE_WORDS = 300;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const MESSAGE_WORD_LIMIT_ERROR = `Bitte maximal ${MAX_MESSAGE_WORDS} Wörter.`;

function withMaxWords<S extends z.ZodString>(schema: S) {
  return schema.refine((s) => countWords(s) <= MAX_MESSAGE_WORDS, {
    message: MESSAGE_WORD_LIMIT_ERROR,
  });
}

const nameField = z
  .string({ message: "Name ist Pflicht." })
  .trim()
  .min(1, "Name ist Pflicht.")
  .max(100, "Name ist zu lang.");

/**
 * TLD-Block — User-Entscheidung 2026-04-20: E-Mail-Domains auf diesen TLDs
 * ablehnen. Hintergrund: 99 % der Spam-Submissions in der Funnel-Telemetrie
 * kommen aus diesen vier Regionen. OGC-Mitglieder in Indien / Brasilien /
 * Großbritannien sind statistische Einzelfälle und nutzen ohnehin eine
 * `.com`-Adresse als Erstkontakt (Gmail, Outlook, iCloud). Der Trade-Off
 * "ggf. aussperren" ist akzeptiert.
 *
 * Check ist case-insensitive und greift nur auf den letzten TLD-Segment
 * der Domain. `user@example.com` mit `.com` → ok. `user@x.co.in` → blocked.
 */
export const BLOCKED_EMAIL_TLDS = [".ru", ".cn", ".in", ".id"] as const;

function emailHasBlockedTld(email: string): boolean {
  const atIndex = email.lastIndexOf("@");
  if (atIndex < 0) return false;
  const domain = email.slice(atIndex + 1).toLowerCase();
  return BLOCKED_EMAIL_TLDS.some((tld) => domain.endsWith(tld));
}

const emailField = z
  .email({ message: "Ungültige E-Mail-Adresse." })
  .max(200, "E-Mail-Adresse ist zu lang.")
  .refine((value) => !emailHasBlockedTld(value), {
    message:
      "Diese E-Mail-Domain wird aktuell nicht unterstützt. Bitte nutze eine andere Adresse (z. B. .com, .de).",
  });

/**
 * Consent checkbox — HTML sendet `"on"` wenn checked, nichts wenn unchecked.
 * `.transform(() => true)` normalisiert zu Boolean, damit Downstream
 * (JSON-Dump, Plaintext-Field) klarer ist: `true` statt `"on"`.
 */
const consentField = z
  .literal("on", {
    message: "Bitte die Datenschutzhinweise bestätigen.",
  })
  .transform(() => true);

// Honeypot — accepts anything the bot submits. The silent-drop check lives
// in the Server Action (`if (parsed.data.website && website.length > 0)`),
// NOT in the schema.
//
// Previously this used `z.string().max(0, "")` which rejected any non-empty
// value at parse time — but that meant a bot (or a password-manager auto-
// fill trigger) hit a visible validation-error banner instead of the
// intended silent Success-UI. The Server Action's explicit silent-drop
// branch never ran because the schema rejected the payload first.
// (Red-Green caught this in Session D — see FIXME comments removed in the
// same commit.)
const honeypotField = z.string().optional().or(z.literal(""));

// Shared start-date format — YYYY-MM-DD from <input type="date">. Must lie
// between today + 14 days and today + 5 years.
//
// Why +14 days: Quick-Fix für Compliance-Sweep H5 (Dr. Sommer, 2026-04-19).
// Ein Vertragsschluss innerhalb der 14-tägigen Widerrufsfrist ohne
// ausdrückliche Vorab-Zustimmung nach § 356 BGB würde die Widerrufsfrist
// gesetzlich auf 12 Monate + 14 Tage verlängern. Wir schieben das
// Mitgliedschafts-Startdatum über die Widerrufsfrist hinaus — damit ist
// der Vertrag bis zum Leistungsbeginn jederzeit gefahrlos widerruflich
// und die Frist läuft regulär aus.
//
// Obergrenze +5 Jahre: fat-finger-Schutz (User tippt 2066 statt 2026).
const startDateField = z
  .string({ message: "Startdatum ist Pflicht." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte ein gültiges Datum wählen.")
  .refine((value) => {
    const selected = new Date(`${value}T00:00:00`);
    if (Number.isNaN(selected.getTime())) return false;
    const minStart = new Date();
    minStart.setHours(0, 0, 0, 0);
    minStart.setDate(minStart.getDate() + 14);
    const maxYears = new Date();
    maxYears.setFullYear(maxYears.getFullYear() + 5);
    return selected >= minStart && selected <= maxYears;
  }, "Startdatum muss mindestens 14 Tage in der Zukunft liegen (Widerrufsfrist) und darf höchstens 5 Jahre in der Zukunft liegen.");

// ---------------------------------------------------------------------------
// Kontakt — general inquiry.

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  message: withMaxWords(
    z
      .string({ message: "Nachricht ist Pflicht." })
      .trim()
      .min(10, "Bitte mindestens 10 Zeichen.")
      .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen)."),
  ),
  consent: consentField,
  website: honeypotField,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ---------------------------------------------------------------------------
// Signup — new membership. Field set mirrors the legacy WordPress form 1:1
// so existing members recognise the flow; Phase-2 CRM-import stays trivial.

export const SALUTATION_VALUES = [
  "herr",
  "frau",
  "divers",
  "keine_angabe",
] as const;
export type Salutation = (typeof SALUTATION_VALUES)[number];

export const REFERRAL_SOURCE_VALUES = [
  "empfehlung",
  "internet",
  "sonstiges",
] as const;
export type ReferralSource = (typeof REFERRAL_SOURCE_VALUES)[number];

export const COUNTRY_VALUES = [
  "Deutschland",
  "Österreich",
  "Schweiz",
  "Andere",
] as const;
export type Country = (typeof COUNTRY_VALUES)[number];

export const signupFormSchema = z.object({
  // Pflichtfeld ab 2026-04-18 (User-Entscheidung nach UAT): Anrede
  // gehört in die CRM-Anrede der Zahlungs-Mail und in die postalische
  // Mitgliedskarten-Anschrift. Wer nicht ansprechbar sein will, wählt
  // bewusst "Möchte ich nicht sagen" — das ist eine der Enum-Optionen.
  salutation: z.enum(SALUTATION_VALUES, {
    message: "Bitte eine Anrede wählen.",
  }),

  name: nameField,
  email: emailField,

  // Pflichtfeld on the legacy form — we don't verify the number, but we
  // insist on one. The matching FAQ entry explains the self-reported model.
  handicap: z
    .string({ message: "Handicap ist Pflicht." })
    .trim()
    .min(1, "Handicap ist Pflicht.")
    .max(10, "Bitte nur die Zahl eingeben (z. B. 18,5)."),

  startDate: startDateField,

  // Structured address — replaces the legacy free-text textarea. Easier CRM
  // entry, clear required-marking per line.
  street: z
    .string({ message: "Straße und Hausnummer sind Pflicht." })
    .trim()
    .min(3, "Bitte Straße und Hausnummer angeben.")
    .max(200, "Straße ist zu lang."),
  postalCode: z
    .string({ message: "PLZ ist Pflicht." })
    .trim()
    .min(3, "PLZ ist zu kurz.")
    .max(10, "PLZ ist zu lang."),
  city: z
    .string({ message: "Ort ist Pflicht." })
    .trim()
    .min(1, "Ort ist Pflicht.")
    .max(100, "Ort ist zu lang."),
  country: z.enum(COUNTRY_VALUES, { message: "Bitte Land wählen." }),

  // Optional — User-Entscheidung 2026-04-18 Session D: Herkunft ist nice-to-
  // know für den User (Empfehlungen-Tracking), aber kein Signup-Blocker.
  // Zod-Pattern für optionale Enums: .optional() lässt `undefined` durch,
  // `.or(z.literal(""))` lässt den leeren FormData-String (kein Radio ausgewählt) durch.
  referralSource: z
    .enum(REFERRAL_SOURCE_VALUES)
    .optional()
    .or(z.literal("")),

  referredBy: z
    .string()
    .trim()
    .max(200, "Name ist zu lang.")
    .optional()
    .or(z.literal("")),

  // Optional — when present, User treats it as a flight/group label in CRM.
  // Individual sign-ups within the same flight still come in separately.
  group: z
    .string()
    .trim()
    .max(200, "Gruppenname ist zu lang.")
    .optional()
    .or(z.literal("")),

  message: withMaxWords(
    z
      .string()
      .trim()
      .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen)."),
  )
    .optional()
    .or(z.literal("")),

  consent: consentField,
  website: honeypotField,
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

// ---------------------------------------------------------------------------
// Renewal — existing member.

export const renewalFormSchema = z.object({
  name: nameField,

  // User's stance: required on the form (legacy UX), no format check.
  // If a member doesn't know their number they'll type anything (e.g. 1234999)
  // and the User identifies them via Name + E-Mail in Outlook.
  memberNumber: z
    .string({ message: "Mitgliedsnummer ist Pflicht." })
    .trim()
    .min(1, "Mitgliedsnummer ist Pflicht.")
    .max(50, "Mitgliedsnummer ist zu lang."),

  email: emailField,

  // "Aktuelles Hcp" — required on renewal; User wants the current value
  // for the annual handicap certificate (self-reported, not verified).
  handicap: z
    .string({ message: "Aktuelles Handicap ist Pflicht." })
    .trim()
    .min(1, "Aktuelles Handicap ist Pflicht.")
    .max(10, "Bitte nur die Zahl eingeben (z. B. 18,5)."),

  // Aktuelle Postanschrift — split into 4 structured fields to match the
  // signup form. User explicitly wants a fresh, verified address every year
  // so the printed membership card reaches the right letterbox.
  street: z
    .string({ message: "Straße und Hausnummer sind Pflicht." })
    .trim()
    .min(3, "Bitte Straße und Hausnummer angeben.")
    .max(200, "Straße ist zu lang."),
  postalCode: z
    .string({ message: "PLZ ist Pflicht." })
    .trim()
    .min(3, "PLZ ist zu kurz.")
    .max(10, "PLZ ist zu lang."),
  city: z
    .string({ message: "Ort ist Pflicht." })
    .trim()
    .min(1, "Ort ist Pflicht.")
    .max(100, "Ort ist zu lang."),
  country: z.enum(COUNTRY_VALUES, { message: "Bitte Land wählen." }),

  message: withMaxWords(
    z
      .string()
      .trim()
      .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen)."),
  )
    .optional()
    .or(z.literal("")),

  consent: consentField,
  website: honeypotField,
});

export type RenewalFormData = z.infer<typeof renewalFormSchema>;
