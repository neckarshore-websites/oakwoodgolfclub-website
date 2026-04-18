/**
 * L3 SMTP full-send smoke — sends real mail through the full compose +
 * send pipeline for all three forms (Kontakt, Signup, Renewal). Two
 * messages per form: the notification to SMTP_TO and the autoresponder
 * back to the caller-supplied test address.
 *
 * Run from repo root:
 *   npm run smoke:send -- --confirm-real-send
 *   npm run smoke:send -- --confirm-real-send --to=test@example.com
 *
 * Guard rails:
 *   - Requires `--confirm-real-send` because this REALLY sends email.
 *     Without the flag the script refuses to run and exits 1.
 *   - Default test-recipient is `g@rauhut.com` (User's private address,
 *     explicitly approved for smoke-testing in the session briefing).
 *     Override with `--to=<email>` for CI or alt-mailbox testing.
 *
 * What lands where:
 *   - 3 notifications → SMTP_TO (= info@oakwoodgolfclub.de by default)
 *   - 3 autoresponders → the --to address
 *   Each mail carries the run-ID and ISO timestamp in the free-text
 *   field so individual runs are easy to locate in the inbox.
 *
 * Exit codes:
 *   0 — all 6 sends succeeded
 *   1 — config missing, flag missing, or any send failed
 *
 * Why this does NOT go through the Server Actions:
 *   The Server Actions are thin wrappers around Zod validation + compose*
 *   + send*. The Zod layer is compile-time asserted by the TS types on
 *   the mock data below. The actual SMTP pipeline — compose, transport,
 *   IONOS delivery, envelope/reply-to headers — is what we care about
 *   here, and that is exactly what this script exercises. Form-UI end-
 *   to-end (HTTP POST to the action from the rendered page) is covered
 *   by a manual pass in the browser against the production URL.
 */
import { sendAutoresponse, sendFormEmail } from "../lib/email/send.ts";
import {
  composeContactAutoresponse,
  composeContactEmail,
  composeRenewalAutoresponse,
  composeRenewalEmail,
  composeSignupAutoresponse,
  composeSignupEmail,
} from "../lib/email/templates.ts";
import { getSmtpConfig } from "../lib/email/client.ts";
import type {
  ContactFormData,
  RenewalFormData,
  SignupFormData,
} from "../lib/forms/schemas.ts";

type CliArgs = {
  confirm: boolean;
  to: string;
};

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const confirm = args.includes("--confirm-real-send");
  const toArg = args.find((a) => a.startsWith("--to="));
  const to = toArg ? toArg.slice("--to=".length) : "g@rauhut.com";
  return { confirm, to };
}

function buildRunId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  return `LINUS-E2E-${ts}`;
}

function traceBlock(runId: string, stamp: string, to: string): string {
  return [
    "--- SMOKE TRACE ---",
    `Run-ID: ${runId}`,
    `Timestamp: ${stamp}`,
    `Autoresponder-Target: ${to}`,
    "Herkunft: scripts/smoke-smtp-send.ts",
    "Zweck: Pipeline-Verifikation vor DNS-Cutover.",
    "--- END TRACE ---",
  ].join("\n");
}

function startDateIn30Days(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function buildMockData(runId: string, stamp: string, to: string) {
  const trace = traceBlock(runId, stamp, to);

  const contact: ContactFormData = {
    name: "Linus Smoke-Test",
    email: to,
    message: `Kontakt-Formular Smoke-Test. Keine echte Anfrage — bitte ignorieren.\n\n${trace}`,
    consent: "on",
    website: "",
  };

  const signup: SignupFormData = {
    salutation: "divers",
    name: "Linus Smoke-Test",
    email: to,
    handicap: "28,4",
    startDate: startDateIn30Days(),
    street: "Teststraße 42",
    postalCode: "70173",
    city: "Stuttgart",
    country: "Deutschland",
    referralSource: "sonstiges",
    referredBy: "",
    group: `SMOKE ${runId}`,
    message: `Signup-Formular Smoke-Test. Kein echter Mitgliedsantrag.\n\n${trace}`,
    consent: "on",
    website: "",
  };

  const renewal: RenewalFormData = {
    name: "Linus Smoke-Test",
    memberNumber: `SMOKE-${runId}`,
    email: to,
    handicap: "28,4",
    street: "Teststraße 42",
    postalCode: "70173",
    city: "Stuttgart",
    country: "Deutschland",
    message: `Renewal-Formular Smoke-Test. Keine echte Verlängerung.\n\n${trace}`,
    consent: "on",
    website: "",
  };

  return { contact, signup, renewal };
}

type SendStep = {
  label: string;
  run: () => Promise<{ ok: boolean; reason?: string }>;
};

async function main() {
  const { confirm, to } = parseArgs();

  if (!confirm) {
    console.error(
      "[smoke:send] Refusing to run without --confirm-real-send flag.",
    );
    console.error(
      "  Usage: npm run smoke:send -- --confirm-real-send [--to=<email>]",
    );
    process.exit(1);
  }

  const config = getSmtpConfig();
  if (!config) {
    console.error("[smoke:send] SMTP env vars missing — cannot send.");
    console.error(
      "  Populate .env.local with SMTP_* vars (see scripts/smoke-smtp-connect.ts header for instructions).",
    );
    process.exit(1);
  }

  const stamp = new Date().toISOString();
  const runId = buildRunId();
  const mocks = buildMockData(runId, stamp, to);

  console.log(`[smoke:send] Run-ID            : ${runId}`);
  console.log(`[smoke:send] Timestamp         : ${stamp}`);
  console.log(`[smoke:send] Notification → to : ${config.to} (SMTP_TO)`);
  console.log(`[smoke:send] Autoresponse → to : ${to}`);
  console.log("");

  const steps: SendStep[] = [
    {
      label: "[Kontakt]  notify     ",
      run: () => sendFormEmail(composeContactEmail(mocks.contact)),
    },
    {
      label: "[Kontakt]  autoresp   ",
      run: () => sendAutoresponse(to, composeContactAutoresponse(mocks.contact)),
    },
    {
      label: "[Signup]   notify     ",
      run: () => sendFormEmail(composeSignupEmail(mocks.signup)),
    },
    {
      label: "[Signup]   autoresp   ",
      run: () => sendAutoresponse(to, composeSignupAutoresponse(mocks.signup)),
    },
    {
      label: "[Renewal]  notify     ",
      run: () => sendFormEmail(composeRenewalEmail(mocks.renewal)),
    },
    {
      label: "[Renewal]  autoresp   ",
      run: () => sendAutoresponse(to, composeRenewalAutoresponse(mocks.renewal)),
    },
  ];

  const results: { label: string; ok: boolean; reason?: string }[] = [];

  for (const step of steps) {
    process.stdout.write(`[smoke:send] ${step.label} ... `);
    try {
      const r = await step.run();
      results.push({ label: step.label, ok: r.ok, reason: r.reason });
      console.log(r.ok ? "OK" : `FAIL (${r.reason ?? "unknown"})`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      results.push({ label: step.label, ok: false, reason });
      console.log(`THREW (${reason})`);
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log("");
  console.log(
    `[smoke:send] Result: ${results.length - failed.length}/${results.length} sends succeeded.`,
  );

  if (failed.length > 0) {
    console.error("[smoke:send] Failures:");
    for (const f of failed) console.error(`  ${f.label}: ${f.reason}`);
    process.exit(1);
  }

  console.log(
    `[smoke:send] DONE — verify in inbox (${config.to}) and (${to}), search for: ${runId}`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("[smoke:send] Uncaught:", err);
  process.exit(1);
});
