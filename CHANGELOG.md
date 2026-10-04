# Changelog

All notable changes to the **Universal Realtime Music MV Skill**.

Versions follow `MAJOR.MINOR.PATCH`. Entries are grouped by what the shipped
`SKILL.md` actually contains. Where no archived artifact exists for a version,
the entry is explicitly marked as *reconstructed* from project documentation
([`docs/readme_ai.md`](docs/readme_ai.md)) instead of being presented as verified.

---

## [2.4.1] — 2026-10-04

**重大已知问题公告（README 与 GitHub Release 同步发布）**

### 发现的问题

- 🐞 **重大结构性问题：缺少"设计师 / 导演"角色。** 当前 Skill 过度强调工程纪律
  （同步、确定性、验证、审计），视觉设计指导严重不足——产出"工程正确但缺少设计感"
  的 MV：没有分镜方法、没有场景编排方法，7/8 风格适配器（除 Terminal）只有 6-8 行
  关键词列表，美学质量从未被定义（全库 0 次 beautiful / design quality / craft）。

### 已启动的重构（dev 分支）

- 拆分两个 Skill：`mv-director`（设计编排 / 导演：场景编排 + 分镜 + 风格设计语法）
  与 `mv-engineer`（实现：确定性 / 可同步 / 可验证的代码，保留全部工程纪律为护栏）。
- 重构方案书：`REFACTOR-PLAN.md`（dev 分支，未提交）。
- 重构完成后工程正确性不降级，视觉设计质量大幅补强。

### 状态

- ✅ 公告本身（README 双语 + 本条目）已发布；Skill 正文与工程纪律不受影响。
- ⚠️ 重构未完成，v2.4.x 工程纪律基线仍然有效。

---

## [2.4.0] — 2026-10-04

**证据来源：** 真实运行反馈（*"这个模型就知道猛猛干，什么都不问"*）、`world.execute(me)`
生产实录（[`Galen563/world.execute-me`](https://github.com/Galen563/world.execute-me)）以及
蒸馏进 `skill-patch-reference.md` 的 TUI MV 构建日志（单曲 6 轮交付、v1 因没有镜头脚本被
整版推翻、词级同步验收、13 处缺口审计 → 0）。

### 新增 —— 分批审批交付流程（SKILL.md 核心，开放式请求强制执行）

- **S-A 歌词分析** —— 在**任何视觉设计之前**，把整份歌词从头到尾分析完（字面义、语义角色、
  重复句组、对立词对、结构），产出可读文档。分析永不等审批；设计必须等。
- **S-B 分批设计** —— 演出设计一次只覆盖**一批约 10 句连续歌词**（Agent 声明具体批大小，
  按密度大致 6–14 句）。绝不一次设计整首歌。
- **S-C 每批一次用户审批门** —— 批次方案在**产出任何阶段产物之前**呈现；批准即锁定决策、
  驳回则重新提案、无回应走 § 21.10 兜底（默认值 + provisional + 可逆），明确说"直接干"
  本身也记为一条锁定的范围决策，但交付仍按批次进行。
- **S-D 逐批产出** —— 每批产出产物 + 同步审计结果，以
  `designed → approved → produced → audit gaps → open questions` 收口。
- 排序规则，以及与 S0–S9 状态机的显式映射（§ 27.1：S1–S3 每曲一次，S4–S8 每批准批次
  一次，S9 最后一次）。
- `§ 1.1` 硬化：渲染器内 `audio.currentTime` **只读**；`syncOffset` 加在**时钟**上，
  而不是显示的数字上。

### 新增 —— 实战蒸馏规则进 `references/`（均标注 *Added in v2.4.0*）

- `music-visual-mapping.md` —— **词级时间轴**（音节数比例切分 → ≤600ms 窗口内吸附 onset、
  单调约束；卡拉OK点亮与舞台切换共用一条时间轴：*词唱到才亮灯*）；**对立概念必须各自
  成形**（给同一张图换标签不叫演出）；**歌词时间与音乐网格保持两套来源**。
- `architecture.md` —— **歌词显示寿命** `min(间隔, 0.8 + 字数×0.09)` 秒、唱完即清
  （残留歌词 = TIMING 缺陷）；**held cue 在查找时解析**（验证规则：*每条 cue 都必须
  解析到一块画板*）；重复句组经参数化工厂 + 共享常量读作**同一个实体**。
- `workflow.md` —— **镜头脚本是硬交付物**（落盘文档 ↔ 代码镜头表逐行对应）+ **环境陷阱
  附录**（中文 drawtext、同源加载、形状检查 fail loud、数学效果的可见验收物、重渲染不进
  git、先解析再写入的批量编辑）。
- `validation.md` —— 覆盖率必须证明"**画出来了**"而非"注册了"；锚点词映射表让**构建**
  失败而不是首映失败；**三层同步审计门禁** `关键词 → 场景 → 镜头` 以 `REMAINING GAPS: 0`
  收口，有缺口时**带着清单**向用户提一次短问题；视觉验收的**字节级 sha 旁证**、**帧内
  时间戳**、**无静止帧扫描**，以及**先验证验证器**再怪作品。
- `visual-system.md` —— **分层隔离的接管**（只盖演出区，歌词与传输条保持可读）；**凡是
  打开的都必须有退场**；**歌词画板绝不拖过自己的句尾**；母题第二次出现**复用已建立的
  语言**。
- `reference-analysis.md` —— **仓库卫生**：版权音频、成片、重渲染与运营文档一律不进 git；
  首推**之前**就想清楚。

### 状态

- ⚠️ 规则蒸馏自真实生产证据，但**本次修订本身尚未在全新会话里端到端跑过**；2.2.0 仍是
  拆分前 skill 的实测基线。

---

## [2.3.0] — 2026-10-03

Verified against the shipped artifact `realtime-music-mv-universal-skill-v2.3.0.zip`
(`SKILL.md`, 54 765 bytes, 2 191 lines, frontmatter `version: 2.3.0`).

### Fixed — interactive question tool payload (found in real host failures)

Root cause: a long `question` field can prevent constrained host UIs from rendering the
options at all. 2.3.0 separates the two channels:

- **Full context lives in the normal agent message** — question, why it matters, options
  with consequences, recommended default, reply format. The interactive tool carries only
  a short header, a short decision index and concise options.
- The tool's `question` field is an **index**, not a copy of the natural-language question.
  Never put `[WHY IT MATTERS]`, `[RECOMMENDED DEFAULT]`, `[REPLY]`, long rationale,
  reference analysis or implementation rationale into it.
- UI-safety size budgets: decision index ≤ 32 CJK characters, header ≤ 12, option label ≤ 24,
  option description ≤ 60 when supported. These are *payload* budgets — context is **moved
  out of the tool, never deleted**.
- New enforcement subsection **§ 27.4 "Interactive tool payload / UI safety"** (§ 27.5–27.15
  renumbered accordingly), extended question-quality checklist, stable semantic `id` per
  decision, and a North-star addition: *the host UI is a delivery constraint, not the product*.
- No duplication: the message carries meaning, the tool carries selection.

### Note — a planned bullet does not exist in the artifact

The release brief for 2.3.0 also mentioned *"the recommended option no longer has to be
listed first"*. **No such rule exists anywhere in the shipped 2.3.0 `SKILL.md`** (verified
by search). Per project policy — actual content wins, never invent history — it is *not*
recorded as a change. If intended, it must be written into the Skill first.

### Changed — repository structure (this repository)

- Monolithic `SKILL.md` split into an entry point + `references/` (7 files):
  - **kept in `SKILL.md`**: § 0 mission / north-star, § 1 temporal invariants, § 2 request
    compiler, § 17 worked example, § 18–20 quality / final definition / lineage, § 27
    operational enforcement protocol (L0–L3, audits, ordering, shared `render(t)`, replan,
    severity, completion gate), § 28 audit invariants, § 29 mission check — plus a compact
    restatement of every moved rule (*Core rules carried by references*) and a reference map;
  - **moved verbatim**: § 3–§ 16 and § 21–§ 26 → `references/architecture.md`,
    `workflow.md`, `visual-system.md`, `music-visual-mapping.md`, `reference-analysis.md`,
    `decision-protocol.md`, `validation.md` — original section numbers preserved;
  - exactly two pointer adaptations (the § 2.1 image-inspection bullets move to
    `reference-analysis.md` while their core rule stays in `SKILL.md`; the § 27.5 reference
    to "Section 23" now links `references/workflow.md`);
  - fidelity verified by line-multiset comparison against the shipped artifact:
    **0 lines lost, 0 lines duplicated, all cross-links resolve**.
- Added `README.md` (English), `README.zh-CN.md`, `examples/`
  (minimal / terminal-tui / lyric-driven), and `docs/readme_ai.md` (original document
  preserved instead of overwritten).

### Status

- ⚠️ **Not yet field-tested.** 2.3.0 fixes the 2.2.0 known issue but has not been verified
  in real runs. Until it is, **2.2.0 remains the field-tested baseline**.

---

## [2.2.0] — 2026-10-02

Verified against the shipped artifact `realtime-music-mv-universal-skill-v2.2.0.zip`
(`SKILL.md`, 49 730 bytes, 2 087 lines, frontmatter `version: 2.2.0`).

### Added — Mission Lock

- **North-star rule**: *"The purpose of this Skill is to help an agent make the user's music MV, not to make the agent's architecture look impressive."*
- **Mission-preservation check (§ 29)**: every abstraction must answer *what part of the user's MV does this improve / what evidence says it needs to exist / could the same result be achieved more simply*, plus anti-drift guard and *"no architecture for architecture's sake"*.

### Added — operational enforcement protocol (§ 27)

The design principles became explicit agent-execution rules with priority over vague defaults elsewhere:

- execution state machine `S0 INSPECT → … → S9 COMPLETION GATE`;
- decision levels **L0 / L1 / L2 / L3** with default behavior (`decide / default / default / ask and wait`);
- question budget and precision rules;
- **input audit** (audio, lyrics, references, MIDI/analysis) before visual implementation;
- **existing-project audit** — reuse compatible abstractions, replacement only when documented;
- event model: timestamps **non-decreasing**, stable ordering by `(time, priority, stableOrder)`;
- **preview / playback / offline export share one `render(t)` pipeline** (`t = frameIndex / fps + syncOffset`);
- **replan trigger** on dominant-style / layout / temporal / asset / renderer changes;
- **defect severity** `BLOCKER / HIGH / MEDIUM / LOW`;
- **completion gate** (9 checks) + **stop condition** (no infinite polishing);
- user-locked priorities override the default quality hierarchy;
- multi-reference conflict order: explicit instruction > primary reference > shared grammar > secondary > agent inference;
- deterministic time model (seconds canonical, no accumulated frame deltas).

### Hardened

- Determinism split into **state determinism** and **render determinism** with an explicit test procedure (§ 13.4).
- Deterministic randomness (`seed(sceneId, eventId, elementId)`), no uncontrolled `Math.random()` (§ 1.2).
- **Audit invariants (§ 28)**: compact pre-completion checklist grouped as TEMPORAL / INPUT / DECISIONS / ARCHITECTURE / VISUAL / QUALITY.

### Known issues

- 🐞 **Interactive question payload too long** (found in real agent runs): when the agent passes the whole `[DECISION] / [WHY IT MATTERS] / [OPTIONS] / [RECOMMENDED DEFAULT]` block inside an interactive question tool's `question` field, some host UIs cannot render the options at all. Workaround on 2.2.0: put the full context in the normal agent message and keep the tool payload short. **Fixed in 2.3.0.**
- ✅ **Otherwise field-tested**: 2.2.0 is the baseline version confirmed working in real runs.

### Note on sources

Two descriptions of 2.2 exist in the project record: the original project document calls it *"adds the Mission Lock (Skill 是缰绳，不是目标)"*, while the release brief also credits *"enhanced determinism, input audit, existing-project audit, replan, completion gate"*. **Both claims are verifiable in the shipped 2.2.0 artifact** (North-star rule + § 27.4–27.10), so both are recorded instead of choosing one.

---

## [2.1.0] — date unknown · *reconstructed*

- Agent execution workflow (phases / build steps / behavior contract).
- Decision boundary and severity levels.
- Input audit, existing-project audit, determinism rules.
- Validation mechanism introduced as a first-class concern.

*Source: `docs/readme_ai.md` and the release brief. No archived 2.1.0 artifact is available for verification.*

---

## [2.0.0] — date unknown · *reconstructed*

- **Universal Skill-ification** of the original realtime MV methodology:
  - style adaptation / style-agnostic architecture;
  - scene & plate system;
  - lyrics as events;
  - music coupling;
  - validation;
  - open-ended prompt compilation (vague request → Specification).

*Source: `docs/readme_ai.md`. No archived 2.0.0 artifact is available for verification.*

---

## [1.x] — date unknown · *reconstructed*

- Original realtime MV methodology distilled into a minimal pipeline:

  ```text
  audio → time → visual state → render
  ```

- Realtime, deterministic, lyric-driven, time-based, code-rendered — principles
  distilled from the documented design of
  [`Galen563/world.execute-me`](https://github.com/Galen563/world.execute-me).

*Source: `docs/readme_ai.md`. No archived 1.x artifact is available for verification.*

---

[2.4.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.4.0
[2.3.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.3.0
[2.2.0]: https://github.com/13055751/realtime-music-mv-skill/releases/tag/v2.2.0
