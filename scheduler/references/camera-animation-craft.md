# Camera & Animation Craft — distilled from Opus 5.5 reference work

**Added in v2.5.0 · distilled from ClaudeAnimationBase (ANIMATION_GUIDE.md) and
PDoomVideo (STORYBOARD.md) — the Opus 5.5 reference films for "I'm Upping My
P(doom)".** These are the concrete camera moves and animation principles that make
a frame feel ALIVE instead of like a music player. Apply per shot, per batch.

---

## 1. Camera — every shot moves, and moves FOR a reason

### 1.1 Every shot has a camera move

```text
PUSH / PULL (zoom in/out)   emphasis, intimacy, or pulling back for context
PAN (lateral shift)         scanning, continuity, tension release
TILT (vertical sweep)       hierarchy, revelation
WHIP (fast pan)             urgency, motion, momentum through a cut
ON-BEAT SHAKE               impact, explosion, landing (deterministic shake)
RIDE (camera follows a move) the shot "rides" a falling/rising/racing subject
```

A static shot is allowed only when it is DELIBERATELY static (gravity,
monumentality, letting the stage act) — never as a default.

### 1.2 Camera moves are MOTIVATED, not decorative

- the camera moves because something in the scene moves: a chomp closes over the
  lens, a rocket lifts and the camera tilts up after it, a fall pulls the camera
  down, a zoom rides a throw to its landing;
- "motivated transitions": the action carries you across the cut (a chomp to
  black, a zoom through an eye, a bomb flash, crashing through a floor);
- camera continues across cuts: motion does not stop at the edit, it carries
  through into the next shot.

### 1.3 Aim and react

- aim at the subject: the camera chases what each beat frames (lagging, leaning,
  settling) instead of staying glued;
- on impact, a bounded camera shake sells the weight (deterministic shakeXY);
- camera speed is emotion: slow push = gravity, fast whip = momentum.

---

## 2. Animation — the classic principles, applied

### 2.1 Anticipation

Before a big move, make a small move the opposite way: a crouch before a jump, a
wind-up before a throw, a squint before a take. It tells the viewer something is
coming and where to look.

### 2.2 Squash and stretch

Bodies squash on impact and stretch when they move fast, keeping their volume.
A bounce without squash reads as a slide; a landing without squash reads as a
teleport.

### 2.3 Slow in, slow out (eased motion)

Almost nothing moves at constant speed. Things ease out of one pose and into the
next. A plain linear move looks mechanical — run progress through an easing
(easeIn/easeOut/backOut) unless the style is deliberately chunky.

### 2.4 Weight

How something starts and stops says what it weighs. Heavy things take longer to
get going and to stop, and land with little bounce. Light things snap into
motion, bounce and flutter to rest.

### 2.5 Arcs

Living things move on arcs, not straight lines: thrown props, hops, arm swings,
head turns. A straight line is an android; an arc is alive.

### 2.6 Overlapping action and follow-through

Do not move every part at once. The eyes lead, the body follows, and hats, tails
and props drag behind, overshoot and settle last. Offset each part a little from
the one it hangs off.

### 2.7 Avoid twinning

Code copies values, so both arms end at the same angle, both eyes blink together,
a crowd bounces in unison. Give one side the action and the other something
smaller; offset timings, phases and seeds between elements.

### 2.8 Exaggeration

Push poses, takes, squash and leans further than feels natural. In a short video,
subtle reads as nothing. If it looks like too much on the sheet, pull it back.

### 2.9 Strong key poses

Each shot's storytelling poses should read as stills, with a clear silhouette and
the body leaning into what it does, before any motion goes between them. If the
key poses do not read, motion will not fix it.

### 2.10 Show the thought

A character notices, thinks, then acts — and the eyes move first. The viewer
understands a choice when they see it being made.

### 2.11 Secondary action

Small actions that support the main one (a hat bobbing, an emote popping, grass
stirring) add life, but they never compete with it.

---

## 3. Timing — model the viewer (the most-often-broken rule)

- **write the reads**: for each shot, list in order what the viewer has to
  understand. Every item is a read; each read needs time to be found, understood,
  and registered before the next starts;
- **one read at a time**: when two things happen at once, the viewer sees only
  one. Sequence a cause and its reaction, never stack them;
- **fast actions, slow meanings**: motion can be quick if anticipated, but what it
  MEANS needs held time. Move quickly through what does not matter; spend time on
  what does. That contrast is what gives rhythm;
- **lead the eye**: the viewer looks at whatever moves, is bright, is big, or is
  being looked at. Before an important read, get the eye there first;
- **let the reads set the length**: a shot is as long as its reads need. The final
  shot's last read needs time to land before the video ends.

---

## 4. Scene discipline — something happens in every scene

- every shot needs an EVENT: something changes between its first and last frame
  (wants, finds, tries, fails, reacts, gets). "Standing and being cute" is not a
  shot;
- one focal action at a time, staged with a clear silhouette, nothing competing;
- cause, then reaction — give the reaction time, it is often the best part;
- pay it off: whatever a shot sets up gets resolved on screen, in that shot or a
  later one.

---

## 5. Handmade feel (for painted/illustrated styles)

- linework boils: every drawing wobbles slightly, like hand-drawn animation
  (deterministic reseed, ~12x/sec), unless the style forbids it;
- flat 2D, depth via overlap/scale/colour, never projection;
- soft palette, no pure black/white; light painted as real light, not glow overlays;
- no text if the joke can be acted — a sign repeating the story is the classic
  failure. Paint the reaction, not the caption.

---

## 6. Applying this to the script

- in TECH BREAKDOWN: name the camera move (push-in on beat, tilt-up after rocket),
  the animation principle used (squash on landing, anticipation before take,
  follow-through on hat), and the reads timing (held 0.8s for the eye);
- in the DESIGN-FOOTPRINT gate: a shot with prose but no camera move and no
  animation principle is under-directed — same fail as missing parameters;
- per-shot checklist before handoff: camera move? event? anticipation? squash?
  follow-through? reads timed? something alive? If any is blank, the shot is
  "player-static" — rewrite it.
