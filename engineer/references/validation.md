> Extracted **verbatim** from `SKILL.md` (v2.3.0). Original section numbers are
> preserved for traceability. Numeric cross-references such as "Section 27.2"
> point to sections that remain in `SKILL.md`.
> Sections added after the split are marked **Added in v2.4.0** (field evidence cited inline).

Related rules kept in `SKILL.md`: § 27.5 input audit · § 27.10 defect
severity · § 27.11 completion gate · § 28 audit invariants.

# 13. Validation

## 13.1 Timeline

Verify:

- cue count > 0
- timestamps non-decreasing
- events sharing a timestamp have deterministic stable ordering
- timestamps parsed consistently
- final cue is compatible with measured audio duration
- duplicate timeline copies agree
- malformed cues fail loudly

## 13.2 Event coverage

Every semantic event must have exactly one declared handling path. For a music video, event types may include (for non-music videos, map the same shape to your data/script timeline):

```text
SCENE       → scene / plate
LYRIC       → lyric or semantic handler
MUSIC       → parameter response
STATE       → world-state transition
TRANSITION  → transition handler
ANNOTATION  → instrumentation / text handler
```

Verify:

- every event has a handler
- every scene reference resolves
- no duplicate scene IDs
- no empty plates
- unreachable scenes are warnings
- runtime plate exceptions are surfaced
- events sharing timestamps execute in deterministic order

**Added in v2.4.0 — coverage must prove frames were drawn, not that plates were registered:**

- count real draw primitives (`moveTo` / `lineTo` / `fillText` / `arc` / …) per plate at
  several progress points including `p = 0` — a registration-only coverage check once
  reported 100% while every plate was throwing and nothing was drawn;
- the scene ↔ lyric mapping table carries an **anchor word**: each row is
  `[index, sceneId, a word that must appear in that lyric line]` — alignment by position
  alone silently mismapped a whole act with the total still "correct"; an anchor makes
  the **build** fail instead of the premiere;
- **three-layer sync audit as a gate:** walk every cue through
  `keyword → scene → shot`, export the gap list, and gate the final full-film render on
  `REMAINING GAPS: 0`; after repairs, re-audit to zero **before** re-rendering;
- when gaps exist: audit automatically first, then bring **one short question carrying
  the gap list** to the user — a checklist beats blind review of the whole film
  (field evidence: first audit pass found 13 gaps, 7 of them the user had not noticed).

## 13.3 Rendering

Render representative timestamps from:

- intro
- first semantic transition
- shortest cue
- first chorus/drop
- repetitive section
- bridge/break
- final chorus
- outro

Inspect for:

- text overlap
- clipped text
- blank holes
- excessive background
- stale effects
- unreadable lyrics
- inconsistent layout
- style drift

## 13.4 Determinism

Test both state determinism and render determinism.

State determinism means:

```text
same inputs + same t → same world state / layout state / random seeds
```

Render determinism means:

```text
same state → visually equivalent frame
```

For selected `t`:

```text
render(t)
render(t)
compare
```

Pixel-identical comparison is preferred when the runtime permits it. Otherwise use a documented visual-difference tolerance.

Also:

```text
render(t1)
render(t2)
render(t1)
compare final t1 with fresh t1
```

They should match.

**Added in v2.4.0 — evidence beyond the double render:**

- **byte-level side evidence for visual acceptance:** compare the delivered artifact
  against an **independent single-frame render** via sha256 — screenshot/harness
  pipelines have returned stale or misaligned images; only matching bytes disprove the
  misjudgment (field evidence: 8/8 byte matches before clearing a false defect);
- **in-frame self-identifying timestamp:** embed `t / cue / sec` inside the picture
  content, so a frame proves which moment it claims to be;
- **no still frames:** walk the whole track at a fine step (≈0.15–0.2 s). Every sample
  must draw above a minimum primitive floor **and** differ from the previous sample's
  call-stream digest — a repeated frame is a gap; a run of gaps is reported with its
  time range, named rather than felt (field evidence: 1413 samples, 0 repeats required);
- **verify the verifier:** when a tool judges the film, first prove the tool is correct.
  Field history is unambiguous — broken rasterizers/checkers produced symptoms
  indistinguishable from broken artwork (white-on-white, colors read as channels,
  float colors silently rejected, every gradient flattened). Symptom in the tool ≠
  defect in the film.

## 13.5 Text layout test

Especially for TUI/typographic styles:

- detect bounding-box overlap
- ensure line spacing >= font size + safety margin
- clip text to its panel
- wrap or truncate deliberately
- test at final target resolution

A visually correct concept is not complete if text overlaps.

---

# 22. Visual critique and repair loop

The agent must treat rendering as an iterative feedback loop rather than a final ceremonial step.

```text
prototype
   ↓
render
   ↓
inspect
   ↓
classify defects
   ↓
repair highest-impact defect
   ↓
render again
   ↓
repeat
```

*(§ 22.1 Reference fidelity check lives in
[`reference-analysis.md`](../../director/references/reference-analysis.md).)*

---

## 22.2 Style lock / anti-drift

Once the Style Contract is established, new visual elements must conform to it.

New colors, primitives, panel types, or major effects require an explicit reason.

Do not silently introduce a competing visual grammar during later iterations.

If a proposed improvement conflicts with the Style Contract, prefer modifying the improvement unless the user explicitly requests a style change.

## 22.3 Creative decision log

Maintain a compact record of important design decisions:

```text
Decision
Chosen value
Reason
Source: user / reference / agent inference
Status: provisional / locked
```

When changing a locked decision, state what new evidence caused the change.

## 22.4 Visual defect taxonomy

Classify defects before repairing them:

```text
GEOMETRY
- overlap
- clipping
- misalignment
- wrong proportions

HIERARCHY
- weak focal point
- excessive background
- wrong contrast

TIMING
- late entrance
- early exit
- stale state
- missed accent

STYLE
- palette drift
- typography mismatch
- density mismatch
- wrong visual primitives

SEMANTICS
- lyric meaning mismatch
- meaningless decoration
- fake instrumentation

PERFORMANCE
- excessive draw calls
- expensive per-frame work
- unnecessary allocations
```

Prefer concrete defect reports such as:

```text
D1 STYLE — right panel is too saturated compared with reference.
D2 GEOMETRY — stdout line 7 overlaps line 8 at 1280×720.
D3 HIERARCHY — feature bands overpower the active lyric cue.
```

## 22.5 No premature abstraction

Do not create generic abstractions before a pattern is understood.

Use this progression:

```text
first occurrence → concrete implementation
second occurrence → compare behavior
repeated pattern → extract abstraction
```

Avoid speculative layers whose only purpose is to appear architecturally sophisticated.
