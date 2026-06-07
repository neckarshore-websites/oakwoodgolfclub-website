"use server";

import { headers } from "next/headers";
import { renewalFormSchema } from "@/lib/forms/schemas";
import {
  composeRenewalEmail,
  composeRenewalAutoresponse,
} from "@/lib/email/templates";
import { sendAutoresponse, sendFormEmail } from "@/lib/email/send";
import {
  fieldErrorsFromZod,
  formDataToRecord,
} from "@/lib/forms/helpers";
import {
  CAPTCHA_FORM_FIELD,
  verifyCaptchaToken,
} from "@/lib/captcha/verify";
import { checkRateLimit } from "@/lib/ratelimit";
import type { FormActionState } from "@/components/forms/FormStatus";

export async function submitRenewalAction(
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const nextSubmitCount = (prevState.submitCount ?? 0) + 1;
  const raw = formDataToRecord(formData);
  const parsed = renewalFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      status: "validation-error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: "Bitte prüfe die markierten Felder.",
      values: raw,
      submitCount: nextSubmitCount,
    };
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: true, status: "blocked", submitCount: nextSubmitCount };
  }

  // Friendly Captcha — siehe Kontakt-Action für vollen Kontext.
  const captchaSolution = raw[CAPTCHA_FORM_FIELD];
  const captcha = await verifyCaptchaToken(captchaSolution);
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
        "Spam-Schutz konnte nicht bestätigt werden. Bitte warte einen Moment und sende die Verlängerung dann erneut ab.",
      values: raw,
      submitCount: nextSubmitCount,
    };
  }

  // Rate-Limit — siehe app/kontakt/actions.ts für den vollen Rationale.
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

  const result = await sendFormEmail(composeRenewalEmail(parsed.data));

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

  // Autoresponder — best-effort. See contact action for full rationale.
  await sendAutoresponse(
    parsed.data.email,
    composeRenewalAutoresponse(parsed.data),
  );

  return {
    ok: true,
    status: "success",
    message:
      "Wir prüfen deine Verlängerung und melden uns zeitnah mit den neuen Zahlungsdetails — in der Regel innerhalb weniger Tage.",
    submitCount: nextSubmitCount,
  };
}
