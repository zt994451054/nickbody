# v1.0.0 技术方案

> **技术架构基线**：[foundation/tech-arch/overview.md](../../../foundation/tech-arch/overview.md)  
> **需求文档**：[product/requirements.md](../product/requirements.md)  
> **接口设计**：[api-design.md](./api-design.md)  
> **数据库设计**：[db-design.md](./db-design.md)  

---

## 1. 方案概述

本版本在 macOS 上交付 `nick` 产品的首个原生客户端。技术策略采用**纯端侧单机零后端架构**：
1.  **UI 表现层**：采用 SwiftUI 编写，通过配置为 `LSUIElement`（无 Dock 图标）的常驻菜单栏项目承载，主交互由毛玻璃透明置顶的 `NSPanel` 承载，运行基于 8×11 精灵图集（Spritesheet）切帧的宠物状态机。
2.  **疲劳追踪**：基于全局鼠标/键盘活动事件监视器（非侵入式，无录入风险）。
3.  **姿态识别与领操**：利用系统内置的 `Apple Vision`（`VNDetectHumanBodyPoseRequest`），并以 `PoseProvider` 协议隔离 Vision 依赖。
4.  **数据持久化**：使用 macOS 沙盒内的 `SwiftData` 本地库。
5.  **变现控制**：使用 StoreKit 2 本地验证订阅状态，无云端校验。

---

## 2. 架构变更

无，完全沿用 `foundation/tech-arch/overview.md` 的纯端侧单机架构。

---

## 3. 向后兼容性

本版本为 v1.0.0 创世版本，不涉及历史兼容性问题。所有接口和本地 SwiftData 表结构均按新定义落地。

---

## 4. 新增三方依赖

本版本**彻底实现了零第三方动画运行框架依赖 (Zero Third-Party Animation Runtime Dependency)**。

宠物的状态机渲染将完全基于**原生 SwiftUI Image + 视口位移切片**。这消除了 C++ Rive 运行时在 macOS 常驻后台时的额外发热风险，提高了长效运行的稳定性，并将最终生成的 App 体积缩减了约 85%。

---


## 5. 配置变更需求

无环境变量。所有配置（如用户疲劳阈值偏好）通过 SwiftUI 的 `@AppStorage`（即本地 `UserDefaults`）进行扁平化存取。

---

## 6. 非功能需求技术实现

| 需求类型 | 需求指标 | 技术实现方案 |
|:---|:---|:---|
| **姿态推理性能** | 领操跟练时推理帧率 `≥ 15 fps` | 在 `AVFoundation` 视频流代理中，使用专有串行后台队列（`Serial Queue`）派发 Vision 请求。配置 Vision 以优先调用系统的 Apple Neural Engine (ANE) 进行硬件加速，防止阻塞主线程（Main Thread）。 |
| **后台功耗控制** | 宠物待机常驻时 CPU 占用 `< 1%` | 1. 当宠物处于贴边隐藏（`Edge Snap`）或用户全屏工作时，使精灵图切帧定时器失效（`Timer.invalidate()`）挂起帧切换渲染循环，降为 0 fps 渲染。<br>2. 闲时动画采用 3-8 分钟随机定时器唤醒，非活动时完全挂起绘图更新。 |
| **摄像头隐私** | 帧仅在内存处理，永不上传/落盘/入日志 | 使用 `CMSampleBuffer` 直接交给 Vision 提取骨骼点，整个链路无任何写盘（File I/O）动作。Vision 导出的骨骼坐标存入内存数组后，视频帧即被 ARC 机制销毁，日志模块（`os.Logger`）严禁输出视频相关数据。 |
| **数据安全** | 数据不出设备，免 GDPR/CCPA 合规风险 | 全部用户历史跟练和段位记录均存储在 macOS 系统的 Sandboxed 文件夹下的 `SwiftData` 容器中，天然物理隔离，无网络出站请求。 |

---

## 7. 模块设计

```
  ┌────────────────────────────────────────────────────────┐
  │                   macOS Swift App                      │
  │                                                        │
  │  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
  │  │ Fatigue-     │ ➔ │ Reminder-    │ ➔ │ NSPanel-   │  │
  │  │ Tracker      │   │ Scheduler    │   │ SpriteView │  │
  │  └──────────────┘   └──────────────┘   └────────────┘  │
  │                                              ▲         │
  │  ┌──────────────┐   ┌──────────────┐         │         │
  │  │ AVFoundation │ ➔ │ PoseProvider │ ➔ ScoringEngine   │
  │  └──────────────┘   └──────────────┘                   │
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
    *   收到信号后，获取当前的 `NSPanel` 宠物窗，将精灵图状态机切换至疲劳态动画行（打哈欠/极困行），使宠物在桌面表现出疲劳姿态。
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

### 7.4 评分引擎 (ScoringEngine)
*   **实现思路**：  
    评分引擎订阅 `PoseProvider` 导出的 `UserJoints` 坐标。
*   **坐标系归一**：Vision 前置摄像头输出的是**镜像坐标系**，`roll` 与 `pitch` 的正负号与用户实际动作方向相反（`yaw` 一致）。该差异在 `PoseTracker` 边界处由 `HeadPose.fromVision` 统一取反，**下游一律使用动作坐标系**（负 = 向左／向下）。此前未做归一时，六个动作中有四个方向判定是反的。

*   **目标角度的标定口径**：
    目标角**由推导得出，不是逐个手填**。此前六个动作的目标角各自写死，导致相对难度严重不均——侧倾要求约为正常活动度的 70%，而仰头只要求约 30%，同一组动作里难易差了一倍以上。

    | 动作 | 轴 | 成人活动度常模 | 目标角（常模 × 0.55） |
    | --- | --- | --- | --- |
    | 左/右侧颈拉伸 | `roll`（侧屈） | `45°` | `±25°` |
    | 左/右转头 | `yaw`（旋转） | `80°` | `±44°` |
    | 低头拉伸 | `pitch`（前屈） | `50°` | `-28°` |
    | 仰头拉伸 | `pitch`（后伸） | `60°` | `+33°` |

    1.  **常模取值**：采用通行的成人颈椎主动活动度参考值，**不得由任何单个用户的实测数据反推**——个人极限幅度只能证明目标可达，用它抬高全局阈值会影响其他用户。
    2.  **舒适系数 `0.55`**：本产品是工间拉伸而非活动度评估，目标须落在舒适区内。颈椎活动度随年龄显著下降，若按青年人极限设定，年长用户即使动作正确也会被判为未达标。
    3.  **宽容带**：`±8°`，即实际满分触发点为目标角再宽松 `8°`（如侧倾 `17°` 即可满分）。超出目标不扣分，只惩罚未到位。
    4.  **常模出处与取值依据**：各文献给出的区间差异较大，上表取值及理由如下。

        | 轴 | 文献区间 | 本表取值 | 说明 |
        | --- | --- | --- | --- |
        | 前屈 | `45°–80°`（AAOS `45°`／Kendall `65°`） | `50°` | 取健康青年实测均值 |
        | 后伸 | `50°–80°`（AAOS `45°`／Kendall `50°`） | `60°` | 取区间中位 |
        | 侧屈 | `20°–45°` | `45°` | **位于区间上沿**，见下方风险说明 |
        | 旋转 | `80°–90°` | `80°` | 取区间下沿，偏保守 |

        来源：[Cervical Spine Range of Motion (Orthofixar)](https://orthofixar.com/special-test/cervical-spine-range-of-motion/)、[Cervical Spine Ranges of Motion (Learn Muscles)](https://learnmuscles.com/glossary/cervical-spine-ranges-of-motion-rom/)、[Normative Values for Cervical and Lumbar ROM in Healthy Young Adults (J Turkish Spinal Surgery, 2023)](https://jtss.org/articles/doi/jtss.galenos.2023.33042)。

        ⚠️ **侧屈的风险**：文献区间下沿仅 `20°`，而本表按 `45°` 推导出目标 `±25°`。对活动度处于区间下沿的用户，该目标超出其极限。所幸 `±8°` 宽容带把实际满分触发点拉到 `17°`，仍在其可达范围内——但**若后续调整宽容带，须重新核算此项**。

    5.  **文献一致确认**：上述常模均为健康青年值，随年龄显著下降。这是舒适系数取 `0.55` 而非更高值的直接依据。

*   **关于「收颌」动作的移除**：
    原第 5 个动作名为「低头收颌」，混淆了两个不同动作。**收颌（chin tuck）是下巴水平后缩的平移动作**，头部俯仰角几乎不变，摄像头基于 `pitch` 根本无法测量——这正是它此前目标角被迫设为 `18°`（远低于其他动作）的原因。现已明确为**低头（前屈）大动作**，可由 `pitch` 正常测量。

*   **公开保健操标准的适用边界**：
    米字操、工间操等公开标准规定的是**动作选择、节奏、保持时长与组数**，其动作终点是主观判据（"至有牵拉感"），**不提供角度度数**。故可直接引用其动作编排与节奏，角度阈值仍须按上述常模推导。

*   **对齐环收紧逻辑**：计算影子关节与目标关键点的空间距离。到位比例从 0 渐变至 1.0。当大于 `0.9` 且保持不变时，触发靶心圆环向圆心合并，开启 3 秒的 `HoldingTimer`。3 秒倒计时结束，调用 `LocalDBManager` 累计当前动作得分，并通知 UI 触发 `current_action_id` 递增进行动作切换。

### 7.5 桌面宠物切帧渲染与视线随动模块 (PetSpriteRenderer)
*   **物理图集切分机制**：
    宠物动画渲染基于 `1536x2288` 图集。在 SwiftUI 中，通过对 Image 组件添加容器裁剪（`.clipped()`）和背景偏移定位，动态计算帧渲染：
    ```swift
    struct PetSpriteView: View {
        let spritesheet: NSImage // WebP/PNG 透明大图
        @State var currentFrame: Int = 0 // 0 到 7
        @State var currentRow: Int = 0  // 0 到 10

        var body: some View {
            Image(nsImage: spritesheet)
                .resizable()
                .aspectRatio(contentMode: .none)
                // 强制将图片拉大为 11行 x 8列 的物理规格
                .frame(width: 1536, height: 2288, alignment: .topLeading)
                // 通过偏移将目标单元格 (Cell) 对齐至视口左上角
                .offset(x: -CGFloat(currentFrame) * 192, y: -CGFloat(currentRow) * 208)
                // 以 192x208 规格进行物理裁剪，形成独立的动画视口
                .frame(width: 192, height: 208)
                .clipped()
        }
    }
    ```
*   **16 方向眼珠/视线随动数学公式 (Look-Vector Mathematics)**：
    1. 获取鼠标在屏幕的全局绝对坐标 $M(x, y)$。
    2. 获取桌面宠物窗口中心点的绝对坐标 $P(x, y)$。
    3. 计算从宠物指向光标的角度向量：
       $$\theta = \operatorname{atan2}(M.y - P.y, M.x - P.x)$$
    4. 将弧度角转换为顺时针度数，并将朝上定义为 $0^\circ$。
    5. 通过除以 $22.5^\circ$ 进行四舍五入并取模，计算出 0 到 15 的盯人帧偏移量 `lookIndex`：
       $$\text{lookIndex} = \left( \operatorname{round}\left( \frac{\theta_{\text{degrees}}}{22.5} \right) \right) \bmod 16$$
    6. **帧映射规则**：
       * 若 `lookIndex` 位于 `0...7` (顺时针 0° 到 157.5°)：映射至 **Row 9** 的第 `lookIndex` 帧。
       * 若 `lookIndex` 位于 `8...15` (顺时针 180° 到 337.5°)：映射至 **Row 10** 的第 `lookIndex - 8` 帧。
       * 若光标静止或离开窗口敏感盲区，则无延迟平滑回退至 Row 0 的 `idle` 待机呼吸状态。

*   **NSPanel 浮动窗口穿透与避让配置**：
    创建类 `PetNSPanel` 继承自 `NSPanel`，配置如下物理参数：
    ```swift
    class PetNSPanel: NSPanel {
        init() {
            super.init(
                contentRect: NSRect(x: 0, y: 0, width: 240, height: 240),
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

### 7.6 养成持久化与内购 (SwiftData & StoreKit 2)

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
1.  **第一阶段 (1-3天)**：编写 `FatigueTracker` 并连接鼠标监视，完成本地 AppStorage 偏好配置。
2.  **第二阶段 (4-7天)**：编写 `VisionPoseProvider` 与跟练评分引擎，利用测试用例跑通 6 个动作的角度判定。
3.  **第三阶段 (8-10天)**：实现透明 `NSPanel` 与 `PetSpriteView` 组件的挂载，并在 SwiftUI 中将所有窗口串联起来，联调 StoreKit 2。

### 技术风险防范
*   *风险*：Vision 姿态推理在 M1 基线机型发热高。  
*   *防范*：跟练开始时，限制摄像头捕获分辨率为 `640x480` (姿态识别不需要 4K 高清)；在 Vision 识别结果中，一旦检测到用户肩膀离场（`OutOfFrame`），立刻挂起推理，提示用户回到画面。
