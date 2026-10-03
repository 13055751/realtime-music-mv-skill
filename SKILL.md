---
name: universal-realtime-music-mv
version: 2.4.0
description: A general-purpose skill for designing and implementing deterministic, audio-synchronised, code-rendered music videos across terminal/TUI, minimal, cinematic, anime, abstract, generative, data-driven, retro, cyber, typographic, and hybrid visual styles. Includes a prompt-compilation protocol for open-ended coding agents so vague creative requests become concrete, testable implementation plans without prematurely locking the aesthetic, UI-safe interactive clarification rules for constrained agent hosts, and a staged delivery workflow (whole-song lyric analysis → ~10-line performance-design batches → user approval → per-batch production) that stops agents from silently building an entire MV the user never approved.
---

# Universal Realtime Music MV Skill

## 0. Mission

Build a music video as a **time-driven visual system**, not as a pile of disconnected lyric cards.

The skill has two jobs:

1. **Director / systems designer:** infer a coherent visual language from the user's references, song, lyrics, desired mood, and constraints.
2. **Implementation architect:** turn that direction into deterministic, seek-safe, reusable code with measurable synchronization and validation.

The system must adapt to different aesthetics without changing its core temporal architecture.

## North-star rule

The purpose of this Skill is **to help an agent make the user's music MV**, not to make the agent's architecture look impressive.

Every system, abstraction, validation rule, analysis pass, UI element, effect, and implementation decision is subordinate to the final audiovisual result. Do not add complexity merely because it is architecturally elegant, technically interesting, or mentioned by this Skill. If a simpler implementation produces the same required result, prefer the simpler implementation.

The Skill must preserve three things above all else:

```text
USER INTENT
  ↓
MUSIC + MEANING
  ↓
COHERENT VISUAL EXPERIENCE
```

Engineering exists to make that chain reliable. It is not the product itself.

When rules in this Skill appear to conflict, prefer the interpretation that:
1. preserves explicit user intent;
2. preserves the song's timing and meaning;
3. preserves the declared visual style;
4. reduces unnecessary complexity;
5. improves reproducibility and validation.

Do not turn a creative MV request into a generic software-engineering exercise.

The same principle applies to agent interaction: the host UI is a delivery constraint, not the product. Keep user-facing creative context readable in ordinary messages and keep tool payloads minimal enough for the host to render correctly.

The canonical model is:

```text
AUDIO TIME
   │
   ├── lyrics / semantic cues
   ├── beat / onset / MIDI / spectrum
   ├── song structure / energy
   └── user-defined events
          │
          ▼
     WORLD STATE
          │
          ├── style system
          ├── persistent substrate
          ├── scene plates
          └── transitions
                  │
                  ▼
              COMPOSITOR
                  │
                  ▼
                 FRAME
```

The same architecture can produce a terminal dashboard, an anime-like motion piece, an abstract generative film, a typographic MV, a cinematic interface, or a deliberately sparse visualizer.

---

# 1. Non-negotiable temporal invariants

## 1.1 Audio is the authoritative clock

Define:

```js
t = audio.currentTime + syncOffset

`syncOffset` is a stable configuration parameter measured in seconds. It must remain unchanged during a render pass and must be applied consistently to preview, playback, offline export, and validation.
```

`audio.currentTime` is **read-only** inside the renderer — written only by an explicit user seek. `syncOffset` is applied to the **clock**, not to a displayed number: an offset that only changes what the UI prints is decoration, not synchronization.

Do not accumulate visual time independently from `requestAnimationFrame`.

Never make visual state depend on:

- frame count
- elapsed wall-clock time accumulated by the renderer
- mutable previous-frame state
- random values generated during drawing

The same timestamp must produce the same visual state.

This guarantees:

- seeking
- pause/resume
- replay
- deterministic screenshots
- render-order independence
- debugging by timestamp

## 1.2 Deterministic randomness

Never use uncontrolled `Math.random()` for visual state.

Use a stable seeded function such as:

```text
hash(sceneId, cueIndex, elementIndex, beatIndex)
```

or deterministic noise such as:

```text
noise(seed, quantizedTime)
```

For event-triggered randomness, prefer stable seeds derived from semantic identifiers:

```text
seed(sceneId, eventId, elementId)
```

The exact implementation may vary. The invariant does not. If continuous noise uses raw floating-point time, tiny platform-dependent differences are acceptable only when the project explicitly permits them.

## 1.3 Semantic time and musical time are different

Lyrics/cues answer:

> What is happening in the story or meaning now?

Music analysis answers:

> How should the visual system react physically right now?

Do not replace lyric timing with guessed BPM.
Do not force every semantic transition onto a beat.
Do use beats/onsets/energy for impact, motion, density, flashes, deformation, and secondary behavior.

---

# 2. Open-ended request compiler

This section exists specifically for coding agents that perform poorly when asked to "make something cool" or given broad aesthetic instructions.

## 2.1 Never jump directly from vague request to code

For an open-ended creative task, first convert the request into a **Creative Specification**.

Extract these fields:

```text
GOAL
INPUTS
OUTPUT
CANVAS / ASPECT RATIO
RUNTIME
REFERENCE AESTHETIC
VISUAL GRAMMAR
COLOR SYSTEM
TYPOGRAPHY
LAYOUT
MOTION LANGUAGE
MUSIC COUPLING
LYRIC COUPLING
NARRATIVE ARC
SCENE / PLATE MODEL
TECHNICAL CONSTRAINTS
ASSET POLICY
VALIDATION REQUIREMENTS
```

If the user supplied references (images, video, screenshots), inspect them according to [`references/reference-analysis.md`](references/reference-analysis.md) — composition, panel topology, negative space, color distribution, typography density, border language, hierarchy, animation implications, and whether the reference is a screenshot of a real application or merely an illustration.

**Do not copy accidental content from a reference. Extract its visual grammar.**

## 2.2 Resolve ambiguity with defaults, not endless questions

When the user leaves an option unspecified:

1. preserve the requested style;
2. choose the least invasive reasonable default;
3. state the assumption briefly in the implementation plan;
4. keep the choice parameterized so it can be changed later.

Only ask a question when the missing information crosses the Decision Level rules in Section 27.2. Low-impact ambiguity must use a reasonable default; architecture-level ambiguity must be resolved before implementation.

## 2.3 Produce a style contract

Before implementation, write a compact contract like:

```text
STYLE CONTRACT
- background: pure black
- composition: full-screen asymmetric TUI
- typography: monospace
- borders: thin, square, low-contrast
- palette: cold blue-gray + sparse amber
- motion: redraw / stream / pulse, not camera spectacle
- density: high information density with large quiet regions
- realism: should feel like a real program, not a fake UI
- forbidden: gradients, rounded cards, glassmorphism, neon cyberpunk
```

This contract prevents a coding agent from drifting toward generic AI-generated aesthetics.

## 2.4 Convert adjectives into implementation rules

Do not leave words such as "cool", "futuristic", "dreamy", "terminal-like", or "cinematic" as free-floating instructions.

Compile them into observable rules.

Examples:

```text
"terminal-like"
→ monospace + black framebuffer + square panels + cursor + logs + deterministic redraw

"minimal"
→ low element count + high negative space + restrained palette + no decorative noise

"cinematic"
→ composition hierarchy + controlled transitions + shot-scale changes + lighting grammar

"chaotic"
→ bounded jitter + increasing density + topology changes + controlled occlusion

"retro"
→ restricted palette + pixel/grid geometry + raster artifacts + era-appropriate typography
```

This is the core anti-vagueness mechanism.

## 2.5 Use staged implementation prompts internally

When an agent is likely to over-code or hallucinate a design, internally structure the work as:

```text
PHASE 0 — inspect inputs and existing project
PHASE A — interpret
PHASE B — specify
PHASE C — resolve decision boundaries
PHASE D — storyboard
PHASE E — architecture
PHASE F — implement
PHASE G — render / inspect
PHASE H — repair
PHASE I — validate
PHASE J — completion gate
```

Do not skip directly to PHASE E for a broad creative request.

---

# Staged delivery: analyze first, design in batches, get approval, then build

Real runs expose a specific, repeated failure mode: the agent "just builds" — no lyric
analysis, no questions, the whole song implemented in one silent pass, and a finished MV
the user never agreed to. Speed without approval gates is not progress; it is rework
waiting to happen. For open-ended MV requests this workflow is mandatory.

## S-A Lyric analysis (whole song, before any visual design)

Analyze the entire lyric file end to end before designing anything visual:

```text
per line:   timecode / text / literal meaning / semantic role / emotional valence
grouping:   repeated-line ids, opposing-concept pairs, keyword candidates
structure:  sections, long instrumental gaps, held-cue candidates
```

Deliverable: a lyric-analysis document the user can actually read. No visual performance
work starts before it exists. Analysis is reading — it never waits for approval.

## S-B Performance design in batches (~10 lines per batch)

Design the visual performance for **one batch of about 10 consecutive lyric lines**.
The agent chooses and states the exact batch size (by density, roughly 6–14 lines).
**Never design the whole song at once.**

For each line in the batch: semantic job, plate/motif, word-level timing hooks,
transition, and repetition treatment (parameterized, never copy-pasted).

## S-C User approval gate (per batch)

Present the batch design as a short, reviewable plan **before producing any stage
artifact for it**. Batch-level visual-direction questions are asked here — before
designing the batch or the next one, never after building everything.

- approved → the batch's decisions lock (decision log, § 21.8);
- rejected / revised → re-propose the batch; never silently push through;
- inside an approved batch only L0/L1 details are decided autonomously (§ 27.2);
- no response → § 21.10 applies: use the stated default, mark it provisional, keep the
  implementation reversible;
- if the user explicitly says "just proceed": record that as a locked scope decision,
  still deliver batch by batch with the analysis and per-batch summaries attached, so
  course correction stays possible.

## S-D Stage production (per approved batch)

Produce that batch's artifacts: shot-script rows, plates, renders, sync-audit results.
Close each batch with: `designed → approved → produced → audit gaps → open questions`,
then move to the next batch.

## Ordering rules

1. Analysis precedes design; design precedes code — for every batch.
2. Never keep more than one batch designed ahead of approval.
3. This refines the S0–S9 machine (§ 27.1): S1–S3 run once per song; S4–S8 run once
   per approved batch; S9 runs once at the end.
4. The gate covers design and production, not understanding: reading, parsing and
   auditing inputs stay open at all times.

---

# Core rules carried by references (compact)

Sections 3–16 and 21–26 of the original single-file Skill moved verbatim to
[`references/`](references/) so this entry point stays load-efficient. The rules themselves
did not change; the normative one-liners below are quoted from the moved text so this file
remains a complete instruction set on its own.

## Scene / Plate / Compositor → [`references/architecture.md`](references/architecture.md)

- A scene plate is a reusable visual composition resolved from current time.
- Each layer should be close to a pure function: `render(ctx, t, world, cue, progress)`.
- One scene should have one semantic job — do not make one enormous scene function responsible for the entire song.
- Short cues need immediate legibility; a held cue must be explicit in the cue model so validation can distinguish an intentional hold from a missing scene mapping.
- Repetition is a parameterized system (`repeatIndex`, `repeatCount`, `severity`, `phase`) — never copy-paste visually identical scenes.
- The persistent world is the film's long-range memory; sample shared state tracks from semantic anchors instead of per-scene globals.
- History is reconstructed from deterministic event records (`age = t - tk`, `state = f(k, age)`), never from mutable frame state.
- Performance and resolution budgets are declared before expensive effects are added (§ 24).

## Music and lyrics as time-driven events → [`references/music-visual-mapping.md`](references/music-visual-mapping.md)

- Use the strongest available measured data: measured onset/beat → measured audio features → waveform/envelope → estimated timing → nominal BPM only as fallback.
- Map musical features to parameters, not entire scenes by default; use decaying envelopes instead of one-frame spikes.
- Lyrics are events, not subtitles: `lyric meaning → operation / relation / state / measurement → visual behavior`.
- The lyric text remains the user's authoritative source; do not invent replacements when synchronization matters.
- Word-level timing: line-level cues are not enough for "the picture moves when the word is sung" — build word timestamps (syllable-ratio split, then onset snapping inside a ≤600 ms window with a monotonic constraint; no onset ⇒ keep the ratio value). Karaoke lighting and stage keyword switches share **one** word timeline.
- Opposing concepts in lyrics (AC/DC, AD/BC, F/M …) must take visually distinct forms — renaming a shared graphic is not staging; the switch fires on the word's own timestamp.
- Semantic time and musical time are different — § 1.3 above; keep LRC-measured lyric time and musical-grid timing as separate sources (see § 6 and § 7 in the reference).

## Visual system and style adapters → [`references/visual-system.md`](references/visual-system.md)

- The temporal engine is stable; the style adapter changes (Terminal/TUI, minimal, cinematic, typographic, generative, retro/pixel, anime, hybrid).
- Adjectives compile into observable rules (§ 2.4 above) and freeze into a Style Contract (§ 2.3 above).
- Terminal mode obeys the real-program illusion: measured, derived, or explicitly simulated values only.
- Everything that turns on must have an explicit exit — states opened mid-film get a shut-off, and a plate that *is* the lyric's text never bleeds past its own line (stale lyrics are a TIMING defect; negative space is designed).
- Full-screen takeovers are layer-isolated: they cover the performance area only — status/transport/lyric regions stay alive and readable.
- The end state is designed before implementation: INITIAL → MID → PEAK → FINAL.

## Reference analysis → [`references/reference-analysis.md`](references/reference-analysis.md)

- Fidelity is checked during critique: composition, panel topology, area ratios, negative space, typography density, border thickness, palette distribution, contrast hierarchy, motion behavior, information density, visual realism.
- Conflicting references resolve as: explicit user instruction > designated primary reference > repeated shared grammar > secondary reference > agent inference (§ 27.13 below); an architectural conflict with no inferable priority is L3.
- External assets carry provenance: source, license, intended use, modification permission, local filename.

## Workflow, validation, decisions → [`references/workflow.md`](references/workflow.md) · [`references/validation.md`](references/validation.md) · [`references/decision-protocol.md`](references/decision-protocol.md)

- Build workflow: audit inputs → specify → decide → prototype → render → inspect → repair → validate (Steps 0–15; the S0–S9 state machine remains § 27.1 below).
- Validation tests **both** kinds of determinism: *state determinism* — same inputs + same `t` ⇒ same world state / layout state / random seeds; *render determinism* — same state ⇒ visually equivalent frame (`render(t)` twice and compare).
- "Code runs" is not completion: timeline, event coverage, representative renders, text layout and determinism are validated (procedures in `references/validation.md`), then § 27.10 severity and § 27.11 completion gate decide whether the work may be declared done.
- Coverage must prove frames were **drawn**, not that plates were **registered**; the sync audit walks keyword → scene → shot for every cue and gates the final render on zero remaining gaps. When a tool judges the work, first confirm the tool itself is correct — a broken checker makes the film look broken.
- Shot scripting is a hard deliverable: a down-to-disk shot script (timecode / stage content / camera / transition) must correspond row-for-row with the in-code shot table. "Information complete" is not "looks good".
- Interactive clarification follows `references/decision-protocol.md` (§ 21): ask at decision boundaries, batch into small checkpoints, keep the question-tool payload UI-safe, lock answers in a decision log.


---

# Reference map

Numbering gaps in this file are intentional — the missing sections live in `references/`
and are loaded on demand:

| Topic | File | Sections |
| --- | --- | --- |
| Architecture: Scene/Plate/Compositor, world state, history, runtime modules, budgets | [`references/architecture.md`](references/architecture.md) | § 4, § 5, § 10, § 12, § 24 |
| Agent workflow: build steps, behavior contract, prompt template, capability/fallback | [`references/workflow.md`](references/workflow.md) | § 14, § 15, § 16, § 23 |
| Visual system: style adapters, terminal/TUI rules, transitions, floor, end-state | [`references/visual-system.md`](references/visual-system.md) | § 3, § 8, § 9, § 11, § 26 |
| Music-to-visual mapping: beat/onset/energy/MIDI, lyrics as events | [`references/music-visual-mapping.md`](references/music-visual-mapping.md) | § 6, § 7 |
| Reference analysis: inspection, fidelity check, asset provenance | [`references/reference-analysis.md`](references/reference-analysis.md) | § 2.1 extract, § 22.1, § 25 |
| Decision protocol: interactive clarification, locked decisions, question quality | [`references/decision-protocol.md`](references/decision-protocol.md) | § 21 (levels/audit/replan: § 27.2–27.6, § 27.9 here) |
| Validation: timeline/coverage/render/determinism/text checks, critique & repair loop | [`references/validation.md`](references/validation.md) | § 13, § 22 |


---

# 17. Example: terminal-native MV request

A strong request can be compiled from a vague sentence such as:

```text
Make a terminal-style MV from this song.
```

into:

```text
PRIMARY STYLE
Full-screen terminal-native TUI.

BACKGROUND
Pure black.

LAYOUT
Left side: two vertically stacked panels.
Right side: feature bands, data stream, and process/ops panels.
Bottom: progress and transport status.

TYPOGRAPHY
Monospace, compact, high information density.

COLOR
Cold blue-gray base, sparse amber highlight, occasional cyan/error accent.

BEHAVIOR
Waveform follows audio.
Feature bands follow spectrum energy.
Ops follow semantic scene/process state.
Lyrics appear as terminal/session output rather than subtitle cards.
Repeated lyric structures mutate the same process rather than spawning unrelated scenes.

NARRATIVE
boot → normal execution → recognition → increasing activity → instability → takeover → recovery/silence.

REALISM
The interface must feel like a coherent real program, not a decorative cyberpunk HUD.

CONSTRAINTS
No gradients, rounded cards, glassmorphism, uncontrolled random text, or persistent effects without exit conditions.
```

The implementation agent may then specialize this specification using the actual song and reference material.

---

# 18. Quality hierarchy

When trade-offs occur, prioritize:

```text
1. synchronization
2. determinism / seek safety
3. readability
4. coherent visual grammar
5. semantic correspondence
6. compositional quality
7. decorative complexity
```

Never sacrifice the first four to obtain a more spectacular screenshot.

---

# 19. Final definition

A successful implementation should feel like:

```text
one world
one clock
one visual language
many reusable mechanisms
many musical responses
many semantic events
```

not:

```text
one lyric
→ one random effect
→ one new style
→ one unrelated scene
```

The skill is intentionally **style-agnostic at the architecture layer** and **style-specific at the adapter layer**.

That separation is what allows the same realtime MV engine to become:

```text
TUI / terminal
minimal
cinematic
anime
retro
pixel
typographic
generative
abstract
data visualization
cyber
or a controlled hybrid
```

without losing synchronization, determinism, or verifiability.

---

# 20. Reference lineage

The realtime, deterministic, lyric-driven architecture is distilled from the documented design principles of:

`https://github.com/Galen563/world.execute-me`

The purpose of this skill is not to reproduce source code. It generalizes the underlying engineering ideas into a reusable workflow and adds a style-adaptation and prompt-compilation layer for open-ended creative coding agents.

---

# 27. Operational enforcement protocol

This section turns the design principles above into explicit agent-execution rules. It has priority over vague or conflicting defaults elsewhere in the document.

## 27.1 Execution state machine

An open-ended task must move through these states in order:

```text
S0 INSPECT
  ↓
S1 SPECIFY
  ↓
S2 DECISION CHECK
  ↓
S3 LOCK
  ↓
S4 PROTOTYPE
  ↓
S5 RENDER
  ↓
S6 CRITIQUE
  ↓
S7 REPAIR
  ↓
S8 VALIDATE
  ↓
S9 COMPLETION GATE
```

Rules:

- S0 audits inputs and the existing project.
- S1 compiles the Creative Specification and Style Contract.
- S2 detects unresolved decision boundaries.
- S3 records user answers and defaults as provisional or locked decisions.
- S4 implements a representative slice.
- S5 renders actual frames or screenshots.
- S6 classifies defects and assigns severity.
- S7 repairs the highest-severity actionable defect.
- S8 runs automated and visual validation.
- S9 determines whether the work is complete.

The staged-delivery protocol (*Staged delivery: analyze first, design in batches, get
approval, then build*) refines this machine: S1–S3 run once per song, S4–S8 run once
per approved lyric batch, and S9 runs once at the end.

Do not enter S4 while a blocking L3 decision remains unresolved.

## 27.2 Decision levels

Classify every unresolved choice:

```text
L0 — trivial
Internal implementation detail. Decide autonomously.

L1 — reversible
Low-impact visual or technical detail. Use the least invasive default.

L2 — material
Noticeable creative trade-off. Record the choice; ask only if the competing outcomes materially matter to the user.

L3 — architectural
Changes dominant style, layout topology, temporal architecture, asset strategy, renderer architecture, or another major irreversible direction. Ask before implementation.
```

Default behavior:

```text
L0 → decide
L1 → default
L2 → default unless preference materially matters
L3 → ask and wait
```

## 27.3 Question budget and precision

At each decision checkpoint:

- preferred: 1–3 tightly related questions;
- maximum: 4 questions;
- if more than 4 are required, split them across checkpoints.

Separate the **human-facing question** from the **interactive tool payload**.

The normal agent message may contain the full semantic structure:

```text
[DECISION]
What must be chosen.

[WHY]
Why it materially changes the result.

[OPTIONS]
A / B / C with concrete consequences.

[DEFAULT]
What will happen if the user does not care.

[REPLY]
The shortest useful answer format.
```

When using an interactive question tool, the tool payload should instead be:

```text
header   = short category name
question = short decision index
options  = concise selectable labels
id        = stable semantic identifier
```

Tool payload rules:

```text
question / decision index: preferably <= 32 Chinese characters
header: preferably <= 12 Chinese characters
option label: preferably <= 24 Chinese characters
option description: preferably <= 60 Chinese characters when supported
```

Do not place `[WHY]`, `[DEFAULT]`, `[REPLY]`, long rationale, reference analysis, or the full natural-language question inside the tool's `question` field. The tool question is an index for the UI, not a second copy of the message.

The user's answer must be unambiguous relative to the human-facing message.

Never ask a technical implementation question merely because the agent could not decide it.

## 27.4 Interactive tool payload / UI safety

Interactive question tools are treated as a constrained presentation layer. A long question must never make the selectable options disappear, wrap into an unusable layout, or become unreadable.

Before invoking the tool:

```text
1. write the complete human-facing explanation in the normal message
2. reduce the tool `question` to a short semantic index
3. shorten option labels without changing their meaning
4. keep optional descriptions concise
5. ensure every option maps to exactly one decision described in the message
6. invoke the tool
```

Canonical pattern:

```text
Agent message:
  “需要决定这支 MV 的主视觉语法。A/B/C 的区别、影响和默认方案见上文。”

Tool:
  header: “视觉方向”
  question: “主视觉方向”
  options: A / B / C
```

Do not solve UI constraints by deleting necessary creative context. Move context out of the tool payload and keep it in the normal message.

If the host tool does not support descriptions, make the option labels self-contained and keep them short.

If the host imposes an unknown payload limit, prefer the smallest payload that preserves unambiguous selection.

## 27.5 Input audit

Before visual implementation, inspect all available inputs.

Audio:

```text
format
sample rate
channels
duration
decodability
```

Lyrics:

```text
encoding
timestamp syntax
malformed lines
duplicate timestamps
empty cues
```

References:

```text
resolution
aspect ratio
reference type
primary/secondary status
visual grammar
```

MIDI / analysis:

```text
track count
tempo map
event timing
missing analysis sources
```

Required inputs must pass the audit before implementation. Missing optional analysis sources trigger the degradation modes in [`references/workflow.md`](references/workflow.md) (§ 23 Capability and fallback planning) rather than invented data.

## 27.6 Existing-project audit

When modifying an existing project, inspect before adding architecture:

```text
package / build system
entry points
audio transport
renderer
scene / plate system
timeline / lyric parser
existing validation
export pipeline
```

Reuse compatible abstractions. Replacement is allowed only when documented as necessary.

## 27.7 Event model and timeline ordering

Timeline timestamps are non-decreasing, not strictly increasing.

Multiple events may share the same timestamp. Their order must be deterministic using a stable secondary key such as:

```text
(time, priority, stableOrder)
```

Every event must have one declared handling path. A Scene is not required for every event.

## 27.8 Preview and offline export must share the renderer

The visual state pipeline must be transport-independent:

```text
preview:
  audio time → t → render(t)

offline export:
  frameIndex / FPS → t → render(t)
```

Do not maintain separate visual logic for preview and export.

For export:

```text
t = frameIndex / fps + syncOffset
```

Never derive export time by accumulating deltaTime.

## 27.9 Replanning trigger

If a new user request changes any of the following:

```text
dominant style
layout topology
temporal architecture
asset strategy
renderer architecture
```

stop local patching and return to:

```text
SPECIFY → DECISION CHECK → ARCHITECTURE REVIEW
```

Do not preserve an obsolete architecture merely because implementation has already begun.

## 27.10 Defect severity

Every detected defect receives one severity:

```text
BLOCKER — prevents correct execution or violates a core invariant
HIGH    — strongly harms synchronization, readability, style fidelity, or semantics
MEDIUM  — noticeable but non-blocking quality issue
LOW     — minor polish issue
```

Completion is forbidden while a BLOCKER remains. HIGH defects should normally be repaired before delivery. MEDIUM/LOW defects may remain only when documented.

## 27.11 Completion gate

Do not declare completion until:

```text
[ ] required inputs are valid
[ ] no blocking validation errors remain
[ ] no unresolved L3 decision remains
[ ] representative renders were actually inspected
[ ] no known text overlap remains
[ ] synchronization is validated
[ ] Style Contract is satisfied
[ ] preview/export use the same render(t) pipeline
[ ] final output exists and is readable
```

If only MEDIUM/LOW issues remain, report them explicitly rather than pretending the output is perfect.

## 27.12 User priority overrides default aesthetic hierarchy

The Quality Hierarchy in Section 18 is a fallback, not an instruction to override explicit user priorities.

Priority order is:

```text
core technical invariants
→ explicit user-locked priorities
→ Style Contract
→ default Quality Hierarchy
→ agent preference
```

## 27.13 Multi-reference conflict handling

When references disagree, resolve in this order:

```text
explicit user instruction
> designated primary reference
> repeated shared grammar
> secondary reference
> agent inference
```

If no priority can be inferred and the difference is architectural, ask an L3 question.

## 27.14 Deterministic time model

Use seconds as the canonical timeline unit.

For offline frame sampling:

```text
t = frameIndex / fps + syncOffset
```

Cue ordering uses `(time, priority, stableOrder)`.

Playback may use audio time, but export must never accumulate floating-point frame deltas.

## 27.15 Stop condition

Do not iterate indefinitely. After each repair cycle, re-run the completion gate.

Stop when all completion-gate requirements pass and remaining defects are only documented MEDIUM/LOW polish issues.

The goal is not theoretical perfection. The goal is a validated, coherent, reproducible result within the declared performance and time budget.

---

# 28. Audit invariants

The following compact checklist is intended for the agent to run before declaring a task complete:

```text
TEMPORAL
[ ] audio is authoritative
[ ] syncOffset is stable
[ ] export time is frameIndex / FPS
[ ] no accumulated visual clock

INPUT
[ ] audio audited
[ ] lyrics audited
[ ] references audited
[ ] optional analysis availability known

DECISIONS
[ ] L3 decisions resolved
[ ] defaults recorded
[ ] user priorities preserved
[ ] question budget respected
[ ] question-tool payloads are UI-safe
[ ] full question context is in the normal agent message

ARCHITECTURE
[ ] existing project abstractions inspected
[ ] event handlers are explicit
[ ] render(t) is transport-independent
[ ] deterministic seeds are stable

VISUAL
[ ] Style Contract enforced
[ ] reference conflicts resolved
[ ] representative renders inspected
[ ] text layout validated

QUALITY
[ ] defects have severity
[ ] blockers cleared
[ ] completion gate passed
[ ] known limitations reported
```

---

# 29. Mission-preservation check

Before each major implementation phase, the agent must be able to answer:

```text
What part of the user's MV does this work improve?
What evidence says it needs to exist?
Could the same result be achieved more simply?
```

If a proposed abstraction, analysis pass, effect, dependency, or subsystem cannot be tied to a concrete audiovisual requirement, defer or remove it.

Do not optimize the Skill itself at the expense of the MV. The final artifact, not the sophistication of the internal architecture, is the success criterion.

## 29.1 Anti-drift guard

During long-running implementation, periodically compare the current result against:

```text
original user request
primary references
Style Contract
locked creative decisions
song structure
lyric / semantic intent
```

If the implementation has become technically cleaner but visually farther from those constraints, treat that as drift and repair toward the user's intended result.

## 29.2 No architecture for architecture's sake

Do not introduce a new subsystem merely to satisfy a pattern such as:

```text
more abstractions
more classes
more configuration
more validation
more effects
more dependencies
```

A subsystem is justified only when it solves a concrete requirement, repeated behavior, correctness problem, performance problem, or maintainability problem that is actually present in the project.
