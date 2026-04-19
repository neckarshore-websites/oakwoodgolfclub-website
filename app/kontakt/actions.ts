"use server";

import { headers } from "next/headers";
import { contactFormSchema } from "@/lib/forms/schemas";
import {
  composeContactEmail,
  composeContactAutoresponse,
} from "@/lib/email/templates";
import { sendAutoresponse, sendFormEmail } from "@/lib/email/send";
import {
  fieldErrorsFromZod,
  formDataToRecord,
} from "@/lib/forms/helpers";
import {
  CAPTCHA_FORM_FIELD,
  verifyFriendlyCaptchaSolution,
} from "@/lib/captcha/verify";
import { checkRateLimit } from "@/lib/ratelimit";
import type { FormActionState } from "@/components/forms/FormStatus";

export async function submitContactAction(
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const nextSubmitCount = (prevState.submitCount ?? 0) + 1;
  const raw = formDataToRecord(formData);
  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      status: "validation-error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: "Bitte prüfe die markierten Felder.",
      // User-Eingabe zurückspielen — React 19 default-reset würde sonst
      // alle Felder leeren, was ein UX-Showstopper war.
      values: raw,
      submitCount: nextSubmitCount,
    };
  }

  // Silently accept honeypot hits — a real user never fills `website`.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: true, status: "blocked", submitCount: nextSubmitCount };
  }

  // Friendly Captcha — Proof-of-Work verification (User-Entscheidung
  // 2026-04-20). Graceful when unconfigured; fail-closed when configured.
  const captchaSolution = raw[CAPTCHA_FORM_FIELD];
  const captcha = await verifyFriendlyCaptchaSolution(captchaSolution);
  if (!captcha.ok) {
    return {
      ok: false,
      status: "validation-error",
      fieldErrors: {
        captcha: [
          "Spam-Schutz konnte nicht bestätigt werden. Bitte warte einen Moment, bis die Prüfung abgeschlossen ist, und versuche es dann erneut.",
        ],
      },
      message:
        "Spam-Schutz konnte nicht bestätigt werden. Bitte warte einen Moment und sende die Nachricht dann erneut ab.",
      values: raw,
      submitCount: nextSubmitCount,
    };
  }

  // Rate-Limit (Security-Sweep F2, 2026-04-19). Pro IP, forms-übergreifend,
  // 5 Submits pro Stunde. Kommt NACH Schema-, Honeypot- und Captcha-Checks
  // damit wir legitime Form-Errors nicht gegen das Budget zählen. Ein
  // Proxy-Header-Spoof erzeugt im schlimmsten Fall einen "anon"-Bucket.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (!checkRateLimit(`form:${ip}`)) {
    return {
      ok: false,
      status: "server-error",
      message:
        "Zu viele Anfragen von dieser Verbindung. Bitte versuche es in einer Stunde erneut oder schreibe direkt an info@oakwoodgolfclub.de.",
      values: raw,
      submitCount: nextSubmitCount,
    };
  }

  const result = await sendFormEmail(composeContactEmail(parsed.data));

  if (!result.ok) {
    return {
      ok: false,
      status: "server-error",
      message:
        "Es gab ein technisches Problem beim Versenden. Bitte in ein paar Minuten erneut versuchen oder direkt an info@oakwoodgolfclub.de schreiben.",
      values: raw,
      submitCount: nextSubmitCount,
    };
  }

  // Autoresponder — best-effort. Failure here does NOT fail the form:
  // the notification to info@ already succeeded, which is the source of
  // truth. We log the result for ops visibility.
  await sendAutoresponse(
    parsed.data.email,
    composeContactAutoresponse(parsed.data),
  );

  return {
    ok: true,
    status: "success",
    message:
      "Wir melden uns zeitnah per E-Mail — in der Regel innerhalb weniger Tage.",
    submitCount: nextSubmitCount,
  };
}
