Universal Realtime Music MV Skill

«A general-purpose Skill for AI agents to design, implement, render, and validate realtime music videos driven by audio, lyrics, references, and visual intent.»

Universal Realtime Music MV Skill 是一套面向 AI Coding Agent 的音乐 MV 制作 Skill。

它的目标不是让 Agent 写出“看起来很专业”的代码，而是让 Agent 真正完成一支与音乐同步、具有统一视觉语言、能够响应歌词与音乐结构，并且可以反复渲染和验证的 MV。

---

为什么要做这个

传统的 AI Coding Agent 在面对：

«“帮我做一个这个音乐的 MV。”»

这类开放式创作任务时，很容易出现几个问题：

- 很快开始写代码，没有真正理解视觉目标；
- 把歌词简单做成字幕卡；
- 每一句歌词对应一个随机特效；
- 音乐、歌词和画面之间没有真正的因果关系；
- 参考图只被当成“素材”，而不是视觉语法；
- 动画依赖 "frameCount"、"deltaTime" 或随机状态，导致无法可靠 seek；
- 代码能运行，但实际画面没有经过检查；
- 遇到创意分歧时，要么擅自决定，要么不停询问用户；
- 为了“工程完整性”不断增加架构，却逐渐偏离 MV 本身。

因此，我们希望把这个过程从：

自然语言需求
    ↓
AI 直接写代码
    ↓
希望它能变成 MV

变成：

音乐 + 歌词 + 参考 + 用户意图
              ↓
       Creative Specification
              ↓
         Style Contract
              ↓
      Music / Lyric Analysis
              ↓
        Visual World Model
              ↓
       Scene / Plate System
              ↓
       Deterministic Render
              ↓
        Render & Inspect
              ↓
          Repair / Refine
              ↓
             MV

---

核心理念

Skill 是缰绳，不是目的

这是整个项目最重要的一条原则：

«Skill 的存在是为了帮助 Agent 做出用户想要的 MV，而不是为了让 Agent 的软件架构看起来漂亮。»

所有抽象、验证、分析、效果和子系统都必须回答：

«“它具体改善了 MV 的哪一部分？”»

如果一个复杂系统只是因为“看起来专业”而存在，而一个更简单的方法已经可以达到相同的视觉结果，那么应该选择简单的方法。

工程是手段。

MV 才是最终产品。

---

核心架构

整个系统以音乐时间轴作为唯一时间基准：

                         AUDIO TIME
                             │
             ┌───────────────┼────────────────┐
             │               │                │
           Lyrics          Music            Events
             │          Beat / MIDI /         │
             │          Spectrum              │
             └───────────────┼────────────────┘
                             ↓
                       WORLD STATE
                             │
             ┌───────────────┼────────────────┐
             │               │                │
        Style System   Persistent Floor   Scene / Plates
             │               │                │
             └───────────────┼────────────────┘
                             ↓
                        TRANSITIONS
                             ↓
                         COMPOSITOR
                             ↓
                            FRAME

任何时间点 "t" 都应该能够独立决定当前画面。

因此：

render(t)

是整个系统最重要的抽象之一。

---

1. Audio-first：音乐是主时钟

视觉时间不应该自己运行。

例如：

t = audio.currentTime + syncOffset;

而不是：

t += deltaTime;

或者：

frameCount++;

这样可以保证：

- 播放
- 暂停
- Seek
- Replay
- 截图
- 离线导出
- Debug

使用的是同一套时间逻辑。

"syncOffset" 也是稳定配置的一部分，并且必须同时作用于：

- 播放
- 预览
- 离线渲染
- Validation

---

2. Deterministic Rendering：确定性渲染

相同的：

Input + timestamp

应该得到相同的 World State。

进一步：

same state
    ↓
visually equivalent frame

因此禁止让画面依赖：

- 不受控制的 "Math.random()"
- 累积的上一帧状态
- 渲染次数
- frame count
- wall-clock 时间

需要随机感时，使用稳定种子，例如：

seed(sceneId, eventId, elementId)

这样同一时间点可以被可靠地重新生成。

---

3. Lyrics are Events

歌词不是简单的字幕。

我们把歌词看作一种语义事件：

LYRIC EVENT
    ↓
semantic meaning
    ↓
visual behavior

例如歌词表达：

execution
isolation
error
memory
collapse
recovery

那么它们可以改变：

- UI 状态
- 场景状态
- 数据流
- 色彩
- 排版
- 故障程度
- 动画参数
- 摄像机
- 转场

而不是简单地：

歌词出现
→ 在屏幕底部写一句文字

这使歌词真正参与 MV 的视觉叙事。

---

4. Music-to-Visual Mapping

音乐分析也不是为了“检测到鼓点然后闪一下”。

系统允许把音乐信息映射到视觉参数：

beat
onset
spectrum
energy
tempo
MIDI
silence
section

例如：

low frequency → panel pulse
high frequency → fine data activity
energy → global density
onset → transient event
silence → visual contraction
section change → scene transition

关键原则是：

«音乐数据应该改变视觉系统的状态，而不是制造没有语义的装饰。»

---

5. Plate-based Visual System

我们把可复用的视觉模块抽象成 Plate。

例如：

waveform plate
terminal plate
lyrics plate
process plate
spectrum plate
particle plate
data stream plate
error plate
background plate

Plate 可以独立处理：

layout
animation
style
data
opacity
transition

然后由 compositor 组合。

这样可以避免：

一个歌词
→ 写一套代码

下一句歌词
→ 再写一套代码

下一场
→ 再复制一份

而是：

semantic event
      ↓
parameter change
      ↓
reusable plate

---

6. Style Adapter

Skill 本身不是 TUI Skill。

它的架构是 style-agnostic 的。

同一套时间和事件系统可以生成：

TUI / Terminal
Minimal
Cinematic
Anime
Retro
Pixel
Typographic
Generative
Abstract
Data Visualization
Cyber
Hybrid

不同风格只需要改变 Style Contract 和对应的视觉 Adapter。

---

7. Reference Images

参考图不是简单的素材。

Agent 应该从参考中提取：

composition
density
hierarchy
typography
color restraint
spacing
behavior
motion grammar

也就是说：

«参考图提供的是视觉语法，而不只是视觉内容。»

如果多个参考之间发生冲突，则遵循：

explicit user instruction
        ↓
designated primary reference
        ↓
repeated common visual grammar
        ↓
secondary references
        ↓
agent inference

如果冲突会导致重大架构或视觉方向变化，则应该询问用户。

---

8. Open-ended Request Compiler

我们特别针对 AI Agent 的开放式创作能力增加了一层：

User Request
    ↓
Creative Specification
    ↓
Style Contract
    ↓
Layout / Scene Topology
    ↓
Music-to-Visual Mapping
    ↓
Cue-to-Plate Mapping
    ↓
Reusable Motifs
    ↓
Runtime Architecture
    ↓
Validation Plan

例如：

«“做一个终端风格 MV。”»

不应该直接变成代码。

Agent 首先需要明确：

PRIMARY STYLE
Full-screen terminal-native TUI

LAYOUT
Left main session
Left lower stdout / lyrics
Right feature bands
Right corpus / data stream
Right ops / process

TYPOGRAPHY
Compact monospace

COLOR
Cold blue-gray
Sparse amber
Occasional cyan / error red

BEHAVIOR
Waveform follows audio
Feature bands follow spectrum
Lyrics become terminal output
Semantic events change process state

然后才进入实现。

---

9. Decision Boundary

Agent 不应该什么都问用户。

我们定义了 Decision Severity：

L0 — trivial
    Agent 自己决定

L1 — reversible
    默认执行，保持可配置

L2 — material
    有真实分歧时询问

L3 — architectural
    必须询问后再继续

真正影响：

- 主视觉方向
- 布局拓扑
- 渲染架构
- 素材策略
- 时间架构
- 核心叙事

的问题，才进入用户决策。

---

10. Interactive Question Protocol

实际在 DSh / Agent 环境运行时，我们发现了一个非常具体的问题：

如果 Agent 把完整的问题、背景、理由和推荐方案全部塞进交互工具：

"question": "[DECISION] ... [WHY IT MATTERS] ... [OPTIONS] ..."

某些宿主 UI 会因为文本过长而无法正常显示选项。

因此在 v2.3.0 中，我们把：

语义上下文

和

UI Tool Payload

彻底分离。

正常消息可以写完整：

当前需要决定 MV 的主视觉方向。

这个决定会影响：
- 面板拓扑
- 配色密度
- 歌词呈现
- 后续故障效果

当前有三个方向……

而工具只接收：

question: "视觉方向"

A. 系统监视器
B. 代码执行
C. 故障演化

即：

Agent Message
    ↓
完整解释
    ↓
Question Tool
    ↓
短决策索引 + 短选项

这是目前 Skill 中非常重要的 Agent/UI 兼容规则。

---

11. Agent Workflow

整个 Agent 执行流程被明确划分为：

PHASE 0  Inspect Inputs
    ↓
PHASE 1  Compile Specification
    ↓
PHASE 2  Detect Decision Boundaries
    ↓
PHASE 3  Ask Required Questions
    ↓
PHASE 4  Lock Decisions
    ↓
PHASE 5  Prototype
    ↓
PHASE 6  Render
    ↓
PHASE 7  Critique
    ↓
PHASE 8  Repair
    ↓
PHASE 9  Generalize
    ↓
PHASE 10 Validate

其中：

«Prototype → Render → Inspect → Repair»

是非常重要的一条路径。

不要在没有看到实际画面之前，就认为代码已经“完成”。

---

12. Input Audit

开始视觉实现之前，Agent 必须检查输入。

包括：

Audio

format
duration
sample rate
channels
decodability

Lyrics

encoding
timestamp format
malformed lines
duplicate timestamps
empty cues

References

resolution
aspect ratio
visual reference
text reference
number of references

MIDI / Analysis

track count
tempo map
event timing
missing analysis

输入不满足要求时，不应该假装已经拥有这些信息。

---

13. Existing Project Audit

如果 Agent 是在已有项目上工作，它应该先检查：

package / build system
entry points
audio transport
renderer
timeline / lyric parser
scene abstractions
validation

原则是：

«能复用就复用，确有必要才重构。»

避免为了套用 Skill 而重写整个项目。

---

14. Validation

“代码能运行”不是完成标准。

Skill 会检查：

timeline
event ordering
scene coverage
lyric consistency
text layout
runtime errors
determinism
audio end
sync offset
render/export consistency

时间戳允许：

t1 <= t2 <= t3

相同时间戳的事件必须通过稳定顺序处理。

---

15. Error Severity

问题分为：

BLOCKER
必须修复

HIGH
通常应该修复

MEDIUM
根据时间 / 质量预算决定

LOW
可以保留

这样 Agent 不会为了修一个低价值的小问题而破坏整个视觉系统。

---

16. Replan Trigger

如果用户修改的内容影响：

dominant style
layout topology
temporal architecture
asset strategy
renderer architecture

就不能继续局部打补丁。

应该重新执行：

Specification
    ↓
Decision Checkpoint
    ↓
Architecture Review

避免整个项目逐渐变成补丁堆。

---

17. Completion Gate

只有满足以下条件，Agent 才应该认为 MV 完成：

required inputs valid
        +
no blocking validation errors
        +
no known text overlap
        +
no synchronization defects
        +
no unresolved L3 decisions
        +
Style Contract satisfied
        +
representative renders inspected
        +
final output generated

而不是：

npm run build
    ↓
成功
    ↓
“MV 完成”

---

18. Terminal / TUI Specialist

Terminal/TUI 是目前 Skill 中最完整的专门风格之一。

典型结构：

┌──────────────────────────────────────────────┐
│ MAIN SESSION              │ FEATURE BANDS    │
│                           │                  │
│ terminal / process        │ spectrum         │
│                           │ waveform         │
├───────────────────────────┼──────────────────┤
│ STDOUT / LYRICS           │ CORPUS / DATA    │
│                           │ STREAM           │
├───────────────────────────┼──────────────────┤
│                           │ OPS / PROCESS    │
└──────────────────────────────────────────────┘

强调：

- 黑色背景
- monospace
- 高信息密度
- 真实终端结构
- 克制配色
- 明确层级
- 保留文本布局空间
- 不做假的“赛博 HUD”

最终目标是：

«看起来像一个真实运行中的程序，而不是贴满装饰的 Cyberpunk UI。»

---

19. 我们从哪里开始

这个项目的最初技术灵感来自：

world.execute(me)

它提供了非常重要的思路：

audio-driven
deterministic
lyric-driven
time-based
code-rendered

我们没有直接复制它的实现，而是将这些核心思想抽象出来，进一步扩展成：

Universal MV architecture
+
Style adaptation
+
Open-ended prompt compilation
+
Interactive decision protocol
+
Validation
+
Visual critique
+
Agent workflow

因此它不是某一个 MV 的代码模板，而是一套可以被不同 AI Agent 使用的音乐 MV 制作方法论与执行约束。

---

20. 当前版本

当前版本：

v2.3.0

主要版本演进：

v1.x

从 "world.execute(me)" 风格的实时音乐视觉实践中提取基础架构：

audio → time → visual state → render

v2.0

开始向通用 Skill 演化：

style adaptation
scene / plate system
lyrics as events
music coupling
validation
prompt compilation

v2.1

增加 Agent 执行流程、决策等级、输入审计、项目审计和确定性规则。

v2.2

加入最重要的 Mission Lock：

«Skill 是缰绳，不是目标。»

进一步限制 Agent 为了工程架构而偏离 MV 本身。

v2.3

来自真实 DSh 运行反馈。

解决：

«Interactive Question Payload 过长导致宿主 UI 无法正常显示选项»

将：

完整语义问题

与：

UI 决策索引

分离。

---

21. 当前设计原则

整个项目可以浓缩成：

          USER INTENT
               │
               ↓
      ┌─────────────────┐
      │  Creative Spec  │
      └────────┬────────┘
               ↓
        STYLE CONTRACT
               ↓
       MUSIC + LYRICS
               ↓
         WORLD STATE
               ↓
      SCENES / PLATES
               ↓
        render(t)
               ↓
          INSPECT
               ↓
           REPAIR
               ↓
          VALIDATE
               ↓
              MV

最终追求的不是：

more code
more abstraction
more effects
more architecture

而是：

one world
one clock
one visual language
many reusable mechanisms
many musical responses
many semantic events

---

License / Attribution

本项目的实时、确定性、歌词驱动视觉系统思想受到：

"Galen563/world.execute-me"

的设计启发。

本项目不以复制其源代码为目标，而是将相关设计思想抽象为面向 AI Agent 的通用音乐 MV 制作 Skill，并加入开放式创意任务编译、风格适配、交互式决策、验证和视觉迭代机制。

---

Status

Experimental / Actively evolving

这个 Skill 会优先根据真实 Agent 执行过程中暴露的问题迭代，而不是无限增加假想规则。

当前原则：

«Real failure → identify cause → smallest useful fix → test again.»

而不是：

«Add more rules until the Skill becomes the problem.»