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
    // Dev / preview without creds — log the composed email so local runs
    // still give feedback about what would have been sent.
    // In production this branch means we forgot to set env vars in Vercel
    // — the Server Action still returns ok=true to the user (they shouldn't
    // eat a 500 because of a config slip) but we log loudly for ops.
    console.warn(
      "[email/send] SMTP not configured — logging composition instead.",
    );
    console.info("[email/send] subject:", composition.subject);
    console.info("[email/send] reply-to:", composition.replyTo);
    console.info("[email/send] body:\n" + composition.text);
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
    console.warn(
      "[email/autoresponse] SMTP not configured — logging composition instead.",
    );
    console.info("[email/autoresponse] to:", to);
    console.info("[email/autoresponse] subject:", composition.subject);
    console.info("[email/autoresponse] reply-to:", composition.replyTo);
    console.info("[email/autoresponse] body:\n" + composition.text);
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
