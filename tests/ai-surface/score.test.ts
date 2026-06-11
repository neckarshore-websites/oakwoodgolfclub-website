/**
 * Unit smoke-test for the scorer — the validation-gate harness (JK-15).
 *
 * Runs with ZERO API keys: synthetic answers exercise every rating branch.
 * This is the piece that, once JK-10 Lauf 1 data lands, gets pointed at the
 * 20 manually-scored answers to prove the ≥85%-agreement acceptance gate.
 *
 * Run: npm run test:ai-surface:unit   (tsx tests/ai-surface/score.test.ts)
 */

import assert from "node:assert/strict";
import { QUERIES } from "./queries";
import { extractMatchContext, providerScore, scoreAnswer } from "./score";
import type { ProviderResult, ScoredResult } from "./types";

const Q1 = QUERIES.find((q) => q.id === "Q1")!;
const Q5 = QUERIES.find((q) => q.id === "Q5")!;

function mk(rawAnswer: string, queryId = "Q5"): ProviderResult {
  return {
    surface: "test",
    queryId,
    rawAnswer,
    citedUrls: [],
    inputTokens: 0,
    outputTokens: 0,
    serverSearchCount: 0,
    durationMs: 0,
  };
}

let pass = 0;
let fail = 0;
function check(label: string, fn: () => void) {
  try {
    fn();
    pass++;
  } catch (err) {
    fail++;
    console.error(`  ✗ ${label}\n      ${(err as Error).message.split("\n")[0]}`);
  }
}

// 1. Perfect Q5 answer hits all 8 required facts → pass
check("perfect Q5 answer → pass", () => {
  const perfect =
    "Der Oakwood Golf Club (oakwoodgolfclub.de) wurde 2007 gegründet und sitzt in " +
    "Stuttgart. Rund 300 Mitglieder. Es gibt eine Geld-zurück-Garantie. Die " +
    "Mitgliedschaft wird zu 95 % in Österreich anerkannt. Preise: 55 EUR pro Jahr, " +
    "143 EUR für vier Freunde im Flight.";
  const r = scoreAnswer(mk(perfect), Q5);
  assert.equal(r.rating, "pass");
  assert.equal(r.hallucinations.length, 0);
  assert.ok(Object.values(r.factsReproduced).every(Boolean), "all facts true");
});

// 2. High-severity hallucination forces fail even with good facts
check("high hallucination → fail", () => {
  const bad =
    "Der Oakwood Golf Club (oakwoodgolfclub.de) in Stuttgart existiert seit 2009 " +
    "und hat rund 300 Mitglieder mit Geld-zurück-Garantie zu 95 % in Österreich.";
  const r = scoreAnswer(mk(bad), Q5);
  assert.equal(r.rating, "fail");
  assert.ok(r.hallucinations.some((h) => h.name === "founded2009" && h.severity === "high"));
});

// 3. Empty / near-empty answer → refused (before any fact check)
check("empty answer → refused", () => {
  assert.equal(scoreAnswer(mk(""), Q5).rating, "refused");
  assert.equal(scoreAnswer(mk("Keine Info."), Q5).rating, "refused");
});

// 4. Half the facts → partial
check("partial facts → partial", () => {
  const partial =
    "Oakwood Golf Club (oakwoodgolfclub.de), gegründet 2007 in Stuttgart — eine " +
    "Fernmitgliedschaft im Golfclub für Spieler im DACH-Raum.";
  const r = scoreAnswer(mk(partial, "Q1"), Q1);
  // Q1 requires 5 facts; this hits domain/2007/dachFocus = 3/5 = 0.6 → partial
  assert.equal(r.rating, "partial");
});

// 5. extractMatchContext returns trimmed context with ellipses
check("extractMatchContext", () => {
  const ctx = extractMatchContext(
    "the quick brown fox jumps over the lazy dog seit 2009 and then a good deal more padding text follows here at the very end",
    /2009/,
  );
  assert.ok(ctx.includes("2009"));
  assert.ok(ctx.startsWith("…"), "match is >30 chars in → leading ellipsis");
  assert.ok(ctx.endsWith("…"), "match is >30 chars from end → trailing ellipsis");
});

// 6. providerScore: pass=1, partial=0.5, fail/refused=0
check("providerScore math", () => {
  const fakeRated = (rating: ScoredResult["rating"]): ScoredResult => ({
    ...mk(""),
    rating,
    factsReproduced: {},
    hallucinations: [],
  });
  assert.equal(providerScore([fakeRated("pass"), fakeRated("partial"), fakeRated("fail")]), 1.5);
  assert.equal(providerScore([fakeRated("refused")]), 0);
});

console.log(`\nscore.test: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
