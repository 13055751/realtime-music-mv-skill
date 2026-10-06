#!/usr/bin/env node
// jev-min.mjs — minimal OpenCode Zen Jev free-model client
// Uses jev-1.13-free (limited-time free model) via the OpenCode Zen SystemOne endpoint.
// Client is presented as the official opencode client so the free model is served.
//
// Usage:
//   OPENCODE_ZEN_KEY=your_key node jev-min.mjs "state text" 'question_id:type:question text'
//   question types: noul (yes/no), choice (multiple choice), score (0..1 rubric)
//
// Example:
//   OPENCODE_ZEN_KEY=k node jev-min.mjs "I want warm colors" "style:noul:Is a warm palette suitable?"

const ENDPOINT = "https://opencode.ai/zen/v1/systemone";
const MODEL = "jev-1.13-free";
const KEY = process.env.OPENCODE_ZEN_KEY || process.env.OPENCODE_API_KEY;

if (!KEY) {
  console.error("ERROR: set OPENCODE_ZEN_KEY (get it from OpenCode Zen console — add billing details, free models still need a key)");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("USAGE: node jev-min.mjs <state> <question_id:type:question> [question_id:type:question ...]");
  process.exit(1);
}

const state = args[0];
const questions = {};
for (const raw of args.slice(1)) {
  const [id, type, ...textParts] = raw.split(":");
  const question = textParts.join(":");
  if (!id || !type || !question) {
    console.error("BAD question spec (need id:type:text):", raw);
    process.exit(1);
  }
  questions[id] = { type, instructions: question };
}

const payload = { model: MODEL, state, questions };

async function main() {
  const started = Date.now();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
      // present as the official opencode client
      "User-Agent": "opencode/" + (process.env.OPENCODE_VERSION || "0.1.0") + " (+https://opencode.ai)",
      "x-opencode-client": "opencode"
    },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  const ms = Date.now() - started;
  if (!res.ok) {
    console.error("HTTP", res.status, "-", text.slice(0, 500));
    process.exit(1);
  }
  let json;
  try { json = JSON.parse(text); } catch { console.log(text); process.exit(0); }
  console.log("== jev-1.13-free response (" + ms + "ms) ==");
  console.log(JSON.stringify(json, null, 2));
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });
