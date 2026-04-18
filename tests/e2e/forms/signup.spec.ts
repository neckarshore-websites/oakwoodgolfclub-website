/**
 * Signup-Form E2E — happy path + validation edges + honeypot silent-drop.
 *
 * The signup form has the largest field set (salutation, structured address,
 * handicap, startDate, referral). Happy-path exercises all mandatory
 * fields; validation cases target the most error-prone inputs.
 */

import { expect, test } from "@playwright/test";
import { mockSignup } from "../fixtures/mock-data";

test.describe("Signup-Form (/mitglied-werden)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/mitglied-werden");
  });

  async function fillHappyPath(
    page: import("@playwright/test").Page,
  ): Promise<void> {
    // salutation is an inline radio group — click the `Herr` label.
    await page.getByRole("radio", { name: "Herr" }).check();

    await page.locator('input[name="name"]').fill(mockSignup.name);
    await page.locator('input[name="email"]').fill(mockSignup.email);
    await page.locator('input[name="handicap"]').fill(mockSignup.handicap);
    // startDate defaults to today — leave untouched.

    await page.locator('input[name="street"]').fill(mockSignup.street);
    await page.locator('input[name="postalCode"]').fill(mockSignup.postalCode);
    await page.locator('input[name="city"]').fill(mockSignup.city);
    // country defaults to "Deutschland" — leave untouched.

    await page.getByRole("radio", { name: "Internet" }).check();

    await page.getByLabel(/AGB/i).check();
  }

  test("TC-FORM-SIG-001 happy path — vollständig ausgefüllt zeigt Success-Banner", async ({
    page,
  }) => {
    await fillHappyPath(page);

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(
      page.getByRole("status").filter({ hasText: /Zahlungsdetails/i }),
    ).toBeVisible();
  });

  test("TC-FORM-SIG-002 validation — leeres Formular zeigt multiple Server-Errors", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByText(/Name ist Pflicht/i)).toBeVisible();
    await expect(page.getByText(/Handicap ist Pflicht/i)).toBeVisible();
  });

  test("TC-FORM-SIG-003 validation — ungültige E-Mail-Adresse wird abgelehnt", async ({
    page,
  }) => {
    await fillHappyPath(page);
    await page.locator('input[name="email"]').fill("kaputt-email");

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(page.getByText(/Ungültige E-Mail-Adresse/i)).toBeVisible();
  });

  test("TC-FORM-SIG-004 validation — fehlende Consent-Checkbox wird abgelehnt", async ({
    page,
  }) => {
    await fillHappyPath(page);
    await page.getByLabel(/AGB/i).uncheck();

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(
      page.getByText(/Datenschutzhinweise bestätigen/i),
    ).toBeVisible();
  });

  test("TC-FORM-SIG-005 validation — fehlende Anrede ist OK (optional)", async ({
    page,
  }) => {
    // salutation is optional per Zod-Schema — this test locks that contract in.
    await page.locator('input[name="name"]').fill(mockSignup.name);
    await page.locator('input[name="email"]').fill(mockSignup.email);
    await page.locator('input[name="handicap"]').fill(mockSignup.handicap);
    await page.locator('input[name="street"]').fill(mockSignup.street);
    await page.locator('input[name="postalCode"]').fill(mockSignup.postalCode);
    await page.locator('input[name="city"]').fill(mockSignup.city);
    await page.getByRole("radio", { name: "Internet" }).check();
    await page.getByLabel(/AGB/i).check();

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(
      page.getByRole("status").filter({ hasText: /Zahlungsdetails/i }),
    ).toBeVisible();
  });

  test("TC-FORM-SIG-007 validation — fehlende Quelle (referralSource) ist OK (optional)", async ({
    page,
  }) => {
    // referralSource ("Wie hast Du von uns erfahren?") soll optional sein —
    // User-Entscheidung 2026-04-18 Session D: Feld nicht mehr required.
    await page.locator('input[name="name"]').fill(mockSignup.name);
    await page.locator('input[name="email"]').fill(mockSignup.email);
    await page.locator('input[name="handicap"]').fill(mockSignup.handicap);
    await page.locator('input[name="street"]').fill(mockSignup.street);
    await page.locator('input[name="postalCode"]').fill(mockSignup.postalCode);
    await page.locator('input[name="city"]').fill(mockSignup.city);
    // referralSource bewusst NICHT setzen.
    await page.getByLabel(/AGB/i).check();

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(
      page.getByRole("status").filter({ hasText: /Zahlungsdetails/i }),
    ).toBeVisible();
  });

  test("TC-FORM-SIG-006 honeypot — Bot-Submit silently dropped", async ({
    page,
  }) => {
    await fillHappyPath(page);
    // Honeypot is off-screen (absolute left:-9999px) — simulate bot fill
    // via force to skip actionability checks.
    await page
      .locator('input[name="website"]')
      .fill("http://spam.example", { force: true });

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(page.getByRole("status")).toBeVisible();
  });
});
