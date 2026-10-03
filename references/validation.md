> Extracted **verbatim** from `SKILL.md` (v2.3.0). Original section numbers are
> preserved for traceability. Numeric cross-references such as "Section 27.2"
> point to sections that remain in `SKILL.md`.

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

Every semantic event must have exactly one declared handling path. Event types may include:

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
[`reference-analysis.md`](reference-analysis.md).)*

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
