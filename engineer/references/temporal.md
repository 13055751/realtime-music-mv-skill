> Extracted from SKILL.md (v2.4.0) and generalized (v2.5.0) — § 1.1-1.3 temporal
> invariants and § 27.14 deterministic time model, restated for videos of ANY kind
> (with or without an audio track). Related: engineer/enforcement.md for the rest of
> § 27 (S0-S9, audits, gates).

# 1. Non-negotiable temporal invariants

## 1.1 The authoritative time source

Every video declares ONE authoritative time source. The renderer reads it; nothing else
drives visual state.

```text
with audio   -> t = audio.currentTime + syncOffset
without audio-> t = frameIndex / fps + syncOffset   (or a declared data timeline)
```

`syncOffset` is a stable configuration parameter measured in seconds. It must remain
unchanged during a render pass and must be applied consistently to preview, playback,
offline export, and validation.

The time source is **read-only** inside the renderer — written only by an explicit user
seek (audio) or a declared seek (timeline). `syncOffset` is applied to the **clock**, not
to a displayed number: an offset that only changes what the UI prints is decoration, not
synchronization.

Do not accumulate visual time independently from the declared clock (requestAnimationFrame
only presents it).

Never make visual state depend on:

- frame count of accumulated visual time (only via the declared t);
- elapsed wall-clock time accumulated by the renderer;
- mutable previous-frame state;
- random values generated during drawing.

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

The exact implementation may vary. The invariant does not. If continuous noise uses raw
floating-point time, tiny platform-dependent differences are acceptable only when the
project explicitly permits them.

## 1.3 Semantic time and physical time are different

For a lyric-driven or narrative video:

> Semantic cues answer: what is happening in the story or meaning now?

For a music-driven video, music analysis answers: how should the visual system react
physically right now? For a data-driven video, the data axis answers it.

Do not replace semantic timing with a guessed grid (BPM for music, uniform bins for
data). Do not force every semantic transition onto a physical beat. Do use the physical
signal (beats / onsets / energy / data landmarks) for impact, motion, density, flashes,
deformation, and secondary behavior.

---

## 27.14 Deterministic time model

Use seconds as the canonical timeline unit.

For offline frame sampling:

```text
t = frameIndex / fps + syncOffset
```

Cue ordering uses `(time, priority, stableOrder)`.

Playback may use the live time source, but export must never accumulate floating-point
frame deltas — always derive t from the declared source.
