# ADR-003 生产级角色动画资产管线与运行时分层

> ADR 索引见 [../overview.md](../overview.md) 关键技术决策索引节。

---

## 基本信息

| 字段 | 值 |
|------|-----|
| **编号** | ADR-003 |
| **状态** | 已接受，分阶段实施 |
| **决策时间** | 2026-08-12 |
| **引入版本** | v1.0.0 |
| **决策人** | winston（创始人）|
| **关联变更** | `versions/v1.0.0/CHANGES.md` CHANGE-011 |

---

## 背景

人形小草当前采用 Meshy 自动生成的 24 骨 rig，表现动作由 Swift 直接写关节角度。该方案可以快速验证 3D 教练链路，但无法作为长期内容生产基础：

- 唯一身份基准在 48 个关键单关节压力探针中有 5 个失败。独立抬腿或抬臂会在远端腹部、胸部、腋下和背部产生硬折痕或撕扯，根因是跨躯干蒙皮权重污染。
- 挥手候选已证明，继续限制角度、锁定躯干、改曲线或添加静态补片只能掩盖局部症状，不能修复错误的网格拓扑和权重归属。
- `PetIdleMotionPlanner` 用业务代码描述具体骨骼姿势，`PetSceneView` 同时负责动作选择、混合、脚底约束、叶片弹簧和渲染提交。新动作会继续扩大耦合，并让多个模块竞争写入同一组关节。
- 固定 16 列 x 11 行整张图集把动作数量、帧数和发布格式绑死。增加一个动作会要求重烘焙和替换整张资源。
- Apple SDK 已提供关节采样动画、Blend Tree 和 blend shape 权重绑定 API，但既有实验中 GLB corrective morph 在 Apple GLB 到 USD 的导入过程中丢失。API 存在不等于当前资产往返路径可用。

项目需要的是可持续生产多种姿态和动作的角色系统，而不是继续修补某一个挥手动作。

---

## 决策

### 1. 采用五层角色架构

角色能力拆分为五个相互独立、通过版本化合同连接的层次：

1. **视觉身份层**：定义轮廓、比例、材质和面部特征。当前唯一小草基准只作为视觉参考，不再作为生产蒙皮来源。
2. **生产骨架层**：建立固定 32 关节导出骨架，分离 `Root` 与 `Hips`，增加四肢 twist 骨和独立叶冠骨。骨名、层级、轴向和 bind pose 一经发布不可隐式变更。
3. **变形层**：对适合动画的连续网格手工蒙皮，以单关节和组合极限姿势逐步修权重。corrective blend shape 只处理权重和拓扑无法解决的最后体积问题。
4. **动作内容层**：表现动作在 DCC 中使用控制 rig 制作，再烘焙到固定导出骨架。应用代码只选择、混合和约束动作，不再手写挥手、张望、伸展等具体关节角度。
5. **运行时层**：由唯一 `PetAnimationGraph` 合成 Base、Action、Additive、IK、Secondary 和 Corrective 层，最终统一写入 RealityKit `jointTransforms`。

详细合同见 `versions/v1.0.0/engineering/pet-character-rig-v2.md`。

### 2. Blender 是生产 DCC，但不得作为黑盒转换器

锁定 Blender `4.3.2` 为 Rig v2 的生产 DCC。使用内置 Rigify 或等价控制 rig 提供动画控制，另设固定 32 关节导出骨架；控制骨、机制骨、约束和驱动器不进入运行时资产。

Blender 的使用必须满足：

- 正式资产只从有哈希和版本记录的 DCC master 导出。
- 导入、建骨、烘焙、导出和结构审计由固定版本脚本驱动；人工工作限于拓扑、权重和动作艺术调整。
- 每次候选导出均在隔离目录生成 GLB、FBX 和 USDZ 验证产物，不把任何往返文件重新导入 DCC master。
- 通过结构哈希、原尺寸多方位截图和 RealityKit 实机加载共同验收，不以“Blender 中看起来正常”作为发布依据。

### 3. Meshy 降级为候选生成器

Meshy 可以继续生成概念模型、纹理或动作参考，但不再决定生产骨架、最终拓扑、蒙皮权重和发布动作。任何 Meshy 输出进入生产管线前都必须重拓扑、绑定到固定 Rig v2 并重新通过全部门禁。

调用 Meshy API 会消耗 credits。每次调用前必须说明目的、预期产物和成本，并获得用户批准。

### 4. 大厅/跟练与桌面共用动作源，不共用运行时形式

- 大厅和跟练窗口只在可见且需要时使用 RealityKit 3D。
- 桌面常驻宠物继续使用 Core Animation 播放透明预烘焙帧，满足后台功耗目标。
- 每个桌面动作使用独立 sprite strip 和 manifest，帧数、FPS、循环、事件和 Reduce Motion 替代项均由 manifest 描述；不再依赖固定整张图集的行号。
- 3D clip 与桌面 sprite strip 必须来自同一个已批准 DCC action 和同一个发布 manifest，确保动作语义一致。

### 5. 使用原生 USD 发布；blend shape 仍为可选增强

2026-08-12 已使用隔离三骨资产完成两个最小往返实验：

1. Blender → GLB → Apple USDZ → RealityKit。
2. Blender → USD → USDZ → RealityKit。

Blender 原生 USD 路径保留三骨名称、bind/rest、31 个关节采样、`TestBulge` 名称和 31 个 shape 权重采样；RealityKit 实测峰值为 `35.000006°` 和 `0 → 1 → 0`，macOS 15+ 静态权重 `0.25` 可写回读取。GLB 路径经 Apple 导入后骨路径匿名化、shape 丢失，且 RealityKit 不驱动测试骨，因此不作为发布路径。

- Rig v2 发布固定使用 Blender 4.3.2 → 原生 USD → USDZ → RealityKit；GLB 只作交换和诊断产物。
- App 最低支持 macOS 14，而直接 blend shape API 从 macOS 15 起可用；生产动作不得依赖运行时 corrective morph。
- 变形质量必须主要由拓扑、蒙皮和 twist 骨保证。
- 面部表情可使用独立眼睑/眼球部件或受控面部骨作为降级方案。

### 6. 不引入 Unity 或 Unreal 运行时

Unity/Unreal 可以提供成熟的角色动画工具，但把游戏引擎嵌入当前原生 macOS 常驻应用会显著增加包体、生命周期、功耗和窗口集成复杂度。当前问题位于离线资产质量与动画职责划分，不需要更换应用运行时。

---

## 运行时责任边界

| 组件 | 新职责 | 禁止职责 |
|------|--------|---------|
| `PetIdleActionScheduler` | 按产品规则选择下一个动作和触发时间 | 生成具体骨骼姿势 |
| `PetAnimationLibrary` | 校验 rig contract，加载采样 clip 与元数据 | 静默修复不兼容骨架 |
| `PetAnimationGraph` | 状态切换、分层混合、可中断控制，输出单一最终姿势 | 直接操作视图或持久化 |
| `PlantedFootSolver` | 在动画混合后修正脚底接触 | 覆盖完整下肢动作设计 |
| 叶片 secondary solver | 在主动作后追加受限次级运动 | 改写头颈主动作 |
| `PetSceneView` | 场景、相机、灯光、生命周期和最终提交 | 定义动作曲线或让多个模块分别写关节 |

现有六个头颈教学动作的产品语义、`PlantedFootSolver`、叶片弹簧数学和 Rig 审核工具可以保留；具体教学姿势逐步迁移为 DCC clip。

---

## 考虑的备选方案

### 方案 A：继续修补 Meshy 24 骨与 Swift 动作（未选择）

优点是短期改动小。未选择原因是关键单关节静态姿势已能稳定复现远端撕扯，证明问题早于动作时序和运行时混合；继续调角度无法建立未来动作能力。

### 方案 B：Blender 生产资产 + RealityKit 原生运行时（已选择）

保留原生应用的体积、功耗和窗口优势，同时使用成熟 DCC 完成重拓扑、控制 rig、蒙皮和动作烘焙。代价是前期需要建立导出合同和认证工具，但这些工作可复用于所有后续宠物动作。

### 方案 C：所有场景都改为预渲染帧（未选择）

桌面常驻场景适合预渲染，但跟练教练需要按动作阶段实时控制、平滑过渡和脚底约束，纯帧动画会降低动作扩展能力，并造成 3D 与跟练语义分叉。

### 方案 D：引入 Unity/Unreal（未选择）

引擎的 Animator、IK 和工具链成熟，但解决不了源网格与蒙皮污染本身，并会破坏当前零第三方运行时和低功耗常驻架构。

---

## 影响

### 正面影响

- 新动作主要成为 DCC 内容生产，不再要求修改 Swift 关节角度代码。
- 同一 rig contract 可支撑闲时动作、教学动作、庆祝动作和未来互动动作。
- 资产问题能在进入 App 前通过门禁失败，避免依赖用户肉眼在正式应用中发现撕裂。
- 大厅 3D 与桌面帧动画保持同源，同时维持桌面低功耗。

### 成本与风险

- 首次重拓扑、手工蒙皮和认证成本高于自动绑骨。
- Blender、Apple USD 工具和 RealityKit 之间存在格式差异，必须维护往返测试。
- 原生 USD 可保留 blend shape，但直接运行时访问不覆盖 macOS 14；面部和 corrective 方案仍需保留降级设计。
- 角色 DCC master 是重要源资产，后续需建立适合大文件的版本化存储策略；在该策略确定前，必须至少保存不可变哈希、发布 manifest 和本地备份，不得只保留最终 USDZ。

---

## 分阶段迁移

1. **合同阶段**：冻结视觉身份，完成 Rig v2、动作 manifest、导出和认证规范。
2. **最小往返阶段（已完成）**：隔离测试已淘汰 GLB Apple 发布路径并选择 Blender USD → USDZ → RealityKit。
3. **角色生产阶段**：重拓扑小草、建立 32 关节导出骨架、完成手工蒙皮与极限姿势修正。
4. **认证阶段**：依次通过结构、关键单关节、全关节、组合姿势和 RealityKit 往返门禁。
5. **运行时阶段**：引入统一动画图，迁移现有教学动作和脚底/叶片后处理。
6. **内容阶段**：按“挥手 → 张望 → 伸展”逐个制作、八方位逐帧审核并发布独立 sprite strip。
7. **切换阶段**：用户批准候选后才替换正式 USDZ 和桌面资源；旧资产保留可回滚版本。

每一阶段均可独立停止，不允许为了推进后续动作跳过前一阶段门禁。

---

## 决策可逆性

- 运行时仍使用 RealityKit 和 Core Animation，因此可以按角色逐个迁移，不需要一次性替换全部宠物。
- 正式资源使用不可变版本号和哈希；若 Rig v2 运行时发生回归，可回退到当前已发布 USDZ 和桌面图集。
- 32 关节合同发布后不可原地改名或改层级。需要破坏性调整时创建 Rig v3，并显式迁移动作。

---

## 需要同步更新的文档

- [x] `versions/v1.0.0/engineering/pet-character-rig-v2.md`
- [x] `versions/v1.0.0/engineering/tech-solution.md`
- [x] `versions/v1.0.0/engineering/api-design.md`
- [x] `foundation/tech-arch/overview.md`
- [x] `foundation/tech-arch/changelog.md`
- [x] `standards/engineering/frontend.md`
- [x] `standards/design/DESIGN.md`
- [x] `versions/v1.0.0/product/requirements.md`
- [x] `versions/v1.0.0/product/design-spec.md`
- [x] `versions/v1.0.0/README.md`
