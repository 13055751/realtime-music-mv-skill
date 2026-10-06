# 重构方案书：拆分「导演」Skill 与「实现」Skill

> 分支：dev（自 backup-v2.4.0-pre-split 分出） · 状态：方案书草稿，**未提交、未推送**
> 依据：用户反馈"用起来有问题，似乎缺少设计感" + 全库静态审计（2026-10-04）

---

## 0. 问题定义（证据链）

用户原话：*"应该让主 agent 当导演，用最简单的语言做场景编排，做分镜安排"*。

静态审计证据（只读完成，2026-10-04）：

| # | 证据 | 数据 |
| --- | --- | --- |
| E1 | 语言重心倒向工程 | 导演语言 160 次 vs 工程语言 404 次 = 1 : 2.5（SKILL.md 内 1 : 3） |
| E2 | Director 角色只有口号 | §0 声明双角色，但导演方法论总量 ≈ 90 行；工程纪律（§27 十五个子节 + §28 + §29）≈ 600+ 行 |
| E3 | shot script 有格式无方法 | workflow.md 只规定表格列与代码逐行对应，**从不教怎么填**——景别、舞台编排、情绪弧可视化 0 处 |
| E4 | 风格适配器 7/8 是空壳 | Terminal 33+100 行；其余 7 种风格各 6–8 行关键词 |
| E5 | 美学质量从未被定义 | 全库 0 次 beautiful / design quality / craft / color theory；§18 把 compositional quality 排第 6 |

**根因一句话**：skill 从 terminal 项目的工程失败里反向蒸馏，把力气全花在"防止工程翻车"，把"导演"当默认能力——设计感不是被禁止，是**从未被定义**。

---

## 1. 拆分架构（两个 Skill，单一仓库）

```text
realtime-music-mv-skill/
├── SKILL.md                ← 顶层入口：只做路由
├── director/               ← Skill A：设计编排（导演）
│   ├── SKILL.md            ← frontmatter name: mv-director
│   └── references/
│       ├── staging.md      ← 场景编排方法（新写，核心补强）
│       ├── shot-script.md  ← 分镜方法（新写，核心补强）
│       ├── visual-styles.md← 风格适配器（补到 terminal 一半密度）
│       ├── music-visual-mapping.md（共享，导演视角）
│       └── reference-analysis.md（共享）
├── engineer/               ← Skill B：实现（工程师）
│   ├── SKILL.md            ← frontmatter name: mv-engineer
│   └── references/
│       ├── temporal.md     ← §1 时间不变量 + §27.14 确定时间模型
│       ├── enforcement.md  ← §27 工程纪律（S0–S9/审计/完成门/停止条件）
│       ├── validation.md   ← §28 审计不变量 + validation
│       ├── workflow.md     ← Steps 12–15 + 环境陷阱
│       └── architecture.md ← scene/plate/compositor/预算
├── examples/               ← 保留，按 A→B 双 skill 重写 README
├── docs/                   ← 对外文档
└── README.md / README.zh-CN.md / CHANGELOG.md / LICENSE
```

### 1.1 Skill A — mv-director（设计编排 / 导演）

**使命**：理解歌与用户意图，产出**导演语言**的完整分镜方案（shot script + 场景编排），**不写实现代码**。

**人格提示词（用户指定，v2.5.0 采用）**：

```text
你是一个顶级设计师，进行深度决策，得到视频脚本。
你不是为了实现任何功能的，你是进行视频编排的。
```

**角色定位**：mv-director 是**驱动者**——通过视频脚本驱动其他 skill（mv-engineer）执行。判断标准不是"设计感好不好看"，而是**编排是否明确、可驱动实现、可过审批门**。产出 = 视频脚本（shot script + 场景编排说明），交付即脚本落盘；设计感的最终质量由 director↔engineer 多轮协作迭代，不由 director 单次输出背锅。

**工作流**（最简单语言，主 agent 当导演）：

```text
S-A 理解  读歌词/音乐/参考，找情绪弧与叙事结构
S-B 编排  按 ~10 句一批做场景编排：这个镜头里有什么、怎么动、观众感受什么
S-C 审批  每批一次用户审批门
S-D 分镜  产出落盘 shot script：timecode / shot / stage / camera / transition / 情绪意图
          + 每批一张"场景编排说明"（舞台层次、视觉焦点、留白、呼吸）
```

**核心补强（解决 E2/E3/E5）**：
1. **shot script 教"怎么填"**——新增分镜方法：景别选择（特写/中景/全景的语义）、舞台编排（三层法：前景动作/中景主体/背景环境）、情绪弧可视化（平静→紧张→爆发→余韵如何落到画面参数）、镜头节奏（何时长镜、何时快切、如何留白）。
2. **风格适配器补设计语法**——每个风格至少给到 terminal 一半密度：构图法则（负空间/三分/层次）、配色系统（明度/饱和度/色彩叙事）、排版系统（字阶/字重/行距/对齐）、运动语言（easing 曲线/节奏）。
3. **质量层次重排**——§18 把 compositional quality 提进前四，新增"设计感底线"：同步与确定性满足后，视觉质量是核心交付物，"正确但难看"不构成完成。

### 1.2 Skill B — mv-engineer（实现）

**使命**：把 director 的 shot script 逐行实现为确定性、可同步、可验证的代码。**不替导演做创作决策**。

**工作流**：

```text
E-1 接收  读 shot script + 场景编排说明（硬输入，缺失即停）
E-2 审计  输入/项目审计
E-3 实现  逐行对应 shot script → 代码镜头表（同一 id/timecode）
E-4 渲染  实际帧输出 + 三层同步审计
E-5 验收  完成门 + 与 shot script 逐行核对（diff 即缺陷）
```

**保留内容（原样搬入，不做删减）**：§1 时间不变量、§27 全部工程纪律、§28 审计不变量、§29 任务保持检查、validation.md 全部、环境陷阱附录。这些是 B 的护栏，**从主角退到幕后**——它们服务于导演意图，而不是反过来。

### 1.3 交接协议（A → B 的硬契约）

```text
shot script 每行 = timecode | shot name | stage content | camera/motion | transition | emotion intent
                        ↓
代码镜头表每行必须与 shot script 逐行对应（同 id、同 timecode）
差异 = BLOCKER 缺陷，渲染前修复
```

- A 的产出（shot script + 场景编排说明）是 B 的**唯一创作输入**；
- B 遇到 shot script 未覆盖的创作空白 → 回问 director skill（或用户），**不得自行编导演艺**；
- 三层同步审计（keyword → scene → shot，REMAINING GAPS: 0）保留在 B。

---

## 1.4 DSH 智能体团队协作协议（**强制**）

> 用户要求（原话）："如果跑在 dsh 中强制使用「智能体团队功能」……进行制作实实在在渲染代码的必须要是多轮可复用的（需要和设计师/导演/脚本师反复交流）"。

**运行环境为 DSH 时**，制作真实渲染代码**必须**使用智能体团队功能（spawn_teammate / 共享任务板 / send_message 多轮）：

| 成员 | 角色 | 职责 |
| --- | --- | --- |
| mv-director（导演/脚本师） | 设计编排 | 产出/修订视频脚本，审批门，评审渲染结果 |
| mv-engineer（实现） | 实现 | 脚本逐行实现，渲染，同步审计，回传结果 |
| （可选）评审 | 蓝军 | 对脚本/渲染做对抗性审查 |

**协作流程（多轮可复用，非一次性调用）**：

```text
director 产出脚本 → engineer 逐行实现 → 渲染回传 director 评审
    → 修订脚本（若导演不满意）→ 再实现 → … → 双方确认 → 完成门
```

**规则**：
1. 单次小任务（如只出脚本、不渲染）可不组团队；
2. 凡涉及"实实在在渲染代码"的制作，**必须**团队模式，且允许 director↔engineer 反复交流（多轮）；
3. 每轮交流都更新脚本与镜头表，保持逐行对应；分歧由 director 定夺（导演是创作裁决者）；
4. 顶层 SKILL.md 须包含此强制条款（路由时检测宿主能力，DSH 即启动团队）。

---

## 2. 现有内容归属对照

| 现有内容 | 去向 | 理由 |
| --- | --- | --- |
| §0 Mission / North-star | 两 skill 各自重写 | 使命不同：导演 vs 实现 |
| §1 时间不变量 / §27.14 | engineer/temporal.md | 实现层铁律 |
| §2 请求编译器 / §17 例子 | director | 理解需求是导演职责 |
| Staged delivery S-A~S-D | director | 分批编排 + 审批门 |
| §18 质量层次 | director（重排） | 创作质量标准 |
| §19 / §20 | director | 定义与谱系 |
| §27 全部 / §28 / §29 | engineer/enforcement.md | 工程护栏 |
| references/architecture.md | engineer | 实现架构 |
| references/workflow.md | engineer（Steps 12–15 + 陷阱） | 实现工作流 |
| references/visual-system.md | director（补设计语法） | 视觉语言是导演领域 |
| references/music-visual-mapping.md | 两 skill 各一份视角版 | 导演要懂、实现要做 |
| references/reference-analysis.md | director | 参考解读是导演领域 |
| references/decision-protocol.md | 两 skill 共用 | 提问/审批协议 |
| references/validation.md | engineer | 验证是工程 |
| examples/ | 按 A→B 重写 README | 演示双 skill 协作 |

---

## 3. 设计感补强清单（E4/E5 的落地）

| 补强项 | 目标文件 | 验收标准 |
| --- | --- | --- |
| 分镜方法（怎么填 shot script） | director/references/shot-script.md | 能回答：这镜为什么这么拍、观众感受到什么 |
| 场景编排方法（三层法/情绪弧/节奏/留白） | director/references/staging.md | 每批产出"场景编排说明" |
| 风格设计语法 ×7 | director/references/visual-styles.md | 每种 ≥ terminal 一半密度，含构图/配色/排版/运动 |
| §18 重排 + 设计感底线 | director/SKILL.md | compositional quality 进前四 |
| 交接契约 | 顶层 SKILL.md + engineer/SKILL.md | shot script ↔ 代码表逐行可核对 |

---

## 4. 里程碑与风险

| 里程碑 | 内容 | 风险/依赖 |
| --- | --- | --- |
| M0 ✅ | 备份 tag + dev 分支 | 已完成 |
| M1 | 本方案书（不提交） | 用户确认方向 |
| M2 | 建 director/ engineer/ 目录，迁移现有内容 | 逐行保真（0 丢失 0 重复） |
| M3 | 新写 shot-script.md / staging.md / visual-styles.md | 设计方法论质量 |
| M4 | 顶层路由 SKILL.md + 双 frontmatter | 两 skill 可独立加载 |
| M5 | 交叉引用/章节号/链接全量校验 | 复用 v2.3 校验法 |
| M6 | 用户确认后提交 dev（**方案书不提交**） | 走 rebase 纪律：禁止在冲突态删建 tag |

**主要风险**：
1. 两 skill 边界漂移（导演写实现、实现替导演创作）→ 靠交接契约 + E-2 审计兜底；
2. 拆分丢失现有工程纪律 → M2 逐行保真迁移 + M5 校验；
3. 方案书若被误提交 → 已约定 M6 只提交 skill 迁移，不提交本文件。

---

## 5. 已定项与待拍板

**已定（用户本轮拍板）**：
- director 人格提示词：*"你是一个顶级设计师，进行深度决策，得到视频脚本。你不是为了实现任何功能的，你是进行视频编排的。"*
- 角色定位：mv-director 是驱动者，产出视频脚本驱动 mv-engineer；设计感好坏不由 director 单次输出背锅。
- DSH 强制智能体团队：渲染类制作必须多轮可复用团队协作（§1.4）。

**已拍板（2026-10-04 第二轮确认）**：
- 顶层 SKILL.md：**不设**（A2）——director/ 与 engineer/ 平级独立，根目录只放 README；
- 目录命名：**director/ + engineer/**；
- 版本：保持 v2.4.x，重构完实测再定；
- 补充：无，动工 M2。

**此前拍板项（第一轮）**：

1. **顶层 SKILL.md 形态**：A. 保留单入口做路由（推荐，README/CHANGELOG 连续性最好）；B. 拆成两个独立仓库。
2. **目录命名**：director/engineer（推荐）还是 design/implement？
