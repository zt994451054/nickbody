# 前端专项规范

> 本规范优先于公司级规范，未覆盖条目以公司级规范为准。
> 本产品"前端" = macOS 原生客户端（macos-app）+ 官网静态站（website）。

## 技术栈约定

- macos-app：Swift 5.x + SwiftUI + AppKit。SwiftUI 用于适合声明式状态驱动的界面；AppKit 用于窗口、全局事件、精确生命周期和 RealityKit 场景承载
- 大厅和跟练宠物使用系统 RealityKit 有界 3D 渲染；桌面常驻宠物使用 Core Animation 播放独立透明 sprite strip，禁止 GIF、Rive 和散落的逐帧定时器
- 角色资产遵循版本化 rig/clip/manifest 合同。生产表现动作在锁定版本的 Blender DCC 中制作并烘焙，业务代码不得手写挥手、张望、伸展等具体骨骼角度
- Blender 只用于离线资产生产，不进入 App 运行时；导出必须可重复并通过 GLB/USD/USDZ/RealityKit 往返验证
- 官网：静态站（框架待定），零后端

## 组件规范

- 视图遵循 MV 模式（SwiftUI 惯用），业务逻辑下沉到领域层（FatigueTracker/ScoringEngine/GrowthSystem 等纯 Swift 类型，可单测）
- 领域层不 import SwiftUI/AppKit
- `PetSceneView` 只负责场景、相机、灯光、生命周期与最终姿势提交；动作选择、clip 加载和姿势合成必须由独立服务完成

## 状态管理

- 单一数据源：SwiftData 持久化 + Observable 领域对象
- `PetAnimationGraph` 是 3D 宠物 `jointTransforms` 的唯一最终写入者，按 Base → Action → Additive → IK → Secondary → Corrective 顺序求值
- 状态层只发送语义动作 ID 与参数，不依赖骨名、图集行号或固定帧数
- 桌面 strip 由 manifest 声明帧数、FPS、循环、事件和 Reduce Motion 替代项；缺失或校验失败时回退到已批准的 `idle-neutral`
- 骨架合同不兼容必须显式失败并回退旧资产，禁止按名称模糊匹配后继续播放

## 3D 资产门禁

- 正式 3D 资源使用不可变版本和 SHA-256；候选通过完整认证与人工批准前不得覆盖 bundle 资源
- 主身体必须使用适合变形的连续网格和手工蒙皮；自动绑骨只能作为候选起点，不能跳过单关节与组合极限姿势审核
- 动作审核必须逐帧检查八个真实相机方位的原尺寸图；接触表和碰撞为零都不能替代人工细节审核
- blend shape、corrective 或格式特性必须先通过最小 RealityKit 往返实验，再成为生产依赖
- 具体骨架、权重、坐标、导出与认证合同见当前版本 `engineering/pet-character-rig-v2.md`

## 样式规范

> UI 视觉细节以 `standards/design/DESIGN.md` 为准，不在此重复定义色彩/字体等。

- 颜色/字号/圆角一律引用集中定义的 Design Token（对应 DESIGN.md），禁止硬编码散落
