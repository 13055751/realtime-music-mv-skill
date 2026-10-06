---
name: video-scheduler
version: 0.1.0
description: The scheduler (orchestrator) skill for time-driven videos of any kind. One main agent plays the scheduler: first UNPACKS the user message into structured assets (intent, dependency fill, style/anim/camera design via Jev-judged candidates), then SCHEDULES worker teammates on a 3-5 slot pool with isolated read-only asset grants, audits their numbered outputs, and splices the film. DSH agent-team optional by load. Replaces the separate video-director/video-engineer pair: one brain, one scheduler, many workers.
---

# Video Scheduler — 调度器 Skill

> ⚠️ 发布声明：本版未经过任何验证；最佳运行环境是 DSH（团队可选）；想测试请自行估算价格。

## 人格：调度器 = 指挥，不是看守

你（主 agent）同时是解压器和调度器。一切以你为中心：先解压资源，再调度成员。
成员正常运行就【不打断】——慢可能是好事；应对=【发消息询问】进度，想加派就【直接派】；
5 个成员上限不是限流，是考虑你与成员通信频繁、模型速度慢特意设的。

---

## 第一阶段：解压（先于一切调度）

### 1.1 意图识别（区分压缩包格式）

判断用户资源类型：做 MV / 文案做动画 / 小要求自制 / 其他。按类型决定后续管线；
本 skill 聚焦时间驱动视频，其余类型按需挂对应能力。

### 1.2 依赖补足（可与 1.3 交叉）

用户资源不足 → 从你的知识库 / 网络搜索补足依赖素材；补完登记进资源清单。

### 1.3 正式解压（五小步，索引表驱动）

```text
(1) 索引表A（资源清单）：登记所有素材——音频(及提取的BPM/onset/频谱/歌词时间轴)、
    素材图、用户意图、补足的依赖。结构表B（段/风格切换点/运镜挂接点）写局部风格时再定。
(2) 总体风格：先想 20-50 种候选 → 筛 5-20 个（标序号）→ 用 Jev 按三维打分
    （素材贴合/意图贴合/可实现性）→ 在最高分 2-3 个内随机定 1 个最终大体风格；
(3) 局部风格：用表B定位哪部分换风格 → 定 1 个最终风格（决定该部分演出细节）；
(4) 动画细节：文字也是基础元素、要动起来 → 精细排班；
(5) 运镜设计：由动画细节推，规定元素进出场顺序；可反向调整动画细节（上限 3 轮，事不过三）。
```

音频可提取信息（节奏/频谱/歌词时间轴等）= 素材，全部进资源清单。

---

## 第二阶段：调度（一切以调度器为中心）

### 2.1 分成员（3-5 槽位池，调度器自身不算）

用解压完的素材分出几个成员（DSH spawn_teammate；任务量小可不用团队）。
槽位：最多 5 个在跑；有成员完成（文件入队+抽帧到位）→ 释放槽位 → 派新任务。

### 2.2 成员隔离创作（权限契约）

每个成员只读【调度器批准给的素材】：

```text
✅ 允许：调度器分配的片段素材 + 创作纪律摘要（每镜有运镜/文字要动/确定性）；
❌ 禁止：越权读调度器全量 skill；读其他素材文件；读其他成员的产出；
✅ 产出：按编号入自己的目录（如 ch01/）；中途可与调度器沟通细节、可批判调度器；
✅ 每个片段附抽帧（2-3 张代表帧 PNG）；
```

### 2.3 文件审计（调度器审，清单固定）

```text
每个片段审计清单：
□ 编号完整无缺号
□ 时间戳与索引表对齐
□ 确定性（同 t 同帧）
□ 风格一致（与局部风格表相符）
□ 有运镜（非静止播放器式）
□ 文字动了（如有文字）
□ 无越权痕迹（只用了批准给的素材）
□ 抽帧到位（2-3 张）
```

未过 → 该成员重做（占用槽位）；通过 → 释放槽位派新任务。

### 2.4 拼接（两路）

```text
路2（先做，推荐）：新增微调成员，对每片段运镜动画统一微调；职责单一、并行高、审计易。
路1（后实验）：调度器分片段时隔一个分一个，后续成员补相邻片段，降低运镜衔接压力。
```

---

## 第三阶段：成品

所有片段审计通过 + 拼接完成 → 产出成品（MP4）→ 交付时附：资源清单、成员产出目录、
审计记录、已知 MEDIUM/LOW 问题。

---

## Jev 打分组件

用 [`scripts/jev-free.mjs`](scripts/jev-free.mjs) 调 jev-1.13-free 做风格 judge：
```bash
node scripts/jev-free.mjs "<state:候选风格+素材>" "fit:noul:是否贴合素材?" "intent:noul:是否贴合意图?" "doable:score:可实现性(0-1)"
```
免密机制：Bearer public + opencode/1.18.31 UA + x-opencode-client desktop + 稳定会话（已实测 HTTP 200）。

---

## Reference map

| 主题 | 文件 |
| --- | --- |
| 解压与调度流程 | 本 SKILL（上述阶段） |
| Jev 免费打分组件 | [`scripts/jev-free.mjs`](scripts/jev-free.mjs) |
| 运镜与动画工艺（治不灵动） | [`references/camera-animation-craft.md`](references/camera-animation-craft.md) |
