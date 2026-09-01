# v1.0.0 技术方案

> **技术架构基线**：[foundation/tech-arch/overview.md](../../../foundation/tech-arch/overview.md)  
> **需求文档**：[product/requirements.md](../product/requirements.md)  
> **接口设计**：[api-design.md](./api-design.md)  
> **数据库设计**：[db-design.md](./db-design.md)  

---

## 1. 方案概述

本版本在 macOS 上交付 `nick` 产品的首个原生客户端。技术策略采用**纯端侧单机零后端架构**：
1.  **UI 表现层**：采用 SwiftUI + AppKit，通过配置为 `LSUIElement`（无 Dock 图标）的常驻菜单栏项目承载。大厅和跟练窗口按需使用 RealityKit 3D；桌面 `NSPanel` 使用 Core Animation 播放低功耗透明 sprite strip。
2.  **疲劳追踪**：基于全局鼠标/键盘活动事件监视器（非侵入式，无录入风险）。
3.  **姿态识别与领操**：利用系统内置的 `Apple Vision`（`VNDetectHumanBodyPoseRequest`），并以 `PoseProvider` 协议隔离 Vision 依赖。
4.  **角色动画**：Rig v2 使用固定 32 关节生产骨架，表现动作在 Blender 4.3.2 制作并烘焙；运行时由唯一 `PetAnimationGraph` 分层合成最终关节姿势。
5.  **数据持久化**：使用 macOS 沙盒内的 `SwiftData` 本地库。
6.  **变现控制**：使用 StoreKit 2 本地验证订阅状态，无云端校验。

---

## 2. 架构变更

CHANGE-011 引入生产级角色动画架构，保持纯端侧和零第三方运行时不变，但调整宠物资产与动作边界：

- 当前 Meshy 24 骨资产只保留为身份与回归参考；新生产资产遵循 `pet-character-rig-v2.md` 的连续网格、32 关节骨架、手工蒙皮和认证合同。
- CHANGE-024 允许从许可证、归因、不可变 artifact/source-topology hash 均已绑定的人工 basemesh 手工适配生产网格。当前 source intake 为 Blender Studio `Base Meshes`（CC BY 4.0）；它只提供拓扑起点，不能替代小草身份或任一 S0–Gate 4 证据。
- Blender 是固定版本的离线 DCC，不随 App 分发。Meshy 只作为候选生成器，不再决定生产 rig 和最终权重。
- 大厅/跟练的 RealityKit 3D clip 与桌面 sprite strip 来自同一已批准 DCC action。
- `PetAnimationGraph` 是关节姿势的唯一最终写入者，取代 `PetSceneView` 和多个 planner 直接拼装骨骼角度的模式。
- 详细决策见 ADR-003；ADR-002 的“移除 Rive、桌面使用预烘焙帧”继续有效，固定整张图集部分由独立 strip + manifest 取代。

---

## 3. 向后兼容性

本版本为 v1.0.0 创世版本，不涉及用户数据迁移。角色资产采用并行迁移：Rig v2 完整认证和用户批准前，App 继续使用当前正式 USDZ 与整张桌面图集；新资源以不可变版本和哈希并行加入，切换失败时回退旧资产。旧 24 骨 clip 不复制到 Rig v2，新骨架动作必须从 DCC 源重新烘焙。

---

## 4. 新增三方依赖

本版本**彻底实现了零第三方动画运行框架依赖 (Zero Third-Party Animation Runtime Dependency)**。

App 运行时只使用系统框架：RealityKit 负责有界 3D，Core Animation 负责桌面透明帧播放，不引入 Rive、Unity 或 Unreal。Blender 4.3.2 仅用于离线资产生产，不是 App 依赖。CHANGE-024 的 CC BY basemesh 同样是离线内容输入，不是软件包或运行时依赖；若衍生资源发布，须随发布 manifest 保留归因、许可链接和修改说明。该边界消除了 C++ 动画运行时在 macOS 常驻后台时的额外发热风险，并保持最小运行时依赖面。

---


## 5. 配置变更需求

无环境变量。所有配置（如用户疲劳阈值偏好）通过 SwiftUI 的 `@AppStorage`（即本地 `UserDefaults`）进行扁平化存取。

---

## 6. 非功能需求技术实现

| 需求类型 | 需求指标 | 技术实现方案 |
|:---|:---|:---|
| **姿态推理性能** | 领操跟练时推理帧率 `≥ 15 fps` | 在 `AVFoundation` 视频流代理中，使用专有串行后台队列（`Serial Queue`）派发 Vision 请求。配置 Vision 以优先调用系统的 Apple Neural Engine (ANE) 进行硬件加速，防止阻塞主线程（Main Thread）。 |
| **后台功耗控制** | 宠物待机常驻时 CPU 占用 `< 1%` | 1. 桌面常驻只播放预烘焙 strip，不创建 RealityKit 场景。<br>2. 贴边隐藏、全屏工作或静止帧期间暂停 Core Animation。<br>3. 闲时动作由 3–8 分钟随机调度器唤醒，非活动时不运行逐帧 Swift 定时器。 |
| **角色变形质量** | 正式动作无裂缝、远端拉扯、穿模和脚底滑动 | 生产 rig 依次通过结构、关键单关节、全关节、组合姿势和动作逐帧门禁；每个姿势/帧使用八方位 RealityKit 原尺寸图人工审核，机器指标只作问题定位。 |
| **摄像头隐私** | 帧仅在内存处理，永不上传/落盘/入日志 | 使用 `CMSampleBuffer` 直接交给 Vision 提取骨骼点，整个链路无任何写盘（File I/O）动作。Vision 导出的骨骼坐标存入内存数组后，视频帧即被 ARC 机制销毁，日志模块（`os.Logger`）严禁输出视频相关数据。 |
| **数据安全** | 数据不出设备，免 GDPR/CCPA 合规风险 | 全部用户历史跟练和段位记录均存储在 macOS 系统的 Sandboxed 文件夹下的 `SwiftData` 容器中，天然物理隔离，无网络出站请求。 |

---

## 7. 模块设计

```
  ┌────────────────────────────────────────────────────────┐
  │                   macOS Swift App                      │
  │                                                        │
  │  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
  │  │ Fatigue-     │ ➔ │ Reminder-    │ ➔ │ NSPanel +  │  │
  │  │ Tracker      │   │ Scheduler    │   │ SpriteStrip│  │
  │  └──────────────┘   └──────────────┘   └────────────┘  │
  │                                                        │
  │  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
  │  │ AVFoundation │ ➔ │ PoseProvider │ ➔ │ Scoring-   │  │
  │  └──────────────┘   └──────────────┘   │ Engine     │  │
  │                                         └────────────┘  │
  │  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
  │  │ Animation-   │ ➔ │ PetAnimation│ ➔ │ RealityKit │  │
  │  │ Library      │   │ Graph       │   │ Scene      │  │
  │  └──────────────┘   └──────────────┘   └────────────┘  │
  └────────────────────────────────────────────────────────┘
```

### 7.1 疲劳追踪模块 (FatigueTracker)
*   **实现思路**：  
    在后台运行一个独立的 `FatigueTracker` 单例，通过 Cocoa API 的全局监视器来捕捉系统的用户活动事件：
    ```swift
    // 全局监视器，无需 macOS Accessibility（辅助功能）特权，仅检测活动发生
    NSEvent.addGlobalMonitorForEvents(matching: [.mouseMoved, .keyDown]) { _ in
        FatigueTracker.shared.reportUserActivity()
    }
    ```
*   **控制逻辑**：
    *   `reportUserActivity()`：当捕获到活动时，刷新“最后活动时间”。
    *   `FatigueTimer`：每隔 1 分钟检测“最后活动时间”。如果当前时间与最后活动时间差 `> 5 分钟`，则判定用户已离开电脑，暂停疲劳累计计时。
    *   一旦恢复活动，则继续累计。当累计时间突破偏好设置里的阈值（如 60 分钟），向通知中心发布广播 `Notification.Name("FatigueThresholdReached")`。

### 7.2 提醒调度模块 (ReminderScheduler)
*   **实现思路**：  
    监听 `FatigueThresholdReached` 广播。
*   **交互控制**：
    *   收到信号后，向桌面宠物发送 `yawn` 或 `sleep` 语义动作命令，由 manifest 定位独立帧资源，不依赖图集行号。
    *   同时，在屏幕中央淡入（Fade-in）弹出提醒邀请卡片窗口。
    *   **延迟按钮限制逻辑**：在内存中维护 `delayCount`。每次点击延迟，卡片淡出，并在 5 分钟后重新分发信号。若 `delayCount >= 2`，则直接通过 SwiftUI 控制隐藏延迟按钮，仅向用户提供 "Let's move" 的主按钮。

### 7.3 姿态识别与跟练 (PoseProvider & Vision)
*   **实现思路**：  
    定义抽象接口 `PoseProvider` 协议，提供反应式数据流绑定，解耦 Vision 框架：
    ```swift
    protocol PoseProvider: ObservableObject {
        var jointPublisher: Published<UserJoints?>.Publisher { get }
        func startCapture()
        func stopCapture()
    }
    ```
    实现 `VisionPoseProvider`。内部封装 `AVCaptureSession`，设置分发队列。在 `captureOutput` 中将视频帧直接交给系统的 `VNImageRequestHandler`，绑定两个检测请求：
    *   `VNDetectHumanBodyPoseRequest`：提取左右肩关节及头部的 2D 坐标（归一化为 0.0 - 1.0 的 CGFloat）。
    *   `VNGeneratePersonSegmentationRequest`：提取用户人像的遮罩（Mask），用于在影子面板渲染纯色的人像剪影，保护隐私。

*   **跟练角色分工**：左侧 `PetSceneView` 始终按 `PersistenceController.activePet()` 加载用户当前宠物并播放教练动作；V1 当前电子宠物使用之前的 3D 人形小草 `pet_sprout_s2.usdz`。右侧 `MirrorSceneView` 只消费 Vision 关节和头部姿态，固定加载独立的闭嘴狐狸 `mirror_avatar_fox.usdz`；旧张嘴狐狸 `mirror_fox.usdz` 不再进入 App bundle。
*   **资产坐标与静止姿态**：迁移期人形小草仍对当前正式资产保留历史 Z-up 到 Y-up 转换；闭嘴狐狸已统一为 RealityKit Y-up。Rig v2 发布资产必须直接使用 RealityKit Y-up，不再叠加历史根旋转。小草自然收脚站姿由 `idle-neutral` clip 提供，bind pose 保持蒙皮用 A-pose；用户替身继续使用自己的自然站姿回退。

### 7.4 评分引擎 (ScoringEngine)
*   **实现思路**：  
    评分引擎订阅 `PoseProvider` 导出的 `UserJoints` 坐标。
*   **坐标系归一**：Vision 前置摄像头输出的是**镜像坐标系**，`roll` 与 `pitch` 的正负号与用户实际动作方向相反（`yaw` 一致）。该差异在 `PoseTracker` 边界处由 `HeadPose.fromVision` 统一取反，**下游一律使用动作坐标系**（负 = 向左／向下）。此前未做归一时，六个动作中有四个方向判定是反的。

*   **目标角度的标定口径**：
    目标角**由推导得出，不是逐个手填**。此前六个动作的目标角各自写死，导致相对难度严重不均——侧倾要求约为正常活动度的 70%，而仰头只要求约 30%，同一组动作里难易差了一倍以上。

    | 动作 | 轴 | 成人活动度常模 | 目标角（常模 × 0.55） | 满分线 |
    | --- | --- | --- | --- | --- |
    | 左/右侧颈拉伸 | `roll`（侧屈） | `45°` | `±25°` | `±17°` |
    | 左/右转头 | `yaw`（旋转） | `80°` | `±44°` | `±36°` |
    | 低头拉伸 | `pitch`（前屈） | `45°` | `-25°` | `-17°` |
    | 仰头拉伸 | `pitch`（后伸） | `45°` | `+25°` | `+17°` |

    1.  **常模取值**：采用通行的成人颈椎主动活动度参考值，**不得由任何单个用户的实测数据反推**——个人极限幅度只能证明目标可达，用它抬高全局阈值会影响其他用户。
    2.  **舒适系数 `0.55`**：本产品是工间拉伸而非活动度评估，目标须落在舒适区内。颈椎活动度随年龄显著下降，若按青年人极限设定，年长用户即使动作正确也会被判为未达标。
    3.  **宽容带**：`±8°`，即实际满分触发点为目标角再宽松 `8°`（如侧倾 `17°` 即可满分）。超出目标不扣分，只惩罚未到位。
    4.  **常模出处与取值依据**：各文献给出的区间差异较大，上表取值及理由如下。

        **统一采用 AAOS 单一来源**，不再逐轴从不同研究里挑选数值。文献区间很宽（仅后伸就跨 `45°–80°`），混用来源会在无人察觉的情况下改变各动作之间的相对难度——而消除这种不均正是本推导存在的意义。

        | 轴 | 文献区间 | AAOS | 本表取值 |
        | --- | --- | --- | --- |
        | 前屈 | `45°–80°`（Kendall `65°`） | `45°` | `45°` |
        | 后伸 | `45°–80°`（Kendall `50°`） | `45°` | `45°` |
        | 侧屈 | `20°–45°` | `45°` | `45°` |
        | 旋转 | `80°–90°` | `80°` | `80°` |

        来源：[Cervical Spine Range of Motion (Orthofixar)](https://orthofixar.com/special-test/cervical-spine-range-of-motion/)、[Cervical Spine Ranges of Motion (Learn Muscles)](https://learnmuscles.com/glossary/cervical-spine-ranges-of-motion-rom/)、[Normative Values for Cervical and Lumbar ROM in Healthy Young Adults (J Turkish Spinal Surgery, 2023)](https://jtss.org/articles/doi/jtss.galenos.2023.33042)。

        ⚠️ **侧屈的风险**：文献区间下沿仅 `20°`，而本表按 `45°` 推导出目标 `±25°`。对活动度处于区间下沿的用户，该目标超出其极限。所幸 `±8°` 宽容带把实际满分触发点拉到 `17°`，仍在其可达范围内——但**若后续调整宽容带，须重新核算此项**。

    5.  **文献一致确认**：上述常模均为健康青年值，随年龄显著下降。这是舒适系数取 `0.55` 而非更高值的直接依据。

    6.  **实测校验（单人三轮，2026-07-23）**：

        | 动作 | 三轮 P90 | 波动 | 满分线占最好成绩 |
        | --- | --- | --- | --- |
        | 左侧倾 | `46.8 / 36.6 / 39.0` | `10.2°` | 32% |
        | 右侧倾 | `53.3 / 49.3 / 36.7` | `16.6°` | 32% |
        | 左转头 | `72.7 / 76.5 / 66.7` | `9.8°` | 46% |
        | 右转头 | `72.5 / 78.5 / 75.1` | `6.0°` | 46% |
        | 低头 | `42.9 / 44.1 / 34.6` | `9.5°` | 39% |
        | 仰头 | `31.5 / 25.3 / 33.5` | `8.2°` | 51% |

        结论三条：

        *   **「做到最大」本身有 `6°–17°` 的天然波动**，单轮 P90 不是稳定量，不能作为调参依据。
        *   **后伸是唯一离群轴**。该用户各轴最大值对常模之比为：侧屈 118%、旋转 98%、前屈 88%、**后伸 56%**。修正前后伸满分线占其能力 75%，其余动作仅 32%–46%，难度严重失衡。改用 AAOS 统一来源后收敛至 32%–51%。
        *   **追踪率 100% 只能排除丢帧，不能证明角度准确**。仰头时人脸透视压缩，Vision 完全可能在检测成功的前提下压缩 `pitch` 读数。故「摄像头低估后伸」与「该用户后伸受限」无法区分——**也无需区分**：评分只能对其观测得到的量打分，标定须在测量空间内完成。

        ⚠️ **单人数据的用途边界**：以上数据用于**暴露轴间不均**，不用于反推阈值。本次修正是消除来源混用（逐轴挑数改为 AAOS 统一），而非拟合该用户的数值。

        ⚠️ **静态保持 ≠ 跟练**：校准测的是静态最大幅度保持，真实跟练是跟随节奏做重复动作，实际幅度通常更低。上表余量属乐观估计，须以完整跟练实测复核。

*   **关于「收颌」动作的移除**：
    原第 5 个动作名为「低头收颌」，混淆了两个不同动作。**收颌（chin tuck）是下巴水平后缩的平移动作**，头部俯仰角几乎不变，摄像头基于 `pitch` 根本无法测量——这正是它此前目标角被迫设为 `18°`（远低于其他动作）的原因。现已明确为**低头（前屈）大动作**，可由 `pitch` 正常测量。

*   **公开保健操标准的适用边界**：
    米字操、工间操等公开标准规定的是**动作选择、节奏、保持时长与组数**，其动作终点是主观判据（"至有牵拉感"），**不提供角度度数**。故可直接引用其动作编排与节奏，角度阈值仍须按上述常模推导。

*   **对齐环收紧逻辑**：计算影子关节与目标关键点的空间距离。到位比例从 0 渐变至 1.0。当大于 `0.9` 且保持不变时，触发靶心圆环向圆心合并，开启 3 秒的 `HoldingTimer`。3 秒倒计时结束，调用 `LocalDBManager` 累计当前动作得分，并通知 UI 触发 `current_action_id` 递增进行动作切换。

### 7.5 角色资产与统一动画图 (PetAnimationGraph)

*   **生产资产**：人形小草 Rig v2 的网格、32 关节导出骨架、蒙皮、动作 manifest、坐标和认证门禁统一由 `pet-character-rig-v2.md` 定义。当前 24 骨资产只作为迁移期正式回退和视觉参考。licensed basemesh 必须先通过独立 source intake，再以 `licensed_basemesh_adapted` 新版本进入完整 S0；源文件既有拓扑质量、modifier、rig 或动作不能继承审批。
*   **动作来源**：挥手、张望、伸展、庆祝等表现动作在 Blender control rig 中制作并逐帧烘焙到固定导出骨架。Swift 不再定义这些动作的具体关节角度；现有 `PetIdleMotionPlanner` 迁移后只保留随机动作调度职责并更名为 `PetIdleActionScheduler`。
*   **唯一姿势写入者**：`PetAnimationGraph` 按 Base → Action → Additive → IK → Secondary → Corrective 顺序合成完整姿势，一次性写入 `jointTransforms`。`PetSceneView` 只负责场景、相机、灯光、生命周期和最终提交。
*   **可保留能力**：六个头颈教学动作语义、`PlantedFootSolver`、叶片受限弹簧和 Rig probe 保留；教学动作的具体姿势逐步迁移为采样 clip。
*   **主发布路径与 Blend shape 边界**：最小往返实验已选择 Blender 4.3.2 → 原生 USD → USDZ → RealityKit。该路径保留骨名、31 个关节/shape 采样和 `TestBulge 0 → 1 → 0`；GLB 经 Apple 导入会匿名化骨路径、丢失 shape，且 RealityKit 不驱动测试骨，故只作交换与诊断产物。App 最低支持 macOS 14，而直接 shape API 要求 macOS 15，因此 corrective 与面部 shape 只能作为 macOS 15+ 可选增强，不能成为身体完整性的必需条件。

### 7.6 桌面宠物透明动作资源与视线随动 (PetSpriteRenderer)

*   **形象与动作单一来源**：大厅中央宠物、桌面悬浮宠物和跟练教练均由当前宠物选择驱动。3D clip 与桌面 strip 使用相同角色版本、DCC action、相机、灯光和发布 manifest，不混用旧形象或其他 rig。
*   **独立动作资源**：每个动作发布一条透明横向 sprite strip。manifest 定义 `clipId`、`frameCount`、`fps`、`loopMode`、逻辑画布、anchor、事件和 Reduce Motion 替代项；新增动作只增加自己的资源，不修改无关动作。
*   **迁移兼容**：Rig v2 切换前继续读取当前 `pet_sprout_sheet.png`。新资源加载或校验失败时回退当前正式图集或 `idle-neutral`，不得显示空白宠物。
*   **随机调度**：静默状态每 `3–8 分钟` 从呼吸叶摆、张望/挥手、伸展轻弹中选择一项，并排除上次动作；疲劳、提醒、点击和跟练等高优先级状态可立即打断，动作图根据 manifest 的可中断窗口平滑退出。
*   **16 方向眼珠/视线随动数学公式 (Look-Vector Mathematics)**：
    1. 获取鼠标在屏幕的全局绝对坐标 $M(x, y)$。
    2. 获取桌面宠物窗口中心点的绝对坐标 $P(x, y)$。
    3. 计算从宠物指向光标的角度向量：
       $$\theta = \operatorname{atan2}(M.y - P.y, M.x - P.x)$$
    4. 将弧度角转换为顺时针度数，并将朝上定义为 $0^\circ$。
    5. 通过除以 $22.5^\circ$ 进行四舍五入并取模，计算出 0 到 15 的盯人帧偏移量 `lookIndex`：
       $$\text{lookIndex} = \left( \operatorname{round}\left( \frac{\theta_{\text{degrees}}}{22.5} \right) \right) \bmod 16$$
    6. **帧映射规则**：`lookIndex` 直接选择 `look-direction` 独立资源中的第 `0...15` 帧；光标静止或离开敏感区时平滑回退 `idle-neutral`。运行时不依赖固定 Row。

*   **NSPanel 浮动窗口穿透与避让配置**：
    创建类 `PetNSPanel` 继承自 `NSPanel`，配置如下物理参数：
    ```swift
    class PetNSPanel: NSPanel {
        init() {
            super.init(
                contentRect: NSRect(x: 0, y: 0, width: 196, height: 176),
                styleMask: [.borderless, .nonactivatingPanel, .hudWindow],
                backing: .buffered,
                defer: false
            )
            self.isOpaque = false
            self.backgroundColor = .clear // 保证边缘绝对透明
            self.hasShadow = false // 禁用默认系统直角阴影，改用WebP自身半透明影
            self.level = .floating // 置顶悬浮
            self.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary] // 跨屏幕展示
            self.isMovableByWindowBackground = false // 禁用系统默认拖动，改用我们的物理鼠标Drag
        }
    }
    ```

### 7.7 养成持久化与内购 (SwiftData & StoreKit 2)

*   **持久化**：  
    每次运动结算后，调用 `ModelContext` 向本地 SwiftData 写入一条新的 `WorkoutSession` 和 `HealthScore` 数据。
*   **StoreKit 2 会员控制**：
    在 App 启动时，开启异步任务查询内购特权：
    ```swift
    func checkSubscriptionStatus() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result {
                if transaction.productID == "com.nickbody.app.pass" {
                    // Unlock premium ranks and exclusive pet animation rows
                    DispatchQueue.main.async {
                        self.isPremiumUnlocked = true
                    }
                }
            }
        }
    }
    ```

---

## 8. 实现顺序与测试基准

### 实现顺序
1. **已完成的产品链路**：`FatigueTracker`、Vision 姿态识别、六动作评分、透明 `NSPanel`、大厅/跟练 RealityKit 场景和迁移期桌面图集保持可运行，不因资产重构中断。
2. **Rig v2 合同**：冻结视觉身份，完成 32 关节骨架、网格/蒙皮、动作 manifest、导出和 Gate 0–4 认证规范。
3. **最小往返实验（已完成）**：隔离三骨资产已验证 GLB/USD/USDZ/RealityKit，选择 Blender USD → USDZ 主发布路径；机器报告位于 App 仓库 `character_pipeline/sprout/v2/reports/roundtrip-report.json`。
4. **角色生产**：CHANGE-024 已完成 licensed basemesh source intake；下一步在 v009 隔离副本中直接适配五接口和关节面流，完整通过 S0 与用户静态审核后，才建立 control/export 双骨架并手工蒙皮；按 Gate 0–3 修正到全部通过。
5. **运行时迁移**：新增 `PetAnimationLibrary`、`PetAnimationGraph` 和 `PetIdleActionScheduler`，迁移脚底/叶片后处理，保留旧资产回退。
6. **动作内容**：依次制作挥手、张望、伸展，每项执行八方位逐帧审核并生成同源桌面 strip。
7. **正式切换**：用户批准后更新不可变发布 manifest 和 bundle 资源；验证失败时回退当前正式资产。

### 技术风险防范
*   *风险*：Vision 姿态推理在 M1 基线机型发热高。  
*   *防范*：跟练开始时，限制摄像头捕获分辨率为 `640x480` (姿态识别不需要 4K 高清)；在 Vision 识别结果中，一旦检测到用户肩膀离场（`OutOfFrame`），立刻挂起推理，提示用户回到画面。
*   *风险*：Blender、GLB/USD、Apple USDZ 与 RealityKit 对骨架、单位、法线或 blend shape 的解释不一致。
*   *防范*：正式角色统一从 Blender 原生 USD 打包 USDZ；每次导出记录版本与语义合同哈希，使用 `usdchecker`、结构脚本和 RealityKit 原尺寸截图共同验收，禁止将 GLB 往返结果或发布文件覆盖 DCC master。
*   *风险*：自动蒙皮在肩、腋下、髋部产生远端权重污染。
*   *防范*：生产主身体重拓扑后手工蒙皮，使用命名区域 mask 阻止跨区域 influence，并按关键单关节 → 全关节 → 组合姿势顺序逐级放行。
*   *风险*：外部 basemesh 许可、来源文件或归因在适配与发布之间漂移，或来源身份被误当作拓扑通过。
*   *防范*：source intake 绑定 artifact、source topology、license evidence、attribution 和 manifest hashes；候选比较禁止 provenance 原地变更，发布前重新校验归因与修改说明。许可通过与 S0 几何/身份门禁分别判定。
