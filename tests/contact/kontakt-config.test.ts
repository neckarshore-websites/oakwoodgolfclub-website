import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { CAPTCHA_AKTIV, KONTAKT, TURNSTILE_SITEKEY } from "../../lib/kontakt-config";
import { captchaSitekey, verifyCaptchaToken } from "../../lib/captcha/verify";
import { getSmtpConfig } from "../../lib/email/client";

/**
 * Guards for lib/kontakt-config.ts, the readable mail and captcha settings
 * (planning #2879, same pattern as goldoni-website#233).
 *
 * 1. No secret in the file that is readable on purpose.
 * 2. No code reads the old variables, or the unreadable Vercel values keep winning.
 * 3. The mail transport takes everything but the password from the config.
 * 4. The captcha widget appears only where its secret exists.
 * 5. Production fails closed without the captcha secret, a preview does not.
 * 6. All three forms get their site key from a server page. Signup and renewal
 *    are covered by no live submit (the nightly prod run skips it, the CI run has
 *    no secret), so a page that forgets the prop would reject every member
 *    unnoticed: production has a secret but the form has no widget.
 *
 * WHAT THIS CANNOT DO: prove the production values are right. Only a live submit
 * through the form, arriving in the club's mailbox, does that.
 */

const WURZEL = process.cwd();
const lies = (pfad: string) => readFileSync(join(WURZEL, pfad), "utf8");
const QUELLE = lies("lib/kontakt-config.ts");

let checks = 0;
async function check(name: string, fn: () => void | Promise<void>): Promise<void> {
  await fn();
  checks++;
  console.log(`ok - ${name}`);
}

function quellen(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const pfad = join(dir, name);
    if (statSync(pfad).isDirectory()) return quellen(pfad);
    return /\.(ts|tsx|mjs|js)$/.test(name) ? [pfad] : [];
  });
}

async function mitUmgebung<T>(
  werte: Record<string, string | undefined>,
  fn: () => T | Promise<T>,
): Promise<T> {
  const umgebung = process.env as Record<string, string | undefined>;
  const vorher = Object.fromEntries(Object.keys(werte).map((k) => [k, umgebung[k]]));
  const setze = (paare: Record<string, string | undefined>) => {
    for (const [k, v] of Object.entries(paare)) {
      if (v === undefined) delete umgebung[k];
      else umgebung[k] = v;
    }
  };
  setze(werte);
  try {
    return await fn();
  } finally {
    setze(vorher);
  }
}

async function main(): Promise<void> {
  await check("kontakt-config.ts names no secret variable or field", () => {
    const variable = QUELLE.match(/\b[A-Z0-9_]*(PASS|SECRET|TOKEN|PASSWORD|PASSWORT)[A-Z0-9_]*\b/g);
    assert.equal(variable, null, `secret variable name in kontakt-config.ts: ${variable}`);
    const feld = QUELLE.match(/\b\w*(pass|passwort|password|secret|geheim|token)\w*\s*:/gi);
    assert.equal(feld, null, `secret field in kontakt-config.ts: ${feld}`);
  });

  await check("values are complete and have the measured shape", () => {
    assert.equal(KONTAKT.smtpHost, "smtp.ionos.de");
    assert.equal(KONTAKT.smtpUser, "info@oakwoodgolfclub.de");
    assert.ok(
      KONTAKT.absender === KONTAKT.smtpUser || KONTAKT.absender.includes(`<${KONTAKT.smtpUser}>`),
      "IONOS refuses a sender other than the logged-in mailbox",
    );
    assert.match(KONTAKT.empfaenger, /^[a-z0-9._-]+@oakwoodgolfclub\.de$/);
    assert.ok(KONTAKT.smtpPort > 0 && KONTAKT.smtpPort < 65536);
    assert.match(TURNSTILE_SITEKEY, /^0x4[A-Za-z0-9_-]+$/, "not a production site key");
  });

  await check("no source file reads the old non-secret variables", () => {
    const ALT = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_FROM",
      "SMTP_TO",
      "NEXT_PUBLIC_TURNSTILE_SITEKEY",
      "CAPTCHA_ENABLED",
      "NEXT_PUBLIC_CAPTCHA_ENABLED",
    ];
    const dateien = ["app", "components", "lib", "scripts"].flatMap((d) => quellen(join(WURZEL, d)));
    assert.ok(dateien.length > 50, `only ${dateien.length} source files found, wrong directory?`);
    for (const datei of dateien) {
      const text = readFileSync(datei, "utf8");
      for (const name of ALT) {
        assert.ok(!text.includes(`process.env.${name}`), `${datei} still reads ${name}`);
      }
    }
  });

  await check("the mail transport takes everything but the password from the config", async () => {
    assert.equal(
      await mitUmgebung({ SMTP_PASSWORD: undefined }, () => getSmtpConfig()),
      null,
      "without the password no mail may be sent",
    );
    // Stale values of the old variables must change nothing.
    const config = await mitUmgebung(
      { SMTP_PASSWORD: "x", SMTP_HOST: "falsch.example", SMTP_TO: "falsch@example.com" },
      () => getSmtpConfig(),
    );
    assert.ok(config);
    assert.equal(config.host, KONTAKT.smtpHost);
    assert.equal(config.port, KONTAKT.smtpPort);
    assert.equal(config.user, KONTAKT.smtpUser);
    assert.equal(config.from, KONTAKT.absender);
    assert.equal(config.to, KONTAKT.empfaenger);
  });

  await check("the mail transport refuses to log in without TLS", () => {
    // Port 587 starts unencrypted. Without requireTLS a stripped STARTTLS would send
    // the mailbox password in the clear.
    assert.match(lies("lib/email/client.ts"), /requireTLS: true/);
  });

  await check("captcha widget appears only where its secret exists", () => {
    assert.equal(CAPTCHA_AKTIV, true);
    assert.equal(captchaSitekey({}), null);
    assert.equal(captchaSitekey({ TURNSTILE_SECRET_KEY: "" }), null);
    assert.equal(captchaSitekey({ TURNSTILE_SECRET_KEY: "x" }), TURNSTILE_SITEKEY);
  });

  await check("production fails closed without the captcha secret, a preview does not", async () => {
    const leise = console.error;
    const leise2 = console.warn;
    console.error = () => {};
    console.warn = () => {};
    try {
      const prod = await mitUmgebung(
        { NODE_ENV: "production", VERCEL_ENV: "production", TURNSTILE_SECRET_KEY: undefined },
        () => verifyCaptchaToken("x"),
      );
      assert.equal(prod.ok, false);
      const ausserhalb = await mitUmgebung(
        { NODE_ENV: "production", VERCEL_ENV: undefined, TURNSTILE_SECRET_KEY: undefined },
        () => verifyCaptchaToken("x"),
      );
      assert.equal(ausserhalb.ok, false, "a production build outside Vercel must fail closed");
      const vorschau = await mitUmgebung(
        { NODE_ENV: "production", VERCEL_ENV: "preview", TURNSTILE_SECRET_KEY: undefined },
        () => verifyCaptchaToken("x"),
      );
      assert.equal(vorschau.ok, true);
    } finally {
      console.error = leise;
      console.warn = leise2;
    }
  });

  await check("all three forms get their site key from a server page", () => {
    const FORMULARE: Record<string, string> = {
      ContactForm: "app/kontakt/page.tsx",
      SignupForm: "app/mitglied-werden/page.tsx",
      RenewalForm: "app/mitgliedschaft-verlaengern/page.tsx",
    };
    for (const [formular, seite] of Object.entries(FORMULARE)) {
      const text = lies(seite);
      // A client page would run the secret check in the browser, where it is always null.
      assert.doesNotMatch(text, /^\s*["']use client["']/m, `${seite} must stay a server component`);
      assert.match(
        text,
        new RegExp(`<${formular}\\s+turnstileSitekey=\\{captchaSitekey\\(\\)\\}\\s*/>`),
        `${seite} does not hand captchaSitekey() to ${formular}`,
      );
      const form = lies(`components/forms/${formular}.tsx`);
      assert.match(form, /<Turnstile sitekey=\{turnstileSitekey\} \/>/, `${formular} drops the key`);
    }
  });

  console.log(`${checks} checks passed`);
}

main().catch((fehler) => {
  console.error(fehler);
  process.exit(1);
});
