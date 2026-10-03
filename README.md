# Universal Realtime Music MV Skill

> A general-purpose **Skill for AI coding agents** that designs, implements, renders, inspects and iterates realtime music videos — driven by audio, lyrics, reference images and user intent.

**Current version:** `2.4.0` · **Status:** Experimental / actively evolving · **License:** MIT · 中文版：[README.zh-CN.md](README.zh-CN.md)

---

## The problem this solves

Ask a coding agent to *"make an MV for this song"* and you will typically get one of these:

- code starts before the visual goal is understood;
- lyrics become subtitle cards, one random effect per line;
- music, lyrics and picture have no real causal relationship;
- reference images are treated as paste-in assets instead of a visual grammar;
- animation depends on `frameCount`, `deltaTime` or uncontrolled randomness, so seeking and export break;
- the code "runs", but nobody ever looked at a rendered frame;
- on creative forks the agent either decides unilaterally or interrogates the user forever;
- architecture keeps growing while the MV drifts further from what was asked.

This Skill exists to turn that process into a controlled pipeline:

```text
music + lyrics + references + user intent
        → Creative Specification
        → Style Contract
        → music / lyric analysis
        → visual world model
        → Scene / Plate system
        → deterministic render(t)
        → render & inspect
        → repair / refine
        → MV
```

## The one rule

```text
Skill is the leash, not the goal.
The MV is the goal.
Code is only a tool.
```

Every abstraction, validator, effect or subsystem in this Skill must answer one question: *"Which part of the MV does this concretely improve?"* If a simpler implementation produces the same audiovisual result, the simpler implementation wins.

## Why a Skill instead of a prompt

| Ordinary prompt | This Skill |
| --- | --- |
| one-shot text, re-typed every session | a durable methodology the agent loads every run |
| describes a wish ("make it cool") | compiles the wish into a testable Specification and Style Contract |
| no rule about when to ask questions | explicit decision levels (L0–L3): decide alone, default, or ask |
| "done" = compiles | "done" = a Completion Gate: validated, inspected, synchronized output |
| drifts with every iteration | Mission Lock + anti-drift checks keep the work pointed at the MV |

## Core design ideas

1. **Mission Lock** — the Skill serves the MV, not the agent's architecture. Technical purity never outranks the user's intent.
2. **Audio-first** — `t = audio.currentTime + syncOffset` is the single clock. Never `t += deltaTime`, never `frameCount++`.
3. **Deterministic rendering** — same inputs + same `t` ⇒ same state ⇒ visually equivalent frame. Randomness comes from stable seeds like `seed(sceneId, eventId, elementId)`.
4. **Lyrics are events, not subtitles** — `lyric meaning → operation / relation / state / measurement → visual behavior`.
5. **Music-to-visual mapping** — beat, onset, energy, MIDI and silence map to *parameters* (density, deformation, pulse, decay), not to one-off decorative flashes.
6. **Plate-based visual system** — reusable Scene / Plate / Compositor layers, each close to a pure function `render(ctx, t, world, cue, progress)`; repetition is parameterized, never copy-pasted.
7. **Style-agnostic core, style-specific adapters** — the same temporal engine drives TUI, minimal, cinematic, typographic, generative, retro, anime or hybrid looks.
8. **Open-ended request compiler** — a vague sentence is first compiled into a Specification, Style Contract, layout topology, mappings and a validation plan.
9. **Decision boundary (L0–L3)** — trivial details are decided by the agent; architectural forks are asked before implementation, batched at checkpoints, then locked.
10. **Validation as a gate** — input audit, timeline/coverage/determinism/text-layout checks, defect severity (BLOCKER→LOW) and a Completion Gate stand between "it runs" and "it is done".

## Workflow

The agent moves through an explicit state machine; rendering is a loop, not a ceremony:

```text
S0 INSPECT      audit inputs + existing project
S1 SPECIFY      Creative Specification + Style Contract
S2 DECISION     detect unresolved decision boundaries (L0–L3)
S3 LOCK         record user answers / defaults as provisional or locked
S4 PROTOTYPE    implement one representative slice
S5 RENDER       render real frames
S6 CRITIQUE     classify defects by severity
S7 REPAIR       fix the highest-impact defect
S8 VALIDATE     automated + visual validation
S9 GATE         Completion Gate, then stop
```

```text
prototype → render → inspect → classify → repair → render again → …
```

No irreversible implementation begins while a blocking L3 decision is unresolved, and no completion is declared without inspecting representative renders.

### Staged delivery (since 2.4.0)

Real runs showed agents "just building" an entire MV in silence. The Skill now enforces a
delivery rhythm for open-ended requests:

```text
whole-song lyric analysis   (readable document, before any design)
        ↓
performance design for ONE batch of ~10 lyric lines   ← agent picks the exact size
        ↓
USER APPROVAL GATE          (plan only — no stage artifacts yet)
        ↓
produce that batch          (shot-script rows, plates, renders, sync audit)
        ↓
next batch … → final completion gate
```

Analysis precedes design; design precedes code; nothing beyond the approved batch is
designed ahead. The user always sees a reviewable plan before anything heavy is built.

## Core architecture

```text
                         AUDIO TIME
                             │
       ┌─────────────────────┼──────────────────────┐
       │                     │                      │
   lyric cues         beat/MIDI/onset/spectrum   structure/energy
       │                     │                      │
       └─────────────────────┼──────────────────────┘
                             ▼
                       WORLD STATE
        (style system, persistent substrate, scene plates, transitions)
                             ▼
                         COMPOSITOR
                             ▼
                            FRAME
```

Any time `t` decides its frame on its own. Preview, playback and offline export share **one** `render(t)` pipeline — export computes `t = frameIndex / fps + syncOffset` instead of accumulating deltas — which is what makes seeking, screenshots, reproducible debugging and render/export consistency possible at once.

## How to use

1. **Install the Skill** into your agent host's skill directory so `SKILL.md` is loaded (for DSH: `~/.dsh/skills/<skill-name>/SKILL.md`; other hosts: their equivalent skill/plugin folder).
2. **Give it a real request** with whatever inputs you have:

   ```text
   Make a terminal-style MV from this song.
   audio: song.mp3   lyrics: song.lrc   reference: screenshot.png
   ```

3. **Answer only what matters.** The agent compiles the request itself and asks only at real decision boundaries (dominant visual direction, layout topology, lyric readability vs density, asset strategy…). Everything else uses documented defaults.
4. **Look at the output together.** The agent must render representative timestamps and report `implemented / validated / known limitations / next refinement`.

For hosts whose agents need extra discipline, the Skill also contains a ready-made prompt
template — see *Prompt template for DeepSeek / open-ended coding agents* in
[`references/workflow.md`](references/workflow.md).

### Why audio-first

If the visual clock runs on its own, every transport operation — pause, seek, replay, screenshot, offline export, debug-by-timestamp — becomes a separate code path that can disagree with the others. Anchoring time to the audio element collapses all of them into one function of `t`, and `syncOffset` stays a single stable configuration applied consistently to preview, playback, export and validation.

### Why deterministic rendering

A music video is watched in every order: scrubbed, re-watched, exported frame by frame, compared against the reference. If a frame depends on accumulated state, wall-clock time or `Math.random()` during drawing, the same timestamp produces different pictures — seeking jumps, exports drift, and defects cannot be reproduced. Determinism is not aesthetic purity; it is what makes inspection and repair possible at all. The Skill separates **state determinism** (same inputs + `t` ⇒ same state) from **render determinism** (same state ⇒ visually equivalent frame) and validates both.

### Why lyrics are not subtitles

A subtitle track never touches the visual system. Treating lyrics as *semantic events* lets the same cue change scene state, data flow, typography, density or camera behavior — so the words participate in the picture instead of floating on top of it. The lyric text itself stays authoritative: never invent replacements when synchronization matters.

### Why decision checkpoints

Two failure modes kill open-ended creative work: the agent deciding taste questions alone, or asking a 17-question questionnaire. Decision levels fix both — L0/L1 are decided or defaulted by the agent, L2 is recorded, and only L3 (dominant style, layout topology, temporal architecture, asset strategy, renderer architecture) must be asked *before* implementation, batched into small checkpoints, and locked afterwards so the same question is never re-asked.

## Repository layout

```text
realtime-music-mv-skill/
├── README.md            ← this file (for humans)
├── README.zh-CN.md      ← Chinese version
├── SKILL.md             ← the Skill: entry point executed by agents
├── references/          ← detailed manuals, loaded on demand
│   ├── architecture.md          Scene/Plate/Compositor, world state, runtime, budgets
│   ├── workflow.md              build steps, behavior contract, prompt template, fallbacks
│   ├── visual-system.md         style adapters, terminal/TUI rules, transitions, end-state
│   ├── music-visual-mapping.md  beat/onset/energy/MIDI coupling, lyrics as events
│   ├── reference-analysis.md    reference inspection, fidelity check, asset provenance
│   ├── decision-protocol.md     interactive clarification, locked decisions, question quality
│   └── validation.md            timeline/coverage/determinism/text checks, critique loop
├── LICENSE              ← MIT
├── CHANGELOG.md         ← version evolution + known issues
├── examples/
│   ├── minimal/         ← smallest complete MV workflow
│   ├── terminal-tui/    ← terminal/TUI case (compiled spec example)
│   └── lyric-driven/    ← lyrics driving visual events
└── docs/
    └── readme_ai.md     ← original project document (Chinese)
```

`SKILL.md` stays self-sufficient: it keeps the mission, temporal invariants, request
compiler, worked example, quality hierarchy, lineage, enforcement protocol (L0–L3, audits,
severity, completion gate) and audit checklist, and quotes the core rules of every moved
section. Numbering gaps in `SKILL.md` are intentional — each gap points to the reference
file that now carries that section, with original section numbers preserved.

## Version and evolution

| Version | What changed |
| --- | --- |
| `1.x` | Real-time MV methodology distilled from practice: audio → time → visual state → render |
| `2.0.0` | Universal Skill-ification: style adapters, scene/plate system, lyrics-as-events, validation, prompt compilation |
| `2.1.0` | Agent workflow, decision boundary, input/existing-project audit, determinism rules |
| `2.2.0` | Mission Lock; hardening of determinism, audits, replan trigger and completion gate — the field-tested baseline |
| `2.3.0` | UI-safe interactive question payloads (message/tool separation); repository split into `SKILL.md` + `references/` |
| `2.4.0` | Staged delivery (lyric analysis → ~10-line design batches → user approval → per-batch production) + field-distilled rules (word-level sync, sync-audit gate, shot script, exit discipline) — **current, not yet field-tested** |

Full history, sources and known issues: [CHANGELOG.md](CHANGELOG.md).

## Project origin

The realtime, deterministic, lyric-driven architecture is **inspired by** the documented design principles of [`Galen563/world.execute-me`](https://github.com/Galen563/world.execute-me): audio-driven, deterministic, lyric-driven, time-based, code-rendered.

No source code was copied. This project abstracts those ideas into a reusable agent methodology and adds style adaptation, open-ended prompt compilation, an interactive decision protocol, validation and visual critique. **There is no official affiliation or collaboration with the original author** — attribution is a credit of inspiration, not a partnership.

## Known issues

Declared per release in [CHANGELOG.md](CHANGELOG.md) instead of being hidden:

- **v2.2.0** — interactive question tool payloads that carry the whole
  `[DECISION] / [WHY] / [OPTIONS] / [DEFAULT]` block can prevent host UIs from rendering
  the options. **Fixed in v2.3.0** (context moved to the normal message; the tool payload
  is reduced to a short decision index). Otherwise v2.2.0 is the field-tested baseline.
- **v2.3.0** — contains that fix but **has not been field-tested yet**; real failures are
  welcome so they can be folded into the next patch.
- **v2.4.0** — its rules are distilled from real production evidence, but the revision
  itself has not yet been run end-to-end in a fresh session.

## License

[MIT](LICENSE). Copyright © 2026 tsukikage.

Attribution: design inspiration from `Galen563/world.execute-me` (see *Project origin*).
