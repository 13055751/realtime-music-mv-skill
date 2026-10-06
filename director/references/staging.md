# Staging — Scene Choreography Method

**Added in v2.5.0 refactor · design methodology, not a checklist**

> Your freedom is the freedom *inside* the skill's boundaries: this file gives you
> **vocabulary and principles**, not a straitjacket. Your judgment is the product;
> rules are scaffolding. Every rule here can be broken once you can explain *why*.

Staging = deciding **what is on screen at each moment, how it moves, and what the
audience feels at that moment**. This is not laying out lyric cards; it is directing
a scene.

---

## 1. Three-layer stage (default mental model)

Think of any frame as three layers, and allocate attention deliberately instead of
letting elements fight for it:

```text
FOREGROUND  ACTION      what moves / what speaks
MIDGROUND   SUBJECT     the emotion-bearing subject (lyric image, character, core graphic)
BACKGROUND  ATMOSPHERE  mood / environment (grid, stars, tint, noise)
```

Principles:

- One layer moves, two stay. Everything moving = nothing moves (no attention anchor).
- The background is mood, not information — it should *breathe*, not compete.
- Layers may rhythmically swap roles (background rising to foreground = a transition);
  a swap needs a reason.
- At most one visual focus per frame. If the audience does not know where to look,
  the staging failed.

---

## 2. Emotional arc

The whole song is one emotional curve; staging places beats on that curve. Draw the
arc first, then place shots:

```text
energy
  ^                __/~~__          <- PEAK
  |          __~~      ~~__
  |      __~                 ~~__    __
  |   ~~                        ~_/   <- quiet / tail
  +-------+-------+-------+-------+----> time
      calm    build   burst   settle
```

Principles:

- Define INITIAL -> MID -> PEAK -> FINAL first (end-state design), then fill detail.
- Emotional inflection points (calm -> tension, burst -> tail) are *shot-language
  switch points*, not arbitrary cuts.
- Long instrumental gaps are a chance for the stage to breathe, not dead zones —
  design breathing (decay, negative space, residue).
- The arc must be readable from the script alone ("calm -> breakdown -> reboot ->
  warm -> quiet").

---

## 3. Rhythm and breath

An MV is not equally dense every second. Rhythm comes from *density contrast*:

```text
dense (tension / burst)   -> quick cuts, high element count, strong motion, push in
sparse (build / tail)     -> long takes, low element count, negative space, static camera
```

Principles:

- Negative space is *designed*, not unfilled — quiet regions make the burst louder
  (contrast principle).
- Change speed: go *still for one frame* before energy arrives; impact comes from
  contrast, not from continuously adding.
- A long take must stay alive: even when static, keep micro-motion (breathing,
  flicker, particle settling). A dead frame is a defect.
- Avoid even pacing: three quick cuts followed by one long take hits harder than
  five equally fast ones.

---

## 4. Motion grammar

Motion needs a *why*. Borrow from mature motion systems:

```text
responsiveness  -> ease-out / spring (starts fast, instant feedback)
naturalness     -> ease-in-out / custom curve (on-screen travel)
constancy       -> linear (scrollbars, progress)
physicality     -> spring + bounce (overshoot only when momentum preceded it)
```

Principles:

- Never open with ease-in (slow start = sluggish feel). Custom curves beat built-ins
  (cubic-bezier over defaults).
- Enter and exit along the same path (spatial consistency) — what came from the
  right goes back to the right.
- One song = one motion family. Unify curves; do not give every effect its own style.
- Motion speed is emotion: slow and steady (solemn), fast and crisp (tense),
  bouncy and alive (playful).

---

## 5. Focus and negative space

```text
one frame = one focus + supporting elements + negative space
             the eye: focus (1s) -> support (0.3s) -> breath -> back to focus
```

Principles:

- Focus is established by one of: brightness / contrast / motion / size. Not by
  stacking everything.
- Negative space is not empty: it is the rhythmic slot where the eye rests (a
  design asset).
- Text/lyrics: clear them when their moment ends (stale text is a TIMING defect — the audience
  re-reads old content).  For non-lyric videos this applies to on-screen text/annotations.
- Edge case: text / key graphics never collide with the background (low contrast
  = invisible).

---

## 6. Freedom within constraint

The skill locks only three floors (engineering-side hard constraints); everything else
is free:

```text
1. Synchronization: time relationships to music / lyrics must hold (when the lamp
   lights, when the stage switches);
2. Determinism: the same timestamp renders the same frame (seek / replay stable);
3. Enter -> exit: every state opened must be closed (an element with no home is a
   defect).
```

Above these three floors you are the director: you may break any style rule or
staging habit — as long as you can say *why this is better*. If you cannot, use the
principles first.
