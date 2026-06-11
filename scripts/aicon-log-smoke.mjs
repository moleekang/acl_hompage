// Aicon Log smoke test — exercises the real implementation modules
// (src/aicon/log/_core + activity/menu-map) against the live log server.
// Plain .mjs so tsc skips it; node strips types from the imported .ts modules.
//
// Usage (reads AICON_LOG_* from the environment):
//   AICON_LOG_ENABLED=true AICON_LOG_BASE_URL=http://localhost:8400 \
//   AICON_LOG_API_KEY=ak_live_... node scripts/aicon-log-smoke.mjs
//
// Sends: 1× /call/logs, 1× /menu/logs, 1× /event/logs (user_signin — expects event_tier L1).

import { isActive, postAiconLog } from "../src/aicon/log/_core/index.ts";
import { resolveMenu } from "../src/aicon/log/activity/menu-map.ts";

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

if (!isActive()) fail("gate inactive — set AICON_LOG_ENABLED/BASE_URL/API_KEY");

// 0. ENABLED=false gate check (no network)
const prev = process.env.AICON_LOG_ENABLED;
process.env.AICON_LOG_ENABLED = "false";
const gated = await postAiconLog("/event/logs", { event_name: "page_view" });
if (gated !== null) fail("ENABLED=false should return null (no network call)");
process.env.AICON_LOG_ENABLED = prev;
console.log("OK  gate: ENABLED=false -> no network call");

// 1. /call/logs
const call = await postAiconLog("/call/logs", {
  user_id: "smoke@aiconlab.xyz",
  http_method: "GET",
  end_point: "/log",
  status_code: 200,
  latency_ms: 12,
  success_yn: "Y",
});
if (!call?.ok) fail(`/call/logs -> ${call?.status}`);
console.log(`OK  /call/logs -> ${call.status}`, JSON.stringify(call.data));

// 2. /menu/logs (via menu_map resolve)
const menu = resolveMenu("/log");
const menuRes = await postAiconLog("/menu/logs", {
  user_id: "smoke@aiconlab.xyz",
  menu_code: menu.code,
  menu_name: menu.name,
  page_path: "/log",
  referrer_path: "/",
});
if (!menuRes?.ok) fail(`/menu/logs -> ${menuRes?.status}`);
console.log(`OK  /menu/logs -> ${menuRes.status} (menu_code=${menu.code})`, JSON.stringify(menuRes.data));

// 3. /event/logs — user_signin must resolve to tier L1
const evt = await postAiconLog("/event/logs", {
  event_name: "user_signin",
  user_id: "smoke@aiconlab.xyz",
  page_path: "/auth/callback",
});
if (!evt?.ok) fail(`/event/logs -> ${evt?.status}`);
const tier = evt.data?.data?.event_tier;
console.log(`OK  /event/logs -> ${evt.status} (event_tier=${tier})`, JSON.stringify(evt.data));
if (tier !== "L1") fail(`expected event_tier L1 for user_signin, got ${tier}`);

console.log("\nAll smoke checks passed.");
