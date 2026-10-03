# Input — lyric-driven

## The request (verbatim, as a user would say it)

```text
Make the visuals follow the meaning of the lyrics, not subtitles.
song.mp3
song.lrc
```

## Illustrative lyric excerpt

The lines below are **placeholders for demonstration** (not a real song). Real runs use
the user's actual lyric file; its text is authoritative and must not be rewritten.

```lrc
[00:12.40] waiting for the signal
[00:15.10] searching every path
[00:18.90] nothing comes back
[00:22.30] memory keeps running
[00:26.00] memory keeps running
[00:29.80] error everywhere
[00:33.10] error everywhere
[00:37.50] silence after the crash
```

## What the audit must catch before design starts

- timestamps **non-decreasing** — the duplicated lines at `00:26.00` / `00:33.10` are legal
  and must execute in stable order `(time, priority, stableOrder)`, not by accident of iteration;
- no empty cues, no malformed lines, no timestamp that runs past the measured audio duration;
- repeated lines are *intentional repetition* → they must map to a **parameterized** mechanism
  (`repeatIndex` / `repeatCount` / `severity` / `phase`), not to a copy-pasted scene;
- the long hold implied by the final line must be modeled as an **intentional hold**
  (so validation doesn't mistake it for a missing scene mapping).

## Deliberately absent

- No MIDI / onset file → music coupling falls down the degradation ladder and must not be fabricated.
- No reference image → no fidelity check; visual grammar comes from the compiled contract.
