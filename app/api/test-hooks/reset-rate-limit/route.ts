/**
 * Test-only Route Handler — leert den In-Memory Rate-Limit-Counter.
 *
 * Nur erreichbar in Dev-Mode (NODE_ENV !== "production"). In Production-
 * Builds (Vercel) returnt der Handler 404. Damit ist der Reset-Hook
 * niemals Teil der Live-Attack-Surface — selbst wenn der Pfad geleakt wird.
 *
 * Aufrufer: Playwright `test.beforeEach` in `tests/e2e/fixtures/test.ts`.
 * Hintergrund: 23 E2E-Tests produzieren ~5 successful submits, exakt am
 * Per-IP-Limit (5/h aus `lib/ratelimit.ts`). Ohne Reset zwischen Tests
 * kippt jeder zusätzliche Happy-Path-Test über die Grenze (CTX3 aus
 * Session 2026-04-19-h Report).
 *
 * Doppel-Sicherung: NODE_ENV-Gate + POST-only. GET liefert 405.
 *
 * Naming-Note: Pfad ist `/api/test-hooks/...` (nicht `/api/__test/...`),
 * weil Next.js App Router Ordner mit `_`-Prefix als private behandelt
 * und vom Routing ausschließt. Der Pfadname ist Konvention; die echte
 * Security-Boundary ist der NODE_ENV-Gate unten.
 */

import { NextResponse } from "next/server";
import { __resetRateLimitForTests } from "@/lib/ratelimit";

export async function POST(): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }
  __resetRateLimitForTests();
  return NextResponse.json({ ok: true });
}
