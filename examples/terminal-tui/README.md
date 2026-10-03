# Example — terminal-tui

The terminal/TUI style is the most completely specified style in the Skill: a
full-screen, monospace, high-information-density interface that must feel like
**one coherent real program**, never like a decorated cyberpunk HUD.

This case shows the full arc: *vague request + real reference screenshot → reference
analysis → Style Contract → panel topology → lyric/event coupling → validation*.

## What it exercises

- **Reference analysis**: the reference is a screenshot of a real application, so the agent
  extracts *visual grammar* (composition, panel topology, area ratios, negative space,
  typography density, border language, contrast hierarchy, motion implications) — and must
  not copy accidental content from it.
- **Adjective compilation**: "terminal-style" is compiled into observable rules
  (monospace + black framebuffer + square panels + cursor + logs + deterministic redraw)
  instead of left as a mood.
- **Real-program illusion**: every visible value is measured, derived from runtime data, or
  explicitly marked as simulated — no fake CPU/GPU/temperature decoration.
- **Text layout discipline**: reserved line boxes, panel clipping, collision checks at the
  final target resolution.
- **Anti-drift**: gradients, rounded cards, glassmorphism and neon matrix rain are excluded
  by the Style Contract, so later "improvements" that reintroduce them are rejected.

## Files

| File | Purpose |
| --- | --- |
| [`input.md`](input.md) | The request and inputs, including the reference screenshot |
| [`expected.md`](expected.md) | Decision behavior, where the compiled specification lives, and case-specific acceptance |

## Where the rules live

In `SKILL.md`, see: *Style adaptation system → Terminal / TUI*, *Terminal/TUI specialist
rules*, *Example: terminal-native MV request*, and *Reference fidelity check*.
