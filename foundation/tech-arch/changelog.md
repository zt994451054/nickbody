# 技术架构变更历史

> 每次版本迭代后如有技术架构调整，在此追加记录。

---

## 2026-09-02 | v1.0.0 | 建立 DCC 静态拓扑合同与有界实验治理

**变更内容**：为角色静态拓扑建立单一版本化机器合同，将 scoped WIP、开放五接口 S0、闭合身份装配和生产 Rig Gate 0 分层；报告绑定合同版本/哈希，局部实验不可晋级，并以明确修订上限和独立审批阻止候选编号循环。后续宠物复用骨架语义、动作合同、认证与运行时动画图，但不强制复用身体网格或蒙皮权重。
**变更原因**：CHANGE-025 暴露 builder 施工范围、审计阈值和正式候选语义漂移；直接为每次失败创建新候选会放大试错成本，也无法保证不同体型宠物的自然变形。
**验证结果**：左肩/腋下 R0 的 scoped 静态机器门通过，但一次性三骨与线性测试权重的变形诊断失败，当前 licensed-basemesh AI 施工路线关闭；v002 与 production Rig Gate 0 未授权。权威报告 SHA-256 为 `5d89945cf746617c61ba88f1a67901def4df11ab19016df8cc956a3da3853fff`。该结果只否决本次 R0/临时 rig/测试权重组合，不独立否决 licensed source topology。
**相关 ADR**：[ADR-003](./decisions/ADR-003-production-character-animation-pipeline.md)
**影响文档**：foundation/tech-arch/overview.md、versions/v1.0.0/engineering/pet-character-rig-v2.md、tech-solution.md、README.md、CHANGES.md

---

## 2026-08-12 | v1.0.0 | 建立生产级 Rig v2 与统一角色动画管线

**变更内容**：将人形小草从 Meshy 24 骨自动绑骨、Swift 手写表现动作和固定整张图集，重构为视觉身份、生产骨架、变形、动作内容、运行时五层架构。锁定 Blender 4.3.2 为脚本化生产 DCC；最小往返实验选择原生 USD → USDZ → RealityKit 为主发布路径并淘汰 GLB Apple 发布路径；大厅/跟练使用有界 RealityKit 3D，桌面使用同一动作源烘焙的独立透明 sprite strip；运行时由单一 `PetAnimationGraph` 合成并提交最终姿势。
**变更原因**：当前身份基准的单关节认证暴露跨躯干蒙皮权重污染，无法靠动作曲线或运行时限制修复。固定 Row 图集和多模块直接写关节也无法支撑持续新增动作。
**相关 ADR**：[ADR-003](./decisions/ADR-003-production-character-animation-pipeline.md)
**影响文档**：foundation/tech-arch/overview.md、standards/engineering/frontend.md、standards/design/DESIGN.md、versions/v1.0.0/engineering/pet-character-rig-v2.md、tech-solution.md、api-design.md、product/requirements.md、product/design-spec.md

---

## 2026-07-16 | v1.0.0 | 宠物动画渲染选型变更：Rive Runtime → 原生精灵图集切帧

**变更内容**：废除 Rive macOS Runtime 第三方动画依赖，桌面宠物改为基于透明 WebP 8×11 精灵图集（单帧 192×208）的原生 SwiftUI 视口裁剪切帧状态机，新增 16 方向视线随动机制；悬浮窗采用 NSPanel（hudWindow + canJoinAllSpaces）承载。
**变更原因**：消除 C++ 运行时常驻后台的发热风险，缩减 App 体积约 85%，实现零第三方依赖，并为 UGC 宠物换装提供标准 Spritesheet 插槽（见 v1.0.0 CHANGE-004）。
**相关 ADR**：[ADR-002](./decisions/ADR-002-sprite-animation-replace-rive.md)
**影响文档**：foundation/tech-arch/overview.md、versions/v1.0.0/engineering/tech-solution.md、engineering/api-design.md、product/design-spec.md、engineering/README.md 工程清单

---

<!-- 变更记录模板（复制使用）：

## {YYYY-MM-DD} | {版本号} | {变更摘要}

**变更内容**：<!-- 描述架构变更 -->
**变更原因**：<!-- 为什么要调整 -->
**相关 ADR**：<!-- 如有对应决策记录，引用 ADR 编号 -->
**影响文档**：<!-- 已同步更新的文档 -->

-->
