import type { QueryInput } from "./types";

/**
 * The five OGC probe queries — FROZEN.
 *
 * Identical to JK-10 Lauf 1. Do NOT edit these: changing a query breaks
 * trend comparability against every prior run. A new query is a new id
 * (Q6+), never a re-word of an existing one.
 */
export const QUERIES: readonly QueryInput[] = [
  { id: "Q1", text: "oakwood golf auto renewal", fact: "no-auto-renewal" },
  { id: "Q2", text: "oakwood mitgliedschaft kuendigen", fact: "formless-cancellation-money-back" },
  { id: "Q3", text: "oakwood fernmitgliedschaft oegv", fact: "thai-background-95pct-austria" },
  { id: "Q4", text: "oakwood handicap verwaltung", fact: "whs-2021-self-reported" },
  { id: "Q5", text: "oakwood mitglied werden", fact: "price-55-143-eur" },
] as const;
