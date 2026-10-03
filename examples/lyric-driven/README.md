# Example — lyric-driven

**Lyrics are events, not subtitles.** This case shows a MV where the visual system is
driven by what the words *mean*, not by where they sit on screen.

```text
lyric meaning
    ↓
operation / relation / state / measurement
    ↓
visual behavior
```

A subtitle track never touches the visual system. A lyric event can change scene
transitions, commands, state changes, object creation/destruction, topology, typography,
process names, labels, errors, measurements and dialogue-like UI — while the lyric text
itself stays the authoritative source (never rewrite lyrics when synchronization matters).

## What it exercises

- Cue → semantic job mapping: **every cue has exactly one semantic visual job**; a held
  plate across several lines must be an *explicit intentional hold*, so validation can tell
  it apart from a *missing scene mapping*.
- Semantic time vs musical time: lyric timing is never replaced by guessed BPM, and not
  every semantic transition is forced onto a beat — beats/onsets/energy still drive impact,
  motion, density and flashes.
- Short-cue legibility: a 500 ms line must not spend its whole life on an entrance
  animation that appears after the cue ends.
- Repetition as a system: repeated lyric structures transform the same mechanism
  (`clean → denser → unstable → fragmented → absent`) instead of spawning unrelated scenes.
- Music-to-parameter coupling: decaying envelopes, not one-frame spikes.

## Files

| File | Purpose |
| --- | --- |
| [`input.md`](input.md) | The request plus an illustrative timed lyric excerpt |
| [`expected.md`](expected.md) | The cue→semantic→visual mapping and case-specific acceptance |

## Where the rules live

In `SKILL.md`, see: *Lyrics are events, not subtitles*, *Musical coupling*,
*Semantic time and musical time are different*, and *Scene and plate architecture*.
