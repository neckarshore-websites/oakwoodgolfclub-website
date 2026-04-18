"use server";

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
import type { FormActionState } from "@/components/forms/FormStatus";

export async function submitContactAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const raw = formDataToRecord(formData);
  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      status: "validation-error",
      fieldErrors: fieldErrorsFromZod(parsed.error),
      message: "Bitte prüfe die markierten Felder.",
    };
  }

  // Silently accept honeypot hits — a real user never fills `website`.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: true, status: "blocked" };
  }

  const result = await sendFormEmail(composeContactEmail(parsed.data));

  if (!result.ok) {
    return {
      ok: false,
      status: "server-error",
      message:
        "Es gab ein technisches Problem beim Versenden. Bitte in ein paar Minuten erneut versuchen oder direkt an info@oakwoodgolfclub.de schreiben.",
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
      "Wir melden uns in der Regel innerhalb von 48 Stunden per E-Mail.",
  };
}
