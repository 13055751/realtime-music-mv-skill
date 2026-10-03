# Changelog

All notable changes to the **Universal Realtime Music MV Skill**.

Versions follow `MAJOR.MINOR.PATCH`. Entries are grouped by what the shipped
`SKILL.md` actually contains. Where no archived artifact exists for a version,
the entry is explicitly marked as *reconstructed* from project documentation
([`docs/readme_ai.md`](docs/readme_ai.md)) instead of being presented as verified.

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

[2.3.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.3.0
[2.2.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.2.0
