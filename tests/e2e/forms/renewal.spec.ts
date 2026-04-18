/**
 * Renewal-Form E2E — happy path + validation edges + honeypot silent-drop.
 *
 * The renewal form asks an existing member to re-confirm current address +
 * handicap so the printed membership card reaches the right letterbox.
 * Member-number is required but not format-checked (User identifies via
 * name + email in Outlook when a member invents a number).
 */

import { expect, test } from "@playwright/test";
import { mockRenewal } from "../fixtures/mock-data";

test.describe("Renewal-Form (/mitgliedschaft-verlaengern)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/mitgliedschaft-verlaengern");
  });

  async function fillHappyPath(
    page: import("@playwright/test").Page,
  ): Promise<void> {
    await page.getByLabel("Name").fill(mockRenewal.name);
    await page.getByLabel("Mitgliedsnummer").fill(mockRenewal.memberNumber);
    await page
      .getByLabel("Aktuelle E-Mail-Adresse")
      .fill(mockRenewal.email);
    await page.getByLabel("Aktuelles Hcp").fill(mockRenewal.handicap);
    await page
      .getByLabel("Straße und Hausnummer")
      .fill(mockRenewal.street);
    await page.getByLabel("PLZ").fill(mockRenewal.postalCode);
    await page.getByLabel("Ort").fill(mockRenewal.city);
    await page.getByLabel(/AGB/i).check();
  }

  test("TC-FORM-REN-001 happy path — vollständig ausgefüllt zeigt Success-Banner", async ({
    page,
  }) => {
    await fillHappyPath(page);

    await page
      .getByRole("button", { name: "Verlängerung absenden" })
      .click();

    await expect(
      page.getByRole("status").filter({ hasText: /Zahlungsdetails/i }),
    ).toBeVisible();
  });

  test("TC-FORM-REN-002 validation — leeres Formular zeigt multiple Server-Errors", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Verlängerung absenden" })
      .click();

    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page.getByText(/Name ist Pflicht/i)).toBeVisible();
    await expect(page.getByText(/Mitgliedsnummer ist Pflicht/i)).toBeVisible();
  });

  test("TC-FORM-REN-003 validation — ungültige E-Mail-Adresse wird abgelehnt", async ({
    page,
  }) => {
    await fillHappyPath(page);
    await page
      .getByLabel("Aktuelle E-Mail-Adresse")
      .fill("nicht-email-format");

    await page
      .getByRole("button", { name: "Verlängerung absenden" })
      .click();

    await expect(page.getByText(/Ungültige E-Mail-Adresse/i)).toBeVisible();
  });

  test("TC-FORM-REN-004 validation — fehlende Consent-Checkbox wird abgelehnt", async ({
    page,
  }) => {
    await fillHappyPath(page);
    await page.getByLabel(/AGB/i).uncheck();

    await page
      .getByRole("button", { name: "Verlängerung absenden" })
      .click();

    await expect(
      page.getByText(/Datenschutzhinweise bestätigen/i),
    ).toBeVisible();
  });

  test("TC-FORM-REN-005 honeypot — Bot-Submit silently dropped", async ({
    page,
  }) => {
    await fillHappyPath(page);
    // Honeypot is off-screen (absolute left:-9999px) — simulate bot fill
    // via force to skip actionability checks.
    await page
      .locator('input[name="website"]')
      .fill("http://spam.example", { force: true });

    await page
      .getByRole("button", { name: "Verlängerung absenden" })
      .click();

    await expect(page.getByRole("status")).toBeVisible();
  });

  test("TC-FORM-REN-006 preservation — Validation-Error erhält User-Eingaben", async ({
    page,
  }) => {
    // Regression lock-in für den Showstopper 2026-04-18.
    await page.locator('input[name="name"]').fill(mockRenewal.name);
    await page
      .locator('input[name="memberNumber"]')
      .fill(mockRenewal.memberNumber);
    await page.locator('input[name="email"]').fill("kaputt-email"); // invalid
    await page.locator('input[name="handicap"]').fill(mockRenewal.handicap);
    await page.locator('input[name="street"]').fill(mockRenewal.street);
    await page
      .locator('input[name="postalCode"]')
      .fill(mockRenewal.postalCode);
    await page.locator('input[name="city"]').fill(mockRenewal.city);
    await page.getByLabel(/AGB/i).check();

    await page
      .getByRole("button", { name: "Verlängerung absenden" })
      .click();

    await expect(page.getByText(/Ungültige E-Mail-Adresse/i)).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue(
      mockRenewal.name,
    );
    await expect(
      page.locator('input[name="memberNumber"]'),
    ).toHaveValue(mockRenewal.memberNumber);
    await expect(page.locator('input[name="handicap"]')).toHaveValue(
      mockRenewal.handicap,
    );
    await expect(page.locator('input[name="street"]')).toHaveValue(
      mockRenewal.street,
    );
    await expect(page.getByLabel(/AGB/i)).toBeChecked();
  });
});
