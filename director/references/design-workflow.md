> Extracted from references/workflow.md (v2.4.0) — the **director's** portion:
> build Steps 0–11 (design), plus the shot-script hard-deliverable contract.
> The implementation tail (Steps 12–15, behavior contract, prompt template,
> capability fallback, environment traps) lives in engineer/references/workflow.md.

# 14. Build workflow for open creative tasks

Use this exact sequence when the user gives an underspecified request.

### Steps 0–11 (design)

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
