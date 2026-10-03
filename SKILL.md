---
name: universal-realtime-music-mv
version: 2.2.0
description: A general-purpose skill for designing and implementing deterministic, audio-synchronised, code-rendered music videos across terminal/TUI, minimal, cinematic, anime, abstract, generative, data-driven, retro, cyber, typographic, and hybrid visual styles. Includes a prompt-compilation protocol for open-ended coding agents so vague creative requests become concrete, testable implementation plans without prematurely locking the aesthetic.
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

If the user supplied images, inspect them for:

- composition
- panel topology
- negative space
- color distribution
- typography density
- border language
- hierarchy
- animation implications
- whether the reference is a screenshot of a real application or merely an illustration

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

# 3. Style adaptation system

The temporal engine is stable; the **style adapter** changes.

Use this conceptual interface:

```text
StyleAdapter {
  palette()
  typography()
  layout()
  primitives()
  transition()
  motion()
  instrumentation()
  background()
}
```

## 3.1 Terminal / TUI

Use when the reference resembles a real terminal application, ncurses dashboard, htop/btop-like monitor, AI workstation, command console, or system analyzer.

Rules:

- pure black or near-black framebuffer
- full-screen TUI rather than decorative terminal windows
- square panels
- thin low-contrast borders
- monospace typography
- sparse blue/gray/amber accents
- waveform/spectrum when music analysis is visible
- process lists, logs, stdout, token streams, progress, status bars
- selected rows / cursor / current process as focal accents
- information density balanced by large quiet black regions
- values must look like real runtime instrumentation
- avoid generic neon cyberpunk styling unless explicitly requested

A useful topology is:

```text
┌───────────────────────────────┬──────────────────────┐
│                               │ feature / spectrum   │
│       MAIN SESSION            ├──────────────────────┤
│       / WORLD / CHAT          │ corpus / data stream │
├───────────────────────────────┼──────────────────────┤
│       STDOUT / LYRIC          │ ops / process        │
│       / TOKENS                │                      │
└───────────────────────────────┴──────────────────────┘
```

This is a **reference topology**, not a mandatory exact layout. Adapt it to the user's actual reference.

## 3.2 Minimal / editorial

- large negative space
- small number of motifs
- strong typographic hierarchy
- slow transitions
- little instrumentation
- no unnecessary particle systems

## 3.3 Cinematic / atmospheric

- shot composition rather than dashboard topology
- layered depth
- camera/framing as a first-class state
- controlled light fields
- longer scene holds
- musical accents drive cuts or physical impacts

## 3.4 Typographic

- text is the primary visual object
- lyric line geometry is meaningful
- typography can deform, fragment, orbit, rasterize, or become spatial structure
- do not merely display subtitles

## 3.5 Generative / abstract

- define a small mathematical vocabulary
- map music to parameters rather than literal objects
- preserve global continuity through shared state curves
- make repetition evolve parametrically

## 3.6 Retro / pixel / CRT

- restricted palette
- raster/grid structure
- scanline/noise only when stylistically justified
- deterministic pixel artifacts
- typography and geometry should belong to the same era

## 3.7 Anime / illustrated / character-driven

- treat character poses, expressions, props, backgrounds, and effects as reusable plates
- use image assets only when appropriate
- keep motion procedural where possible
- do not force a TUI grammar onto an illustrated style

## 3.8 Hybrid styles

Combine adapters by assigning ownership:

```text
base style = cinematic
instrumentation = TUI
lyrics = typography
effects = glitch
```

Avoid mixing every available style simultaneously. A hybrid still needs one dominant grammar.

---

# 4. Scene and plate architecture

A scene plate is a reusable visual composition resolved from current time.

Conceptually:

```js
plate = [
  layer(background),
  layer(subject),
  layer(annotation),
  layer(lyric),
  layer(effect)
]
```

Each layer should be close to a pure function:

```js
render(ctx, t, world, cue, progress)
```

where `progress` is normalized cue progress.

## 4.1 One scene should have one semantic job

Examples:

```text
boot
waiting
search
connection
recognition
overflow
fracture
recovery
silence
```

Do not make one enormous scene function responsible for the entire song.

## 4.2 Short cues need immediate legibility

For short lyric lines, the subject should become recognizable quickly.

Do not spend most of a 500 ms cue animating an entrance that becomes visible only after the cue ends.

## 4.3 Held cues

A cue may intentionally hold a plate across several lyric lines.

This must be explicit in the cue model so that validation can distinguish:

```text
intentional hold
```

from:

```text
missing scene mapping
```

## 4.4 Repetition is a parameterized system

Never copy-paste ten visually identical scenes.

Use:

```text
repeatIndex
repeatCount
severity
phase
```

Then transform the mechanism over repetitions.

Example progression:

```text
clean → denser → unstable → fragmented → absent
```

---

# 5. World-state model

The persistent world is the film's long-range memory.

Define continuous tracks such as:

```text
structure
energy
chaos
density
warmth
heat
glow
scale
rotation
shatter
tension
```

and discrete modes such as:

```text
idle
loading
running
warning
error
execute
recovery
```

Sample these from semantic anchors rather than giving every scene its own unrelated global state.

The world should make distant scenes feel like chapters of the same machine.

---

# 6. Musical coupling

Use the strongest available measured data.

Priority:

```text
measured onset / beat data
        ↓
measured audio features
        ↓
waveform / envelope
        ↓
estimated timing
        ↓
nominal BPM only as fallback
```

Map musical features to parameters, not entire scenes by default.

Example:

```text
kick      → scale impulse
snare     → cursor / text flash
bass      → deformation amplitude
high freq → fine jitter / particle activity
energy    → density / brightness
silence   → decay / negative space
```

Use decaying envelopes instead of one-frame spikes.

---

# 7. Lyrics are events, not subtitles

Lyrics can control:

- scene transitions
- commands
- state changes
- object creation/destruction
- topology changes
- typography
- process names
- labels
- errors
- measurements
- dialogue-like UI

Semantic translation should usually follow:

```text
lyric meaning
    ↓
operation / relation / state / measurement
    ↓
visual behavior
```

For a terminal style, for example:

```text
waiting
→ process enters WAIT state

searching
→ filesystem / corpus query expands

disappearance
→ lookup returns null / empty result

memory
→ persistent cache/history panel changes
```

The actual lyric text remains the user's authoritative source; do not invent replacements for it when synchronization matters.

---

# 8. Terminal/TUI specialist rules

When terminal mode is selected, follow these additional constraints.

## 8.1 Real-program illusion

The screen should appear to be generated by a coherent program.

Every visible component should have a plausible reason to exist.

Bad:

```text
random numbers + decorative bars + fake CPU + unrelated ASCII
```

Good:

```text
audio.clock → waveform
FFT → feature bands
current cue → session text
render state → FPS
queue → ops
lyric analysis → token stream
world state → process/status values
```

## 8.2 Information hierarchy

Use three levels:

```text
primary   = current event / current lyric / current process
secondary = supporting runtime state
tertiary  = quiet background instrumentation
```

Do not make everything bright.

## 8.3 Panel topology

Panels should be rectangular, aligned, and intentionally sized.

If using a left/right split, prefer explicit sub-panels rather than placing unrelated content into one large canvas region.

A common arrangement is:

```text
LEFT
├── main session
└── stdout / lyric / tokens

RIGHT
├── spectrum / feature bands
├── corpus / data stream
└── ops / process
```

The exact number and order may change with the reference.

## 8.4 Typography density

Terminal text must not overlap.

Before rendering a text block, calculate or reserve its line box.

Use a layout cursor or grid:

```text
x = panel.left + padding
baseline = panel.top + padding
baseline += lineHeight
```

Never position large numbers of lines using unrelated absolute y-values without collision checking.

## 8.5 Realistic instrumentation

Do not display values such as GPU %, CPU %, FPS, token count, cache hit, temperature, or network speed unless they are:

1. measured,
2. derived from actual runtime data, or
3. explicitly marked as simulated.

For an offline rendered MV, simulated instrumentation is acceptable when it is clearly part of the fictional world, but it must still obey deterministic timing.

## 8.6 Avoid generic cyberpunk drift

Unless explicitly requested, do not introduce:

- neon gradients
- glowing glass cards
- holographic UI
- excessive RGB chromatic aberration
- random matrix rain
- rounded dashboard cards
- sci-fi HUD circles everywhere

A terminal aesthetic is primarily typography, layout, state, density, and behavior.

---

# 9. Transition system

Transitions should be selected by semantic and musical context.

Possible transition classes:

```text
hard cut
crossfade
slide / scroll
redraw
reflow
morph
corruption
terminal clear
process takeover
silence / blackout
```

Do not use one transition for every cue.

A transition should communicate something:

```text
new command → redraw
new process  → append
memory       → persistent trace
error        → corruption
silence      → clear / decay
chorus       → topology expansion
```

---

# 10. History without mutable frame state

If the visual concept needs accumulated history, reconstruct it from deterministic event records.

For every event `k` with time `tk <= t`:

```text
age = t - tk
state = f(k, age)
```

This creates memory without storing mutable frame-to-frame arrays.

It remains seek-safe.

---

# 11. Persistent floor

Sparse scenes may use a persistent low-energy substrate:

- faint grid
- slow traces
- waveform envelope
- sparse particles
- quiet annotations
- low-opacity topology

The floor must remain subordinate.

If the foreground is weak, first inspect composition and scene timing. Do not solve every sparse scene by adding more particles.

---

# 12. Browser/runtime architecture

Recommended conceptual modules:

```text
00_core        math / easing / deterministic noise
01_audio       audio clock / duration / features
02_timeline    lyric + cue normalization
03_world       shared state curves
10_draw        low-level rendering primitives
15_sceneapi    plate registry / transitions / isolation
20_lyrics      cue lookup / semantic mapping
30_music      onset / beat / spectrum helpers
35_motifs      reusable visual vocabulary
40_plates      scene implementations
50_validate    self-tests / coverage / determinism
60_app         playback / seek / UI / compositor
```

Keep film-specific drawing out of the audio clock and transport layer.

When `file://` compatibility matters:

- avoid unnecessary ES-module/CORS dependencies
- use robust relative paths
- keep local assets discoverable
- report audio-loading failures visibly
- never silently fall back to a fake clock

---

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

For UI/TUI styles, define the complete panel topology before implementation and reserve text layout boxes so that text can never overlap.

For open-ended visual tasks, implement one representative section first, render it, inspect it, repair it, and then generalize the architecture.

After implementation, render representative timestamps and run synchronization, scene coverage, text-layout, runtime, and determinism checks.

Do not declare success based only on code compilation.
```

Then append the user's actual request and assets.

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


# 21. Interactive clarification protocol

This skill may be executed interactively. The agent is **allowed and encouraged to ask the user questions repeatedly when the answer materially affects the result**. Asking is not a failure state; asking the wrong or low-value question is.

## 21.1 When to ask

Ask a question when at least one of these is true:

- two plausible interpretations would produce materially different visual systems;
- a missing choice changes architecture, scene topology, asset requirements, or rendering technology;
- a reference image contains an important ambiguity that cannot be resolved safely by inference;
- the user's desired priority is unclear (reference fidelity vs originality, lyric readability vs visual density, realism vs stylization, performance vs complexity);
- a required input is missing and cannot be reconstructed reliably;
- implementation has reached a genuine creative fork where the user should choose the direction.

Do **not** ask merely because an option was not explicitly specified if a reasonable reversible default exists.

## 21.2 Ask at decision boundaries, not continuously

Do not interrupt every implementation step.

Batch related questions into a small decision checkpoint. A useful cadence is:

```text
brief → ask if necessary → prototype → render → ask if a meaningful fork remains → refine → validate
```

For a long task, the agent may ask multiple rounds of questions, but each round should correspond to a real decision boundary.

## 21.3 Every question must be precise

Never ask:

```text
你想要什么风格？
你觉得怎么样？
还有什么要求吗？
要不要更酷一点？
```

Instead, ask a question that identifies the exact decision, explains why it matters, and constrains the answer space.

Required structure:

```text
[DECISION]
What exact choice is unresolved?

[WHY IT MATTERS]
What part of the implementation changes?

[OPTIONS]
A. ...
B. ...
C. ...

[RECOMMENDED DEFAULT]
If you have no preference, I will use ...

[ANSWER FORMAT]
Reply with A/B/C or describe your own option.
```

Keep each question independently answerable.

## 21.4 Prefer concrete visual choices over abstract adjectives

Convert vague questions into observable decisions.

Bad:

```text
你想要更赛博一点吗？
```

Good:

```text
[DECISION] Accent behavior
A. restrained blue-gray + sparse amber, matching the reference
B. stronger cyan highlights and more active glow
C. high-contrast neon palette

This changes border emphasis, waveform intensity, selection states,
and musical impact effects.
```

## 21.5 Ask about priorities when trade-offs exist

If two valid goals conflict, ask which should dominate.

Example:

```text
[PRIORITY]
For the TUI layout, should the system prioritize:
A. reference fidelity — preserve the dense professional-monitor look
B. lyric readability — give the lyric/stdout panel more space
C. balanced — preserve topology while increasing lyric contrast

If unspecified, use C.
```

Do not silently optimize for an assumed preference.

## 21.6 Ask with a preview whenever possible

If the uncertainty is visual, prefer generating two or three small prototypes over asking the user to describe an abstract preference.

```text
uncertain visual choice
        ↓
render A / B / C
        ↓
ask: "Which direction: A, B, or C?"
```

The prototypes may differ only in the disputed dimension. Do not change five variables at once.

## 21.7 One question may contain tightly coupled subchoices

A question can contain 2–4 tightly related options when answering them together is easier.

Avoid giant questionnaires.

Bad:

```text
Please answer these 17 design questions...
```

Good:

```text
[LAYOUT DECISION]
Choose the dominant composition:
A. left-heavy 2+1 TUI
B. balanced 3-column monitor
C. full-screen central session with small instrumentation

Then choose density:
1. sparse
2. medium
3. dense
```

## 21.8 Preserve answers as locked decisions

After the user answers, update the Creative Specification and Creative Decision Log. Partial answers lock the answered decisions; unanswered low-impact choices use defaults rather than triggering unnecessary re-questions.

Do not repeatedly ask the same question unless new evidence genuinely invalidates the previous decision.

Record:

```text
DECISION
VALUE
REASON / SOURCE
LOCKED: yes/no
```

## 21.9 Never use clarification to outsource the design work

The agent remains responsible for making reasonable creative decisions.

The user should choose only where human preference materially matters.

The agent should independently decide things such as:

- variable names
- internal module boundaries
- easing implementation
- cache strategy
- exact seed values
- low-level drawing code
- minor spacing adjustments

The agent should ask about things such as:

- dominant visual direction
- competing reference interpretations
- major layout topology
- lyric readability vs density
- asset usage preference
- whether a major stylistic deviation is desired

## 21.10 Clarification timeout / no-response behavior

If the environment requires progress and the user does not answer:

1. choose the stated recommended default;
2. mark the decision as provisional;
3. continue with a reversible implementation;
4. make the affected parameter easy to change later.

Never block an otherwise executable project on a low-impact preference.

## 21.11 Question quality test

Before sending a question, verify:

```text
[ ] Is there a real unresolved decision?
[ ] Would different answers materially change the output?
[ ] Can the user understand the difference without technical knowledge?
[ ] Are the options concrete?
[ ] Is there a sensible default?
[ ] Can the answer be given in one short reply?
[ ] Is the question within the per-checkpoint question budget?
[ ] Am I asking because I need the user's preference rather than because I failed to decide?
```

If the answer to the last question is "yes", decide it yourself.

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

## 22.1 Reference fidelity check

When references are supplied, compare the implementation against them using:

- composition
- panel topology
- relative area ratios
- negative space
- typography density
- border thickness
- palette distribution
- contrast hierarchy
- motion behavior
- information density
- visual realism

When multiple references conflict, use this priority order:

```text
1. explicit user instruction
2. explicitly designated primary reference
3. repeated common visual grammar
4. secondary references
5. agent inference
```

If the conflict would materially change the architecture and no priority can be inferred, treat it as an L3 decision.

Do not ask only:

> Does this look cool?

Ask:

> Does this still belong to the same visual language?

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

# 24. Performance and resolution budgets

## 24.1 Performance

Define a target before adding expensive effects.

Consider:

- CPU cost
- memory allocation
- draw calls
- text rendering cost
- offscreen canvas usage
- particle count
- FFT frequency
- export cost

Prefer cached geometry, bounded particles, batched drawing, and lower-frequency analysis when visually sufficient.

## 24.2 Resolution independence

Separate design space from output resolution.

Support either:

```text
continuous normalized layout
```

or:

```text
terminal grid layout
```

depending on the style.

Do not assume that coordinates designed for one screenshot automatically work at the final render resolution.

## 24.3 Semantic density budget

Each cue should normally have:

```text
1 primary visual idea
0–2 supporting mechanisms
optional background substrate
```

Do not stack multiple competing metaphors onto every lyric simply because the renderer can.

---

# 25. Asset provenance

For external assets, track:

```text
source
license
intended use
modification permission
local filename
```

Prefer user-provided, procedural, public-domain, or appropriately licensed assets.

Do not silently substitute arbitrary external copyrighted assets.

---

# 26. End-state design

Define the visual destination before implementation:

```text
INITIAL STATE
MID STATE
PEAK STATE
FINAL STATE
```

The final section should resolve the accumulated visual logic rather than simply stop when the audio ends.

Examples:

```text
boot → running → overload → corruption → recovery → clean prompt
```

or:

```text
full composition → fragmentation → sparse residue → silence
```

The exact ending is style-dependent, but the endpoint must be intentional.


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

Every question must contain:

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

Never ask a technical implementation question merely because the agent could not decide it.

## 27.4 Input audit

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

Required inputs must pass the audit before implementation. Missing optional analysis sources trigger the degradation modes in Section 23 rather than invented data.

## 27.5 Existing-project audit

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

## 27.6 Event model and timeline ordering

Timeline timestamps are non-decreasing, not strictly increasing.

Multiple events may share the same timestamp. Their order must be deterministic using a stable secondary key such as:

```text
(time, priority, stableOrder)
```

Every event must have one declared handling path. A Scene is not required for every event.

## 27.7 Preview and offline export must share the renderer

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

## 27.8 Replanning trigger

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

## 27.9 Defect severity

Every detected defect receives one severity:

```text
BLOCKER — prevents correct execution or violates a core invariant
HIGH    — strongly harms synchronization, readability, style fidelity, or semantics
MEDIUM  — noticeable but non-blocking quality issue
LOW     — minor polish issue
```

Completion is forbidden while a BLOCKER remains. HIGH defects should normally be repaired before delivery. MEDIUM/LOW defects may remain only when documented.

## 27.10 Completion gate

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

## 27.11 User priority overrides default aesthetic hierarchy

The Quality Hierarchy in Section 18 is a fallback, not an instruction to override explicit user priorities.

Priority order is:

```text
core technical invariants
→ explicit user-locked priorities
→ Style Contract
→ default Quality Hierarchy
→ agent preference
```

## 27.12 Multi-reference conflict handling

When references disagree, resolve in this order:

```text
explicit user instruction
> designated primary reference
> repeated shared grammar
> secondary reference
> agent inference
```

If no priority can be inferred and the difference is architectural, ask an L3 question.

## 27.13 Deterministic time model

Use seconds as the canonical timeline unit.

For offline frame sampling:

```text
t = frameIndex / fps + syncOffset
```

Cue ordering uses `(time, priority, stableOrder)`.

Playback may use audio time, but export must never accumulate floating-point frame deltas.

## 27.14 Stop condition

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
