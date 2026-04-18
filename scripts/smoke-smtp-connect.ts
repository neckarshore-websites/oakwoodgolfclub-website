/**
 * L2 SMTP connect smoke — verifies that our SMTP config can authenticate
 * against the IONOS mailbox. No mail is sent.
 *
 * Run from repo root:
 *   npm run smoke:smtp
 *
 * Requirements:
 *   - `.env.local` with all six SMTP_* vars populated.
 *     SMTP_PASSWORD is sensitive in Vercel and is NOT returned by
 *     `vercel env pull` — paste it manually once into `.env.local`.
 *
 * Exit codes:
 *   0 — SMTP connect + auth + TLS handshake OK
 *   1 — config missing, or connect / auth failed
 *
 * Why this is separate from `smoke:send`:
 *   `verify()` only opens the socket and authenticates; it does not relay
 *   any mail. Safe to run on every pre-launch check or in CI — no inbox
 *   noise, no SMTP rate-limit exposure.
 */
import { getSmtpConfig, getTransporter } from "../lib/email/client.ts";

async function main() {
  const config = getSmtpConfig();
  if (!config) {
    console.error("[smoke:smtp] SMTP env vars missing.");
    console.error(
      "  Required in .env.local: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, SMTP_TO",
    );
    console.error(
      "  Hint: run `npx vercel env pull .env.local --environment=production --yes`,",
    );
    console.error(
      "        then paste the SMTP_PASSWORD value manually (it is marked sensitive and pulls empty).",
    );
    process.exit(1);
  }

  const transporter = getTransporter();
  if (!transporter) {
    // Should be unreachable if config is non-null, but be explicit.
    console.error("[smoke:smtp] Transporter null despite config present.");
    process.exit(1);
  }

  const secureLabel = config.port === 465 ? "TLS implicit (465)" : "STARTTLS (587)";
  console.log(
    `[smoke:smtp] Connecting to ${config.host}:${config.port} as ${config.user} via ${secureLabel}...`,
  );

  try {
    await transporter.verify();
    console.log("[smoke:smtp] OK — SMTP connect + auth succeeded.");
    process.exit(0);
  } catch (err) {
    console.error("[smoke:smtp] FAILED — connect / auth error:");
    console.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[smoke:smtp] Uncaught:", err);
  process.exit(1);
});
