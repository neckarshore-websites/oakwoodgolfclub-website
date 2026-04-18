"use server";

import { signupFormSchema } from "@/lib/forms/schemas";
import {
  composeSignupEmail,
  composeSignupAutoresponse,
} from "@/lib/email/templates";
import { sendAutoresponse, sendFormEmail } from "@/lib/email/send";
import {
  fieldErrorsFromZod,
  formDataToRecord,
} from "@/lib/forms/helpers";
import type { FormActionState } from "@/components/forms/FormStatus";

export async function submitSignupAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const raw = formDataToRecord(formData);
  const parsed = signupFormSchema.safeParse(raw);

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

  const result = await sendFormEmail(composeSignupEmail(parsed.data));

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
    composeSignupAutoresponse(parsed.data),
  );

  return {
    ok: true,
    status: "success",
    message:
      "Wir prüfen deine Anmeldung und schicken dir die Zahlungsdetails innerhalb von 48 Stunden per E-Mail.",
  };
}
