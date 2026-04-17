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
