# Changelog

All notable changes to the **Universal Realtime Music MV Skill**.

Versions follow `MAJOR.MINOR.PATCH`. Entries are grouped by what the shipped
`SKILL.md` actually contains. Where no archived artifact exists for a version,
the entry is explicitly marked as *reconstructed* from project documentation
([`docs/readme_ai.md`](docs/readme_ai.md)) instead of being presented as verified.

---

## [2.4.0] — 2026-10-04

**Evidence sources:** real-run feedback (*"the model just builds, never asks"*), the
`world.execute(me)` production record ([`Galen563/world.execute-me`](https://github.com/Galen563/world.execute-me))
and the TUI MV build log distilled into `skill-patch-reference.md` (6 delivery rounds,
v1 rejected for missing a shot script, word-level sync acceptance, 13-gap audit → 0).

### Added — staged delivery workflow (SKILL.md core, mandatory for open-ended requests)

- **S-A Lyric analysis** — the whole lyric file is analyzed end to end (meaning, roles,
  repetition groups, opposing pairs, structure) into a readable document **before any
  visual design**. Analysis never waits for approval; design does.
- **S-B Design in batches** — performance design covers **one batch of ~10 consecutive
  lyric lines** (agent states its exact size, roughly 6–14 by density). Never the whole
  song at once.
- **S-C User approval gate per batch** — the batch plan is presented *before any stage
  artifact is produced*; approval locks decisions, rejection re-proposes, no-response
  falls back to § 21.10 (default + provisional + reversible), and an explicit
  "just proceed" is itself recorded as a locked scope decision while delivery stays
  batch-wise.
- **S-D Per-batch production** — artifacts + sync-audit results per batch, closed with
  `designed → approved → produced → audit gaps → open questions`.
- Ordering rules and an explicit mapping onto the S0–S9 machine (§ 27.1: S1–S3 once per
  song, S4–S8 per approved batch, S9 once).
- `§ 1.1` hardened: `audio.currentTime` is **read-only** in the renderer; `syncOffset`
  applies to the **clock**, not to a displayed number.

### Added — field-distilled rules in `references/` (each marked *Added in v2.4.0*)

- `music-visual-mapping.md` — **word-level timeline** (syllable-ratio split → onset
  snapping inside ≤600 ms, monotonic; one shared timeline for karaoke lighting and stage
  switches: *the lamp lights only when the word is sung*); **opposing concepts take
  distinct forms** (renaming a shared graphic is not staging); **LRC time and the
  musical grid stay separate sources**.
- `architecture.md` — **lyric display lifetime** `min(gap, 0.8 + chars×0.09)` s, sing →
  clear (stale lyrics = TIMING defect); **held cues resolve at lookup** (validator rule:
  *every cue must RESOLVE TO a plate*); repeated groups read as **one entity** via a
  parameterized factory + shared constants.
- `workflow.md` — **shot script as a hard deliverable** (disk document ↔ in-code shot
  table, row for row) and an **environment traps appendix** (CJK drawtext, same-origin
  loading, fail-loud shape checks, visible acceptance artifacts for math effects, heavy
  renders out of git, parse-before-write batch edits).
- `validation.md` — coverage proves frames were **drawn**, not that plates **registered**;
  anchor-word mapping tables fail the *build* instead of the premiere; **three-layer sync
  audit gate** `keyword → scene → shot` with `REMAINING GAPS: 0`, then ask the user once
  *with the gap list*; **byte-level sha evidence** for visual acceptance, **in-frame
  timestamps**, a **no-still-frames sweep**, and **verify the verifier** before blaming
  the film.
- `visual-system.md` — **layer-isolated takeover** (performance area only; lyrics and
  transport stay readable); **everything that turns on must have an exit**; **text
  plates do not bleed** past their line; a motif's second occurrence **reuses the
  established language**.
- `reference-analysis.md` — **repository hygiene**: copyrighted audio, finished video,
  heavy renders and ops documents stay out of git; decide *before* the first push.

### Status

- ⚠️ Rules are distilled from real production evidence, but this Skill revision itself
  has **not yet been run end-to-end** in a fresh session; 2.2.0 remains the
  field-tested baseline for the pre-split skill.

---

## [2.3.0] — 2026-10-03

Verified against the shipped artifact `realtime-music-mv-universal-skill-v2.3.0.zip`
(`SKILL.md`, 54 765 bytes, 2 191 lines, frontmatter `version: 2.3.0`).

### Fixed — interactive question tool payload (found in real host failures)

Root cause: a long `question` field can prevent constrained host UIs from rendering the
options at all. 2.3.0 separates the two channels:

- **Full context lives in the normal agent message** — question, why it matters, options
  with consequences, recommended default, reply format. The interactive tool carries only
  a short header, a short decision index and concise options.
- The tool's `question` field is an **index**, not a copy of the natural-language question.
  Never put `[WHY IT MATTERS]`, `[RECOMMENDED DEFAULT]`, `[REPLY]`, long rationale,
  reference analysis or implementation rationale into it.
- UI-safety size budgets: decision index ≤ 32 CJK characters, header ≤ 12, option label ≤ 24,
  option description ≤ 60 when supported. These are *payload* budgets — context is **moved
  out of the tool, never deleted**.
- New enforcement subsection **§ 27.4 "Interactive tool payload / UI safety"** (§ 27.5–27.15
  renumbered accordingly), extended question-quality checklist, stable semantic `id` per
  decision, and a North-star addition: *the host UI is a delivery constraint, not the product*.
- No duplication: the message carries meaning, the tool carries selection.

### Note — a planned bullet does not exist in the artifact

The release brief for 2.3.0 also mentioned *"the recommended option no longer has to be
listed first"*. **No such rule exists anywhere in the shipped 2.3.0 `SKILL.md`** (verified
by search). Per project policy — actual content wins, never invent history — it is *not*
recorded as a change. If intended, it must be written into the Skill first.

### Changed — repository structure (this repository)

- Monolithic `SKILL.md` split into an entry point + `references/` (7 files):
  - **kept in `SKILL.md`**: § 0 mission / north-star, § 1 temporal invariants, § 2 request
    compiler, § 17 worked example, § 18–20 quality / final definition / lineage, § 27
    operational enforcement protocol (L0–L3, audits, ordering, shared `render(t)`, replan,
    severity, completion gate), § 28 audit invariants, § 29 mission check — plus a compact
    restatement of every moved rule (*Core rules carried by references*) and a reference map;
  - **moved verbatim**: § 3–§ 16 and § 21–§ 26 → `references/architecture.md`,
    `workflow.md`, `visual-system.md`, `music-visual-mapping.md`, `reference-analysis.md`,
    `decision-protocol.md`, `validation.md` — original section numbers preserved;
  - exactly two pointer adaptations (the § 2.1 image-inspection bullets move to
    `reference-analysis.md` while their core rule stays in `SKILL.md`; the § 27.5 reference
    to "Section 23" now links `references/workflow.md`);
  - fidelity verified by line-multiset comparison against the shipped artifact:
    **0 lines lost, 0 lines duplicated, all cross-links resolve**.
- Added `README.md` (English), `README.zh-CN.md`, `examples/`
  (minimal / terminal-tui / lyric-driven), and `docs/readme_ai.md` (original document
  preserved instead of overwritten).

### Status

- ⚠️ **Not yet field-tested.** 2.3.0 fixes the 2.2.0 known issue but has not been verified
  in real runs. Until it is, **2.2.0 remains the field-tested baseline**.

---

## [2.2.0] — 2026-10-02

Verified against the shipped artifact `realtime-music-mv-universal-skill-v2.2.0.zip`
(`SKILL.md`, 49 730 bytes, 2 087 lines, frontmatter `version: 2.2.0`).

### Added — Mission Lock

- **North-star rule**: *"The purpose of this Skill is to help an agent make the user's music MV, not to make the agent's architecture look impressive."*
- **Mission-preservation check (§ 29)**: every abstraction must answer *what part of the user's MV does this improve / what evidence says it needs to exist / could the same result be achieved more simply*, plus anti-drift guard and *"no architecture for architecture's sake"*.

### Added — operational enforcement protocol (§ 27)

The design principles became explicit agent-execution rules with priority over vague defaults elsewhere:

- execution state machine `S0 INSPECT → … → S9 COMPLETION GATE`;
- decision levels **L0 / L1 / L2 / L3** with default behavior (`decide / default / default / ask and wait`);
- question budget and precision rules;
- **input audit** (audio, lyrics, references, MIDI/analysis) before visual implementation;
- **existing-project audit** — reuse compatible abstractions, replacement only when documented;
- event model: timestamps **non-decreasing**, stable ordering by `(time, priority, stableOrder)`;
- **preview / playback / offline export share one `render(t)` pipeline** (`t = frameIndex / fps + syncOffset`);
- **replan trigger** on dominant-style / layout / temporal / asset / renderer changes;
- **defect severity** `BLOCKER / HIGH / MEDIUM / LOW`;
- **completion gate** (9 checks) + **stop condition** (no infinite polishing);
- user-locked priorities override the default quality hierarchy;
- multi-reference conflict order: explicit instruction > primary reference > shared grammar > secondary > agent inference;
- deterministic time model (seconds canonical, no accumulated frame deltas).

### Hardened

- Determinism split into **state determinism** and **render determinism** with an explicit test procedure (§ 13.4).
- Deterministic randomness (`seed(sceneId, eventId, elementId)`), no uncontrolled `Math.random()` (§ 1.2).
- **Audit invariants (§ 28)**: compact pre-completion checklist grouped as TEMPORAL / INPUT / DECISIONS / ARCHITECTURE / VISUAL / QUALITY.

### Known issues

- 🐞 **Interactive question payload too long** (found in real agent runs): when the agent passes the whole `[DECISION] / [WHY IT MATTERS] / [OPTIONS] / [RECOMMENDED DEFAULT]` block inside an interactive question tool's `question` field, some host UIs cannot render the options at all. Workaround on 2.2.0: put the full context in the normal agent message and keep the tool payload short. **Fixed in 2.3.0.**
- ✅ **Otherwise field-tested**: 2.2.0 is the baseline version confirmed working in real runs.

### Note on sources

Two descriptions of 2.2 exist in the project record: the original project document calls it *"adds the Mission Lock (Skill 是缰绳，不是目标)"*, while the release brief also credits *"enhanced determinism, input audit, existing-project audit, replan, completion gate"*. **Both claims are verifiable in the shipped 2.2.0 artifact** (North-star rule + § 27.4–27.10), so both are recorded instead of choosing one.

---

## [2.1.0] — date unknown · *reconstructed*

- Agent execution workflow (phases / build steps / behavior contract).
- Decision boundary and severity levels.
- Input audit, existing-project audit, determinism rules.
- Validation mechanism introduced as a first-class concern.

*Source: `docs/readme_ai.md` and the release brief. No archived 2.1.0 artifact is available for verification.*

---

## [2.0.0] — date unknown · *reconstructed*

- **Universal Skill-ification** of the original realtime MV methodology:
  - style adaptation / style-agnostic architecture;
  - scene & plate system;
  - lyrics as events;
  - music coupling;
  - validation;
  - open-ended prompt compilation (vague request → Specification).

*Source: `docs/readme_ai.md`. No archived 2.0.0 artifact is available for verification.*

---

## [1.x] — date unknown · *reconstructed*

- Original realtime MV methodology distilled into a minimal pipeline:

  ```text
  audio → time → visual state → render
  ```

- Realtime, deterministic, lyric-driven, time-based, code-rendered — principles
  distilled from the documented design of
  [`Galen563/world.execute-me`](https://github.com/Galen563/world.execute-me).

*Source: `docs/readme_ai.md`. No archived 1.x artifact is available for verification.*

---

[2.4.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.4.0
[2.3.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.3.0
[2.2.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.2.0
