# 重构设计决策说明（审阅入口）

> 目的：让你快速审阅这次重构的**设计判断**，标注自由度边界、参考来源、待你确认的点。
> 英文正式版在 director/ 与 engineer/；本目录是中文审阅副本，正式版以英文为准。

---

## 0. 一句话总结

把原来"一个全能 skill"拆成**导演（mv-director）+ 实现（mv-engineer）**两个 skill：
导演只做视频编排（深度决策、出视频脚本），实现只做代码落地（脚本逐行→确定性渲染）。
设计感缺失的根因（缺设计师角色）由新 director skill 直接解决；工程纪律全部保留在 engineer 侧当护栏。

---

## 1. 你已拍板的（本轮确认）

- 人格提示词："你是一个顶级设计师，进行深度决策，得到视频脚本。你不是为了实现任何功能的，你是进行视频编排的。"
- 角色定位：mv-director 是**驱动者**，判断标准=编排是否明确可驱动，设计感好坏不由单次输出背锅；
- DSH 强制智能体团队：渲染类制作必须多轮可复用协作；
- 单仓库双 skill、不设顶层 SKILL、目录名 director/engineer、版本保持 v2.4.x；
- 发布声明：未经验证 + 最佳运行环境 DSH + 测试自行估算价格（已写入两个 SKILL.md 头部）。

---

## 2. 我做的设计判断（请重点审）

### D1. 质量层次重排：compositional quality 从第 6 升到第 4
- 理由：旧版把"好看"排到可牺牲位置，agent 的最优策略变成"正确但平庸"；
- 风险：提升后 agent 可能为"好看"牺牲同步/确定性——已用"设计感底线"条款约束（先满足前三条再谈视觉）；
- 待确认：你是否认可第 4 位，还是想更激进（比如第 3）？

### D2. 三条硬约束 + 其余全自由（staging.md §6）
- 只锁：同步、确定性、有进有出；其余全部可打破（能讲清"为什么更好"就行）；
- 理由：你的"设计师自由度要高"直接落成规则——用三条地板约束换全屏创作自由；
- 风险："可以打破任何规则"可能被懒 agent 当挡箭牌——已在 S-C 审批门兜底（打破规则要在批里讲清理由）；
- 待确认：三条地板够不够？要不要加第四条（比如"每帧必须有焦点"）？

### D3. director 不背设计感 KPI，质量靠多轮迭代
- 理由：单次输出惊艳不可靠也不可验收；把质量责任移到"导演↔engineer 多轮评审闭环"；
- 风险：多轮可能拖慢交付——用"完成门 + 停止条件"（engineer 侧 §27.15）限迭代上限；
- 待确认：你是否接受"第一版脚本可以不惊艳，靠迭代收口"？

### D4. 风格适配器补强为四维语法（visual-styles.md）
- 每种风格给构图/配色/排版/运动四维，密度到 terminal 一半以上；
- 来源：apple-design（排版光学尺寸/字距/行距、深度层次、八原则）+ emil-design-eng（缓动决策框架、运动家族、隐形正确聚合）蒸馏；
- 待确认：风格数量（7+hybrid）够不够？要不要补"数据可视化/cyber"（旧版 §19 提过）？

### D5. 参考内容归属
- decision-protocol / music-visual-mapping 双份拷贝（各 skill 自包含）；
- workflow.md 拆成 director(Steps 0-11+shot script) 与 engineer(Steps 12-15+§15/16/23+陷阱)；
- 其余整文件搬迁（逐字节一致，0 丢失 0 重复已验证）；
- 待确认：双份拷贝是否接受（还是想抽公共 references/ 层共享）？

---


### D6. 导演想象力维度（概念先行 + 创意杠杆）
- 用户本轮新要求：*"导演现在应该不会在合适的地方使用各种有意思的设计吧（导演的想象力要高），比如什么傅里叶变换，用分词器拆词之内的"*；
- 新写 concept.md：任何分镜前先写**三个中心概念**（onetake 硬规则），创意杠杆库（FFT/分词器/利萨如/物理隐喻/光学戏法）在合适时刻使用；节奏绝不按节拍器切（镜头长度差 ≥4×、至少一段近静默、小元素大地面）；每个段边界必须有东西存活并移动（carry）；
- 已接入 director/SKILL.md：S-A.5 Concept 阶段 + Imagination floor（一个强杠杆=签名，五个=噪音）；
- 待确认：想象力这条硬度够吗？要不要把"三概念选一"也做成用户审批门的一环？


### D7. 泛化：脱离"只为音乐 MV 设计"
- 用户本轮新要求（原话）：*"我希望这个skill可以脱离原本的只为音乐生成mv设计的，现在应该要为了制作所有种类的视频设计，不可以在提示词中就锁定了范围了"*；
- 已泛化：两 SKILL.md frontmatter name 改 **video-director / video-engineer**，description/mission 覆盖所有时间驱动视频（MV/产品片/文字片/数据可视化/解说/动态图形）；temporal.md 时间源改为"声明的权威时间源"（有音频→audio.currentTime，无音频→frameIndex/FPS 或数据时间线）；music-visual-mapping.md 标条件加载（仅输入是歌曲时）；staging/validation/enforcement 关键表述条件化；
- 保留：三地板（同步/确定性/有进有出）不因泛化削弱，只是同步对象从歌词扩展为"声明的 cue/数据时间线"；
- 待确认：泛化后是否还需要保留 music-visual-mapping 作为条件模块，还是干脆去掉（导演通用规则已覆盖）？

### D8. 剧本是落盘文件、多轮写入（用户洞察）
- 用户原话：*"导演其实是可以写的，可以写剧本文件，因为如果剧本长会需要多轮写入的（模型单次输出上下文有限），而读取剧本几乎不可能用满上下文，而剧本需要非常多文字来精细化演出，单次输出绝对不够"*；
- 纠正了我一个隐性误解：导演不写代码 ≠ 只产出精简表格。产出应该是**落盘长剧本文件**，支持多轮追加写入（写一批保存一批），演出列写完整散文级细节；
- 已落实：shot-script.md 加 §0 写入协议 + director/SKILL.md S-D 强化；
- 待确认：单轮输出前先写骨架再逐轮展开的做法，是否要严格分轮（round 1 骨架 → round 2+ 细节 → 最后通读）还是允许导演自由节奏？

### D9. 权限门：主 agent 保持设计师，开工前索要会话级完全权限
- 用户实测发现：受限会话里 spawn 的 teammate **没有被沙箱放行**（teammate 只继承会话级策略，per-call 放行不传递）；
- 探针验证（2026-10-05）：teammate 视角的 Current DSH file policy 与主 agent 完全一致（本会话 danger-full-access 时副 agent 全通）——确认 teammate 实时继承会话策略；
- 用户拍板：**主 agent 仍是 video-director（设计师）**，但开工前必须先向用户索要**会话级完全权限**（danger-full-access / workspace-write），拿到后 spawn 的 engineer 才继承；
- 已落实：两 SKILL 团队章节加 Permission gate（导演侧：spawn 前确认会话策略、不够即停并索要；工程师侧：被拒即上报，不静默降级）+ 中文审阅版同步；
- 待确认：权限门的默认措辞（"向用户索要 danger-full-access"）是否需要在 SKILL 里给出一句标准话术模板？

### D10. 可视审批门——Show, don't describe（用户实测关键反馈）
- 用户反馈（原话）：*"A. 审核的东西没法评估，我想的和他想的完全不一样"*；
- 根因：S-C 只给文字批方案，用户无从评估——文字描述无法传达视觉，双方脑补的画面天然不一致；
- 修复：S-C 改名**可视审批门**，每批必须先出 1-3 张静态关键帧设计稿（HTML/CSS/SVG/canvas 静态帧，构图/配色/排版/氛围），用户审批**看到的画面**；"我想的不一样"→ 出新设计稿迭代，不是更长的文字解释；
- 同步修正导演角色边界：不写实现代码，但**必须画设计稿**（美指出分镜草图的本职）；
- 已落实：SKILL S-C + Mission + shot-script §1.6 + 中文版 + 本地两份安装；
- 待确认：设计稿用什么产出最快（纯 HTML/CSS/SVG vs 直接在所选运行时渲染单帧）？要不要在 SKILL 里固定推荐一种？

### D11. 剧本对生产者=可执行规格，不只"更长"（用户实测二次反馈）
- 用户反馈（原话）：*"他给的方案我看着挺好的，但实际上交给生产者就制作得特别差了。很可能是剧本太短，生产者无法很好地理解那些东西"*；
- 诊断修正：不是"行数短"，是**参数密度低**——导演写"温暖的光、分层深度"（概念），生产者需要"#FFD7A0、z-index/透明度/曲线"（数值）；执行者被迫解码概念=发明，每处发明都是漂移；
- 修复：shot-script.md 加**参数硬清单（8 项必填数值）**+ **§1.55 完整示例镜头**（#0A1E3C/4.4s/cubic-bezier 级别的密度下限）；修辞：*"答满 8 项→工程师只翻译；只答 3-4 项→工程师发明其余，那不是执导"*；
- 待确认：示例的密度会不会太苛刻吓跑导演？要不要加"低密度镜头可显式标 engineer choose"的豁免（示例 Rules 里已写）？

### D12. engineer 需显式调用环境设计技能（用户实测反馈）
- 用户反馈（原话）：*"而且生产者好像不会调用，我当前环境中其他设计有关的 skill"*；
- 根因：engineer/SKILL.md 只引用工程类 references（temporal/enforcement/validation…），零指示调用环境已装设计 skill（emil-design-eng/apple-design/design-system/ui-ux-pro-max/onetake）——"确定性做"但不知"怎么做得像设计稿"；
- 修复：engineer/SKILL.md 加"Environment design skills (DSH, best-effort)"节：E-3 写码前按需加载（运动→emil/apple；排版→apple；布局→ui-ux-pro-max；配色→design-system；节奏→onetake），规则=ON TOP OF 确定性地板、缺失即跳过、先加载后询问、工艺不得覆盖导演数值（冲突要报告不要悄悄改）；
- 待确认：映射表要不要按"镜头元素类型"再细化（比如文字镜头强制 apple-design，粒子镜头强制 emil-design-eng）？

### D13. 音乐视频：歌词逐词解析画面（用户要求）
- 用户要求（原话）：*"如果是音乐视频的话，要把歌词逐词解析，解析每个词该用什么画面展示"*；
- 缺口：music-visual-mapping.md 原有词级时间轴（何时唱到）但无词级画面语义（每个词用什么画面）；
- 新增 Word-level visual parsing：每个实词一行——word / t(ms) / 语义角色 / 情绪 / 该词的画面决策（形状/色/运动/舞台/杠杆，不是字幕式说明）/ shot id；对立词（AC/DC、from/to、light/dark）在此获得逐词触发；歌词没有逐词画面表 = 音乐视频批次不审批；
- 已接入：director/SKILL.md S-A（音乐输入硬要求）+ word→visual 表落盘硬交付 + 本地四份 music-visual-mapping（director/engineer × .dsh/.agents）同步；
- **已拍板（用户2026-10-05批复）**：逐词画面表**进 S-C 可视审批**——每批抽 2-3 个代表词渲染画面 mockup 给用户看，用户审批词的**实际画面**而非文本行（show-don't-describe 规则下沉到词级）；已写入 director/SKILL.md S-C + music-visual-mapping.md 并同步本地安装。

### D14. 模型不爱调搜索工具 → Search-first 硬规则
- 用户反馈（原话）：*"模型现在似乎还不喜欢调用搜索工具，而有一些东西确实得需要搜索"*；
- 修复（用户修正措辞）：**搜索不是强制流程，是"需要搜索的时刻必须调用"**——director/SKILL.md S-A + engineer/SKILL.md E-3 各加 Search when needed——给出"需要搜索"的触发清单（参考风格/歌词文化语境/杠杆技法先例/字体授权/API 形状/库可用性/FFmpeg 行为/未实现技法示例）；核心原则：*搜索胜过记忆，验证胜过假设；无法引用或测量的事实是猜测，猜测不进 shot script / 猜的 API 是等着的运行时错误*；
- 已同步中文审阅版与本地安装；
- 待确认（修正后）：触发清单与"不要每步搜索"的平衡——如何防止模型走极端（要么不搜、要么过度仪式化搜索）？

### D15. 平台感知工具映射（非 Mac 可用性）
- 问题：Opus 5.5 工具栈含 Swift Core/VFX（macOS 专属）与 Homebrew（macOS 主力），非 Mac 怎么办？
- 答案：每层都有跨平台替代——Swift VFX→FFmpeg filters+OpenCV/Pillow；Homebrew→apt/winget；ImageMagick→apt 或 Pillow；Ruby 不需要（Node/Python 覆盖）；P5JS/FFmpeg 本就跨平台。**真正跨不过的只有 FAL.ai 云模型层**（付费 API，与平台无关）；本机 Linux aarch64 实测已有 Node/Python3/FFmpeg；
- 修复：engineer/SKILL.md 加 Platform-aware tool mapping（硬规则）——spec 命名效果不绑定工具名，E-2 先探测工具清单，缺工具安装或代码实现（质量可降级绝不缺席）；
- 待确认：是否要给 director 的 tech breakdown 模板加一句"写效果不写工具名"的提示（目前只在 engineer 侧强制）？

### D16. WebGL/Three.js 纳入实现层（用户问询确认）
- 用户问（原话）：*"WebGL/Three.js这类Web端3D引擎在考虑范围之内吗？"*；
- 回答：在——skill 原则本就是"spec 写效果不绑工具"，但此前全库 0 次提及 WebGL/Three.js，模型面对"3D 立体感/体积效果"不会想到现成引擎；
- 修复：engineer/SKILL.md 平台感知表加 WebGL/Three.js 行（3D 场景/体积/空间效果/3D 粒子 → Three.js，浏览器内或 node+headless-gl；Babylon.js 备选；任意 OS 可用）+ 中文版同步；
- 待确认：要不要在 director 的 tech breakdown 示例里加一个"3D 立体感 → 建议 Three.js"的示范（让导演也学会点名 3D 引擎）？

### D17. 运镜与动画工艺（学 Opus 5.5 参考作品，治"不灵动/像播放器"）
- 用户实测反馈：*"画面一点也不灵动，他就像做了一个本地音乐播放器一样"*；
- 学习源：ClaudeAnimationBase（ANIMATION_GUIDE.md）+ PDoomVideo（STORYBOARD.md）——Opus 5.5 逐词设计 I'm Upping My P(doom) 的完整成果；
- 蒸馏：新写 director/references/camera-animation-craft.md——每镜必须有运镜（push/pan/tilt/whip/on-beat shake/ride）且是被动机的（chomp 盖镜头/火箭带动仰角/坠落带镜头）；经典动画原理（anticipation/squash-stretch/slow-in-out/weight/arcs/follow-through/anti-twinning/exaggeration/key poses/show-the-thought/secondary action）；timing=model the viewer（reads/one-read-at-a-time/fast-actions-slow-meanings/lead-the-eye）；每场景必须有事件（something happens）；handmade 手感（boil/flat2D/no-text-if-actable）；
- 落地检查：每镜 TECH BREAKDOWN 必须含 camera move + animation principle + reads timing，缺失="player-static" 重写；
- 待确认：动画8 是否用这份重做（它是同一首歌的逐词标杆）？
## 3. 尚未做的（M5/M6）

- M5 全量校验：交叉引用/链接/章节号（复用 v2.3 校验法）；
- M6 提交 dev（**REFACTOR-PLAN.md 与 review-zh/ 不提交**，等你审阅后决定）；
- 顶层 README 是否需要更新说明双 skill 用法（你已说不设顶层 SKILL，README 只做仓库说明）。

---

## 4. 给我反馈的格式建议

对每条 D1-D5 回复："D2 认可" / "D2 改：加第四条地板" / "D4 补风格：cyber" 等。
全认可就说"全过"，我直接进 M5+M6。
