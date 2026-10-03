> Extracted **verbatim** from `SKILL.md` (v2.3.0). Original section numbers are
> preserved for traceability. Numeric cross-references such as "Section 27.2"
> point to sections that remain in `SKILL.md`.

Where the enforcement rules live:

- decision levels L0–L3 and default behavior → `SKILL.md` § 27.2
- question budget, human-facing message vs tool payload → `SKILL.md` § 27.3–27.4
- replanning trigger → `SKILL.md` § 27.9
- audits → `SKILL.md` § 27.5–27.6

# 21. Interactive clarification protocol

This skill may be executed interactively. The agent is **allowed and encouraged to ask the user questions repeatedly when the answer materially affects the result**. Asking is not a failure state; asking the wrong or low-value question is.

## 21.1 When to ask

Ask a question when at least one of these is true:

- two plausible interpretations would produce materially different visual systems;
- a missing choice changes architecture, scene topology, asset requirements, or rendering technology;
- a reference image contains an important ambiguity that cannot be resolved safely by inference;
- the user's desired priority is unclear (reference fidelity vs originality, lyric readability vs visual density, realism vs stylization, performance vs complexity);
- a required input is missing and cannot be reconstructed reliably;
- implementation has reached a genuine creative fork where the user should choose the direction.

Do **not** ask merely because an option was not explicitly specified if a reasonable reversible default exists.

## 21.2 Ask at decision boundaries, not continuously

Do not interrupt every implementation step.

Batch related questions into a small decision checkpoint. A useful cadence is:

```text
brief → ask if necessary → prototype → render → ask if a meaningful fork remains → refine → validate
```

For a long task, the agent may ask multiple rounds of questions, but each round should correspond to a real decision boundary.

## 21.3 Every question must be precise

Never ask:

```text
你想要什么风格？
你觉得怎么样？
还有什么要求吗？
要不要更酷一点？
```

Instead, identify the exact decision, explain why it matters, and constrain the answer space. The explanation belongs in the normal agent message; the interactive tool should carry only a short decision index and concise options.

### Separate human-facing context from tool-facing payload

Use this two-layer structure:

```text
NORMAL AGENT MESSAGE
  ├─ full question
  ├─ necessary context
  ├─ why the choice matters
  ├─ reference analysis / trade-offs
  └─ recommended default

INTERACTIVE QUESTION TOOL
  ├─ short header
  ├─ short decision index
  └─ concise options
```

The tool's `question` field is an **index**, not the complete natural-language question. It exists to identify which decision the options belong to and to keep the host UI renderable.

Recommended tool payload:

```json
{
  "id": "visual_direction",
  "header": "视觉方向",
  "question": "主视觉方向",
  "options": [
    {"label": "A 系统监视器"},
    {"label": "B 代码执行"},
    {"label": "C 故障演化"}
  ]
}
```

Recommended size limits for the interactive payload:

```text
question / decision index: preferably <= 32 Chinese characters
header: preferably <= 12 Chinese characters
option label: preferably <= 24 Chinese characters
option description: preferably <= 60 Chinese characters when supported
```

These are UI-safety budgets, not semantic budgets. Do not remove important context merely to satisfy them; move that context into the normal message instead.

Never put the following into the tool's `question` field when they can be shown in the normal message:

```text
[WHY IT MATTERS]
[RECOMMENDED DEFAULT]
[REPLY]
long option explanations
reference analysis
implementation rationale
```

Do not duplicate the full question and option list in both the normal message and the tool payload. The normal message provides meaning; the tool provides structured selection.

Keep each decision independently answerable and give the tool question a stable semantic `id` such as `visual_direction`, `layout_priority`, or `output_format`.

## 21.4 Prefer concrete visual choices over abstract adjectives

Convert vague questions into observable decisions.

Bad:

```text
你想要更赛博一点吗？
```

Good:

```text
[DECISION] Accent behavior
A. restrained blue-gray + sparse amber, matching the reference
B. stronger cyan highlights and more active glow
C. high-contrast neon palette

This changes border emphasis, waveform intensity, selection states,
and musical impact effects.
```

## 21.5 Ask about priorities when trade-offs exist

If two valid goals conflict, ask which should dominate.

Example:

```text
[PRIORITY]
For the TUI layout, should the system prioritize:
A. reference fidelity — preserve the dense professional-monitor look
B. lyric readability — give the lyric/stdout panel more space
C. balanced — preserve topology while increasing lyric contrast

If unspecified, use C.
```

Do not silently optimize for an assumed preference.

## 21.6 Ask with a preview whenever possible

If the uncertainty is visual, prefer generating two or three small prototypes over asking the user to describe an abstract preference.

```text
uncertain visual choice
        ↓
render A / B / C
        ↓
ask: "Which direction: A, B, or C?"
```

The prototypes may differ only in the disputed dimension. Do not change five variables at once.

## 21.7 One question may contain tightly coupled subchoices

A question can contain 2–4 tightly related options when answering them together is easier.

Avoid giant questionnaires. When an interactive tool is used, keep its payload compact even when the human-facing explanation is longer. Split material choices when a single decision would require a long tool description.

Bad:

```text
Please answer these 17 design questions...
```

Good:

```text
[LAYOUT DECISION]
Choose the dominant composition:
A. left-heavy 2+1 TUI
B. balanced 3-column monitor
C. full-screen central session with small instrumentation

Then choose density:
1. sparse
2. medium
3. dense
```

## 21.8 Preserve answers as locked decisions

After the user answers, update the Creative Specification and Creative Decision Log. Partial answers lock the answered decisions; unanswered low-impact choices use defaults rather than triggering unnecessary re-questions.

Do not repeatedly ask the same question unless new evidence genuinely invalidates the previous decision.

Record:

```text
DECISION
VALUE
REASON / SOURCE
LOCKED: yes/no
```

## 21.9 Never use clarification to outsource the design work

The agent remains responsible for making reasonable creative decisions.

The user should choose only where human preference materially matters.

The agent should independently decide things such as:

- variable names
- internal module boundaries
- easing implementation
- cache strategy
- exact seed values
- low-level drawing code
- minor spacing adjustments

The agent should ask about things such as:

- dominant visual direction
- competing reference interpretations
- major layout topology
- lyric readability vs density
- asset usage preference
- whether a major stylistic deviation is desired

## 21.10 Clarification timeout / no-response behavior

If the environment requires progress and the user does not answer:

1. choose the stated recommended default;
2. mark the decision as provisional;
3. continue with a reversible implementation;
4. make the affected parameter easy to change later.

Never block an otherwise executable project on a low-impact preference.

## 21.11 Question quality test

Before sending a question, verify:

```text
[ ] Is there a real unresolved decision?
[ ] Would different answers materially change the output?
[ ] Can the user understand the difference without technical knowledge?
[ ] Are the options concrete?
[ ] Is there a sensible default?
[ ] Can the answer be given in one short reply?
[ ] Is the question within the per-checkpoint question budget?
[ ] Am I asking because I need the user's preference rather than because I failed to decide?
[ ] If using a question tool, is its question field only a short decision index?
[ ] Is the full context already present in the normal agent message?
[ ] Are the tool labels/descriptions short enough for the host UI?
```

If the answer to "Am I asking because I need the user's preference rather than because I failed to decide?" is "no", decide it yourself. If using a tool and the payload is too verbose, shorten the payload rather than deleting human-facing context.
