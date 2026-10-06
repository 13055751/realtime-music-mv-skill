> Extracted **verbatim** from `SKILL.md` (v2.3.0). Original section numbers are
> preserved for traceability. Numeric cross-references such as "Section 27.2"
> point to sections that remain in `SKILL.md`.
> Sections added after the split are marked **Added in v2.4.0** (field evidence cited inline).

Multi-reference conflict priority is enforced in `SKILL.md` § 27.13.

## Reference inspection (extracted from `SKILL.md` § 2.1)

If the user supplied images, inspect them for:

- composition
- panel topology
- negative space
- color distribution
- typography density
- border language
- hierarchy
- animation implications
- whether the reference is a screenshot of a real application or merely an illustration


---

## 22.1 Reference fidelity check

When references are supplied, compare the implementation against them using:

- composition
- panel topology
- relative area ratios
- negative space
- typography density
- border thickness
- palette distribution
- contrast hierarchy
- motion behavior
- information density
- visual realism

When multiple references conflict, use this priority order:

```text
1. explicit user instruction
2. explicitly designated primary reference
3. repeated common visual grammar
4. secondary references
5. agent inference
```

If the conflict would materially change the architecture and no priority can be inferred, treat it as an L3 decision.

Do not ask only:

> Does this look cool?

Ask:

> Does this still belong to the same visual language?

---

# 25. Asset provenance

For external assets, track:

```text
source
license
intended use
modification permission
local filename
```

Prefer user-provided, procedural, public-domain, or appropriately licensed assets.

Do not silently substitute arbitrary external copyrighted assets.

## Repository hygiene

**Added in v2.4.0 (field evidence: an ops document removed after first push forced a
full history rewrite).**

- copyrighted audio, finished video and heavy frame renders **never enter git**
  (gitignore them; determinism means they are rebuildable from the pipeline);
- operational documents (upload titles, tags, schedules) live **outside** the code repo;
- git history is permanent — decide what belongs **before** the first push; removing it
  later means rewriting history (orphan rebuild + force push), which breaks every clone;
- provenance tracking (§ 25) applies to what is *excluded* exactly as much as to what
  is included.
