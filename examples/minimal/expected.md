# Expected — minimal

What a correct agent run produces for the input in [`input.md`](input.md).

## 1. Decision behavior

| Decision | Level | Expected behavior |
| --- | --- | --- |
| Dominant visual direction | L3 | **One** question asked before any irreversible implementation (e.g. A/B/C concrete directions), batched as a single checkpoint, answer recorded as *locked* |
| Layout details, density, palette specifics, easing, seeds, spacing | L0–L2 | Decided by the agent or documented as parameterized defaults — **no** questions |
| Anything else missing | — | Least-invasive default, stated briefly in the implementation plan, kept parameterized |

If the user never answers: choose the stated recommended default, mark the decision
*provisional*, continue reversibly — never block an executable project on a low-impact preference.

## 2. Compiled specification (shape, not wording)

```text
GOAL            one realtime music video from song.mp3 + song.lrc
INPUTS          audio (audited), lyrics (audited), no references, no MIDI
CANVAS          declared aspect ratio / resolution, design space ≠ output resolution
RUNTIME         one render(t) pipeline shared by preview, playback, offline export
REFERENCE       none → style taken from the L3 answer + stated defaults
MUSIC COUPLING  fallback ladder (no fabricated onset/BPM data)
LYRIC COUPLING  every cue maps to exactly one semantic visual job
VALIDATION      timeline, coverage, determinism, text layout, completion gate
```

## 3. Implementation expectations

- `t = audio.currentTime + syncOffset` is the only clock; `syncOffset` is one stable
  configuration applied to preview, playback, export and validation.
- Offline export computes `t = frameIndex / fps + syncOffset` — no accumulated deltas.
- Cue timestamps are non-decreasing; events sharing a timestamp execute in stable order.
- Randomness (if any) comes from stable seeds, never `Math.random()` during drawing.
- One representative section is built, rendered and inspected **before** the architecture
  is duplicated across the whole song.
- Missing analysis sources degrade the visual system; they are never faked.

## 4. Acceptance (Completion Gate)

```text
[ ] required inputs valid (audio + lyrics audit passed)
[ ] no blocking validation errors
[ ] no unresolved L3 decision (the one question was answered or defaulted as documented)
[ ] representative renders actually inspected (intro, first transition, shortest cue,
    first chorus, outro) — not just "it compiles"
[ ] no known text overlap
[ ] synchronization validated
[ ] Style Contract satisfied
[ ] preview and export use the same render(t) pipeline
[ ] final output exists and is readable
```

Remaining MEDIUM/LOW polish issues must be reported explicitly, not hidden.
