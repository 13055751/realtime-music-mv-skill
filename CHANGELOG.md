# Changelog

All notable changes to the **Universal Realtime Music MV Skill**.

Versions follow `MAJOR.MINOR.PATCH`. Entries are grouped by what the shipped
`SKILL.md` actually contains. Where no archived artifact exists for a version,
the entry is explicitly marked as *reconstructed* from project documentation
([`docs/readme_ai.md`](docs/readme_ai.md)) instead of being presented as verified.

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

[2.2.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.2.0
