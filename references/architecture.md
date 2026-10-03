> Extracted **verbatim** from `SKILL.md` (v2.3.0). Original section numbers are
> preserved for traceability. Numeric cross-references such as "Section 27.2"
> point to sections that remain in `SKILL.md`.

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
