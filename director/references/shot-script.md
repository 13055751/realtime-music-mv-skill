# Shot Script — Directing Method

**Added in v2.5.0 refactor · how to *fill* the shot script, not just its format**

> The old skill defined the shot-script table columns but never taught how to fill them.
> This file is the missing half: shot scale, staging, emotional arc on screen, camera
> language, transition choice. Same freedom principle — principles and vocabulary,
> not a checklist.

---

## 0. The script is a file — write it in multiple rounds (hard rule)

The director's output is **a script file on disk**, not a one-shot answer. Reasons:

- a long script needs **many writing rounds** — a single model output has a context
  limit, so you write a batch, save it, continue with the next batch;
- reading the script is nearly free — the engineer reads the whole file without
  exhausting context, so **do not compress the staging to fit one answer**;
- detailed staging needs *a lot* of text — one pass is never enough.

Write protocol:

```text
round 1   write the skeleton: shot table rows + one-line emotion per shot
round 2+  for each shot, expand the staging in detail (what is on screen, how it
          moves, light, rhythm, the emotion the audience feels) — append to the file,
          never rewrite what is already good
last      re-read the whole file once, fix contradictions, check the arc reads
```

Rules:

- **append, don't compress**: each round grows the file; the final script is the full
  accumulation, not a summary;
- the shot table stays the skeleton (row-for-row contract with code), but the staging
  columns are written in **full prose-level detail**, not abbreviations (shot-script.md § 1.5: prose + tech breakdown per shot);
- if a round runs low on context, **stop at a clean boundary and save** — the file is
  the working memory, the conversation is only the front end;
- the engineer reads the complete file; its size is not a problem.

---

## 1.5 Per-shot delivery: prose + tech breakdown (hard minimum)

Each shot row is expanded in the script body as TWO blocks. One-liners are not a script.

PROSE (the viewer's experience):
  what the audience sees, in order; composition, layers, focus, motion, light,
  rhythm, the emotion felt at this moment — written like a scene description in a
  screenplay, not a label. At minimum several full sentences; prefer a paragraph.

TECH BREAKDOWN (how the engineer implements it):
  the implementation direction for THIS shot, concrete enough that the engineer
  can code it without inventing: which data source (audio FFT bins / lyric tokens /
  data axis), which technique (canvas path / particle system / camera transform /
  waveform drawing / tokenizer split), key parameters (bin count, particle count,
  easing curve name, color values, duration ms), and what must be deterministic.
  This is NOT code; it is the director's implementation spec.

Rules:

- **no tech breakdown, no shot**: a shot the engineer must improvise the technique
  for is a shot the director has not directed. If unsure, say what the technique
  should achieve and let the engineer propose in E-3 — but never leave it blank;
- **prose first, tech second**: the viewer experience decides; the technique serves it;
- a Fourier transform / tokenizer / particle system / camera move is ONLY allowed in a
  shot if the tech breakdown names it explicitly — otherwise the engineer must NOT
  add such techniques on its own (no invented spectacle);
- typical output volume: a 3-minute song with ~60 shots produces a script file of
  several thousand words. If your script is a few hundred words, it is too short:
  write more rounds until every shot has its prose + tech blocks.

### Parameter checklist (what short really means)

A shot is executable only when these concrete values are present. Short is not
line count — it is how many of these the director actually specified:

```text
1. COLORS in concrete form     #RRGGBB / rgba() for every visible surface;
2. GEOMETRY in numbers         x / y / w / h / radius, or a named layout rule;
3. MOTION with numbers         duration ms, easing curve name, from/to values;
4. TYPE with values            text content, font family, size px, weight, tracking;
5. LAYERS explicit             z-index / draw order / blend mode for each layer;
6. DATA MAPPING named          which audio/data signal drives which parameter;
7. RHYTHM stated in ms         when the shot starts, when key moves hit;
8. DETERMINISM noted           what is seeded / what must be reproducible.
```

If the tech breakdown answers all 8, the engineer translates. Answering 3-4 means
the engineer invents the rest — that is not directing, that is leaving the design
to chance. When in doubt, specify numbers, not feelings.
---
## 1.55 Worked example — one shot, fully specified

So the abstraction becomes concrete, here is ONE shot written the way the script
file should look for every shot (this is the density floor):

```text
SHOT 012 | t=74.2s-78.6s | lyric: dancing in the dark | scale: CLOSE-UP

PROSE:
  The word dark hangs large on screen as deep-navy luminous glyphs, slightly
  out of rhythm with each other, each glyph breathing with a slow sine. Behind it,
  the audio low FFT band swells into a soft blue haze filling the lower half.
  A single warm highlight (the dancing accent) drifts across the glyphs like a
  flashlight, easing across the frame. Mood: intimate, late-night, contained.

TECH BREAKDOWN:
  - canvas, deterministic; audio = FFT via AnalyserNode, 128 bins, t = audio.currentTime;
  - glyphs: 12 glyphs from lyric tokenizer split, font Space Grotesk 96px weight 500,
    color #0A1E3C with glow (shadowBlur 24, shadowColor #2E5CFF);
  - per-glyph phase = hash(glyphId) * 0.7s, y-breathe = 4px * sin(2*PI*(t - phase)/2.8s);
  - haze: low band avg (bins 0-15) mapped to radial gradient alpha 0.15-0.45, color #1B2A52;
  - highlight: soft radial (r 160px) rgba(255,214,170,0.55), x = easeInOut(t-74.2)/4.4s * 900,
    y fixed 300, duration 4.4s, curve cubic-bezier(0.65,0,0.35,1);
  - determinism: seed = 74.2, all randomness hash(sceneId, shotId, glyphIdx);
  - layers: glyphs z=3, haze z=1, highlight z=2; screen blend for haze only.
```

Rules:

- every shot in the script file reaches THIS density before handoff to E-3;
- the example is a floor, not a ceiling: simpler shots need fewer lines, but every
  value the engineer needs must be stated or explicitly marked as engineer choice;
- when the script review sees a shot with prose but no numbers, it flags: incomplete.
## 1.6 Visual design mockups — show, don't describe (hard requirement)

Before a batch is approved, the user must SEE the design — text-only approval is
banned ("what I imagined" never matches "what you wrote").

Produce at least 1-3 **static key-frame mockups** per batch:

- static HTML/CSS/SVG/canvas stills (or a single-timestep render in the chosen
  runtime), expressing composition, palette, typography, depth, atmosphere;
- each mockup maps to a specific shot-row id in the table (same id = same look);
- the mockup is a DESIGN DRAFT, not final rendering — fast, cheap, disposable;
- deterministic stills: same mockup id + same t renders the same pixels.

Rules:

- no mockups, no approval: S-C is a VISUAL gate; text-only batches are rejected
  before discussion;
- mockups lead, prose explains: the sketch shows the look, the prose argues the
  choices; if prose and mockup disagree, the mockup wins in the user's eyes;
- when a user says "I imagined it differently", the answer is a NEW mockup, not
  a longer explanation — iterate visually until the picture matches;
- keep mockups cheap: one or three stills per batch, never a full render loop.

---
## 1. The shot script table

```text
| # | timecode | shot name | stage content | tech breakdown | camera / motion | transition | emotion intent |
```

Every row maps one-to-one to an in-code shot-table entry (same ids, same timecodes);
the correspondence must be checkable, not implied. The emotional arc must be readable
from this table alone. When code and script disagree, one of them is wrong — fix the
pair before rendering.

**The table is the SPINE, not the whole script.** The table lives inside a SCRIPT FILE
(shot-script.md section 0) whose body — per shot — carries the two mandatory expansions
below. A table alone, or a script whose rows are one-liners, FAILS the quality floor;
it must be written out multi-round to full prose + tech detail.

---

## 2. Shot scale (when to use what)

Shot scale is a semantic statement, not a zoom level:

```text
EXTREME CLOSE-UP  a single word / glyph / eye     -> intimacy, obsession, precision
CLOSE-UP          subject fills the frame          -> emotion, presence, confession
MEDIUM            subject + some context           -> action, conversation, agency
WIDE              subject small in the world       -> isolation, scale, awe
EXTREME WIDE      world dominates                  -> context, destiny, transition marker
```

Rule of thumb: scale changes are *punctuation*. A sudden push-in lands an emotional
beat; a sudden pull-back resets the stage. Do not wander between scales without a
reason — pick a scale per beat and commit.

---

## 3. Staging per shot

For each shot, answer in plain director language:

```text
WHAT is on screen?         (subject, supporting elements, environment)
WHERE is the focus?        (one focus; everything else supports it)
HOW does it move?          (one motion family; see staging.md § 4)
WHEN does it change?       (word/data timestamp, beat, or emotional inflection)
WHY does the audience feel? (state the intended emotion explicitly)
```

Three-layer staging (staging.md § 1) applies per shot: foreground action, midground
subject, background atmosphere. If a shot has no focus, it is a placeholder, not a shot.

---

## 4. Emotional arc on screen

The arc is not abstract — it must be *visible in camera and motion choices*:

```text
calm    -> slow push, wide framing, low energy, long holds
build   -> asymmetry, rising density, tightening framing
burst   -> fast cuts, motion blur / stretch, full-frame takeover, high contrast
tail    -> decay, negative space, long static take, quiet micro-motion
```

If the script says "calm" but the shot says "cut every second," the script is lying.
The emotion column and the camera column must agree.

---

## 5. Camera language (for code-rendered MVs)

Even without a real camera, framing is a first-class state:

```text
PAN       lateral shift             -> continuity, scanning, tension release
PUSH-IN   zoom / scale toward       -> emphasis, intimacy, inevitability
PULL-OUT  zoom / scale away         -> release, isolation, context
TILT      vertical sweep            -> hierarchy, revelation
HANDHELD  bounded jitter            -> urgency, instability (must be deterministic)
STATIC    no camera motion          -> gravity, monumentality, letting the stage act
```

Camera moves with musical accents, not against them. A push-in landing on the beat is
impact; a push-in landing 200ms off is drift.

---

## 6. Transition choice (when to use what)

Transitions are semantic punctuation, never default glue:

```text
hard cut        -> new command, new section, energy spike
crossfade       -> continuity, memory, dream
slide / scroll  -> progression, process, flow
redraw          -> reload, re-init, system event
reflow          -> layout change, growth
morph           -> transformation, identity shift
corruption      -> error, instability, breakdown
terminal clear  -> reset, silence, rebirth
process takeover -> the stage changes owner (keep lyrics/transport alive)
blackout        -> death, silence, end
```

One transition per cue is a failure mode; a transition that communicates nothing is
decoration. Pick the transition that says what the moment is.

---

## 7. Repetition discipline

A repeated lyric line is a *character*, not a re-run:

```text
first occurrence   -> establish the motif's language
second occurrence  -> speak the established language (same grammar, denser / evolved)
never             -> copy-paste the identical scene
```

Opposing concepts (AC/DC, AD/BC, F/M) take distinct visual forms — renaming a shared
graphic is not staging. The switch fires on the pole's own word timestamp.

---

## 8. Exit discipline (everything opened must close)

```text
- every state opened mid-film gets an explicit, deterministic shut-off;
- a plate whose subject *is* a lyric line is cut at its own line end — it never
  bleeds into crossfade tails or past its vocal;
- a motif's second occurrence reuses the established language (shared functions,
  different content).
```

A parameter that latches at the climax and never closes repaints the ending into a
different film.
