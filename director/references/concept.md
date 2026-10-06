# Concept — Imagination Is a Director's Core Asset

**Added in v2.5.0 refactor · distilled from onetake's concept + rhythm/carry method**

> Mechanics (layers, arc, shot scale) keep a MV *correct*. Concept makes it *memorable*.
> A director with high imagination uses interesting designs at the right moments — a
> Fourier transform of the audio drawn live, a tokenizer visibly splitting a lyric into
> sub-words, a spectrum that becomes the stage. This file is the permission and the
> method for that imagination.

---

## 1. Three central ideas before any beat sheet (hard rule)

Before staging anything, write **three** concepts — each is *one sentence about the
picture*, the single idea the film is made of. They must differ in that central idea,
not retell the same story with different cards:

```text
one element transforms through everything  — a dot is the caret, splits, hollows,
                                            unrolls, lands back as itself
one camera move through scale              — pull in, dive through, come out the other side
one math idea made visible                 — the Fourier transform IS the stage; the
                                            tokenizer IS the lyric character
a chain reaction                           — every beat is the collision that starts the next
a physical metaphor                        — one continuous surface, one material, one room
```

For each concept, name: the hook frame, what carries every boundary, and **its look**
(palette / stage / camera grammar). Show the three to the user, let them pick. Never
default to the first idea that came to mind.

## 2. Creative leverage — interesting designs at the right moments

"Interesting design" is not decoration sprinkled anywhere; it is a *lever* applied
where the song's meaning, energy, or a word's timestamp creates an opening. Concrete
levers you may reach for (and invent beyond this list):

```text
math made visible         Fourier / FFT of the audio as the stage or waveform;
                          spectral bands that become architecture; Lissajous curves;
                          golden-ratio spacing as a layout system
text as living substance  word-level tokenization visibly splitting a lyric into
                          sub-words (the tokenizer itself as a character);
                          characters that carry semantic weight (A/C vs D/C poles)
data as drama             a live-ish measurement panel whose numbers ARE the story;
                          spectrum, energy histogram, onset raster as narrative
physics as language       one spring, one pendulum, one accumulation — a single
                          physical idea that every beat obeys
optical / formal tricks   interference, moire, persistence, afterimage, false
                          parallax, depth from motion — when the song asks for illusion
```

Rules:

- the lever must be **legible** — the audience should be able to say "that is a Fourier
  transform" or "the words are being split by a tokenizer", not "some wavy thing";
- a lever needs a **reason to exist at that moment** — the word is sung, the beat lands,
  the meaning flips. No reason = decoration;
- **one strong lever per film is a signature; five levers in one film is noise.** Go
  deep on one idea before adding another;
- the lever must survive the engineering floors (section 5): if it cannot be made
  deterministic and synchronized, redesign it, do not drop it.

## 3. Rhythm — vary, rest, never a metronome

```text
vary shot length by >= 4x    0.25 s words next to 2.5 s holds
at least one near-silence   in picture and sound
small elements, big ground  70%+ quiet; full-bleed is the exception, not the rule
```

**Never cut on a metronome.** Equal shot lengths read as a slideshow no matter how good
each shot is. Rests are what make the bursts land.

## 4. Carry — something must survive every boundary

At every section boundary, name the thing that **survives and moves** into the next beat:

```text
the subject         a character / object that keeps going
a container         a plate that morphs into the next scene
a camera            pushing into a card until it IS the scene
a stage             opening from the subject
a cast              folding into the final lockup
```

If nothing survives, it is a slide change — whatever the rhythm. **Never replace a beat;
carry it.** Bare cuts belong only to bursts of hits and the end card.

## 5. Freedom within constraint (the three floors)

The floors stay exactly as in staging.md section 6:

```text
1. synchronization — the lever fires when the music/word says so;
2. determinism     — the same timestamp renders the same frame (seeded, no render-path
                     Math.random());
3. enter to exit   — every state opened is closed, including the lever's own.
```

Above these floors, the concept is yours. The imagination bar is *high*: the user expects
a director who reaches for a Fourier transform or a tokenizer at the right moment, not a
director who only assembles safe plates. If a lever is too hard to implement, hand the
engineer a precise spec of what to build — do not silently downgrade to a generic effect.
