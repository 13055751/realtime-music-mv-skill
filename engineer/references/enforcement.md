> Extracted from SKILL.md (v2.4.0). § 27 operational enforcement protocol
> (minus § 27.14, which lives in temporal.md), § 28 audit invariants, § 29
> mission-preservation check. These are the engineer's guardrails.

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

Audio (*when a track exists*):

```text
format
sample rate
channels
duration
decodability
```

Lyrics (*when lyric input exists*):

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

Required inputs must pass the audit before implementation. Missing optional analysis sources trigger the degradation modes in [`workflow.md`](workflow.md) (§ 23 Capability and fallback planning) rather than invented data.

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

---

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

