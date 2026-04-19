import { getSmtpConfig, getTransporter } from "@/lib/email/client";
import type { EmailComposition } from "@/lib/email/templates";

/**
 * Unified send() — SMTP in production, console-log in dev, silent-log in
 * test. Never throws — callers handle a boolean return to show the right
 * UI state.
 *
 * Why not throw on SMTP failure?
 *   A form submission shouldn't 500 the user-visible page just because our
 *   mailbox provider blipped. We log the error server-side so Vercel logs
 *   capture it and show the user a generic "versucht es erneut" state.
 *
 * Two surfaces:
 *   sendFormEmail()    — notification to the OGC inbox (config.to). The
 *                        return value gates the user-visible UI state.
 *   sendAutoresponse() — confirmation to the form-submitter. Best-effort,
 *                        result is logged but never bubbles up to the UI
 *                        — if we lose the autoresponse, the notification
 *                        already reached info@ and that is the source of
 *                        truth for the membership lifecycle.
 */

export type SendResult = {
  ok: boolean;
  /** Machine-readable reason when ok=false. User-facing strings stay in UI. */
  reason?: "no-smtp" | "smtp-error" | "unknown";
};

export async function sendFormEmail(
  composition: EmailComposition,
): Promise<SendResult> {
  const config = getSmtpConfig();
  const transporter = getTransporter();

  if (!config || !transporter) {
    // Fail-closed in production: if SMTP env vars are missing in a
    // production deploy we MUST NOT pretend the submit succeeded. The user
    // would see a "Danke" confirmation, the membership-lifecycle never
    // kicks off, and the form data is lost in the Vercel log stream.
    //
    // Dev / preview without creds: we log the subject line only (no PII)
    // so local runs give feedback that composition happened — the body
    // carries names, addresses, emails, messages and MUST NOT end up in
    // any log destination, even in development.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[email/send] SMTP not configured in production — refusing to accept submit.",
      );
      return { ok: false, reason: "no-smtp" };
    }
    console.warn(
      "[email/send] SMTP not configured — dev-only fallback (body suppressed).",
    );
    console.info("[email/send] subject:", composition.subject);
    return { ok: true, reason: "no-smtp" };
  }

  try {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: composition.replyTo,
      subject: composition.subject,
      text: composition.text,
    });
    return { ok: true };
  } catch (error) {
    console.error("[email/send] SMTP failure:", error);
    return { ok: false, reason: "smtp-error" };
  }
}

/**
 * Send a confirmation email back to the form-submitter.
 *
 * Differences vs. sendFormEmail():
 *   - `to` is the user's address (passed in), not config.to.
 *   - From / Reply-To both come from SMTP config / composition (info@) so
 *     a user-reply lands in OGC inbox, not echoing back to themselves.
 *   - Failure is logged but the caller is expected to swallow the result —
 *     the notification to info@ has already succeeded by the time we get
 *     here, so the membership-lifecycle data is safe regardless.
 *
 * The function still returns a SendResult so callers can log it for ops.
 */
export async function sendAutoresponse(
  to: string,
  composition: EmailComposition,
): Promise<SendResult> {
  const config = getSmtpConfig();
  const transporter = getTransporter();

  if (!config || !transporter) {
    // Same rationale as sendFormEmail: fail-closed in production (no silent
    // success when env is misconfigured), dev-only fallback logs subject
    // only. The user-facing `to:` is not logged — it is PII like the body.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[email/autoresponse] SMTP not configured in production — cannot send autoresponse.",
      );
      return { ok: false, reason: "no-smtp" };
    }
    console.warn(
      "[email/autoresponse] SMTP not configured — dev-only fallback (body + recipient suppressed).",
    );
    console.info("[email/autoresponse] subject:", composition.subject);
    return { ok: true, reason: "no-smtp" };
  }

  try {
    await transporter.sendMail({
      from: config.from,
      to,
      replyTo: composition.replyTo,
      subject: composition.subject,
      text: composition.text,
    });
    return { ok: true };
  } catch (error) {
    console.error("[email/autoresponse] SMTP failure:", error);
    return { ok: false, reason: "smtp-error" };
  }
}
