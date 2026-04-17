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

function field(label: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) return "";
  return `${label}: ${value}\n`;
}

function multilineField(label: string, value: string | undefined): string {
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
// Signup

const TIER_LABEL: Record<SignupFormData["tier"], string> = {
  individual: "Einzelmitgliedschaft (€55 / 12 Monate)",
  flight: "Flight-Mitgliedschaft (€143 / 12 Monate, 4 Personen)",
};

export function composeSignupEmail(data: SignupFormData): EmailComposition {
  const text =
    header("Neue Mitgliedschafts-Anmeldung — oakwoodgolfclub.de") +
    field("Name", data.name) +
    field("E-Mail", data.email) +
    field("Telefon", data.phone) +
    receivedAt() +
    "\n" +
    `Mitgliedschaft: ${TIER_LABEL[data.tier]}\n` +
    field("Startmonat", data.startMonth) +
    field("Self-reported Handicap", data.handicap) +
    "\n" +
    multilineField("Postanschrift", data.address) +
    (data.tier === "flight"
      ? multilineField(
          "Weitere Personen im Flight",
          data.additionalNames,
        )
      : "") +
    multilineField("Nachricht", data.message);

  return {
    subject: `[Signup] ${data.name} — ${TIER_LABEL[data.tier]}`,
    text,
    replyTo: data.email,
  };
}

// ---------------------------------------------------------------------------
// Renewal

const TIER_CHANGE_LABEL: Record<RenewalFormData["tierChoice"], string> = {
  same: "Gleiche Mitgliedschaft wie letztes Jahr",
  individual: "Wechsel auf Einzelmitgliedschaft (€55 / 12 Monate)",
  flight: "Wechsel auf Flight-Mitgliedschaft (€143 / 12 Monate)",
};

export function composeRenewalEmail(
  data: RenewalFormData,
): EmailComposition {
  const text =
    header("Mitgliedschaft — Verlängerung — oakwoodgolfclub.de") +
    field("Name", data.name) +
    field("E-Mail (aktuell)", data.email) +
    field("Mitglieds-Referenz", data.memberReference) +
    receivedAt() +
    "\n" +
    `Option: ${TIER_CHANGE_LABEL[data.tierChoice]}\n` +
    field("Neuer Startmonat", data.startMonth) +
    "\n" +
    multilineField("Nachricht", data.message);

  return {
    subject: `[Renewal] ${data.name}`,
    text,
    replyTo: data.email,
  };
}
