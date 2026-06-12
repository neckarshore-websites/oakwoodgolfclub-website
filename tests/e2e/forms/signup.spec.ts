/**
 * Signup-Form E2E — happy path + validation edges + honeypot silent-drop.
 *
 * The signup form has the largest field set (salutation, structured address,
 * handicap, startDate, referral). Happy-path exercises all mandatory
 * fields; validation cases target the most error-prone inputs.
 */

import { expect, test, waitForTurnstileToken } from "../fixtures/test";
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
    test.skip(
      process.env.E2E_CAPTCHA_REAL === "1",
      "Real Turnstile key (prod target) can't be solved by an automated browser — happy-path submit is covered locally/preview with test keys.",
    );

    await fillHappyPath(page);
    await waitForTurnstileToken(page);

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

  test("TC-FORM-SIG-005 validation — fehlende Anrede wird abgelehnt (Pflichtfeld)", async ({
    page,
  }) => {
    // Anrede ist Pflichtfeld ab 2026-04-18 (User-Entscheidung nach UAT):
    // gehört in die CRM-Anrede + postalische Mitgliedskarten-Anschrift.
    // "Möchte ich nicht sagen" ist eine valide Enum-Option für User die
    // bewusst keine Anrede angeben wollen.
    await page.locator('input[name="name"]').fill(mockSignup.name);
    await page.locator('input[name="email"]').fill(mockSignup.email);
    await page.locator('input[name="handicap"]').fill(mockSignup.handicap);
    await page.locator('input[name="street"]').fill(mockSignup.street);
    await page.locator('input[name="postalCode"]').fill(mockSignup.postalCode);
    await page.locator('input[name="city"]').fill(mockSignup.city);
    await page.getByRole("radio", { name: "Internet" }).check();
    await page.getByLabel(/AGB/i).check();
    // Anrede absichtlich NICHT setzen.

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    await expect(
      page.getByText(/Bitte eine Anrede wählen/i),
    ).toBeVisible();
  });

  test("TC-FORM-SIG-007 validation — fehlende Quelle (referralSource) ist OK (optional)", async ({
    page,
  }) => {
    // referralSource ("Wie hast Du von uns erfahren?") soll optional sein —
    // User-Entscheidung 2026-04-18 Session D: Feld nicht mehr required.
    await page.getByRole("radio", { name: "Herr" }).check();
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

  test("TC-FORM-SIG-009 mobile UX — Success-Panel wird in den Viewport gescrollt + bekommt Focus", async ({
    page,
  }) => {
    // Regression-Lock für den iPhone-12-Pro-Max-Bug 2026-04-19: nach Submit
    // ersetzt das (kürzere) Success-Panel die Form, die Seite kollabiert,
    // der Browser behält die alte Scroll-Position — User landet im Footer
    // statt auf der Bestätigung. Fix in `FormSuccessPanel`: scrollIntoView
    // + focus on mount. Da der Fix zentral in der Shared Component sitzt,
    // reicht ein Test auf der Form mit dem größten Form/Success-Größen-
    // Delta (Signup hat die meisten Felder → größter Kollaps).
    await page.setViewportSize({ width: 428, height: 926 });
    // Vorher hochscrollen ist nicht nötig — Submit-Button liegt am Ende
    // der Form, der Browser ist nach dem Klick automatisch im unteren
    // Drittel der Page. Genau dort entsteht der Bug.
    await fillHappyPath(page);
    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    const successPanel = page
      .getByRole("status")
      .filter({ hasText: /Zahlungsdetails/i });

    // Sichtbar UND im Viewport (mind. 50% der Höhe). Ohne den Fix hätte
    // der User nach unten scrollen müssen um den Banner zu sehen.
    await expect(successPanel).toBeVisible();
    await expect(successPanel).toBeInViewport({ ratio: 0.5 });
    // Programmatisch fokussiert für Screenreader-Ankündigung + a11y-
    // Continuity. tabIndex=-1 macht das `<section>` fokussierbar ohne
    // es in die Tab-Order zu hängen.
    await expect(successPanel).toBeFocused();
  });

  test("TC-FORM-SIG-008 preservation — Validation-Error erhält User-Eingaben", async ({
    page,
  }) => {
    // Regression lock-in für den Showstopper 2026-04-18: React 19 `<form
    // action>` resetet die Form nach jedem Action-Return. Bei Validation-
    // Error muss der User seine Eingaben zurückbekommen statt alles noch
    // einmal einzutippen. Umgesetzt via `key={state.submitCount}` +
    // `defaultValue={state.values?.X}` auf den Form-Inputs.
    await page.getByRole("radio", { name: "Herr" }).check();
    await page.locator('input[name="name"]').fill(mockSignup.name);
    await page.locator('input[name="email"]').fill("kaputt-email"); // invalid
    await page.locator('input[name="handicap"]').fill(mockSignup.handicap);
    await page.locator('input[name="street"]').fill(mockSignup.street);
    await page.locator('input[name="postalCode"]').fill(mockSignup.postalCode);
    await page.locator('input[name="city"]').fill(mockSignup.city);
    await page.getByRole("radio", { name: "Internet" }).check();
    await page.getByLabel(/AGB/i).check();

    await page.getByRole("button", { name: "Anmeldung absenden" }).click();

    // Validation-Fehler erschienen, Form ist NICHT gereset:
    await expect(page.getByText(/Ungültige E-Mail-Adresse/i)).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue(
      mockSignup.name,
    );
    await expect(page.locator('input[name="handicap"]')).toHaveValue(
      mockSignup.handicap,
    );
    await expect(page.locator('input[name="street"]')).toHaveValue(
      mockSignup.street,
    );
    await expect(page.locator('input[name="city"]')).toHaveValue(
      mockSignup.city,
    );
    await expect(
      page.getByRole("radio", { name: "Herr" }),
    ).toBeChecked();
    await expect(page.getByLabel(/AGB/i)).toBeChecked();
  });
});
