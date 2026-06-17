import assert from "node:assert/strict";
import { GET } from "../../app/api/search-index/route";

(async () => {
  let pass = 0, fail = 0;
  const res = await GET();
  const body = await res.json();
  try { assert.ok(Array.isArray(body) && body.length > 0 && body[0].url); pass++; }
  catch (e) { fail++; console.error((e as Error).message); }
  console.log(`route: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
