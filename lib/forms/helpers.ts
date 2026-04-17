import type { z } from "zod";

/**
 * Convert a FormData payload to a plain string-record.
 * Files are intentionally dropped (we don't accept file uploads in Phase 1).
 */
export function formDataToRecord(
  formData: FormData,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Build a field-error map from a ZodError — key is the dotted path, value
 * is the first human-readable message per path. Stable across Zod 3 / 4.
 */
export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_form";
    if (!fieldErrors[key]) fieldErrors[key] = [];
    fieldErrors[key].push(issue.message);
  }
  return fieldErrors;
}
