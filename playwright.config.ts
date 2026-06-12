/**
 * Playwright E2E config for the three public forms (Kontakt, Signup,
 * Renewal). Chromium-only baseline — WebKit/Firefox added if Safari-specific
 * bugs surface in user reports.
 *
 * Two run modes:
 *   - Local (default): Playwright starts `npm run dev` on :3000 and drives
 *     forms against it. Server Actions run without SMTP creds and short-
 *     circuit to a console.log + ok=true — perfect for UI assertion without
 *     hitting IONOS.
 *   - Production: E2E_BASE_URL=https://oakwoodgolfclub-website.vercel.app
 *     skips the webServer and points the tests at the live deploy. Used
 *     once per session-end for real-SMTP confidence (Briefing §4).
 */

import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const isExternalTarget =
  baseURL.startsWith("http") && !baseURL.includes("localhost");

export default defineConfig({
  testDir: "./tests/e2e",
  // One worker keeps server-action console-logs deterministic and avoids
  // accidental IONOS rate-limit bursts when running against production.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Only auto-start dev server for local runs. Production runs skip this
  // (the Vercel deploy is always live).
  webServer: isExternalTarget
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
