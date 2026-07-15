# 研发规范

> 本规范优先于公司级规范，未覆盖条目以公司级规范为准。

## 分支策略

```
main        ← 生产环境，保护分支，禁止直接 push
develop     ← 集成分支，所有功能合入此分支
feat/*      ← 功能分支，命名：feat/{version}-{brief}
hotfix/*    ← 热修复分支，命名：hotfix/{version}-{brief}
release/*   ← 发布分支，命名：release/{version}
```

## 提交规范

```
feat:     新功能
fix:      Bug 修复
docs:     文档变更
style:    代码格式（不影响逻辑）
refactor: 重构
test:     测试相关
chore:    构建/工具变更
```

示例：`feat(v1.0.0): 新增用户手机号验证`

## 代码审查

独立开发模式：合并前执行 AI code review（/code-review），P0/P1 发现必须处理后方可合入 develop。

## 其他约定

- **隐私红线（架构级强制）**：摄像头帧仅内存处理，任何代码不得将帧数据写入磁盘、网络或日志；code review 必查项
- 姿态识别一律通过 `PoseProvider` 协议调用，业务代码禁止直接 import Vision
- 三方依赖需在 tech-arch/overview.md 登记并说明许可证（禁止 AGPL 系）
- 简单直接优先，避免过度抽象（独立开发可维护性第一）
