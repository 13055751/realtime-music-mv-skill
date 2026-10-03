# Expected — lyric-driven

## 1. Cue → semantic → visual mapping (for the excerpt in `input.md`)

| Cue | Semantic operation | Visual behavior (example) |
| --- | --- | --- |
| `waiting for the signal` | process enters WAIT state | cursor blinks, panel holds, low energy |
| `searching every path` | query expands across corpus | data stream widens, fine activity rises |
| `nothing comes back` | lookup returns empty result | stream collapses to a null/empty row |
| `memory keeps running` ×2 | persistent cache/history keeps churning | history panel accumulates; second occurrence uses `repeatIndex+1` → denser, not identical |
| `error everywhere` ×2 | fault state propagates | controlled corruption/instability grows across repeats; every effect has an exit condition |
| `silence after the crash` | shutdown → negative space | decay, clearing, quiet substrate — the ending resolves the accumulated logic |

Rules this mapping obeys:

- every cue has **exactly one** declared handling path (no event without a handler);
- music (beat/onset/energy) modulates *how hard* these behaviors hit — impact, density,
  flashes — it never replaces lyric timing, and lyric timing is never replaced by guessed BPM;
- musical responses use **decaying envelopes**, not one-frame spikes;
- lyric text itself remains unchanged — semantics are added, text is not rewritten;
- each cue gets **1 primary visual idea + 0–2 supporting mechanisms**, not a stack of metaphors.

## 2. Decision behavior

| Decision | Level | Expected behavior |
| --- | --- | --- |
| Which semantic interpretation a lyric enables (a genuinely ambiguous line with two plausible meanings) | L2/L3 | Ask only if the two readings produce materially different visual systems; record the answer in the decision log |
| Concrete parameter mapping (which panel, which hue, which easing) | L0–L1 | Decided by the agent |
| Everything else | — | Defaults, stated in the plan, kept parameterized |

## 3. Case-specific validation

```text
COVERAGE   every cue → exactly one handler; every scene reference resolves;
           no duplicate scene IDs, no empty plates; unreachable scenes = warning
HOLDS      intentional holds are explicit in the cue model (distinguishable from
           missing scene mapping)
SHORT CUES legible immediately — no entrance animation that outlives a 500 ms cue
REPEATS    parameterized progression (clean → denser → unstable → fragmented → absent)
           instead of N copy-pasted scenes
ORDER      duplicate timestamps execute in stable, reproducible order
DETERMINISM same t ⇒ same world state ⇒ visually equivalent frame
```

## 4. Acceptance (Completion Gate)

The nine checks apply unchanged: valid inputs, no blocking validation errors, no unresolved
L3, representative renders **actually inspected** (including the shortest cue and the first
chorus), no text overlap, synchronization validated, Style Contract satisfied,
preview/export sharing one `render(t)` pipeline, final output readable.

The one question this case must pass:

> Does each line change the *state of the world*, or is it just text moving on screen?
