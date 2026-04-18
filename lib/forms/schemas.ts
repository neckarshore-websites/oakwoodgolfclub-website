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
 */

const nameField = z
  .string({ message: "Name ist Pflicht." })
  .trim()
  .min(1, "Name ist Pflicht.")
  .max(100, "Name ist zu lang.");

const emailField = z
  .email({ message: "Ungültige E-Mail-Adresse." })
  .max(200, "E-Mail-Adresse ist zu lang.");

const consentField = z.literal("on", {
  message: "Bitte die Datenschutzhinweise bestätigen.",
});

// Honeypot — accepts empty string or missing; rejects anything else on the
// server. Silent-drop logic lives in the Server Action (schema still passes
// because a bot submission is usually still valid on other fields).
const honeypotField = z.string().max(0, "").optional().or(z.literal(""));

// Shared start-date format — YYYY-MM-DD from <input type="date">, must be
// today or later. We don't look further ahead than ~5 years to catch
// fat-finger typos.
const startDateField = z
  .string({ message: "Startdatum ist Pflicht." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte ein gültiges Datum wählen.")
  .refine((value) => {
    const selected = new Date(`${value}T00:00:00`);
    if (Number.isNaN(selected.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxYears = new Date();
    maxYears.setFullYear(maxYears.getFullYear() + 5);
    return selected >= today && selected <= maxYears;
  }, "Startdatum muss zwischen heute und 5 Jahren in der Zukunft liegen.");

// ---------------------------------------------------------------------------
// Kontakt — general inquiry.

export const contactFormSchema = z.object({
  name: nameField,
  email: emailField,
  message: z
    .string({ message: "Nachricht ist Pflicht." })
    .trim()
    .min(10, "Bitte mindestens 10 Zeichen.")
    .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen)."),
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
  // Optional on the legacy form — keep it that way.
  salutation: z.enum(SALUTATION_VALUES).optional().or(z.literal("")),

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

  message: z
    .string()
    .trim()
    .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen).")
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

  message: z
    .string()
    .trim()
    .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen).")
    .optional()
    .or(z.literal("")),

  consent: consentField,
  website: honeypotField,
});

export type RenewalFormData = z.infer<typeof renewalFormSchema>;
