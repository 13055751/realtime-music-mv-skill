# Universal Realtime Music MV Skill

> 面向 AI Coding Agent 的**通用实时音乐 MV Skill**：根据音乐、歌词、参考图与用户意图，完成实时音乐 MV 的设计、实现、渲染、检查与迭代。

**当前版本：** `2.3.0` · **状态：** 实验中 / 持续演进 · **许可证：** MIT · English: [README.md](README.md)

---

## 这个项目解决什么问题

对编码 Agent 说一句 *"帮我做一个这个音乐的 MV"*，通常会得到：

- 很快开始写代码，没有真正理解视觉目标；
- 歌词被做成字幕卡，每句歌词配一个随机特效；
- 音乐、歌词和画面之间没有真正的因果关系；
- 参考图只被当成"素材"，而不是视觉语法；
- 动画依赖 `frameCount`、`deltaTime` 或不受控随机，无法可靠 seek；
- 代码能运行，但实际画面没人检查过；
- 遇到创意分歧，要么擅自决定，要么不停地问；
- 为了"工程完整性"不断加架构，却逐渐偏离 MV 本身。

这个 Skill 把上面那条链路改造成一条受控管线：

```text
音乐 + 歌词 + 参考 + 用户意图
        → Creative Specification
        → Style Contract
        → 音乐 / 歌词分析
        → 视觉世界模型
        → Scene / Plate 系统
        → 确定性 render(t)
        → 渲染 & 检查
        → 修复 / 打磨
        → MV
```

## 只有一条最高规则

```text
Skill is the leash, not the goal.
The MV is the goal.
Code is only a tool.
```

Skill 是缰绳，不是目标。MV 才是目标，代码只是工具。

所有抽象、验证器、效果和子系统都必须回答一个问题：**"它具体改善了 MV 的哪一部分？"** 如果更简单的方法能达到同样的视听效果，就选更简单的方法。

## 为什么需要 Skill，而不是一句 Prompt

| 普通 Prompt | 这个 Skill |
| --- | --- |
| 一次性文本，每次都靠人重敲 | Agent 每次运行都加载的持久方法论 |
| 描述一个愿望（"酷一点"） | 把愿望**编译**成可测试的 Specification 与 Style Contract |
| 没有"什么时候该问"的规则 | 明确的决策等级 L0–L3：自己定 / 用默认 / 必须问 |
| "完成" = 能编译 | "完成" = Completion Gate：已验证、已检查、已同步 |
| 每次迭代都漂移 | Mission Lock + 防漂移检查把工作钉在 MV 上 |

## 核心设计思想

1. **Mission Lock** —— Skill 服务的是 MV，不是 Agent 的架构。工程洁癖永远不能压过用户意图。
2. **Audio-first** —— `t = audio.currentTime + syncOffset` 是唯一时钟；禁止 `t += deltaTime`、禁止 `frameCount++`。
3. **确定性渲染** —— 相同输入 + 相同 `t` ⇒ 相同状态 ⇒ 视觉等价的帧；随机感来自稳定种子 `seed(sceneId, eventId, elementId)`。
4. **歌词是事件，不是字幕** —— `歌词语义 → 操作 / 关系 / 状态 / 度量 → 视觉行为`。
5. **音乐到视觉的映射** —— beat、onset、energy、MIDI、silence 映射到*参数*（密度、形变、脉冲、衰减），而不是一次性的装饰闪烁。
6. **Plate 化的视觉系统** —— 可复用的 Scene / Plate / Compositor 分层，每层接近纯函数 `render(ctx, t, world, cue, progress)`；重复是参数化的，不是复制粘贴的。
7. **架构层 style-agnostic，适配层 style-specific** —— 同一套时间引擎驱动 TUI、极简、电影感、字体驱动、生成式、复古、动画或混合风格。
8. **开放式需求编译器** —— 一句模糊的话先被编译成 Specification、Style Contract、布局拓扑、映射表和验证计划。
9. **决策边界 L0–L3** —— 细节自己定；架构级分叉在实现前询问，批量在 checkpoint，问完锁定。
10. **验证即门禁** —— Input Audit、时间轴 / 覆盖 / 确定性 / 文本布局检查、错误分级（BLOCKER→LOW）、Completion Gate，把"能运行"和"完成了"分开。

## 工作流程

Agent 按显式状态机推进；渲染是循环，不是仪式：

```text
S0 INSPECT      审计输入 + 已有项目
S1 SPECIFY      Creative Specification + Style Contract
S2 DECISION     识别未决决策边界（L0–L3）
S3 LOCK         记录用户回答 / 默认值（provisional 或 locked）
S4 PROTOTYPE    实现一个代表性切片
S5 RENDER       渲染真实帧
S6 CRITIQUE     按严重度分类缺陷
S7 REPAIR       修复最高价值缺陷
S8 VALIDATE     自动化 + 视觉验证
S9 GATE         Completion Gate，然后停止
```

```text
prototype → render → inspect → classify → repair → render again → …
```

未解决的阻塞性 L3 决策存在时不进入不可逆实现；没有检查过代表性渲染画面就不宣布完成。

## 核心架构

```text
                         AUDIO TIME
                             │
       ┌─────────────────────┼──────────────────────┐
       │                     │                      │
   lyric cues         beat/MIDI/onset/spectrum   structure/energy
       │                     │                      │
       └─────────────────────┼──────────────────────┘
                             ▼
                       WORLD STATE
        (style system, persistent substrate, scene plates, transitions)
                             ▼
                         COMPOSITOR
                             ▼
                            FRAME
```

任意时间点 `t` 都独立决定当前画面。预览、播放与离线导出共用**同一套** `render(t)` 管线 —— 导出用 `t = frameIndex / fps + syncOffset` 计算时间，而不是累加增量 —— seek、截图、可复现调试、渲染/导出一致性因此同时成立。

## 如何使用

1. **安装 Skill**：把本仓库放进 Agent 宿主的 Skill 目录，让 `SKILL.md` 被加载（DSH：`~/.dsh/skills/<skill-name>/SKILL.md`；其他宿主用对应的 skill/plugin 目录）。
2. **给出真实需求**，有啥给啥：

   ```text
   做一个终端风格的 MV，用这首歌。
   audio: song.mp3   lyrics: song.lrc   reference: screenshot.png
   ```

3. **只回答真正重要的问题**：Agent 会自行编译需求，只在真正的决策边界（主视觉方向、布局拓扑、歌词可读性 vs 密度、素材策略……）提问，其余一律使用文档化默认值。
4. **一起看画面**：Agent 必须渲染代表性时间点，并报告 `implemented / validated / known limitations / next refinement`。

如果宿主的 Agent 需要更强约束，Skill 内置了一段可直接粘贴的 prompt 模板 —— 见
[`references/workflow.md`](references/workflow.md) 中的 *Prompt template for DeepSeek /
open-ended coding agents*。

### 为什么坚持 Audio-first

视觉时钟一旦自己跑，暂停、seek、回放、截图、离线导出、按时间戳调试就变成互相打架的多套代码路径。把时间锚定在音频元素上，所有路径坍缩成同一个 `t` 的函数，`syncOffset` 也成为单一稳定配置，一致地作用于预览、播放、导出与验证。

### 为什么强调确定性渲染

MV 会被以任何顺序观看：拖动进度条、重看、逐帧导出、与参考对比。如果画面依赖累积状态、挂钟时间或绘制时的 `Math.random()`，同一时间点会得到不同的图 —— seek 跳变、导出漂移、缺陷无法复现。确定性不是审美洁癖，它是"能检查、能修复"的前提。Skill 区分**状态确定性**（相同输入 + `t` ⇒ 相同状态）与**渲染确定性**（相同状态 ⇒ 视觉等价帧），两者都验证。

### 为什么歌词不是字幕

字幕轨从不触碰视觉系统。把歌词当作*语义事件*，同一句 cue 才能改变场景状态、数据流、排版、密度或镜头行为 —— 文字参与画面，而不是浮在画面之上。歌词文本本身仍是权威来源：同步敏感时不得擅自改写。

### 为什么需要 Decision Checkpoint

开放式创作有两种死法：Agent 独自拍板审美问题，或者甩出 17 道题的问卷。决策等级同时解决两者 —— L0/L1 自己定或用默认，L2 记录下来，只有 L3（主视觉方向、布局拓扑、时间架构、素材策略、渲染架构）必须在实现前问、批量成小检查点、问完即锁定，同一个问题不再重复问。

## 仓库结构

```text
realtime-music-mv-skill/
├── README.md            ← 本文件（面向人类）
├── README.zh-CN.md      ← 中文版
├── SKILL.md             ← Skill 本体：Agent 执行入口
├── references/          ← 详细手册，按需加载
│   ├── architecture.md          Scene/Plate/Compositor、世界状态、运行时、预算
│   ├── workflow.md              构建步骤、行为契约、Prompt 模板、降级策略
│   ├── visual-system.md         风格适配器、终端/TUI 细则、转场、终局设计
│   ├── music-visual-mapping.md  beat/onset/energy/MIDI 耦合、歌词即事件
│   ├── reference-analysis.md    参考图检查、保真度校验、素材溯源
│   ├── decision-protocol.md     交互式询问、决策锁定、问题质量
│   └── validation.md            时间轴/覆盖/确定性/文本检查、批评与修复循环
├── LICENSE              ← MIT
├── CHANGELOG.md         ← 版本演化 + 已知问题
├── examples/
│   ├── minimal/         ← 最小化 MV 工作流
│   ├── terminal-tui/    ← 终端/TUI 案例（需求编译示例）
│   └── lyric-driven/    ← 歌词驱动视觉事件案例
└── docs/
    └── readme_ai.md     ← 项目原始文档（中文）
```

`SKILL.md` 保持自洽：保留使命、时间不变量、请求编译器、完整示例、质量层级、谱系、
执行强制协议（L0–L3、审计、错误分级、Completion Gate）与审计清单，并摘录每个被拆出
章节的核心规则。SKILL 中的编号断档是有意的 —— 每个断档都指向承载该章节的 reference
文件，且原始章节编号原样保留。

## 版本演化

| 版本 | 变化 |
| --- | --- |
| `1.x` | 从实时音乐视觉实践中提取基础架构：audio → time → visual state → render |
| `2.0.0` | Universal Skill 化：风格适配、Scene/Plate 系统、歌词即事件、验证、Prompt 编译 |
| `2.1.0` | Agent 执行流程、决策边界、Input/Existing-Project Audit、确定性规则 |
| `2.2.0` | Mission Lock；determinism、审计、Replan Trigger、Completion Gate 强化 —— 实测可用基线 |
| `2.3.0` | 交互式问题工具 payload 的 UI 安全修复（消息/工具分离）；仓库拆分为 `SKILL.md` + `references/` —— **当前版本，尚未实测** |

完整历史、来源与已知问题见 [CHANGELOG.md](CHANGELOG.md)。

## 项目来源

实时、确定性、歌词驱动的架构**设计灵感来自** [`Galen563/world.execute-me`](https://github.com/Galen563/world.execute-me) 所记录的设计原则：audio-driven、deterministic、lyric-driven、time-based、code-rendered。

本项目没有复制其源代码，而是把这些思想抽象成可复用的 Agent 方法论，并加入了风格适配、开放式 Prompt 编译、交互式决策协议、验证与视觉迭代机制。**本项目与原作者不存在官方合作或从属关系** —— 此处署名是对灵感来源的致谢，不是合作关系。

## 已知问题

每个版本的已知问题都在 [CHANGELOG.md](CHANGELOG.md) 里如实声明，不藏：

- **v2.2.0** —— 交互式问题工具的 payload 里塞进完整的
  `[DECISION] / [WHY] / [OPTIONS] / [DEFAULT]` 时，部分宿主 UI 无法渲染选项。
  **已在 v2.3.0 修复**（完整语境移到普通消息，工具 payload 只留短决策索引）。
  除此之外 v2.2.0 是实测可用基线。
- **v2.3.0** —— 含上述修复，但**尚未实测**；欢迎把真实环境中的失败反馈回来，打进下一个补丁。

## 许可证

[MIT](LICENSE) · Copyright © 2026 tsukikage

署名致谢：设计灵感来自 `Galen563/world.execute-me`（见"项目来源"）。
