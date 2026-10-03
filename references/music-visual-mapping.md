> Extracted **verbatim** from `SKILL.md` (v2.3.0). Original section numbers are
> preserved for traceability. Numeric cross-references such as "Section 27.2"
> point to sections that remain in `SKILL.md`.

Related invariant kept in `SKILL.md`: § 1.3 Semantic time and musical
time are different.

# 6. Musical coupling

Use the strongest available measured data.

Priority:

```text
measured onset / beat data
        ↓
measured audio features
        ↓
waveform / envelope
        ↓
estimated timing
        ↓
nominal BPM only as fallback
```

Map musical features to parameters, not entire scenes by default.

Example:

```text
kick      → scale impulse
snare     → cursor / text flash
bass      → deformation amplitude
high freq → fine jitter / particle activity
energy    → density / brightness
silence   → decay / negative space
```

Use decaying envelopes instead of one-frame spikes.

---

# 7. Lyrics are events, not subtitles

Lyrics can control:

- scene transitions
- commands
- state changes
- object creation/destruction
- topology changes
- typography
- process names
- labels
- errors
- measurements
- dialogue-like UI

Semantic translation should usually follow:

```text
lyric meaning
    ↓
operation / relation / state / measurement
    ↓
visual behavior
```

For a terminal style, for example:

```text
waiting
→ process enters WAIT state

searching
→ filesystem / corpus query expands

disappearance
→ lookup returns null / empty result

memory
→ persistent cache/history panel changes
```

The actual lyric text remains the user's authoritative source; do not invent replacements for it when synchronization matters.
