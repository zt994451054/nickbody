# 前端专项规范

> 本规范优先于公司级规范，未覆盖条目以公司级规范为准。
> 本产品"前端" = macOS 原生客户端（macos-app）+ 官网静态站（website）。

## 技术栈约定

- macos-app：Swift 5.x + SwiftUI 为主，AppKit 仅用于 SwiftUI 无法覆盖的悬浮窗/事件监听场景（NSPanel、全局活动检测）
- 宠物动画统一走 Rive 状态机，禁止散落的帧动画/GIF
- 官网：静态站（框架待定），零后端

## 组件规范

- 视图遵循 MV 模式（SwiftUI 惯用），业务逻辑下沉到领域层（FatigueTracker/ScoringEngine/GrowthSystem 等纯 Swift 类型，可单测）
- 领域层不 import SwiftUI/AppKit

## 状态管理

- 单一数据源：SwiftData 持久化 + Observable 领域对象
- 宠物动画状态由 Rive 状态机管理，App 只发送状态输入，不直接操作动画帧

## 样式规范

> UI 视觉细节以 `standards/design/DESIGN.md` 为准，不在此重复定义色彩/字体等。

- 颜色/字号/圆角一律引用集中定义的 Design Token（对应 DESIGN.md），禁止硬编码散落
