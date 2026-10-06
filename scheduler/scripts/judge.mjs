#!/usr/bin/env node
// judge.mjs — multi-model style judge with availability routing + self-eval fallback
// Lane 1: jev-1.13-free (native noul/choice/score) — preferred, often 422 unavailable
// Lane 2: space-bunny-free (chat text) — the live fallback
// Lane 3: scheduler self-eval — never silent, reports degraded
// Usage: node judge.mjs "<state: 候选风格+素材>" "id:noul:question?" "id:score:question(0-1)"

const KEY = process.env.OPENCODE_ZEN_KEY || "public";
const UA = "opencode/1.18.31";
const BASE = "https://opencode.ai/zen/v1";
const JEV_MODEL = process.env.JEV_MODEL || "jev-1.13-free";
const CHAT_MODEL = process.env.JUDGE_CHAT_MODEL || "space-bunny-free";
const MAX_RETRIES = parseInt(process.env.JUDGE_RETRIES || "2", 10);
const BASE_DELAY = parseInt(process.env.JUDGE_RETRY_DELAY_MS || "1000", 10);

const b62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function b62r() { let s=""; for (let i=0;i<14;i++) s += b62[Math.floor(Math.random()*62)]; return s; }
function mkid(prefix) { const now = Date.now(); return prefix + "_" + (now>>>0).toString(16).padStart(12,"0").slice(0,12) + b62r(); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

const args = process.argv.slice(2);
if (args.length < 2) { console.error("USAGE: node judge.mjs <state> <id:type:question> [...]"); process.exit(1); }
const state = args[0];
const questions = {};
for (const raw of args.slice(1)) { const [id, type, ...rest] = raw.split(":"); questions[id] = { type, instructions: rest.join(":") }; }

// ---- lane 1: Jev native systemone ----
async function callJev(retries) {
  const session = mkid("ses"); const requestId = mkid("msg");
  const headers = { "content-type": "application/json", "authorization": "Bearer " + KEY, "user-agent": UA,
    "x-opencode-client": "desktop", "x-opencode-session": session, "x-opencode-request": requestId,
    "x-opencode-project": "global", "accept": "application/json" };
  const body = { model: JEV_MODEL, state, questions };
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(BASE + "/systemone", { method: "POST", headers, body: JSON.stringify(body) });
      const text = await res.text();
      if (res.status >= 200 && res.status < 300) {
        let j; try { j = JSON.parse(text); } catch { j = null; }
        if (j && j.answers) return { lane: "jev", ...j };
      }
      const permanent = [400, 401, 403, 404].includes(res.status);
      if (permanent) return { lane: "jev", error: "HTTP " + res.status + " " + text.slice(0, 200) };
      if (i < retries) { console.error("jev 422/5xx, retry " + (i+1) + "/" + retries + " in " + (BASE_DELAY * Math.pow(2, i)) + "ms"); await sleep(BASE_DELAY * Math.pow(2, i)); }
      else return { lane: "jev", error: "HTTP " + res.status + " " + text.slice(0, 200) };
    } catch (e) {
      if (i < retries) await sleep(BASE_DELAY * Math.pow(2, i));
      else return { lane: "jev", error: "network " + e.message };
    }
  }
  return { lane: "jev", error: "unreachable" };
}

// ---- lane 2: chat model (space-bunny-free) ----
async function callChat(retries) {
  const session = mkid("ses"); const requestId = mkid("msg");
  const prompt = state + "\n\n问题:\n" + Object.entries(questions).map(([id, q]) => id + ":" + q.type + ":" + q.instructions).join("\n");
  const body = { model: CHAT_MODEL, messages: [ { role: "user", content: prompt + "\n\n直接给出简洁结论，不要输出思考过程。" } ], max_tokens: 500 };
  const headers = { "content-type": "application/json", "authorization": "Bearer " + KEY, "user-agent": UA,
    "x-opencode-client": "desktop", "x-opencode-session": session, "x-opencode-request": requestId,
    "x-opencode-project": "global", "accept": "application/json" };
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(BASE + "/chat/completions", { method: "POST", headers, body: JSON.stringify(body) });
      const text = await res.text();
      if (res.status >= 200 && res.status < 300) {
        try { const j = JSON.parse(text); const m = j.choices && j.choices[0] && j.choices[0].message || {};
          const raw = (m.content || m.reasoning_content || "").slice(0, 1200);
          return { lane: CHAT_MODEL, raw }; } catch { return { lane: CHAT_MODEL, raw: text.slice(0, 800) }; }
      }
      const permanent = [400, 401, 403, 404].includes(res.status);
      if (permanent) return { lane: CHAT_MODEL, error: "HTTP " + res.status + " " + text.slice(0, 200) };
      if (i < retries) { await sleep(BASE_DELAY * Math.pow(2, i)); }
      else return { lane: CHAT_MODEL, error: "HTTP " + res.status + " " + text.slice(0, 200) };
    } catch (e) {
      if (i < retries) await sleep(BASE_DELAY * Math.pow(2, i));
      else return { lane: CHAT_MODEL, error: "network " + e.message };
    }
  }
  return { lane: CHAT_MODEL, error: "unreachable" };
}

// ---- runner: route lanes ----
async function main() {
  const t0 = Date.now();
  // lane 1: Jev first (native structured answers)
  const j = await callJev(MAX_RETRIES);
  if (j.answers) { console.log("lane=jev model=" + JEV_MODEL + " ms=" + (Date.now()-t0)); console.log(JSON.stringify({ model: JEV_MODEL, answers: j.answers }, null, 2)); process.exit(0); }
  console.error("jev unavailable: " + (j.error || ""));
  // lane 2: chat fallback
  const c = await callChat(MAX_RETRIES);
  if (c.raw) { console.log("lane=chat model=" + CHAT_MODEL + " ms=" + (Date.now()-t0)); console.log(JSON.stringify({ model: CHAT_MODEL, answers: c.raw }, null, 2)); process.exit(0); }
  console.error("chat unavailable: " + (c.error || "empty content (model reasoned but no answer)"));
  // lane 3: self-eval fallback (never silent)
  console.error("WARN: all judge models unavailable -> scheduler self-eval");
  console.log(JSON.stringify({ model: "self-eval", state, questions }, null, 2));
  process.exit(2);
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
