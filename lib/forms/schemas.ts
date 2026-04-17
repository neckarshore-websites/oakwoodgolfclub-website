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

// Shared startmonth format — YYYY-MM, must be current month or later.
const startMonthField = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Format: JJJJ-MM (z. B. 2026-07).")
  .refine((value) => {
    const [yearStr, monthStr] = value.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const selected = new Date(year, month - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return selected >= thisMonth;
  }, "Startmonat muss der aktuelle Monat oder später sein.");

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
// Signup — new membership.

export const signupFormSchema = z
  .object({
    name: nameField,
    email: emailField,
    address: z
      .string({ message: "Adresse ist Pflicht." })
      .trim()
      .min(10, "Bitte vollständige Adresse angeben (Straße, PLZ, Ort, Land).")
      .max(500, "Adresse ist zu lang."),
    phone: z.string().trim().max(50, "Telefonnummer ist zu lang.").optional(),
    handicap: z
      .string()
      .trim()
      .max(10, "Handicap-Wert ist zu lang.")
      .optional(),
    tier: z.enum(["individual", "flight"], {
      message: "Bitte Mitgliedschaftstyp wählen.",
    }),
    additionalNames: z
      .string()
      .trim()
      .max(500, "Zu viele Zeichen — bitte Namen komma-getrennt eingeben.")
      .optional(),
    startMonth: startMonthField,
    message: z
      .string()
      .trim()
      .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen).")
      .optional(),
    consent: consentField,
    website: honeypotField,
  })
  .refine(
    (data) =>
      data.tier !== "flight" ||
      (data.additionalNames !== undefined &&
        data.additionalNames.trim().length > 0),
    {
      path: ["additionalNames"],
      message:
        "Für Flight bitte die Namen der 3 weiteren Personen angeben (komma-getrennt).",
    },
  );

export type SignupFormData = z.infer<typeof signupFormSchema>;

// ---------------------------------------------------------------------------
// Renewal — existing member.

export const renewalFormSchema = z.object({
  name: nameField,
  email: emailField,
  memberReference: z
    .string({ message: "Mitglieds-Referenz ist Pflicht." })
    .trim()
    .min(1, "Bitte Mitglieds-ID oder bisherige E-Mail-Adresse angeben.")
    .max(200, "Referenz ist zu lang."),
  tierChoice: z.enum(["same", "individual", "flight"], {
    message: "Bitte Mitgliedschafts-Option wählen.",
  }),
  startMonth: startMonthField,
  message: z
    .string()
    .trim()
    .max(5000, "Nachricht ist zu lang (max. 5000 Zeichen).")
    .optional(),
  consent: consentField,
  website: honeypotField,
});

export type RenewalFormData = z.infer<typeof renewalFormSchema>;
