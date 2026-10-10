# 技术架构变更历史

## 2026-10-10 | CHANGE-118：统一原曲面与完整髋裆预检（进行中）

完整895/848连接及最新两份895行坐标CSV、原三角UV映射通过结构/参考审查，168腿根面内部严格几何与固定nT/四环通过。八份完整点表均被拒绝；最新最佳/末态为29折/6交/32坏AR及33折/5交/37坏AR，完整保护通过仍有微米短边挤瘪，软引导已被实际折面反例否决。969/922细分连接仅组合原型，完整坐标/物理保护待作者；零新Blend，完整模型未验收。没有架构/依赖或正式资源变更。[施工记录](../../versions/v1.0.0/engineering/pet-hip-shared-chart-construction.md)。


## 2026-10-10 | CHANGE-117：作者连续映射根因与共享裆缝

已定位body/leg参数突变（约6cm）、裆桥端回折和接口残差三个独立作者错误。原最终36折面/131全对角自交索引完整重放；连续椭圆反事实0/0却因AR、裆部抬高、v3/保护失败而拒绝，不能称模型修好。 完成56条连续原三角guide与193段共同裆缝，固定21mm同侧环带因两slot27到X=0而缺站；零新Blend。七块源域/中央14×3计数和上腹五扇区整数算法已提出，完整索引、四环/双支撑及通过全部门槛的坐标表未完成；只作为有明确前置条件的施工设计。20输入+9 Blender几何控制通过，正式骨架、v2/S0、保护与资源保持。 无正式合同/架构/依赖变更。

[有限修复设计](../../versions/v1.0.0/engineering/pet-hip-embedding-repair-design.md)。

## 2026-10-10 | CHANGE-116：获批髋诊断定义与隔离分叉施工

**变化**：用户批准CHANGE-115冻结设计/提案，新增v3完整合同快照、固定raw场/锚点量测及hip-only API，同步两处Skill独立诊断指针。592原quad域整体替换，1初稿+2实际修订均895点/848quad且未通过；最终36折面/131自交对/76坏AR面，髋圈/有向strip/双groin及左真实保护一圈失败。内部有限双向P95由22.3412/23.0401降至5.3257/5.2118mm，但895exact锚点回放不认证物理关联/变形。
**生产影响**：新规则仅用于 `hip_branch_diagnostic`，正式CLI/S0仍使用旧v2，原骨架/权重/动作及正式资源保持。三小时含归档/双仓推送；修订额度用尽，不采用新生产候选，不自动新开模型轮。无运行时/基础设施/新增依赖或架构边界，不新建ADR。旧失败与关闭方法保留，完整角色仍阻塞。
**依据**：[版本施工记录](../../versions/v1.0.0/engineering/pet-character-source-layout.md#31-change-116获批规则下的完整分叉施工未通过)。

## 2026-10-10 | CHANGE-115：髋部空间语义与整体重布方案

**变化**：实际32骨髋点与合同一致；皮肤接环更低，变形过渡不能由骨轴窗口单独代表。确定592原quad完整分叉/接环范围，hip表面frame与有向参考切向为待审批提案。
**生产影响**：当前v2合同及正式资源保持，零新模型/骨架/权重；无运行时或基础设施依赖变化，不新建ADR。连接表/目标点/实际mask需下一次施工作者，完整角色仍阻塞。
**依据**：[版本修复设计](../../versions/v1.0.0/engineering/pet-hip-repair-design.md)。

## 2026-10-10 | CHANGE-114：髋裆施工布局缺口与空间证据同步

**变化**：保形重布线在实际空间/原源邻域准入停止，零新候选；只读源cut扩域不等于新保护区通过，有限平面/非平面guide失败不证明一般无解。参考检查场景保持原rev1几何与source属性。
**生产影响**：无运行时/基础设施/依赖或正式合同变化，无新ADR；完整角色仍阻塞。需先明确pivot、实际腿根表面与变形设计关系，不自动新开模型轮。
**依据**：[版本源布局§29](../../versions/v1.0.0/engineering/pet-character-source-layout.md)。

## 2026-10-10 | CHANGE-113：隔离髋裆实物与生产状态同步

**变更内容**：实际3D作者初稿和两次修订已完成，局部形体改善；严格面形/关节环/支撑仍失败，保留rev1未验收形体基线、rev2不采用连接。更新基线中的当前Rig质量状态，旧R0关闭保持。
**架构影响**：无App运行时、基础设施或新增依赖；现有Blender/Python直接作者工具属离线诊断，不构成选型/存储/协议或高成本架构变更，无需ADR。正式资源与生产合同保持。
**依据**：[版本内源布局§28](../../versions/v1.0.0/engineering/pet-character-source-layout.md)。

> 每次版本迭代后如有技术架构调整，在此追加记录。

---

## 2026-10-08 | v1.0.0 | 登记第一块有界可行性求解的隔离依赖

**变更内容**：CHANGE-111 在新私有 vendor 安装 Clarabel 0.11.1（Apache-2.0）、cffi 2.0.0（MIT）、pycparser 3.0（BSD-3-Clause），三份 wheel 哈希及实际许可证/元数据指纹归档。已有 Python 3.14.5、NumPy 2.4.3、SciPy 1.17.1 只读复用，原环境保持。
**结果与边界**：一次真实求解的数值/完整平面几何通过，两个最大值通过、三项分布质量失败，结果未采用。第三方代码/二进制不入仓或随 App 分发，无 App 运行时、基础设施或配置变更；沿用 ADR-003，无新 ADR。
**影响文档**：[overview.md](./overview.md)、[版本源布局 §26](../../versions/v1.0.0/engineering/pet-character-source-layout.md)、版本技术方案与 CHANGES.md；App 实验 `sprout-phase-one-feasibility-20261008` 保存包和执行证据。

---

## 2026-09-20 | v1.0.0 | CGAL 本机输入入口准备结项

**变更内容**：CHANGE-079 登记 CGAL 6.2.1 官方发行包和复用的 GCC/Boost/GMP/MPFR 来源、版本与许可；编译入口最终被 Xcode 许可拒绝阻塞，未运行三角化。选定平面输入也因 3 处固定边交叉被拒绝。新增 Python 预检/边检查器及有界档案，零新角色网格。
**职责边界**：仅本机离线准备，不安装新依赖、不分发第三方源码/二进制、不改变 App 运行时或基础设施。沿用 ADR-003，无新 ADR。
**影响文档**：overview.md、版本核心约束设计 §8、tech-solution.md、CHANGES.md。

---

## 2026-09-20 | v1.0.0 | 登记已结项的 Gmsh 隔离核查环境

**变更内容**：CHANGE-076 使用 Gmsh 4.15.2（主许可证 GPLv2+）及 NumPy 2.4.3 做一次本机合成小样；SciPy 1.17.1 已安装但最终脚本未使用。wheel/运行库/许可证与环境记录按指纹归档，第三方二进制不入仓或进入 App 分发物。
**结果与边界**：固定点及原连接保持失败，接入方式关闭，未引入生产 DCC 选型或运行时/基础设施依赖。沿用 ADR-003 的离线隔离职责，不新增 ADR。
**影响文档**：foundation/tech-arch/overview.md、版本技术方案/方法研究、App 小样归档 README。

---

## 2026-09-11 | v1.0.0 | 登记离线约束实验依赖

**CHANGE-048 补充**：新独立环境引入 Clarabel 0.11.1（Apache-2.0）交叉验证 C1 首个凸子问题，新增 cffi / pycparser 的版本、wheel 指纹、许可证和上游 Rust 构建配方已归档。旧 C1 环境只读复用；不进入 App 运行时，不新增基础设施或改变 ADR-003 职责边界。

**变更内容**：CHANGE-047 在独立 Python 环境安装 OSQP / IPC Toolkit 及 NumPy/SciPy，补足 QP 残差检查、逐步连续碰撞和有界求解。App 工程内锁定实际 wheel 的版本/哈希，保存 Python 传递依赖许可证与上游 C++ 构建配方；没有引入 App 运行时依赖或基础设施服务。
**变更原因**：原 S2 只在更新端点检查相交，无法排除更新途中穿过；下一版需要专用连续碰撞适配及可复核的凸子问题结果。
**决策归属**：沿用 ADR-003 的离线工具和隔离实验职责，不改变框架、存储、服务边界或生产角色合同，不新增 ADR。
**影响文档**：foundation/tech-arch/overview.md、当前版本技术方案/修复计划及 App 实验 README/requirements.lock。

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
