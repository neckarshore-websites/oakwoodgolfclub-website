import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { SITE } from "../../lib/site-config";

/**
 * Telefonnummer-Invariante (2026-08-12).
 *
 * WAS PASSIERT IST: `SITE.phone` trug "+4916038591350" — dreizehn Ziffern gegen
 * zwoelf in `SITE.phoneDisplay`. Jeder `tel:`-Link der Seite waehlte damit eine
 * Nummer, die es nicht gibt: Impressum, Datenschutz, Kontakt UND der Footer, der
 * auf jeder Seite steht. Live, bei rund 300 zahlenden Mitgliedern.
 *
 * WER ES GEFUNDEN HAT: niemand und nichts. Kein Test, kein Lint, kein Review
 * deckte `tel:`-Werte ab; es fiel bei einem zufaelligen Quervergleich mit dem
 * neckarshore-Impressum auf. Das ist der eigentliche Befund — der Tippfehler ist
 * ein Zeichen, die fehlende Pruefung war die Ursache.
 *
 * WARUM DER TEST SO GESCHNITTEN IST: die Anzeige ist die Wahrheit. Ein Mensch hat
 * `phoneDisplay` gegen Briefkopf und Visitenkarte geprueft; `phone` ist die davon
 * ABGELEITETE Maschinenform und darf nie eigene Ziffern haben. Deshalb wird nicht
 * gegen ein hartkodiertes Literal geprueft (das waere dieselbe Handpflege eine
 * Ebene tiefer), sondern die eine Beziehung zwischen beiden Feldern.
 *
 * Test 3 ist der Klassen-Teil: er verhindert, dass eine kuenftige Seite ihren
 * eigenen `tel:`-String baut und damit an dieser Invariante vorbeilaeuft.
 */

let pass = 0,
  fail = 0;
function check(label: string, fn: () => void) {
  try {
    fn();
    pass++;
    console.log(`  ok  ${label}`);
  } catch (err) {
    fail++;
    console.error(`  FAIL ${label}`);
    console.error(`       ${(err as Error).message}`);
  }
}

const digits = (s: string) => s.replace(/\D/g, "");

console.log("tests/contact/phone.test.ts");

check("phone traegt exakt die Ziffern von phoneDisplay", () => {
  assert.equal(
    digits(SITE.phone),
    digits(SITE.phoneDisplay),
    `tel:-Ziffern (${digits(SITE.phone)}) != Anzeige-Ziffern (${digits(SITE.phoneDisplay)}). ` +
      "Die Anzeige ist die Wahrheit — phone anpassen, nicht phoneDisplay.",
  );
});

check("phone ist E.164: fuehrendes + und sonst nur Ziffern", () => {
  assert.match(SITE.phone, /^\+[1-9]\d{6,14}$/, `SITE.phone = ${SITE.phone}`);
});

check("kein tel:-Link wird an SITE.phone vorbei gebaut", () => {
  const roots = ["app", "components"];
  const offenders: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(entry)) continue;
      const src = readFileSync(full, "utf-8");
      // Jedes tel: im Quelltext muss unmittelbar SITE.phone einsetzen.
      for (const m of src.matchAll(/tel:([^`"'\s)]*)/g)) {
        const value = m[1];
        if (value !== "${SITE.phone}") {
          offenders.push(`${full}: tel:${value}`);
        }
      }
    }
  };
  roots.forEach(walk);

  assert.deepEqual(
    offenders,
    [],
    "tel:-Links duerfen ausschliesslich aus SITE.phone gebaut werden, sonst greift " +
      "die Ziffern-Invariante nicht:\n  " + offenders.join("\n  "),
  );
});

check("die Pruefung ist nicht vakuum: es gibt ueberhaupt tel:-Links", () => {
  // Ohne diesen Test waere Test 3 gruen, wenn jemand alle tel:-Links entfernt
  // ODER die Verzeichnisnamen sich aendern und der Scan ins Leere laeuft.
  // Ein Guard, der nichts findet, meldet sonst dasselbe wie ein Guard, der
  // nichts zu beanstanden hat.
  let count = 0;
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(entry)) continue;
      count += [...readFileSync(full, "utf-8").matchAll(/tel:/g)].length;
    }
  };
  ["app", "components"].forEach(walk);
  assert.ok(count >= 4, `nur ${count} tel:-Vorkommen gefunden — erwartet mindestens 4`);
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
