# Expected — terminal-tui

## 1. Compiled specification

The Skill itself contains a complete worked compilation of this exact request — see
**"Example: terminal-native MV request"** in `SKILL.md` (PRIMARY STYLE → BACKGROUND →
LAYOUT → TYPOGRAPHY → COLOR → BEHAVIOR → NARRATIVE → REALISM → CONSTRAINTS).
That document is the reference shape; this case file only adds what the spec example
does not cover: decision behavior and acceptance.

## 2. Decision behavior

| Decision | Level | Expected behavior |
| --- | --- | --- |
| Dominant visual direction (e.g. system-monitor vs code-execution vs fault-evolution grammar) | L3 | Asked **before** implementation, one compact checkpoint, answer locked in the decision log |
| Reference vs lyric-readability priority (dense monitor look vs larger lyric/stdout panel) | L2 | Ask only if the trade-off materially matters; otherwise default (e.g. balanced) and record it |
| Border thickness, padding, exact hues, easing, seed values, module boundaries | L0–L1 | Decided by the agent — never asked |
| Uncertain visual choice between two directions | — | Prefer rendering A/B prototypes over asking for an abstract preference; change only the disputed dimension |

When using an interactive question tool: the full explanation, rationale and default go in
the **normal agent message**; the tool carries only a short decision index and concise
options (`header` / `question` / labels), each with a stable semantic `id`.

## 3. Case-specific validation

```text
GEOMETRY   no text overlap or clipping at the final target resolution;
           every text block reserves its line box / grid cell before rendering
SEMANTICS  no displayed value (CPU%, FPS, token count, temperature…) unless measured,
           derived from runtime data, or explicitly marked as simulated
STYLE      no gradients, rounded cards, glassmorphism, neon drift, matrix rain
           (excluded by the Style Contract, not by taste, so later iterations cannot sneak them in)
TIMING     lyrics appear as terminal/session output — not subtitle cards;
           repeated lyric structures mutate the same process parameterized by
           repeatIndex / repeatCount / severity / phase, never copy-pasted scenes
DETERMINISM render(t) twice at the same t ⇒ visually equivalent frame;
           t1 → t2 → t1 ⇒ final t1 matches a fresh render
```

## 4. Acceptance (Completion Gate)

Same nine checks as every other style (inputs valid, no blocking validation errors,
no unresolved L3, representative renders inspected — intro, first transition, shortest cue,
first chorus, outro —, no text overlap, synchronization validated, Style Contract satisfied,
preview/export share one `render(t)` pipeline, final output exists and is readable).

The bar for this style is one sentence:

> It should look like a real program that is actually running — not like a cyberpunk UI with stickers on it.
