// Eyeball-smoke for autoresponder templates. Run from repo root via:
//   npx tsx scripts/smoke-autoresponse.mjs
import { composeContactAutoresponse, composeSignupAutoresponse, composeRenewalAutoresponse } from "../lib/email/templates.ts";

const contact = composeContactAutoresponse({
  name: "Max Mustermann",
  email: "max@example.com",
  message: "Habe eine Frage zur Mitgliedschaft.",
  consent: "on",
  website: "",
});

const signup = composeSignupAutoresponse({
  salutation: "herr",
  name: "Max Mustermann",
  email: "max@example.com",
  handicap: "18,5",
  startDate: "2026-05-01",
  street: "Beispielstraße 1",
  postalCode: "70173",
  city: "Stuttgart",
  country: "Deutschland",
  referralSource: "empfehlung",
  referredBy: "Erika Schmidt",
  group: "",
  message: "",
  consent: "on",
  website: "",
});

const renewal = composeRenewalAutoresponse({
  name: "Max Mustermann",
  memberNumber: "OGC-1234",
  email: "max@example.com",
  handicap: "18,5",
  street: "Beispielstraße 1",
  postalCode: "70173",
  city: "Stuttgart",
  country: "Deutschland",
  message: "",
  consent: "on",
  website: "",
});

for (const [label, comp] of [["CONTACT", contact], ["SIGNUP", signup], ["RENEWAL", renewal]]) {
  console.log("=".repeat(70));
  console.log(`${label}  subject: ${comp.subject}`);
  console.log(`${label}  reply-to: ${comp.replyTo}`);
  console.log("=".repeat(70));
  console.log(comp.text);
  console.log();
}
