> Extracted **verbatim** from `SKILL.md` (v2.3.0). Original section numbers are
> preserved for traceability. Numeric cross-references such as "Section 27.2"
> point to sections that remain in `SKILL.md`.
> Sections added after the split are marked **Added in v2.4.0** (field evidence cited inline).

# 14. Build workflow for open creative tasks

Use this exact sequence when the user gives an underspecified request.

### Step 0 — Audit inputs and existing project

Before designing architecture, inspect:

```text
INPUTS: audio, lyrics, references, MIDI, analysis data
PROJECT: package/build system, entry points, audio transport, renderer, timeline/lyric parser, scene/plate abstractions, validation
```

Do not recreate an abstraction that already exists unless there is a documented reason.

### Step 1 — Parse

Extract all explicit requirements and references.

### Step 2 — Identify the dominant grammar

Choose one primary style family.

### Step 3 — Resolve decision boundaries

Run the Decision Level check in Section 27.2. Ask all required L3 questions before irreversible implementation.

### Step 4 — Create the style contract

Turn subjective adjectives into observable implementation rules.

### Step 5 — Analyze the music

Determine:

- duration
- lyric structure
- sections
- energy curve
- onset density
- likely peaks
- silence/breaks

### Step 6 — Build the visual arc

Describe the film in semantic states, not individual frames.

**Added in v2.4.0:** the storyboard is not a mental step — a shot script must be written
to disk (timecode / stage content / camera / transition) and later correspond **row for
row** with the in-code shot table. "Information complete" is not "looks good"; a film
without a shot script is a pile of dashboards. See *Shot script as a hard deliverable*
at the end of this file.

### Step 7 — Define panel/layout topology

For UI-like styles, explicitly draw the panel hierarchy before implementation.

### Step 8 — Define reusable motifs

List primitives before writing scene code.

### Step 9 — Define world-state tracks

Make the long-range visual evolution explicit.

### Step 10 — Map cues to plates

Each cue must have a semantic visual job.

### Step 11 — Map music to parameters

Avoid arbitrary beat-synced decoration.

### Step 12 — Implement the smallest complete slice

Build one representative section end-to-end before duplicating the architecture across the whole song.

### Step 13 — Render and inspect

Use actual screenshots/frames, not only code review.

### Step 14 — Repair drift

Fix overlap, density, style inconsistency, timing, and stale state.

### Step 15 — Validate

Run timeline, coverage, layout, runtime, and determinism checks.

---

# 15. Agent behavior contract

When another coding agent is executing this skill, it should follow these rules.

## Before coding

Before implementation, complete the input/project audit and the decision-boundary check. If any L3 decision remains unresolved, ask the user and stop before irreversible implementation.

Return a concise implementation brief containing:

```text
1. interpretation
2. style contract
3. layout / scene topology
4. music-to-visual mapping
5. architecture
6. validation plan
```

Then implement only if no blocking L3 decision remains unresolved. Low-impact unanswered choices use the documented defaults.

## During coding

- preserve the authoritative audio clock
- reuse existing abstractions when editing an existing project
- avoid speculative rewrites
- keep style constants centralized
- parameterize repetition
- fail loudly on missing data
- keep visual functions deterministic
- render representative checkpoints

## After coding

Report:

```text
implemented
validated
known limitations
next highest-value refinement
```

Do not claim that a visual issue is fixed without rendering or inspecting the relevant output.

---

# 16. Prompt template for DeepSeek / open-ended coding agents

When the target agent struggles with broad creative instructions, prepend a task with the following structure.

```text
You are implementing a realtime music MV using the Universal Realtime Music MV Skill.

DO NOT start by writing the whole application.

First compile my request into:
1. Creative Specification
2. Style Contract
3. Layout / Scene Topology
4. Music-to-Visual Mapping
5. Cue-to-Plate Mapping
6. Reusable Motifs
7. Runtime Architecture
8. Validation Plan

Interpret subjective style words as concrete visual rules.
Treat supplied reference images as visual grammar references, not assets to copy.
Preserve the reference's composition, density, hierarchy, typography, color restraint, and behavior while replacing its content with the requested subject.

Use audio time as the single authoritative clock.
Make every frame deterministic from timestamp and stable event data.
Do not use uncontrolled randomness or frame-count animation.
Do not create decorative effects merely because they look impressive.
Every visible element must have a semantic, musical, or runtime reason to exist.

If the request is ambiguous, make the least invasive reasonable assumption and keep it configurable instead of blocking on unnecessary questions.

When asking through an interactive question tool, put the full explanation in the normal agent message and use only a short decision index plus concise options in the tool payload. Never put a long `[DECISION] / [WHY] / [OPTIONS] / [DEFAULT] / [REPLY]` block inside the tool's `question` field.

For UI/TUI styles, define the complete panel topology before implementation and reserve text layout boxes so that text can never overlap.

For open-ended visual tasks, implement one representative section first, render it, inspect it, repair it, and then generalize the architecture.

After implementation, render representative timestamps and run synchronization, scene coverage, text-layout, runtime, and determinism checks.

Do not declare success based only on code compilation.
```

Then append the user's actual request and assets.

---

# 23. Capability and fallback planning

Before implementation, audit the actual environment:

```text
file access
runtime
audio decoding
audio analysis
rendering
FFmpeg / export
image generation / asset handling
network availability
available inspection tools
```

Do not design around capabilities that are not available.

Use graceful degradation:

```text
FULL
audio + lyrics + onset + spectrum + MIDI

REDUCED
 audio + lyrics + waveform

MINIMAL
audio + lyrics

CLOCK-ONLY
audio clock
```

A missing optional analysis source must not invalidate the entire visual system.

---

# Shot script as a hard deliverable

**Added in v2.4.0 (field evidence: v1 was rejected wholesale with "你这镜头脚本都没有";
v2 added the script and passed).**

Before implementing scenes, write a shot script to disk:

```text
| # | timecode | shot name | stage content | camera/motion | transition |
```

Rules:

- every row maps **one-to-one** to an entry of the in-code shot table (same ids, same
  timecodes) — the correspondence is checkable, not implied;
- each row names the lyric lines it covers, its camera behavior, and its transition
  class from § 9;
- the emotional arc must be readable from the script alone (e.g. calm → breakdown →
  reboot → warm → quiet → close);
- when code and script disagree, one of them is wrong — fix the pair before rendering;
- the shot script is also the unit that passes the S-C approval gate in staged delivery.

# Environment traps (toolchain appendix)

**Added in v2.4.0 — each item cost a real debugging session.**

1. **ffmpeg `drawtext` mangles CJK** (garbled + truncated; `textfile` does not fix it) →
   compose text in a browser canvas (headless screenshot) and let the system font engine
   do the glyphs.
2. **`about:blank` pages cannot load `file://` images** (EncodingError) → `page.goto` a
   same-origin local page first, then load assets.
3. **Cross-module data-shape mismatches fail silently** (array read as object returns
   `undefined`, switches fall back to defaults with no error) → assert the shape
   explicitly; when a lookup misses, **fail loud**.
4. **Math-based effects need a visible acceptance artifact** (a wrong slope just means
   "one fewer line" — nobody reports it) → draw the slope label / point markers so the
   value is checkable on screen.
5. **Heavy render output (thousands of PNGs) never enters git** — determinism means it
   can be rebuilt; same for copyrighted audio and finished video (see § 25).
6. **Batch text replacement is not editing** — in some shells `-replace | Set-Content`
   re-encodes the file and double-encodes every non-ASCII character. Prefer tooling that
   parses before writing: replace → parse → only then save.
