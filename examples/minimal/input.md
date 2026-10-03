# Input — minimal

## The request (verbatim, as a user would say it)

```text
Make a music video for this song.
song.mp3
song.lrc
```

That is the whole request: no style word, no reference image, no layout hint.

## Provided inputs

| Input | File | Audit the agent must run before designing |
| --- | --- | --- |
| Audio | `song.mp3` | format, sample rate, channels, duration, decodability |
| Lyrics | `song.lrc` | encoding, timestamp syntax, malformed lines, duplicate timestamps, empty cues |
| References | *(none)* | — no reference ⇒ no reference-fidelity check; style must come from the request, not from invented references |
| MIDI / onset / energy | *(none)* | absence recorded as "missing optional analysis", **not** fabricated |

## What is deliberately missing

- No style adjectives → the dominant visual direction is unresolved, and that choice is
  architectural (**L3**), so exactly *one* question must be asked before implementation.
  Everything else still defaults — low-impact ambiguity must not trigger a question.
- No visual references → no reference fidelity check, but the Style Contract is still required.
- No analysis data → musical coupling falls back down the ladder
  (measured onset/beat → features → waveform/envelope → estimated timing → nominal BPM only as fallback).
