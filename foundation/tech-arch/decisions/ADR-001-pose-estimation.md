# ADR-001 姿态识别选型：Apple Vision framework vs 开源模型

> ADR 索引见 [../overview.md](../overview.md) 关键技术决策索引节

---

## 基本信息

| 字段 | 值 |
|------|-----|
| **编号** | ADR-001 |
| **状态** | 已接受 |
| **决策时间** | 2026-07-14 |
| **引入版本** | v1.0.0 |
| **决策人** | winston（创始人）|

---

## 背景

nick 的核心功能是摄像头跟练评分：识别用户头颈部运动（转头/点头/歪头）和肩部动作（耸肩/绕肩），实时评分。约束条件：

- 单人、坐姿、距摄像头 0.5–1m 的室内场景（姿态估计中最简单档的题目，各候选模型精度均饱和）
- 常驻后台应用，功耗敏感（风扇噪音/耗电直接导致卸载）
- 独立开发 + AI 辅助，集成工程量必须最小化
- 隐私是第一卖点：必须 100% 端侧
- 闭源商用产品：许可证不能有传染性

---

## 决策

**V1 使用 Apple Vision framework（系统内置）作为唯一姿态识别实现；以 `PoseProvider` 协议抽象隔离，评分引擎只消费「角度+关键点」。** M1 阶段对 Vision 肩部关键点做 bake-off 实测，不达标则备选启用「RTMPose/MoveNet 转 CoreML 打包」。

---

## 考虑的备选方案

### 方案 A：Apple Vision framework（已选择）
**描述**：macOS 系统内置视觉 API。`FaceObservation` 直接输出头部 yaw/pitch/roll（对应转头/点头/歪头 4 个动作的核心信号）；`VNDetectHumanBodyPoseRequest` 输出 19 个 2D 人体关键点（肩部动作）。
**优点**：零下载零打包；自动调度 Apple 神经引擎（ANE）功耗最低；免费无许可证问题；系统升级自动改进；头部三轴角度"白送"（开源方案需从面部网格自行 solvePnP 解算）。
**缺点**：仅 Apple 平台；模型版本随 macOS 走不可锁定（不同系统版本输出可能有细微差异）。

### 方案 B：MediaPipe (BlazePose)（未选择，留作 V2 跨平台）
**描述**：Google 开源方案，33 个 3D 关键点 + 468 点面部网格，Apache 2.0。
**优点**：跨平台（Windows/Android/Web）；能力上限更高；模型版本自控。
**未选择原因**：无官方 macOS Swift SDK，桌面端需自己做 C++/bazel 集成（独立开发不可承受）；走 CPU/GPU 不走 ANE，常驻功耗更高；头部姿态需自行解算。**V2 扩 Windows 时启用，评分引擎经 PoseProvider 抽象可复用。**

### 方案 C：RTMPose / MoveNet 转 CoreML（未选择，列为 V1 备选）
**描述**：开源模型（Apache 2.0）转 CoreML 打包进 App。
**优点**：保住 ANE 加速 + 模型版本自控；许可证干净。
**未选择原因**：需要模型转换、打包（增加体积）、维护成本；仅当 M1 实测 Vision 肩部关键点在坐姿近距下抖动不达标时启用。

### 方案 D：YOLO 系 pose / OpenPose（排除）
**未选择原因**：YOLOv8-pose 为 AGPL-3.0，闭源商用需向 Ultralytics 购买授权，法律风险不可接受；OpenPose 非商用许可。直接排除。

---

## 决策依据

1. 需求档位低：坐姿近距单人慢速拉伸动作，学术榜单精度差异在此场景不构成选型依据
2. 功耗是产品生死线：ANE 调度是 Vision 独有优势
3. 工程经济学：独立开发者的集成成本权重最高，系统 API 碾压
4. 版本风险可控：评分采用宽容带设计（如转头 55°±10° 即满分），对模型细微差异天然鲁棒

---

## 影响

### 正面影响
- V1 零模型成本、零云成本、最低功耗、最快落地
- 隐私叙事架构级成立（系统 API 端侧执行）

### 负面影响与风险
- 平台锁定：Windows 版需另接 MediaPipe（已通过 PoseProvider 抽象预留）
- 模型行为随 macOS 版本漂移：以宽容带评分 + 最低支持版本基线测试兜底
- M1 bake-off 若不通过将引入方案 C，增加 2-3 周工作量

### 需要同步更新的文档
- [x] foundation/tech-arch/overview.md 技术栈总览
- [ ] engineering/docs/tech-stack.md（工程创建后）
- [ ] versions/v1.0.0/engineering/tech-solution.md（技术方案阶段）

---

## 相关决策

- 后续决策：V2 跨平台时需新增 ADR（MediaPipe 集成方案）

---

## 废弃说明

（不适用）
