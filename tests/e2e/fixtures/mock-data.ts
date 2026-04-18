/**
 * Mock form data — shared across Kontakt / Signup / Renewal specs.
 *
 * Values are synthetic (Data-Discipline rule: never real member data) and
 * carry a Playwright-run tag so any accidental inbox delivery is easy to
 * trace back to an E2E run vs. a real member submission.
 *
 * Email: `testing@oakwoodgolfclub.de` (User-owned IMAP-fähiges Test-Postfach
 * seit 2026-04-18). Vorher war das `linus-playwright@example.test` — RFC
 * 2606 reserviertes TLD, also effektiv /dev/null für Autoresponder. Jetzt
 * landen beide Mail-Seiten auf echter Infrastruktur: Notification an
 * `info@`, Autoresponder an `testing@` — beide IMAP-lesbar für UAT-
 * Durchsicht und laufende Produktions-Smoke-Visibility.
 *
 * Der Name "Linus Playwright" und die Nachrichten-Prefix "Automated E2E
 * run <ID>" bleiben — so erkennt der Admin in den Inboxen sofort was von
 * einem Test kommt vs. einer echten Kunden-Eingabe.
 */

const runId = `E2E-${Date.now()}`;

export const mockContact = {
  name: "Linus Playwright",
  email: "testing@oakwoodgolfclub.de",
  message: `Automated E2E run ${runId} — please ignore, Playwright happy-path test.`,
};

export const mockSignup = {
  salutation: "herr", // inline radio value
  name: "Linus Playwright",
  email: "testing@oakwoodgolfclub.de",
  handicap: "18,5",
  // startDate defaults to today via SignupForm — leave untouched in happy-path
  street: "Beispielstraße 42",
  postalCode: "70173",
  city: "Stuttgart",
  country: "Deutschland",
  referralSource: "internet",
  referredBy: "",
  group: "",
  message: `Automated E2E run ${runId} — please ignore.`,
};

export const mockRenewal = {
  name: "Linus Playwright",
  memberNumber: "999999",
  email: "testing@oakwoodgolfclub.de",
  handicap: "18,5",
  street: "Beispielstraße 42",
  postalCode: "70173",
  city: "Stuttgart",
  country: "Deutschland",
  message: `Automated E2E run ${runId} — please ignore.`,
};

export const RUN_ID = runId;
