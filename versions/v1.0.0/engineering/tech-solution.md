# v1.0.0 技术方案

> **技术架构基线**：[foundation/tech-arch/overview.md](../../../foundation/tech-arch/overview.md)  
> **需求文档**：[product/requirements.md](../product/requirements.md)  
> **接口设计**：[api-design.md](./api-design.md)  
> **数据库设计**：[db-design.md](./db-design.md)  

---

## 1. 方案概述

本版本在 macOS 上交付 `nick` 产品的首个原生客户端。技术策略采用**纯端侧单机零后端架构**：
1.  **UI 表现层**：采用 SwiftUI 编写，通过配置为 `LSUIElement`（无 Dock 图标）的常驻菜单栏项目承载，主交互由毛玻璃透明置顶的 `NSPanel` 承载，运行 `Rive` 宠物状态机。
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

本版本仅引入一个外部三方库，用以驱动宠物的骨骼动画与状态机：

| 依赖名称 | 最低版本 | 许可证 | 用途 | 引入原因 |
|:---|:---|:---|:---|:---|
| **RiveRuntime (macOS)** | Latest Stable | MIT | 渲染宠物的 `.riv` 骨骼矢量动画并驱动状态机。 | 跨平台骨骼动画标准，GPU 渲染性能极高，内置完备的逻辑状态机。 |

---

## 5. 配置变更需求

无环境变量。所有配置（如用户疲劳阈值偏好）通过 SwiftUI 的 `@AppStorage`（即本地 `UserDefaults`）进行扁平化存取。

---

## 6. 非功能需求技术实现

| 需求类型 | 需求指标 | 技术实现方案 |
|:---|:---|:---|
| **姿态推理性能** | 领操跟练时推理帧率 `≥ 15 fps` | 在 `AVFoundation` 视频流代理中，使用专有串行后台队列（`Serial Queue`）派发 Vision 请求。配置 Vision 以优先调用系统的 Apple Neural Engine (ANE) 进行硬件加速，防止阻塞主线程（Main Thread）。 |
| **后台功耗控制** | 宠物待机常驻时 CPU 占用 `< 1%` | 1. 当宠物处于贴边隐藏（`Edge Snap`）或用户全屏工作时，通过 RiveViewModel 的 `stop()` 挂起 Rive 渲染循环，降为 0 fps 渲染。<br>2. 闲时动画采用 3-8 分钟随机定时器唤醒，非活动时完全挂起绘图更新。 |
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
  │  │ Tracker      │   │ Scheduler    │   │ Rive View  │  │
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
    *   收到信号后，获取当前的 `NSPanel` 宠物窗，向 Rive 状态机输入参数 `fatigue_level` 设置为 `1.0`（使宠物在桌面变为极困或打哈欠姿态）。
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
*   **角度对齐与评分算法**：
    1.  **左/右侧颈拉伸**：计算头部中心（`head`）与两肩中点连线构成的夹角。目标倾斜角为 `35°`，并配置一个宽容带（`Tolerance Band`）为 `±8°`（即 `27° - 43°` 之间皆判定为到位，满分）。
    2.  **对齐环收紧逻辑**：计算影子关节与目标关键点的空间距离。到位比例从 0 渐变至 1.0。当大于 `0.9` 且保持不变时，触发 SwiftUI 靶心圆环向圆心合并，开启 3 秒的 `HoldingTimer`。
    3.  3 秒倒计时结束，调用 `LocalDBManager` 累计当前动作得分，并通知 UI 触发 `current_action_id` 递增进行动作切换。

### 7.5 养成持久化与内购 (SwiftData & StoreKit 2)
*   **持久化**：  
    每次运动结算后，调用 `ModelContext` 向本地 SwiftData 写入一条新的 `WorkoutSession` 和 `HealthScore` 数据。
*   **StoreKit 2 会员控制**：
    在 App 启动时，开启异步任务查询内购特权：
    ```swift
    func checkSubscriptionStatus() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result {
                if transaction.productID == "com.nickbody.app.pass" {
                    // 解锁高阶段位和 Rive 宠物控制权
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
3.  **第三阶段 (8-10天)**：实现透明 `NSPanel` 与 `RiveView` 组件的挂载，并在 SwiftUI 中将所有窗口串联起来，联调 StoreKit 2。

### 技术风险防范
*   *风险*：Vision 姿态推理在 M1 基线机型发热高。  
*   *防范*：跟练开始时，限制摄像头捕获分辨率为 `640x480` (姿态识别不需要 4K 高清)；在 Vision 识别结果中，一旦检测到用户肩膀离场（`OutOfFrame`），立刻挂起推理，提示用户回到画面。
