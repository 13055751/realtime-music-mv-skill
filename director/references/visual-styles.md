# Visual Styles — Design Grammar per Style

**Added in v2.5.0 refactor · each style gets an executable design grammar**

> The old skill gave Terminal a full specialist chapter and every other style 6-8 lines
> of keywords. This file raises the floor: each style gets composition / color /
> typography / motion grammar dense enough to direct a real MV — while staying a
> vocabulary, not a checklist. You are free to mix within a dominant grammar.

---

## 1. Terminal / TUI

Composition: square aligned panels, explicit sub-panels, information density balanced
by large quiet black regions; a reference topology exists in visual-system.md § 3.1.

Color: near-black framebuffer, sparse blue/gray base with a single warm accent
(amber), occasional cyan/error accent; values must look like real runtime data.

Typography: monospace only; reserved line boxes, collision-checked; three hierarchy
levels (primary event, secondary state, tertiary quiet instrumentation).

Motion: deterministic redraw / stream / pulse; cursor and selected row as focal
accents; no neon gradients, no glowing glass, no matrix rain unless requested.

---

## 2. Minimal / editorial

Composition: large negative space is the design; a small number of strong motifs;
asymmetric grid with one anchoring element; every element earns its place.

Color: restrained palette (2-3 hues), one dominant light/dark field, one accent;
color does the emotional work that decoration does elsewhere.

Typography: strong hierarchy built from weight + size + leading as a set (not size
alone); tight leading on display text, looser on body; negative tracking on large text.

Motion: slow transitions, gentle ease, long holds; motion is rare and therefore
meaningful; no particle systems unless the concept needs them.

---

## 3. Cinematic / atmospheric

Composition: shot composition rather than dashboard topology; layered depth
(foreground silhouette / midground subject / background atmosphere); framing is a
first-class state (shot-script.md § 5).

Color: controlled light fields; a key-and-fill logic — one dominant source direction,
shadowed regions designed, not default; grade changes with the emotional arc.

Typography: sparing, diegetic or title-card; optical sizing; tracking tightened at
display scale; text is a set piece, not a caption.

Motion: camera-driven (push / pull / pan / tilt), longer holds, cuts land on musical
accents; slow motion / time-stretch for emotional weight; handheld jitter only for
instability (deterministic).

---

## 4. Typographic

Composition: text is the primary visual object and the stage; lyric line geometry is
meaningful (baseline, weight, tracking carry semantics); whitespace is typographic
mass, not emptiness.

Color: mostly monochrome + one semantic color per meaning state (error, memory,
life); color switches carry lyric meaning.

Typography: the star — optical sizing, weight contrast as hierarchy, negative
tracking on display; type can deform, fragment, orbit, rasterize, or become spatial
structure; never mere subtitles.

Motion: kinetic type with one motion family; enters/exits along consistent paths;
word-level timing drives karaoke lighting and stage switches on one shared timeline.

---

## 5. Generative / abstract

Composition: a small mathematical vocabulary (a few primitives + parameters); global
continuity through shared state curves; the world is one system, not isolated
effects.

Color: a designed gradient / field system driven by parameters; hue/lightness map to
musical features; palette drift is a compositional move, not an accident.

Typography: minimal or absent; when present, it is a measurement or annotation inside
the system, not a layer on top.

Motion: parameters respond to music with decaying envelopes, not one-frame spikes;
repetition evolves parametrically; deterministic randomness only (seeded).

---

## 6. Retro / pixel / CRT

Composition: grid / raster structure as the world's skeleton; restricted geometry;
artifacts (scanlines, dither) only when stylistically justified; deterministic
pixel artifacts.

Color: era-restricted palette (NES / 16-color / two-tone); contrast via limited hue
ramps; color-count discipline is the style.

Typography: era-appropriate faces — typography and geometry belong to the same
decade; bitmap rendering, pixel alignment, no anti-aliasing where the era says so.

Motion: chunky motion, frame-quantized movement (deliberate low fps where the era
demands it); glitch / corruption as a language, deterministic and bounded.

---

## 7. Anime / illustrated / character-driven

Composition: character poses, expressions, props, backgrounds and effects as
reusable plates; scene blocking in three layers (foreground action / midground
character / background environment); shot scale carries dramatic meaning.

Color: cel-style palettes — flat fills with designed shadows and highlights; one
emotional grade shift per arc state; effects use additive glow sparingly.

Typography: title cards and signage follow the illustration language, not UI chrome;
type integrated into the drawing (calligraphy, stamps, hand-lettering).

Motion: procedural where possible (hair, cloth, particles), pose-to-pose timing for
key beats; smear / stretch on fast motion; do not force a TUI grammar onto it.

---

## 8. Hybrid — one dominant grammar

Combine adapters by assigning ownership, never by mixing everything:

```text
base style       = cinematic
instrumentation  = TUI
lyrics           = typography
effects          = glitch
```

One dominant grammar decides the frame; the others only own their assigned layer.
If you cannot name the dominant grammar, you do not have a hybrid — you have noise.

---

## 9. The craft bar (shared by all styles)

```text
- nothing is random: every spacing, timing, alignment is a deliberate, defensible choice;
- typography: optical sizing, tracking is size-specific, leading tracks size inversely;
- motion: one motion family per film; ease-out opens, spatial consistency for enter/exit;
- depth: translucency / layering conveys hierarchy — heavier surfaces read as thicker;
- the emotion you want the audience to feel is decided per beat, then reinforced everywhere.
```

Craft is not decoration. It is the aggregate of invisible correctness — a thousand
barely audible voices singing in tune.
