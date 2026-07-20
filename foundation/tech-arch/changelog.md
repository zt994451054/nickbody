# 技术架构变更历史

> 每次版本迭代后如有技术架构调整，在此追加记录。

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
