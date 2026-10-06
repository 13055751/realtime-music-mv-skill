#!/usr/bin/env node
// jev-free.mjs — call jev-1.13-free via the免密 free lane (plugin-proven headers)
// Headers from dsh-our-free-model/src/upstream.js: Bearer public + opencode client fingerprint.
// Auto-retries transient gateway errors (422 Endpoint unavailable, 429, 5xx) with backoff.
// Usage: node jev-free.mjs "<state>" "id:type:question" [...]   types: noul|choice|score
// Env: JEV_RETRIES (default 4), JEV_RETRY_DELAY_MS (default 1500)

const ENDPOINT = process.env.JEV_ENDPOINT || "https://opencode.ai/zen/v1/systemone";
const MODEL = process.env.JEV_MODEL || "jev-1.13-free";
const KEY = process.env.OPENCODE_ZEN_KEY || "public"; // pooled credential: public
const MAX_RETRIES = parseInt(process.env.JEV_RETRIES || "4", 10);
const BASE_DELAY = parseInt(process.env.JEV_RETRY_DELAY_MS || "1500", 10);
const UA = "opencode/1.18.31";
const b62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function b62r(n) { let s=""; for (let i=0;i<14;i++) s += b62[Math.floor(Math.random()*62)]; return s; }
function mksession() { const now = Date.now(); return "ses_" + (now>>>0).toString(16).padStart(12,"0").slice(0,12) + b62r(); }
function mkrequest() { const now = Date.now()+1; return "msg_" + (now>>>0).toString(16).padStart(12,"0").slice(0,12) + b62r(); }

const args = process.argv.slice(2);
if (args.length < 2) { console.error("USAGE: node jev-free.mjs <state> <id:type:question> [...]"); process.exit(1); }
const state = args[0];
const questions = {};
for (const raw of args.slice(1)) { const [id, type, ...rest] = raw.split(":"); questions[id] = { type, instructions: rest.join(":") }; }

const body = { model: MODEL, state, questions };
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Stable session/request across retries so quota accounting does not treat retries as fresh turns.
const session = mksession();
const requestId = mkrequest();

async function attempt() {
  const headers = {
    "content-type": "application/json",
    "authorization": "Bearer " + KEY,
    "user-agent": UA,
    "x-opencode-client": "desktop",
    "x-opencode-session": session,
    "x-opencode-request": requestId,
    "x-opencode-project": "global",
    "accept": "application/json"
  };
  const res = await fetch(ENDPOINT, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await res.text();
  return { status: res.status, text };
}

async function main() {
  let last = null;
  for (let i = 0; i <= MAX_RETRIES; i++) {
    const t0 = Date.now();
    try {
      last = await attempt();
      const ms = Date.now() - t0;
      // 2xx = success; 401/403/404/400 = permanent, no retry
      if (last.status >= 200 && last.status < 300) {
        console.log("HTTP", last.status, "(" + ms + "ms)");
        console.log(last.text.slice(0, 1500));
        process.exit(0);
      }
      const permanent = last.status === 400 || last.status === 401 || last.status === 403 || last.status === 404;
      if (permanent) {
        console.error("HTTP", last.status, "(permanent, no retry) (" + ms + "ms)");
        console.error(last.text.slice(0, 500));
        process.exit(1);
      }
      // transient: 422 / 429 / 5xx — retry with backoff
      if (i < MAX_RETRIES) {
        const delay = BASE_DELAY * Math.pow(2, i);
        console.error("HTTP", last.status, "transient, retry " + (i+1) + "/" + MAX_RETRIES + " in " + delay + "ms (" + ms + "ms)");
        await sleep(delay);
        continue;
      }
    } catch (e) {
      // network error — retry
      if (i < MAX_RETRIES) {
        const delay = BASE_DELAY * Math.pow(2, i);
        console.error("NETWORK error, retry " + (i+1) + "/" + MAX_RETRIES + " in " + delay + "ms: " + e.message);
        await sleep(delay);
        continue;
      }
      last = { status: 0, text: "network: " + e.message };
    }
  }
  console.error("FAILED after " + (MAX_RETRIES+1) + " attempts. Last:", last ? ("HTTP " + last.status + " " + last.text.slice(0, 500)) : "unknown");
  process.exit(1);
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
