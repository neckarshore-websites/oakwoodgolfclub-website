import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { HONEYPOT_FELD, honeypotAusgeloest } from "../../lib/forms/honeypot";
import {
  contactFormSchema,
  renewalFormSchema,
  signupFormSchema,
} from "../../lib/forms/schemas";

/**
 * Guards for the hidden trap field of contact, signup and renewal
 * (planning L-1102-B-HONEYPOT-REST, same fix as grafowerk-website#24).
 *
 * 1. The field name carries no word a browser or password manager autofills.
 * 2. The rendered field uses that name and no visible "Website" label.
 * 3. A filled trap is dropped and logged with the form name only, never with
 *    anything the visitor typed; empty or whitespace is not a drop.
 * 4. Each of the three actions asks the trap through the logged path.
 * 5. Each schema keeps the field under the new name, so the action receives it.
 *
 * WHAT THIS CANNOT DO: prove that no real browser fills the new field. Only a
 * submit from a browser with autofill switched on shows that.
 */

const WURZEL = process.cwd();
const lies = (pfad: string) => readFileSync(join(WURZEL, pfad), "utf8");

let checks = 0;
function check(name: string, fn: () => void): void {
  fn();
  checks++;
  console.log(`ok - ${name}`);
}

check("the trap field carries no word autofill looks for", () => {
  assert.doesNotMatch(
    HONEYPOT_FELD,
    /url|web|site|home|name|mail|phone|tel|fon|firm|company|addr|adress|city|zip|plz|user|login/i,
  );
});

check("the rendered field uses the constant and drops the old label", () => {
  const feld = lies("components/forms/FormField.tsx");
  assert.match(feld, /name=\{HONEYPOT_FELD\}/);
  assert.doesNotMatch(feld, /name="website"/);
  assert.doesNotMatch(feld, /Website \(/);
});

check("a filled trap is dropped and logged without anything the visitor typed", () => {
  const zeilen: unknown[] = [];
  const warn = console.warn;
  console.warn = (zeile: unknown) => zeilen.push(zeile);
  try {
    assert.equal(honeypotAusgeloest(undefined, "kontakt"), false);
    assert.equal(honeypotAusgeloest("", "kontakt"), false);
    assert.equal(honeypotAusgeloest("   ", "kontakt"), false);
    assert.equal(zeilen.length, 0);
    assert.equal(honeypotAusgeloest("http://geheim.example", "mitglied-werden"), true);
  } finally {
    console.warn = warn;
  }
  assert.deepEqual(zeilen, ["[forms] honeypot drop: mitglied-werden"]);
});

const AKTIONEN = [
  ["app/kontakt/actions.ts", "kontakt"],
  ["app/mitglied-werden/actions.ts", "mitglied-werden"],
  ["app/mitgliedschaft-verlaengern/actions.ts", "mitgliedschaft-verlaengern"],
] as const;

check("each action asks the trap through the logged path", () => {
  for (const [pfad, formular] of AKTIONEN) {
    const aktion = lies(pfad);
    assert.match(
      aktion,
      new RegExp(`if \\(honeypotAusgeloest\\(parsed\\.data\\[HONEYPOT_FELD\\], "${formular}"\\)\\)`),
      `${pfad} does not use the logged trap check`,
    );
    assert.doesNotMatch(aktion, /parsed\.data\.website/, `${pfad} still reads the old field`);
  }
});

check("each schema passes the trap through under the new name", () => {
  for (const schema of [contactFormSchema, signupFormSchema, renewalFormSchema]) {
    assert.ok(HONEYPOT_FELD in schema.shape, "schema lost the trap field");
    assert.ok(!("website" in schema.shape), "schema still carries the old field");
  }
});

console.log(`${checks} checks passed`);
