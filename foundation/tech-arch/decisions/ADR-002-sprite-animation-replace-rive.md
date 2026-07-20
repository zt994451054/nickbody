# ADR-002 宠物动画渲染选型：原生精灵图集切帧替代 Rive Runtime

> ADR 索引见 [../overview.md](../overview.md) 关键技术决策索引节

---

## 基本信息

| 字段 | 值 |
|------|-----|
| **编号** | ADR-002 |
| **状态** | 已接受 |
| **决策时间** | 2026-07-16 |
| **引入版本** | v1.0.0 |
| **决策人** | winston（创始人）|
| **关联变更** | versions/v1.0.0/CHANGES.md CHANGE-004 |

---

## 背景

v1.0.0 技术方案初稿采用 Rive macOS Runtime（骨骼动画 + 状态机）渲染桌面宠物。技术方案阶段复盘发现：

- Rive 是项目唯一的第三方运行时依赖（C++ 运行时），常驻后台持续渲染存在发热与功耗风险，与「后台 CPU <1%」的非功能指标冲突
- 参考 Codex 桌面宠物的成熟方案，透明 WebP 精灵图集（Spritesheet）切帧即可实现同等灵动效果（含 16 方向视线随动），且实现极简
- 产品规划的 UGC 社区宠物换装需要一个标准化、低门槛的素材插槽格式——固定规格图集比 .riv 私有格式对创作者友好得多
- 移除 Rive 后 App 体积预计缩减约 85%，且实现真正的零第三方依赖（隐私/安全叙事一致）

---

## 决策

**废除 Rive Runtime 依赖，桌面宠物动画改为基于透明 WebP 8×11 精灵图集（图集 1536×2288，单帧 192×208）的原生 SwiftUI 视口裁剪切帧状态机。**

- 状态机将 `fatigue_level` / `is_workout_active` / `action_id` / `trigger_celebrate` / `look_index` / `is_premium` 等输入映射为图集目标行与帧播放策略
- Row 9 / Row 10 共 16 帧实现顺时针 16 方向（每 22.5°）鼠标视线随动
- 悬浮窗采用 `NSPanel`（borderless + nonactivatingPanel + hudWindow，canJoinAllSpaces）承载
- 每只宠物对应一张同规格图集，为 UGC 换装提供标准插槽

---

## 考虑的备选方案

### 方案 A：原生精灵图集切帧（已选择）
零依赖、零发热风险、实现简单、UGC 友好；代价是动画由美术素材预烘焙，无骨骼级程序化动画。

### 方案 B：Rive macOS Runtime（原方案，已废除）
骨骼动画表现力强、一套骨骼全段位复用；但引入 C++ 第三方运行时（发热/体积/依赖面），且 .riv 制作门槛高，不利于 UGC 生态。

---

## 影响

- 动效表现力上限由美术图集质量决定，程序化动画（如弹性拉伸）需 SwiftUI 变换叠加实现
- 已有 Rive 相关文档描述全部改写（tech-solution / api-design / design-spec / tech-arch 基线）
- `Package.swift` 须移除 rive-ios 依赖（开发阶段执行）
