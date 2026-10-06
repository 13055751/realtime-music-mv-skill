#!/usr/bin/env node
// jev-free.mjs — call jev-1.13-free via the免密 free lane (plugin-proven headers)
// Headers from dsh-our-free-model/src/upstream.js: Bearer public + opencode client fingerprint.
// Usage: node jev-free.mjs "<state>" "id:type:question" [...]   types: noul|choice|score

const ENDPOINT = process.env.JEV_ENDPOINT || "https://opencode.ai/zen/v1/systemone";
const MODEL = "jev-1.13-free";
const KEY = process.env.OPENCODE_ZEN_KEY || "public"; // pooled credential: public
const UA = "opencode/1.18.31";
const now = Date.now();
const b62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function b62r(n) { let s=""; for (let i=0;i<14;i++) s += b62[Math.floor(Math.random()*62)]; return s; }
const ses = "ses_" + (now>>>0).toString(16).padStart(12,"0").slice(0,12) + b62r();
const req = "msg_" + ((now+1)>>>0).toString(16).padStart(12,"0").slice(0,12) + b62r();

const args = process.argv.slice(2);
if (args.length < 2) { console.error("USAGE: node jev-free.mjs <state> <id:type:question> [...]"); process.exit(1); }
const state = args[0];
const questions = {};
for (const raw of args.slice(1)) { const [id, type, ...rest] = raw.split(":"); questions[id] = { type, instructions: rest.join(":") }; }

const body = { model: MODEL, state, questions };
const headers = {
  "content-type": "application/json",
  "authorization": "Bearer " + KEY,
  "user-agent": UA,
  "x-opencode-client": "desktop",
  "x-opencode-session": ses,
  "x-opencode-request": req,
  "x-opencode-project": "global",
  "accept": "application/json"
};

async function main() {
  const t0 = Date.now();
  const res = await fetch(ENDPOINT, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await res.text();
  console.log("HTTP", res.status, "(" + (Date.now()-t0) + "ms)");
  console.log(text.slice(0, 1500));
}
main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
