# Example — minimal

The smallest **complete** MV workflow: one song, one lyric file, no reference images,
no MIDI, no extra analysis. "Minimal" means *few inputs*, not *skipped discipline* —
this example exists to show the irreducible core of the Skill.

## What it exercises

- Input audit with a thin input set (audio + lyrics only → the `MINIMAL` capability tier:
  `audio + lyrics`; every richer source is optional and must degrade gracefully, never be invented).
- Request compilation for an underspecified request (defaults instead of questions —
  low-impact ambiguity must **not** trigger a question).
- One representative slice first: a single section end-to-end before anything is duplicated
  across the song.
- Deterministic `render(t)` + the Completion Gate — even for the smallest possible project.

## Files

| File | Purpose |
| --- | --- |
| [`input.md`](input.md) | The request and the actual input files the agent receives |
| [`expected.md`](expected.md) | The compiled specification and the acceptance checklist |

## When to use this example

Start here when you want to see the workflow itself with the least noise, or when your
request genuinely has no references and no visual brief. If you *do* have references,
see [`../terminal-tui`](../terminal-tui) instead.
