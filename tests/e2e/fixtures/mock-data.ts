/**
 * Mock form data — shared across Kontakt / Signup / Renewal specs.
 *
 * Values are synthetic (Data-Discipline rule: never real member data) and
 * carry a Playwright-run tag so any accidental inbox delivery is easy to
 * trace back to an E2E run vs. a real member submission.
 */

const runId = `E2E-${Date.now()}`;

export const mockContact = {
  name: "Linus Playwright",
  email: "linus-playwright@example.test",
  message: `Automated E2E run ${runId} — please ignore, Playwright happy-path test.`,
};

export const mockSignup = {
  salutation: "herr", // inline radio value
  name: "Linus Playwright",
  email: "linus-playwright@example.test",
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
  email: "linus-playwright@example.test",
  handicap: "18,5",
  street: "Beispielstraße 42",
  postalCode: "70173",
  city: "Stuttgart",
  country: "Deutschland",
  message: `Automated E2E run ${runId} — please ignore.`,
};

export const RUN_ID = runId;
