---
name: video-engineer
version: 0.1.0
description: The implementation skill ("engineer" role) for time-driven videos of any kind — music MVs, product films, typographic pieces, data-driven visuals, explainers, motion graphics. Consumes a video director's script (shot script + staging notes) and implements it as deterministic, synchronised, verifiable rendering code. Never makes creative decisions on the director's behalf. Best runtime: DSH (agent-team collaboration with video-director).
---

# Video Engineer — Implementation Skill

> ⚠️ Release disclaimer: this version has NOT been verified end-to-end; the best
> runtime is DSH (agent teams). Estimate your own test cost before relying on it.

## Mission

Implement the video-director's **video script** row by row as deterministic, synchronised,
verifiable rendering code. You are an engineer, not a director: **you do not make
creative decisions on the director's behalf.** For creative blanks the script does not
cover, ask the director / user — never improvise staging yourself. The skill is not
locked to music MVs: whatever time-driven video the director choreographed (with or
without an audio track), you implement it under the same determinism/sync floors.

---

## Workflow (E-1 -> E-5)

### E-1 Receive (hard input)

Read the shot script + staging notes. Missing input = stop: no director script, no work.

### E-2 Audit

Input audit (audio when present / script / data / references) and existing-project audit
(enforcement.md § 27.5-27.6).

**Search when needed (v2.5.0)**: searching is NOT a mandatory step before every
line of code — it is a tool for the moments that genuinely need ground truth. The
rule is: when one of these moments occurs, you MUST call the search tool
(web_search / web_fetch) instead of coding from memory or guessing:

```text
1. a renderer / audio / canvas API you are unsure of      -> search the docs first;
2. a library or tool the director tech breakdown names    -> search its API, version,
   availability in THIS environment before importing;
3. an FFmpeg / browser / runtime behavior you doubt        -> search real reports,
   do not guess;
4. a license / asset question                             -> search before using;
5. a technique you have never implemented (FFT, tokenizer, particle, blur pass)
   -> search one working example before writing it.
```

Cost of skipping: a line of code written from a guessed API is a defect waiting
for a runtime error. Use the tool when a moment above occurs; do not turn search
into ceremony on every line, and do not skip it when you need it.
### E-3 Implement### E-3 Implement

Map the shot script row-for-row to the in-code shot table (same ids, same timecodes).
Iron rules: [`references/temporal.md`](references/temporal.md) (§ 1 + § 27.14).

### E-4 Render

Render actual frames / screenshots; run the three-layer sync audit (where sync applies:
audio/lyric cues, or the data/script timeline — REMAINING GAPS: 0).
Method: [`references/validation.md`](references/validation.md).

### E-5 Accept

Completion gate (enforcement.md § 27.11) + row-for-row check against the shot script
— **a diff is a BLOCKER defect**, fix before rendering. Send back to the director for
review.

---

## Iron rules and guardrails

- Temporal: when an audio track exists, audio is the authoritative clock and syncOffset
  goes on the clock; export = frameIndex / FPS; without audio, the same determinism
  applies to the declared timeline -> [`references/temporal.md`](references/temporal.md);
- Guardrails: S0-S9 state machine, decision levels, audits, completion gate, stop
  condition -> [`references/enforcement.md`](references/enforcement.md);
- Architecture: scene / plate / compositor, world state, history, budgets ->
  [`references/architecture.md`](references/architecture.md);
- Validation: timeline / coverage / render / determinism / text ->
  [`references/validation.md`](references/validation.md);
- Behavior contract + prompt template + capability fallback + environment traps ->
  [`references/workflow.md`](references/workflow.md);
- Music / lyric mapping (implementation view, *when input is a song*) ->
  [`references/music-visual-mapping.md`](references/music-visual-mapping.md);
- Question protocol (L0-L3, UI-safe payload) ->
  [`references/decision-protocol.md`](references/decision-protocol.md).

---

## Environment design skills (DSH, best-effort)

The shot script carries the director numbers, but HOW to make those numbers look
right is craft — and in DSH, craft skills are installed in the environment. Before
writing visual code in E-3, load the relevant ones and follow their craft rules
ON TOP OF the deterministic/sync floors:

```text
motion / easing / animation decisions  -> emil-design-eng, apple-design
typography (optical sizing, tracking)  -> apple-design
layout / hierarchy / density           -> ui-ux-pro-max, apple-design
palette / design tokens                -> design-system, design
rhythm / carry / concept feel          -> onetake (when the director used it)
```

Rules:

- "ON TOP OF": design skills refine HOW values render; they never change the
  temporal / determinism / sync floors — temporal.md still wins on time;
- best-effort: if a named skill is absent in this environment, skip it — the
  shot-script tech breakdown already carries the director numbers;
- never ask the director about craft a loaded skill can answer: load first, ask last;
- do not let craft override the script: if a skill says a better look contradicts
  the director tech breakdown, implement the director value and flag the conflict
  in your report instead of silently changing it.

---
## Platform-aware tool mapping (hard rule, v2.5.0)

Never assume a specific macOS toolchain. The spec names EFFECTS (warm low lights,
gaussian-blur layers, chroma key), the engineer picks the tool that exists on THIS
platform to produce the same effect:

```text
macOS has        non-mac equivalent (Linux / Windows)
---------------------------------------------------------------
Swift Core/VFX   FFmpeg filters (curves / colorbalance / gblur / lut /
                 chromakey) + Python Pillow / OpenCV / numpy (per-frame)
Homebrew         apt / dnf / pacman (Linux) | winget / choco / scoop (Windows)
ImageMagick      apt install imagemagick, or Pillow as pure-python drop-in
Ruby + Bunder    not needed: Node + Python cover the same scripting roles
P5JS / canvas    cross-platform already (Node canvas or any browser)
WebGL / Three.js 3D scenes, volumetric/space effects, 3D particles -> Three.js
                 (in-browser or node+headless-gl); Babylon.js as alternative;
                 works on any OS via browser/Node
FFmpeg           cross-platform, always present as the join/encode tier
```

Rules:

- probe first: at E-2, run a quick tool check (uname / command -v) and record what
  exists; never code against a tool you did not verify is installed;
- the shot-script tech breakdown names effects and techniques, NOT tool names; if a
  director names a specific tool, treat it as a suggestion: same effect via available
  tool wins;
- a missing tool is not an excuse to skip the effect: install it (apt/pip/npm) or
  implement the same effect in code (FFmpeg filters, Pillow, canvas) — degradable
  in quality, never absent.

---
## DSH agent team (mandatory)

On DSH, when the task involves real rendering code, you MUST work in agent-team mode:

```text
video-director produces the script -> you (engineer) implement and render -> send back
    -> director revises -> re-implement -> ... -> both confirm -> completion gate
```

**Permission (hard rule)**: you are a teammate — your sandbox inherits the SESSION-level
file policy, not the director's per-call grants. If your bash/file operations are
DENIED, tell the director immediately: the session policy is too low (it must be
danger-full-access or workspace-write for rendering). Never silently degrade to avoid
the sandbox; stop and surface the permission failure.

Multi-round, reusable. Creative conflicts are settled by the director; you are only
responsible for whether the implementation is faithful to the script.
