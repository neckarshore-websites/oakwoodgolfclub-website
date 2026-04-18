"use server";

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
import type { FormActionState } from "@/components/forms/FormStatus";

export async function submitRenewalAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const raw = formDataToRecord(formData);
  const parsed = renewalFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      status: "validation-error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: "Bitte prüfe die markierten Felder.",
    };
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: true, status: "blocked" };
  }

  const result = await sendFormEmail(composeRenewalEmail(parsed.data));

  if (!result.ok) {
    return {
      ok: false,
      status: "server-error",
      message:
        "Es gab ein technisches Problem beim Versenden. Bitte in ein paar Minuten erneut versuchen oder direkt an info@oakwoodgolfclub.de schreiben.",
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
      "Wir prüfen deine Verlängerung und melden uns mit den neuen Zahlungsdetails innerhalb von 48 Stunden.",
  };
}
