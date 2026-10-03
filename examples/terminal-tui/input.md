# Input — terminal-tui

## The request (verbatim, as a user would say it)

```text
Make a terminal-style MV from this song.
song.mp3
song.lrc
reference.png   ← screenshot of a real terminal application
```

## Provided inputs

| Input | File | Audit / analysis the agent must run |
| --- | --- | --- |
| Audio | `song.mp3` | format, sample rate, channels, duration, decodability |
| Lyrics | `song.lrc` | encoding, timestamp syntax, malformed lines, duplicate timestamps, empty cues |
| Reference | `reference.png` | resolution, aspect ratio, primary/secondary status, and reference **type**: is it a screenshot of a real application or merely an illustration? |
| MIDI / analysis | *(optional)* | if present: track count, tempo map, event timing; if absent: degrade, never fabricate |

## Reference inspection checklist (applied to `reference.png`)

```text
composition            panel topology          negative space
color distribution     typography density      border language
hierarchy              animation implications
whether the reference is a screenshot of a real application or merely an illustration
```

Extract the grammar — **do not copy accidental content** (a stray window title, a personal
username, an unrelated log line) into the MV.
