# 运维规范

> 本规范优先于公司级规范，未覆盖条目以公司级规范为准。

## 环境说明

> 单机桌面应用，无服务器环境；"环境"对应分发渠道：

| 环境 | 用途 | 访问限制 |
|------|------|---------|
| dev | Xcode 本地开发调试 | 开发者 |
| staging | TestFlight 内测/公测 | 受邀测试者 |
| prod | Mac App Store 正式发布 | 公开 |

## 部署流程

Archive → 上传 App Store Connect → TestFlight 验证 → 提交审核 → 分阶段发布。详细步骤见各版本 versions/{ver}/engineering/release.md。

## 配置管理

- 签名证书/API Key 仅存本机钥匙串与 App Store Connect，不入 git
- 健康分数值曲线等调参项以配置文件形式内置，便于版本间调整

## 监控告警

App Store Connect 自带崩溃报告与订阅指标；V1 不引入三方 SDK（与隐私叙事一致）。每周人工查看崩溃率与评分评论。

## 故障处理

- P0（崩溃率激增/无法启动）：24h 内热修复送审（申请加急审核）
- 回滚：App Store 无法回滚，采用 phased release（分阶段发布）降低爆炸半径；重大功能加本地 feature flag
