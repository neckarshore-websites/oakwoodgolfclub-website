/**
 * Kontakt-Form E2E — happy path + validation edges + honeypot silent-drop.
 *
 * The form runs Server Actions (useActionState) against a Next.js App Router
 * backend. In local dev the backend has no SMTP creds and short-circuits to
 * a console.log + ok=true, which lets these tests assert on the Success
 * banner without sending real mail (Briefing §4 — 1× real SMTP at session
 * end, not per test).
 */

import { expect, test } from "@playwright/test";
import { mockContact } from "../fixtures/mock-data";

test.describe("Kontakt-Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kontakt");
  });

  test("TC-FORM-CON-001 happy path — submit mit allen Pflichtfeldern zeigt Success-Banner", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill(mockContact.name);
    await page.getByLabel("E-Mail-Adresse").fill(mockContact.email);
    await page.getByLabel("Nachricht").fill(mockContact.message);
    await page.getByLabel(/Datenschutzerklärung/).check();

    await page.getByRole("button", { name: "Nachricht senden" }).click();

    await expect(
      page.getByRole("status").filter({ hasText: /angekommen/i }),
    ).toBeVisible();
  });

  test("TC-FORM-CON-002 validation — fehlende Pflichtfelder zeigen Server-Error-Messages", async ({
    page,
  }) => {
    // Empty submit — noValidate on the form means the Server Action gets
    // called even without client-side required checks.
    await page.getByRole("button", { name: "Nachricht senden" }).click();

    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByText(/Name ist Pflicht/i)).toBeVisible();
  });

  test("TC-FORM-CON-003 validation — ungültige E-Mail-Adresse wird abgelehnt", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill(mockContact.name);
    await page.getByLabel("E-Mail-Adresse").fill("nicht-wirklich-email");
    await page.getByLabel("Nachricht").fill(mockContact.message);
    await page.getByLabel(/Datenschutzerklärung/).check();

    await page.getByRole("button", { name: "Nachricht senden" }).click();

    await expect(page.getByText(/Ungültige E-Mail-Adresse/i)).toBeVisible();
  });

  test("TC-FORM-CON-004 validation — Nachricht unter 10 Zeichen wird abgelehnt", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill(mockContact.name);
    await page.getByLabel("E-Mail-Adresse").fill(mockContact.email);
    await page.getByLabel("Nachricht").fill("zu kurz");
    await page.getByLabel(/Datenschutzerklärung/).check();

    await page.getByRole("button", { name: "Nachricht senden" }).click();

    await expect(page.getByText(/mindestens 10 Zeichen/i)).toBeVisible();
  });

  test("TC-FORM-CON-005 validation — fehlende Consent-Checkbox wird abgelehnt", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill(mockContact.name);
    await page.getByLabel("E-Mail-Adresse").fill(mockContact.email);
    await page.getByLabel("Nachricht").fill(mockContact.message);
    // Consent bewusst NICHT setzen.

    await page.getByRole("button", { name: "Nachricht senden" }).click();

    await expect(
      page.getByText(/Datenschutzhinweise bestätigen/i),
    ).toBeVisible();
  });

  // FIXME(#33): Honeypot silent-drop broken. Zod schema rejects any non-empty
  // `website` via z.string().max(0) BEFORE the Server Action's silent-drop
  // branch runs. Result: a bot (or a password-manager auto-fill) triggers a
  // visible validation-error banner instead of a silent success. Waiting on
  // user bug-inventory (Briefing §1) before fixing — likely schema relaxation
  // to z.string().optional() so the Action's explicit honeypot branch takes over.
  test.fixme("TC-FORM-CON-006 honeypot — Bot-Submit silently dropped (Success-UI, keine Verarbeitung)", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill(mockContact.name);
    await page.getByLabel("E-Mail-Adresse").fill(mockContact.email);
    await page.getByLabel("Nachricht").fill(mockContact.message);
    await page.getByLabel(/Datenschutzerklärung/).check();

    // Fill the hidden honeypot — a real user never touches this.
    // Honeypot is off-screen (absolute left:-9999px) — simulate bot fill
    // via force to skip actionability checks.
    await page
      .locator('input[name="website"]')
      .fill("http://spam.example", { force: true });

    await page.getByRole("button", { name: "Nachricht senden" }).click();

    // Server returns ok=true (silent drop) → Success banner shows. The
    // message body may be the default "innerhalb von 48 Stunden" string.
    await expect(page.getByRole("status")).toBeVisible();
  });
});
