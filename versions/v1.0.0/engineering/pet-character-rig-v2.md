# 人形小草生产角色 Rig v2 规范

> 本文档是 v1.0.0 人形小草生产网格、骨架、蒙皮、动作、导出和认证的单一权威合同。
> 当前状态：CHANGE-052 修复源接触漏检，补回 34 条并重建 1,534 条恢复清单；49 项测试、新源 R/F 组装及导数通过，同方向 CCD 安全比例约提升 6.45 倍，见 §8.0.31。未执行新模型 QP，C3 实际保护与造型拒绝保持。P2 2/2、S 2/2、C1/Q1/C2/C3 各 1/1，K1 未登记，D 未启动。源、正式资源和 S0/32 关节合同不变，最后余额 190 未重查。
> 后续计划：AI 按 [膝部修复计划 §21](./pet-knee-repair-plan.md#21-change-052-源接触漏检修复与有界步骤验证) 核验新增接触的有界可达性，将完整清单、新谓词及步骤修正接入新隔离流程，并保留实际 Blender 精度验收；通过后才准备新登记，不自动 C4。检测缺陷已修复，模型仍未修好，尚无整体无解证明。
> 关联决策：`foundation/tech-arch/decisions/ADR-003-production-character-animation-pipeline.md`。

---

## 1. 目标与边界

### 1.1 目标

Rig v2 必须支撑以下长期能力，而不是只通过某一个挥手动作：

- 自然站立、呼吸、张望、挥手、伸展、庆祝、疲劳、睡眠等桌面宠物表现动作。
- 六个头颈跟练动作及未来肩臂伸展动作。
- 双脚稳定、动作可中断、局部 additive、叶片次级运动和必要的 IK 后处理。
- 同一动作源同时产出大厅/跟练 RealityKit 3D clip 与桌面透明 sprite strip。
- 在新动作接入 App 前自动发现错误权重、穿模、裂缝、比例漂移和导出损失。

### 1.2 非目标

- 不修补当前 Meshy 24 骨 rig 并将其重新命名为 Rig v2。
- 不在本阶段制作正式挥手、张望或伸展动作。
- 不在 Rig v2 通过认证前覆盖 `pet_sprout_s2.usdz` 或 `pet_sprout_sheet.png`。
- 不通过 GLB 将 corrective morph 发布到 RealityKit；独立往返实验已确认 Apple GLB 导入会丢失 shape。
- 不为解决资产问题引入 Unity、Unreal 或常驻第三方动画运行时。

---

## 2. 唯一视觉身份与正式资源保护

### 2.1 身份基准

| 字段 | 值 |
|------|-----|
| 身份基准 GLB | `meshy_output/20260806_104615_sprout-auto-rig-h050_019fd4f3/rigged.glb` |
| SHA-256 | `d8bfa4d395a97c13839188d9c5d7f2212ae3c6e346262f874eee985f38deca36` |
| 用途 | 轮廓、材质、面部、叶冠、色彩和整体比例参考 |
| 禁止用途 | 复制现有骨架、inverse bind、关节索引、蒙皮权重或动作轨道到 Rig v2 |

当前基准有 93,375 顶点、176,466 三角面和 64 个连通组件。它通过角色身份审核，但 24 骨蒙皮认证失败。因此“看起来是正确的小草”和“具备生产动画能力”必须作为两个独立结论。

### 2.2 正式资源

| 资源 | 当前 SHA-256 | 保护规则 |
|------|--------------|---------|
| `Sources/NickBodyCore/pet3d/pet_sprout_s2.usdz` | `0c2f165b6a8be7aa36cf3b0668f6557919de09a8609243403a1822ea1a05273d` | Rig v2 完整认证和用户批准前不得覆盖 |
| `Sources/NickBodyCore/pet_sprout_sheet.png` | `5b0603f730fba4cbe38fc6fdd6da6a6d14f23a9a88e7265351a4e0bf4b6fbdc3` | 新动作逐帧批准前不得覆盖；迁移后由独立 strip 替代 |

每个候选必须写入独立目录。候选文件名、目录名或截图不得伪装为 `final`、`approved` 或正式 bundle 路径。

### 2.3 Licensed basemesh 来源

CHANGE-024 允许 `constructionMethod=licensed_basemesh_adapted`。当前批准的
source intake 为 Blender Studio `Base Meshes`（Julien Kaspar），许可
`CC-BY-4.0`，官方文件 SHA-256 为
`189b794efea10fcad23350b56ce22109a6247afda8f08df67b3e6e22018c4b70`。

该文件只提供人工制作的拓扑起点，不是小草身份、S0 候选或发布资产。
源文件保持仓库外只读；版本化 intake 必须记录标题、作者、发布方、来源与
下载 URL、许可 URL、源/组件拓扑哈希、选中对象/组件、归因文本、许可证据和
修改说明。独立 source-approval 必须将 CHANGE-024 用户决策绑定到完整来源
身份、license、attribution 和 audit hashes；manifest 内部布尔值不能自行授予
许可。缺失任一不可变来源、审批或归因绑定时，不得创建适配候选。

候选不得继承源文件的 modifier、armature、vertex group、parent、action、
shape key、材质或权重作为 Rig v2 证据。最终若采用衍生资产，发布 manifest
和产品第三方声明必须保留 CC BY 归因及实际修改说明。

---

## 3. 五层资产合同

| 层 | 权威来源 | 输出 | 失败时处理 |
|----|---------|------|-----------|
| 视觉身份 | 当前基准 GLB + 用户批准图 | 比例、材质、轮廓参考 | 不进入绑骨 |
| 生产骨架 | Rig v2 skeleton contract | 固定 32 关节导出骨架 | 新建 Rig v3，不原地破坏 |
| 变形 | 重拓扑网格 + 手工权重 + 可选 corrective | 通过极限姿势的 skinned mesh | 回到拓扑/权重修正 |
| 动作内容 | Blender control rig action | 烘焙后的 export-skeleton clip | 动作退回 DCC，不在 Swift 补救 |
| 运行时 | `PetAnimationGraph` + clip manifest | 最终 `jointTransforms` | 回退动作/资产版本 |

任何层都不得隐式修正上游合同。例如运行时不得通过缩头、锁躯干或限制正常关节范围来掩盖网格和蒙皮问题。

---

## 4. 网格与视觉规范

### 4.1 比例和默认姿态

- 方案 D 的头身观感是视觉目标：双脚自然收拢、身体站直、头部相对当前原始 rig 约为 90% 的批准观感。
- 头身比例必须烘焙进生产网格，不允许依靠运行时对 `Head` 做非单位缩放。
- bind pose 使用适合蒙皮的 A-pose；用户能看到的自然收脚站姿由 `idle-neutral` clip 提供，不能把双脚完全收拢的站姿当作 bind pose。
- A-pose 中上臂相对躯干外展约 `40°–45°`，肘部轻微弯曲，手掌朝向身体内侧；腋下、手臂与头部之间必须留出可检查的空间。
- 角色发布高度固定为 `1.10 m`。缩放只能应用在 DCC 网格和 armature 上，导出节点及所有关节 scale 必须为 `(1, 1, 1)`。
- 身份轮廓必须使用固定正交相机的八方位像素掩码审核，并单独统计排除头部后的身体区域，避免大头占比掩盖躯干和四肢漂移。机器指标只用于阻断和回归，不能替代 AI 原图与用户静态审核。
- v008-full-body-v002 的身体轮廓必须同时优于当前最佳止损基线：mean IoU `> 0.8257733441`、minimum IoU `>= 0.7632914488`、mean boundary P95 `< 43.5131 mm`；目标 mean IoU 为 `>= 0.85`。未达到回归底线不得提交视觉审核，达到数字门槛但仍呈方盒躯干、柱形腿或生硬腹股沟时同样判定失败。
- 叶冠作为独立变形组件单独审核。三组件闭合、全四边面和 24 点接口精确只代表结构通过；轮廓、叶脉、厚度、根部隐藏连接与左右叶语义仍须独立通过八方位身份审核。
- v008-full-body-v003 的中央躯干固定使用 `V008_TorsoCoreSafe_Frozen`。其 `4,814` 个身份表面四边面及坐标、拓扑、UV、材质必须精确保留；`260` 点 lower 和 `256` 点 upper 有序边界是唯一允许创建新连接的接口。不得移动、平滑、重采样或重投射冻结躯干以迁就连接器。
- v003 fixture 已证明上述复杂切口不是可动画 section ring，因此该条仅保留为失败证据，不再作为生产装配方式。v004 身份源只参与构建前的截面测量：每层固定 `64` 点、顺序和语义中心，最终网格不得包含运行时 shrinkwrap、nearest projection 或源网格依赖。上下端环必须优先服从关节安全 collar，中间环才拟合身份体块。

### 4.2 连通组件

生产主身体必须是一张连续、封闭的可变形表面，包含头、颈、躯干、双臂和双腿。以下部件允许独立：

- 左眼、右眼。
- 左叶、右叶。
- 经设计确认的眼部高光或口腔部件。

每个独立组件都必须在角色 manifest 中按名称和用途显式声明。任何未声明的小岛、内部重复面、悬空点、零面积面或非流形边均判定失败。不得以“组件数量不多”为由接受来源不明的小点瑕疵。

### 4.3 重拓扑

- DCC 工作网格以四边面为主，最终三角化由固定导出步骤完成。
- 肩部、腋下、肘部、髋部、腹股沟和膝部必须有随关节弯曲方向组织的连续 edge loop。
- 肩胛到胸侧、髋部到下腹不得存在跨越大面积躯干的长三角形或单一扇形极点。
- 肘和膝的内弯侧需要足够压缩环，外弯侧需要足够展开环；关节转轴不得落在单一顶点环上。
- 左右拓扑和基础权重先保持镜像，只有确有视觉原因时才允许不对称，并记录差异。
- 硬边、UV seam 和材质边界不得穿过主要变形区；必要 seam 放在低可见度、低拉伸区域。
- LOD0 优先保证轮廓和变形，不以盲目减面破坏质量。候选必须记录顶点/三角面数量；后续 LOD 从已认证 LOD0 派生，不能分别绑骨。
- 静态候选必须先按语义表面区运行拓扑邻接审计。只允许 `head ↔ torso` 经颈部、`torso ↔ upper_arm` 经肩部、`upper_arm ↔ forearm` 经肘部、`torso ↔ thigh` 经髋部、`thigh ↔ shin` 经膝部的直接边连接；`torso ↔ forearm`、`head ↔ upper_arm/forearm`、手臂与腿部等非解剖直连一律为零。
- 排除上述解剖过渡带后，A-pose 中非相邻表面必须保持至少 `5 mm` 净空且不得相交。该门禁至少覆盖头/上臂、头/前臂、躯干/前臂、左右手臂和手/大腿。
- 主身体内部封口、重叠壳、重复面和不可见自交均必须为零。不得把多组件封口或壳层重叠解释为“连续主身体”，也不得通过扩大权重 mask 掩盖错误邻接。
- 修复局部拓扑缺陷时不得对全身执行 Voxel Remesh 或全局 Quadriflow。非问题区域的顶点位置、手部轮廓和 UV 必须保持冻结；只允许在声明的肩臂重建区创建新表面。
- 肩、腋下、肘部必须提供可识别的闭合横截面环和沿肢体轴向的定向边流。仅满足四边面比例不构成合格 edge-flow；主要弯曲区不得放置高价极点，肘内外侧必须分别具备压缩和展开环。
- 手部不属于可自由重塑区。候选必须单独验证手部局部轮廓、表面距离、掌端厚度和腕部过渡，不能通过把整个手臂排除在身份审计之外放行手部漂移。
- CHANGE-018 已证明 `z=0.260` lower 64 点切口不可继续：两次直接布局虽保持三边界坐标和 pair-of-pants Euler，但无法同时通过严格几何、每侧 hip rings `>= 4` 和 joint-core 极点净空。旧 loft、lower ring、合同和失败证据全部只读，不得恢复该切口继续调点。
- CHANGE-019 的确定性测量为 `expandedHipMaxZ=0.3648870697`、`medianLocalEdgeLength=0.0122083666`、`safeZ=0.3770954363`。完整 Body 与只读 `V008_TorsoCoreSafe_Frozen` 在 safe Z 均仅 50/64 hits：前者 14 miss 来自手臂超出 torso bounds，后者 14 miss 是真实 shoulder branch gaps；升高到 `0.3900000000` 和 `0.4015120000` 仍无 64/64。因此 fully-source 水平 seam 路线关闭，不得继续升高、扫描或更换测量源。
- 原始测量的 clean / shoulder-expanded / gap union 为 `34/16/14`；16 个点已经进入 shoulder expanded zone，14 个方向没有 source surface。用这些分区拼独立 hybrid collar 会混合语义域并制造非 source-measured 区域，亦不得批准。
- CHANGE-020 的 contract-correct final 已绑定 v001 五接口 canonical hashes：neck `8690fd0d...227ca`、wrist L/R `f8968d7a...29d6 / 6d36f5d2...4e9e`、ankle L/R `d568a265...aa18 / 19bfd96a...12be`。真实网格为 `5309 V / 10528 E / 5216 F`、单组件、全四边面、Euler `-3`、边界 `[32,32,32,32,64]`、interior non-manifold `0`；这些仅是基础拓扑证据。
- CHANGE-020 严格几何失败：self-intersection `506`、fold `48`、maximum aspect `98.513`、minimum angle `5.105°`。hip 门禁通过，shoulder 环数/基础极点通过但 joint-zone aspect 失败，elbow/knee expanded two-ring pole 失败；axilla/groin route topology 通过但不能覆盖上述失败。唯一 connectivity revision 已消耗，本 topology 不得继续。
- CHANGE-024 已选择新的 licensed basemesh intake，替代“等待用户二选一”状态。该来源只能在新隔离版本中以直接 BMesh/Poly Build 编辑适配，必须使用新 candidate/topology hash，并从零证明五接口、joint flow、support routes、严格几何和身份。CHANGE-020 仍未执行 identity fitting 或视觉审核，其 topology 不得被包装为 licensed 来源继续使用。

### 4.4 法线、材质与纹理

- 导出前应用确定性的三角化和自定义法线流程；不得依赖导入器临时重算法线。
- 材质使用 RealityKit 可稳定表达的 PBR 通道。颜色空间必须显式区分 sRGB 颜色贴图与线性数据贴图。
- 纹理不得包含密钥、生成服务元数据或绝对本机路径。
- Blender、GLB、FBX、USDZ 和 RealityKit 基准截图中的主色、眼睛位置和叶片轮廓必须一致。
- 新建肩臂表面只能在内臂等低可见区域放置 UV seam；可见表面的 UV 翻折、锯齿状颜色断层和跨相邻面的异常采样跳变必须为零。全局最近面 UV 传递不能作为生产纹理方案。

---

## 5. 生产导出骨架

### 5.1 总体规则

- 导出骨架固定为 32 个关节。`DEF_Root` 不承载蒙皮权重，其余关节按需参与变形。
- 骨名、父子层级和顺序共同形成 `skeletonContractHash`。发布后不得重命名、换父级或重排。
- 左右命名以角色自身视角为准，使用 `_L` / `_R` 后缀。
- Blender 骨骼局部 `+Y` 从 head 指向 tail；骨 roll 由脚本标准化。运行时旋转一律使用 quaternion，不依赖 Euler rotation order。
- 导出骨架不包含 IK target、pole、控制器、机制骨、约束或 driver。
- 所有关节 bind scale 为单位缩放；禁止负缩放和非均匀缩放。

### 5.2 32 关节清单

| # | 关节 | 父关节 | 主要职责 |
|---|------|--------|---------|
| 01 | `DEF_Root` | — | 世界位移、整体朝向；零蒙皮权重 |
| 02 | `DEF_Hips` | `DEF_Root` | 身体重心、骨盆和根部弹跳 |
| 03 | `DEF_Spine` | `DEF_Hips` | 下腹和下躯干 |
| 04 | `DEF_Chest` | `DEF_Spine` | 中躯干体积与弯曲分配 |
| 05 | `DEF_UpperChest` | `DEF_Chest` | 上胸、肩带与呼吸 |
| 06 | `DEF_Neck` | `DEF_UpperChest` | 头颈过渡 |
| 07 | `DEF_Head` | `DEF_Neck` | 头部刚性主体和面部跟随 |
| 08 | `DEF_CrownRoot` | `DEF_Head` | 叶冠整体跟随与惯性基座 |
| 09 | `DEF_Leaf_L` | `DEF_CrownRoot` | 左叶独立摆动 |
| 10 | `DEF_Leaf_R` | `DEF_CrownRoot` | 右叶独立摆动 |
| 11 | `DEF_Shoulder_L` | `DEF_UpperChest` | 左锁骨/肩带抬降和前后移 |
| 12 | `DEF_UpperArm_L` | `DEF_Shoulder_L` | 左上臂主旋转 |
| 13 | `DEF_UpperArmTwist_L` | `DEF_UpperArm_L` | 左上臂轴向扭转分配，不承接肘链 |
| 14 | `DEF_LowerArm_L` | `DEF_UpperArm_L` | 左肘屈伸和前臂主旋转 |
| 15 | `DEF_LowerArmTwist_L` | `DEF_LowerArm_L` | 左前臂轴向扭转分配，不承接手链 |
| 16 | `DEF_Hand_L` | `DEF_LowerArm_L` | 左手掌朝向和挥手 |
| 17 | `DEF_Shoulder_R` | `DEF_UpperChest` | 右锁骨/肩带抬降和前后移 |
| 18 | `DEF_UpperArm_R` | `DEF_Shoulder_R` | 右上臂主旋转 |
| 19 | `DEF_UpperArmTwist_R` | `DEF_UpperArm_R` | 右上臂轴向扭转分配，不承接肘链 |
| 20 | `DEF_LowerArm_R` | `DEF_UpperArm_R` | 右肘屈伸和前臂主旋转 |
| 21 | `DEF_LowerArmTwist_R` | `DEF_LowerArm_R` | 右前臂轴向扭转分配，不承接手链 |
| 22 | `DEF_Hand_R` | `DEF_LowerArm_R` | 右手掌朝向和挥手 |
| 23 | `DEF_UpperLeg_L` | `DEF_Hips` | 左髋屈伸、外展和旋转 |
| 24 | `DEF_UpperLegTwist_L` | `DEF_UpperLeg_L` | 左大腿轴向扭转分配，不承接膝链 |
| 25 | `DEF_LowerLeg_L` | `DEF_UpperLeg_L` | 左膝屈伸 |
| 26 | `DEF_Foot_L` | `DEF_LowerLeg_L` | 左踝和脚掌朝向 |
| 27 | `DEF_Toe_L` | `DEF_Foot_L` | 左前脚掌弯曲和接触滚动 |
| 28 | `DEF_UpperLeg_R` | `DEF_Hips` | 右髋屈伸、外展和旋转 |
| 29 | `DEF_UpperLegTwist_R` | `DEF_UpperLeg_R` | 右大腿轴向扭转分配，不承接膝链 |
| 30 | `DEF_LowerLeg_R` | `DEF_UpperLeg_R` | 右膝屈伸 |
| 31 | `DEF_Foot_R` | `DEF_LowerLeg_R` | 右踝和脚掌朝向 |
| 32 | `DEF_Toe_R` | `DEF_Foot_R` | 右前脚掌弯曲和接触滚动 |

twist 骨是对应主骨的并行变形分支。控制 rig 负责按旋转分量驱动它们；下游肘、手、膝链不挂在 twist 骨下，避免 twist 权重分配改变关节端点。

### 5.3 关节位置要求

- 肩关节中心位于可见肩体积内部，但不得埋入胸腹中心；肩带骨覆盖锁骨到肩峰过渡。
- 肘和膝转轴以网格体积中心和弯曲褶皱位置共同确定，不只按外观端点放置。
- 髋关节位于腿根真实旋转中心，左右影响区在下腹中线前终止。
- `DEF_Neck` 与 `DEF_Head` 分担头部旋转，避免整颗大头只绕单点旋转；脸部顶点不得受肩臂或躯干下段权重影响。
- 手骨 pivot 位于手掌基部，使挥手主要发生在手腕，不要求前臂穿过头部。
- 叶片 pivot 位于各自根部；左右叶不共享单一刚性 `head_end` 控制。

---

## 6. Blender 控制 Rig 与动作烘焙

### 6.1 双骨架结构

Blender master 中保留两套职责不同的 armature：

- `RIG_Sprout_Control`：供动画师使用，可以包含 Rigify 控制器、IK/FK、pole、B-Bone、约束和自定义属性。
- `EXP_Sprout_RigV2`：严格对应 32 关节合同，只接受控制 rig 的约束结果，不承载面向动画师的控制逻辑。

发布动作前将控制 rig 的结果逐帧烘焙到 `EXP_Sprout_RigV2`。烘焙后临时禁用全部约束，再对导出骨架重放并比较姿势，确保结果不依赖未导出的对象。

### 6.2 动作制作规则

- 动作在 `30 fps` 时间线上制作和烘焙；运行时可插值到显示刷新率。
- 静默动作和跟练动作默认 in-place：`DEF_Root` 位移和旋转保持零，身体重心变化写入 `DEF_Hips`。
- 每个 clip 首尾必须定义明确的进入/退出姿势和可中断窗口，不能依赖上一个 clip 恰好停在某个姿势。
- 手与头可以在屏幕投影上重叠，但三维空间中不得穿透。挥手应通过肘部路径、手腕方向和轻微倾头留出空间，而不是让手臂穿过头或后脑。
- squash/stretch 只能由经批准的骨架或 blend shape 通道实现，不能通过对导出关节施加非单位 scale。
- 叶片 secondary motion 在主动作之后计算，幅度、角速度和回弹均受限；动作 clip 只提供主方向和强度提示。

### 6.3 动作 manifest

每个动作必须提供机器可读元数据，至少包含：

```json
{
  "schemaVersion": 1,
  "characterId": "sprout",
  "rigVersion": 2,
  "clipId": "idle-wave-goodbye",
  "sourceAction": "ACT_IdleWaveGoodbye",
  "durationSeconds": 2.4,
  "sampleRate": 30,
  "loopMode": "once",
  "rootMotion": "inPlace",
  "blendInSeconds": 0.16,
  "blendOutSeconds": 0.20,
  "interruptWindows": [[0.0, 0.18], [2.10, 2.40]],
  "jointMask": "fullBody",
  "events": [{"time": 0.42, "id": "handRaised"}],
  "footContacts": {"left": [[0.0, 2.4]], "right": [[0.0, 2.4]]},
  "reducedMotionClipId": "idle-breathe-subtle"
}
```

时间区间必须位于 clip 时长内，事件 ID 使用稳定语义名。manifest 校验失败时不得在 App 中加载该动作。

---

## 7. 蒙皮与变形合同

### 7.1 通用约束

- 每个顶点最多 4 个非零 influence。
- 权重必须非负、归一化，和为 `1.0 ± 1e-5`。
- 小于 `0.005` 的权重在导出前清除并重新归一化，避免远端微小污染累积成可见撕扯。
- `DEF_Root` 权重必须为零。无权重顶点、未使用 vertex group 和缺失骨组均判定失败。
- 初始左右权重必须镜像；人工修正后的不对称差异需要在权重审计报告中列出。

### 7.2 区域隔离

角色网格必须维护命名区域 mask，自动检查关节影响是否越界：

| 区域 | 允许的主要 influence | 明确禁止 |
|------|----------------------|---------|
| 头部/面部 | `Head`、`Neck`，叶根附近可有 `CrownRoot` | 任意肩、手臂、髋、腿权重 |
| 颈部过渡 | `Head`、`Neck`、`UpperChest` | 手臂、腿权重 |
| 胸腹核心 | `Hips`、`Spine`、`Chest`、`UpperChest` | 手臂、手、腿、脚、叶片权重 |
| 肩/腋下过渡 | 同侧 `UpperChest`、`Shoulder`、`UpperArm` | 对侧手臂和任意腿权重 |
| 上臂/前臂 | 同侧主骨、相邻关节和对应 twist | 躯干核心、对侧肢体、腿权重 |
| 髋/腹股沟过渡 | `Hips`、`Spine`、同侧 `UpperLeg` | 对侧腿和任意手臂权重 |
| 大腿/小腿 | 同侧主骨、相邻关节和对应 twist | 胸腹核心、对侧肢体、手臂权重 |
| 叶片 | `CrownRoot`、对应 `Leaf`，根部可有 `Head` | 四肢和躯干下段权重 |

肩、腋下、髋和腹股沟的“过渡区”必须由固定 vertex mask 定义，不能由脚本按距离临时猜测。离开过渡区后，肢体对躯干核心的累计权重必须为零。

### 7.3 Twist 和体积保持

- 上臂、大腿的轴向旋转由主骨与 twist 骨分配，权重沿肢体长度平滑过渡。
- 前臂 twist 用于手腕转动时保持前臂体积；它不能影响肘外的上臂或胸腹。
- twist 分配在 `±60°` 上臂/前臂旋转和 `±35°` 大腿旋转下审核，不允许出现糖纸式塌陷或局部反转。
- corrective 只能在拓扑、骨位和权重已通过单关节门禁后添加。corrective 不得用于隐藏跨区域权重污染。

### 7.4 面部与 corrective blend shape

DCC master 可预留以下稳定名称：

- 表情：`EXP_Blink_L`、`EXP_Blink_R`、`EXP_Smile`、`EXP_Squint`。
- 变形修正：`COR_ShoulderRaise_L/R`、`COR_ShoulderForward_L/R`、`COR_ElbowFlex_L/R`、`COR_HipFlex_L/R`、`COR_HipAbduct_L/R`。

第 10 节往返实验已确认 Blender 原生 USD 路径可保留这些 shape，但 App 最低支持 macOS 14，直接运行时 API 仅覆盖 macOS 15+。因此它们只能作为可选增强，不能成为发布资产的硬依赖；基础身体完整性仍须由拓扑、权重、twist 骨或受控辅助骨保证。不得假设导出器会自动烘焙顶点修正。

---

## 8. 极限姿势认证矩阵

认证顺序固定为 `open_five_s0 → closed_static_identity → 用户静态审核 → production_rig_gate_0 → Gate 1 → Gate 2 → Gate 3 → Gate 4`。前一门禁失败时立即停止，禁止继续生成大量动作来“看看是否能用”。`open_five_s0` 是无骨架开放五接口拓扑门禁，不得记作身份完成、用户审批或正式 Rig Gate 0 通过。

静态拓扑阶段使用四个不可混用的 profile。机器真源为 App 仓库
`character_pipeline/sprout/v2/contract/sprout-rig-v2-static-topology-contract-v2.json`，
SHA-256 固定为
`4cc50d3c1f31b34d3347835995379d5e6c38bd7a84fa49077b3bcc08f5247377`。
报告、handoff 和项目 Skill 必须绑定同一合同版本和哈希，不得各自复制并修改阈值。

| Profile | 产物性质 | 可通过 S0 | 进入条件与退出边界 |
|---------|---------|-----------|------------------|
| `scoped_wip` | 局部、一次性实验 | 否 | 只验证已声明局部；结果只能继续/停止 scoped 实验，不能进入 formal decision、identity 或 rig |
| `open_five_s0` | 正式开放五接口候选 | 是 | 单组件、Euler `-3`、五边界 `[32,32,32,32,64]`、完整语义声明与零静态 rig 状态 |
| `closed_static_identity` | S0 后闭合身份装配 | 否 | 仅从已通过 `open_five_s0` 的同一 connectivity 派生；闭合为 Euler `2`，补齐身份证据与用户审批 |
| `production_rig_gate_0` | 生产 rig 入口工作副本 | 否 | 仅接受用户批准的 `closed_static_identity`；进入并不代表骨架、权重或变形通过 |

关节环点数不是固定的 `32`；`32` 只属于腕踝 canonical interface 和生产导出骨架语义。每个 shoulder/elbow/hip/knee 至少声明 4 个真实闭环，同一关节相邻环点数必须一致并形成连续一对一 quad strip，最小纵向 connector alignment 为 `0.85`。左右同名关节环数差不得超过 `1`，环点数中位差不得超过 `10%`。axilla、shoulder over-cap 和 groin 每侧至少各有 2 条连续、无极点且满足解剖 waypoint 的 support route。关节核心及相邻一环极点数为 `0`；最大面比例为 `3.5`。最小面角 `10°` 在 CHANGE-026 中只保留为诊断值，不作为静态硬门槛。

### 8.0 Static Gate S0：无骨架开放五接口网格

Static Gate S0 只审核开放五接口重拓扑网格，不包含闭合静态装配、视觉身份、用户审核、armature、vertex group、蒙皮权重、bind/rest 或动作。通过后还必须派生并审核 `closed_static_identity`，顺序如下：

1. CHANGE-019 的水平 seam 与 hybrid collar 子路线保持停止。
2. CHANGE-020 的纯合同和 reference/joint probes 已证明五边界、Euler `-3`、单组件、全四边面及 route connectivity，但严格几何、shoulder aspect 和 elbow/knee expanded-pole 门禁失败。
3. 唯一显式 connectivity revision 已失败，CHANGE-020 在 Static Gate S0 前关闭；该 topology 不得继续修补，也不得进入 identity fitting、冻结部件装配、骨架或蒙皮。
4. CHANGE-024 已批准 Blender Studio licensed basemesh source intake。intake 通过只允许创建新隔离适配副本；完整闭合人体、T-pose、现有 modifier/rig、全四边面或许可证均不能记作 S0 证据。
5. 新候选必须声明 `licensed_basemesh_adapted`，绑定 source artifact、license evidence、attribution 和 intake manifest 的 unchanged hashes，并产生不同于源组件及关闭路线的新 topology hash。
6. 只有未来新 proxy 通过全部机器门禁后，才允许显式 identity fitting、冻结部件装配、身份指标和八方位审核；当前没有获批 proxy 可继承。

S0 候选必须保持零 Armature modifier、零 vertex group、零父级和零 action。S0 或用户静态审核失败时不得应用生产骨架或生成权重；S0 通过只批准静态网格 source hash，不代表 Rig Gate 0、变形或动作获批。

### 8.0.1 `nick-character-dcc` 决策 Skill

App 仓库 `.agents/skills/nick-character-dcc/` 版本化一个项目专用 Codex Skill。它是 Rig v2 的非权威证据路由和阶段门禁，不生成网格、不执行 Blender 几何审计、不授予审批，也不替代本规范、ADR-003、原尺寸证据或 RealityKit 往返结果。

决策脚本只接受规范化 decision report。generic Blender auditor 仍负责产生原始事实；候选 builder 或显式 normalizer 按 Skill 的 `references/decision-report-schema.md` 汇总报告，不得改写失败值。正式报告必须绑定机器合同版本/哈希，包含原始几何、八个 joint records、axilla/shoulder-cap/groin 六侧 support-route records、五接口有序点与哈希、冻结输入 before/after 哈希，以及零 Armature object/modifier、mesh modifier、vertex group、parent、shape key 和 action 的 `staticState`。身份完成还须绑定 silhouette measurement 与原尺寸 review manifest 哈希。用户静态审批必须同时绑定 decision-report SHA 和 Blend SHA；CLI 通过 `--artifact` 对实际 Blend 重新哈希。`scoped_wip` 使用独立局部报告，不得送入 normalizer、formal compare 或正式审批链。

2026-08-31 验证结果：

- 单元/CLI 集成测试 `61/61` 通过；目标脚本 line coverage `83.58%`、branch coverage `81.72%`；`quick_validate.py` 通过。
- CHANGE-020 真实报告 SHA-256 为 `b91698ef881632b52d7d90287096862bea1dd24eec8e190e0509a7fd4a84bf67`。连续两次只读评估均以退出码 `2` 返回 `static_gate_s0 / repair_static_topology / riggingAllowed=false`，输出一致，源报告 SHA 前后未变化。
- 评估精确保留 `506` 自交、`48` folds、aspect `98.513`、最小角 `5.105°`、双肩 aspect、双肘 poles `23/23`、双膝 poles `26/28` 及五接口超距吸附；canonical hashes 和 support routes 通过不能抵消失败。
- 历史报告没有 `staticState` 与 `checks.unskinned`，因此额外标记证据缺失。这不证明历史 Blend 含有骨架，只证明该旧报告不能建立“未蒙皮”不变量。

效果结论：保留该 Skill 作为后续候选的防越级门禁；它成功识别真实失败、审批越级、禁用操作、同 identity 复活、细粒度回归和输入漂移。它没有改善或重建 3D 网格，CHANGE-020 继续关闭。CHANGE-024 后的新候选必须如实声明 `licensed_basemesh_adapted`；不得把 `repair_static_topology` 理解为继续修改旧 topology，也不得进入 identity fitting、骨架或蒙皮。

### 8.0.2 社区 Skill 隔离试验结论

CHANGE-022 按用户决策重新检索 SkillHub、ClawHub 和 GitHub 社区，并隔离审查 `cc-blender-skill`、`mcp-blender-agent` 与 `dcc-mcp-blender`。没有候选可替代 Static Gate S0 的拓扑构造与审计：

- `cc-blender-skill` 的 `blender-modeling`、`reference-to-3d`、`quality-refinement-autoloop` 能提供 BMesh 原语、参考量测和失败迭代纪律，但不包含五接口单组件全四边面、关节环、support routes、极点净空或 strict geometry 的构造算法；其默认 Boolean、Voxel、QuadriFlow、最终 Shrinkwrap 与 Delaunay 三角面/2.5D 分件路线均不允许用于本项目。
- PoBruno `mcp-blender-agent` 与 `dcc-mcp-blender` 提供更丰富的 Blender typed tools、骨架、逐顶点权重和动画 E2E，但 retopology 仍依赖自动 remesh、基础 extrude/loop-cut 或人工布局；在 S0 通过前不得加载其 rigging/weight/animation 路线。
- ClawHub `blender-skill` 基于 Blender 官方 MCP，要求 Blender 5.1+；项目当前为 4.3.2，且已有固定 `blender-mcp==1.9.0`，不升级 Blender、不替换执行桥。

三个 `cc-blender-skill` 子 Skill 的隔离副本均未通过 Codex `quick_validate.py`（frontmatter 含不支持的 `when_to_use`），未进入 `~/.codex/skills`。行为测试只证明社区流程能够在项目合同约束下提出 BMesh-first 建议，没有生成 Blender 候选，也没有几何改善证据。社区 Skill 路线在 CHANGE-022 时止损；其“manual DCC 或停止”待决状态已由 CHANGE-024 的 `licensed_basemesh_adapted` source intake 取代。

### 8.0.3 社区 Skill 兼容适配实作结论

CHANGE-023 经用户明确批准，对上述三个 `cc-blender-skill` 子 Skill 仅删除不兼容的 `when_to_use` frontmatter，并在 `/tmp` 中实施 topology smoke candidate。适配后的 Skill 可通过 Codex 结构校验，但实作路线不获批准：

- 候选以固定 `24×8×16` structured grid/cell trunk 和参数化 branch tubes 程序生成 connectivity，没有使用真实 Blender BMesh 手工 authoring；`manual_dcc_authored` provenance 标记不成立，触碰已关闭的 cell/domain 方法边界。
- 基础组合拓扑曾达到单组件、Euler `-3`、五个 canonical counts、全四边面和新 topology hash，但独立复审发现 canonical 自比较、support routes 误用 limb longitudinal rails、joint rings 仅按距离声明，以及缺少自交、净空、解剖邻接和权威 face metrics。
- 修正 canonical、route 与 joint-axis 自检后，当前纯测试 `6/7`，最大面边长比约 `7.45 > 3.5`；社区流程没有给出可解除该红灯且符合 provenance 的新拓扑方法。
- Blender 集成测试只在系统临时目录生成过一次 Blend/report并自动删除，用于验证 evidence plumbing；没有保留或批准 raw report，没有修改任何正式/历史资产。

该路线被 `nick-character-dcc` 拒绝并停止。新 faces/hash 不等于合格新路线；construction method、原始证据和实际建模过程必须一致。后续不得继续该 grid/cell candidate，也不得把最小 frontmatter 适配后的社区 Skill 链接进 active Codex 栈。

### 8.0.4 CHANGE-024 licensed basemesh source intake

Blender Studio `Base Meshes` 的官方文件已在 Blender 4.3.2 以
`--disable-autoexec` 只读预审。选中 `Stylized Female` 的最大连通组件为
`12,502 V / 25,000 E / 12,500 F`、全四边面、单个闭合组件、Euler `2`、
零边界；源 topology SHA-256 为
`971811a11be4e9740c2b874749683e0fa2b3cb747a35fcface73abbdb9e896f1`。
它仍有 `236` 个面超过 aspect `3.5`，且源对象带 Geometry Nodes modifier，
没有五个 canonical openings，也未证明 Rig v2 joint/routes 或小草身份。

版本化 intake 位于 App 仓库
`character_pipeline/sprout/v2/work/experiments/v009-licensed-basemesh-adapted-v001/`。
真实源文件、license evidence 和 attribution 的 intake CLI 已返回
`approved_for_isolated_adaptation / reference_only / riggingAllowed=false`。
本结论只批准后续隔离拓扑适配框架；本变更没有生成 adapted Blend、S0 report、
骨架、权重或正式资源。

### 8.0.5 CHANGE-025 licensed topology adaptation v001

首个真实 adapted revision 固定为
`v009-licensed-basemesh-adapted-v001`。只读 inspector 将五个 source 切割环
绑定为 neck `36`、双 wrist `22`、双 ankle `28`；腕部另有更远端 `20` 点环，
但该环位于手侧 topology，不能作为保留前臂后的 wrist interface。builder 只执行
最大组件提取、source-only 状态移除、明确 pivot A-pose、直接 BMesh/Poly Build
编辑及局部 all-quad 过渡，没有 remesh、Boolean、最终投影、Auto-Rig 或付费 API。

候选 Blend SHA-256 为
`4755b8453230478f57a75ae2f61ec0f8966bf9bf790cb39b0a6a64810df1e15f`，
candidate topology SHA-256 为
`48911f355420b0b004204c4400af64cca21b1d7d204831b558c3a8ad59496ed4`。
它由 `6,459 V / 12,828 E / 6,366 quads` 构成，单组件、Euler `-3`，五边界
`[32,32,32,32,64]` 与冻结 canonical points/hash 全部零误差，且 Armature object/
modifier、vertex group、parent、action 均为 0。

raw S0 明确失败：self-intersection `5`、fold `9`、maximum aspect
`25.3542852131 > 3.5`、minimum angle `2.6318361600° < 10°`。8 个 joint 的
accepted declared ring 均为 0；双 shoulder expanded poles 为 `42/52`，双 elbow
为 `2/4`，双 knee 为 `10/9`，双 hip 虽无 expanded pole 但 aspect 为
`5.212/4.310`。axilla/groin 左右四侧均为 0 accepted support routes。

`nick-character-dcc assess` 返回 `repair_static_topology / riggingAllowed=false`。
相对 CHANGE-020，self-intersection 改善 `99.01%`、fold 改善 `81.25%`、aspect
改善 `74.26%`，并解决 closed-route、excessive boundary snap 和 static-state
缺失；但 minimum angle 从 `5.105°` 降到 `2.632°`，且新增
`SUPPORT_ROUTE_FAILED`。compare 因该新硬失败及全部 joint/support 回归返回
`reject_regression`。

CHANGE-025 到此停止，不得修补同一 revision 或进入 identity、骨架、权重、动作。
若用户未来明确授权新 revision，必须使用新 candidate/topology hash，重点重建 8 个
关节每处至少 4 个真实连续环和 axilla/shoulder-cap/groin 解剖 support quad strips，
同时清除 strict geometry 失败；licensed source 只能继续作为表面种子，不能被视为
可直接复用的变形模型。

### 8.0.6 CHANGE-026 合同治理与 R0

CHANGE-026 修复了 v001 施工范围与正式 S0 声明不一致的问题。builder 在生成任何
产物前必须拒绝空 formal joint/support declaration；审计器和 Skill 从同一合同读取
可变环点数、真实环间 quad strip、双侧一致性及 shoulder over-cap 规则。历史 schema v1
报告继续只读兼容，但不能被静默升级为 schema v2 或解锁 rigging。

获批 R0 只覆盖左肩、上胸、肩胛、腋下和近端上臂。实际构造保留源 provenance 与冻结区，
并以至少 4 个 shoulder rings、2 条 axilla U-routes、2 条 shoulder over-cap routes、
连续 quad strips、关节核心/相邻一环无 pole 和零新增硬几何失败通过
`scoped_wip_static_passed`。该结果仍明确为 `formalCandidate=false / s0Eligible=false /
staticGateS0Passed=false / riggingAllowed=false`，不能解释为正式 S0 或静态身份审批。

随后只在一次性 disposable 副本中应用披露的三骨诊断结构和线性测试权重。baseline-aware
诊断完整执行 `430/430` 个逐度样本：肩带升降 `21/21`、前伸/后收 `31/31` 通过；
上臂前举 `0/121`、外展 `119/136`、轴向旋转 `117/121` 通过，累计新增
`131` 个 folded-face、`101` 个 orientation-flip、`138` 个 self-intersection 失败；
bind pose 原有 `3` 个 frozen folded faces 未重复计为姿态新增失败。权威报告位于 App 仓库
`character_pipeline/sprout/v2/work/experiments/r0-left-shoulder/diagnostics/disposable-deformation-baseline-aware/report.json`，
SHA-256 为 `5d89945cf746617c61ba88f1a67901def4df11ab19016df8cc956a3da3853fff`。
AI 仅实际复核权威新目录中的 `15` 张原图和 `19` 张无重采样裁图，不声称完成全部
`448 + 448` 张人工审核。临时 rig/权重已清理且未保存、导出或复用，正式资产与冻结输入未变。

一次性变形机器门失败后，当前 licensed-basemesh AI 施工路线按止损条件关闭，不创建或
授权 v002，不进入 production Rig Gate 0，不生成生产骨架、正式权重、动作或正式资产替换。
此结论只否决“当前 R0 网格 + 披露的临时三骨 + 线性测试权重”组合，不独立否决 immutable
licensed source topology。任何 materially different production route 均须新的明确决策与授权。

### 8.0.7 CHANGE-027 Tripo P1 付费前输入门

CHANGE-027 只授权一次 `P1-20260311` multiview-to-model 静态任务，最多 `50 credits`，
且明确排除重抽、第二 seed、Pre-rig Check、骨架、权重、动作、USDZ 和正式资源替换。
外部产物即使生成也只能保留为 `scoped_wip`，不得进入 formal normalizer、
`candidate_decision.py assess/compare` 或占用 v002 编号。

冻结身份 rest 双上臂相对躯干向下轴实测约为 `52.6°/55.6°`。获批输入捕获通过旧
24 骨 pose 将双上臂最小校正至 `45°`，并应用 `Head=0.90`。第一次完整四视图通过
顺序、`2048×2048 RGBA`、透明边距、非空包围盒和冻结哈希检查，但 `0 EV` 下可见
像素平均 RGB 为 `0.912–0.963`，高光占比为 `42.989%–68.933%`，因过曝拒绝。
固定世界光与三点灯后以 `-2 EV` 复拍，高光占比降至 `0.012%–0.411%`，曝光不再
阻断；原尺寸审核仍在 front 发现双侧肩根/躯干侧面拉痕，在 left/right 发现肩臂交界
凹陷，在 back 发现从后腋下延伸进躯干的锯齿状纵向深沟。该形态与既有跨躯干权重
污染一致，触发“任何可见头脸、肩腋或躯干拉扯均在付费前停止”的硬规则。

权威 scoped WIP manifest 为 App 仓库
`character_pipeline/sprout/v2/work/experiments/tripo-p1-static-wip-20260904/experiment-manifest.json`，
SHA-256 `bb13e0f98c33766160bc11b42bc7cb8e2a4d86b5ab128b6cf1e5fdb491a857a1`。
Tripo 状态为 `not_submitted`，task 数 `0`、task ID 数 `0`、消费 `0 credits`，余额仍为
`600` 且冻结为 `0`；没有模型、纹理或下载产物。因此本结论只否决当前两组输入，
不构成 Tripo 生成失败或 Tripo 能力结论。

后续如继续，须新授权以下输入路线之一：优先使用完全未施加 pose bone/head scale
变形的冻结 rest 几何，接受本次供应商能力验证采用 `Head=1.0` 和实测上臂角；或单独
设计几何域重姿态，并在提交前完成语义 mask、裂缝、翻面、自交、肩腋轮廓和四视图
一致性审核。Tripo CLI `0.3.1` 不能提交级硬限制 credits，精确提交前价格也尚未确认；
当 `<=50 credits` 仍为硬条件时，付费调用前还必须解决该预算门禁。

### 8.0.8 CHANGE-028 Tripo H3.1 分阶段质量优先实验

CHANGE-028 废止 CHANGE-027 中通过旧 24 骨 pose correction 将双上臂校正至 `45°`、
并应用 `Head=0.90` 的输入策略。阶段 0 只允许从冻结身份 GLB
`character_pipeline/sprout/v2/source/identity-baseline/sprout-identity-reference.glb`
（SHA-256 `d8bfa4d395a97c13839188d9c5d7f2212ae3c6e346262f874eee985f38deca36`）
读取 `char1` 原始 mesh data，在隔离目录创建未经 armature 求值的静态副本。副本保持
`Head=1.0` 和 rest 双上臂约 `52.6°/55.6°`，必须解除 parent、移除全部 modifier 和
animation data；其顶点相对原始 mesh data 的最大位移必须为 `0`。原 armature、原 mesh
及其他对象不得参与渲染，CHANGE-027 的四视图和 manifest 只读保留且禁止复用或覆盖。

阶段 0 固定输出 `front / left / back / right` 四张 `2048×2048 RGBA` 透明背景正交图，
使用相同相机尺度、世界空间灯光和 `-2 EV`。报告必须绑定源/副本顶点数、三角面数、
矩阵、最大顶点位移，以及输入、脚本、正式资源和旧 manifest 的 before/after SHA-256。
机器门检查顺序、尺寸/通道、非空 alpha、透明边距、四视图字节唯一、零顶点位移、
原对象未参与渲染和受保护哈希不变；机器通过后仍须逐张原尺寸检查脸、叶冠、肩腋、
躯干、曝光和轮廓。允许正交视角产生的自然自遮挡；任一非设计拉痕、异常凹陷/深沟、
过曝，或因异常融合、穿插、跨视图不一致而使关键肢体/身份轮廓无法判断时立即停止。
阶段 0 不得上传图片或创建 Tripo task；报告只可声明本地进程的网络请求、上传和 task
创建请求均为 `0`，账户侧 task/credits 未查询。完成本地审核后只可交用户复核并停止。

阶段 0 的四张原始 PNG 已获用户批准；批准记录只绑定 reviewed manifest 与四图哈希，
不授权凭证读取、余额查询、上传、task 创建或付费调用。以下为阶段 1 立项时的固定请求；
用户随后已明确接受并授权执行，实际生成与恢复结果见 §8.0.9：
单次 `v3.1-20260211` multiview-to-model，参数固定为
`texture=false`、`pbr=false`、`quad=true`、`smart_low_poly=true`、`face_limit=10000`、
`geometry_quality=standard`、`generate_parts=false`、`model_seed=424242`。
官方公开价目响应与参数文档已按原始 bytes 保存并绑定到精确请求：H3.1 无纹理多视图
`20` + Quad `5` + Smart Low-poly `10` = `35 credits`。`50 credits` 只是用户审批阈值，
不是服务端消费上限；立项时尚未观察扣费，提交前须重新验证价目，执行后实际消费为 35 credits。CLI `0.3.1`
没有 `dry-run`、`estimate`、提交级 `max-credits` 或远端幂等键，不得用真实生成请求试价。

禁止使用默认 CLI `generate`、`tripo ai`、`make`、MCP `tripo_make`、batch、redo、
多候选或自动重试。默认 CLI 的上传和 task POST 存在重试，并在图片上传后才执行其普通
余额预检；阶段 1 获批后唯一允许路径是 App commit `7c87e8c` 中的项目守卫执行器，
以 `claim → balance → upload front/left/back/right → durable create_intent → single createTask`
顺序运行，client `maxRetries=0`。API Key 只能由守卫从本机 `nick-custom` profile 的私有
普通文件经 descriptor-bound 单次读取，禁止回显或写入仓库/日志；只允许上传用户批准且
哈希锁定的 PNG，不上传 GLB、Blend、代码或项目文档。`https://cdn.tripo3d.ai` 仅作
provisional 产物 allowlist；任何 URL 规则或 origin 偏离都须在下载前 hash-only 停止，
本地产物恢复必须先通过单文件 `512 MiB`、总集 `1 GiB` 的全量大小预检。任何未来输出仍属于
`scoped_wip`，不得分配 candidate version、创建或暗示 v002、进入 formal normalizer、
`candidate_decision.py assess/compare` 或宣称 Static Gate S0 通过。纹理、Rig Check、
Auto Rig、权重、动作、corrective、USDZ 转换与 App 正式替换均属独立且未授权阶段。

单次执行授权还必须显式接受三项残余风险：第三方转售且曾披露的凭证无法保证账户独占；
provisional CDN 偏离可能导致已扣费但停止下载；claim 消费后即使余额或后续步骤失败也不会
自动重试。优先轮换为用户独占凭证；若继续使用现有凭证，须由用户明确接受该账户风险。
守卫已通过独立安全复审、Stage 1 `111/111`（line `82.59%` / branch `84.35%` /
function `90.55%`）及 Stage 0 Python/Blender `27/27`，但测试通过不构成付费授权。

### 8.0.9 CHANGE-029 已知 Tripo 任务恢复与离线结果评审

已知任务 `a9797bba-4e95-439c-baf5-7824799d7184` 的状态为 `success`，
模型为 `v3.1-20260211`，实际消费 `35 credits`。原执行器在发现产物来自
`https://tripo-data.rg1.data.tripo3d.com`、不同于 provisional CDN 后于下载前停止；
这不是生成失败。经用户授权，恢复器只查询该任务一次并下载两个既有产物，
没有新建、重试、重抽或追加积分。恢复于 2026-09-06 完成，离线评审于 2026-09-08 完成。

FBX 为 `699,276 bytes`，SHA-256
`8eb06e5914fe82247cd04ac51bb5b5de0edf8bd25859a4582d8693ef7f435283`；
私有审计 Blend 的 SHA-256 为
`f707123909e8c6e0ff92be354d981bdbbfebafbee74a4febe2da6821676e8cc9`。
Blender 4.3.2 在干净环境、禁用自动执行及禁止网络条件下读取隔离文件，得到：

| 项目 | 实测值 |
|---|---|
| 网格 / 顶点 / 边 | 1 / 12,637 / 25,932 |
| 原生面 / 四边形 / 三角形 / ngons | 13,307 / 11,092（83.35%）/ 2,215 / 0 |
| 展开为三角形后的数量 | 24,399（不可与原生面数混用） |
| 连通组件 | 37：一个覆盖全身的 9,894 顶点主组件，另 36 个 45–98 顶点小组件位于头部 |
| 开放边 / 非边界非流形边 | 全模型 856 / 4；主组件 173 / 3 |
| 退化面 | 0（面积阈值 1e-12） |
| Armature / vertex groups / actions / modifiers / shape keys | 全部 0；这是无纹理静态任务，不是自动绑定测试 |
| 材质 / UV 层 | 1 / 1；未请求纹理或 PBR |

四条非流形边有 3 或 4 个相邻面，均位于头部/叶冠高度范围。组件数量不能等同于断开的
身体块数，开放边也不等同于可见破洞。请求中的 `face_limit=10000` 未精确约束输出。
全模型包括头、手、足和叶冠，不是 `open_five_s0` 的开放五接口身体 proxy；
本次没有执行 formal normalizer、assess/compare 或完整关节/自交认证，不给 S0 结论。

使用既有 renderer 生成并逐张审查八方位素模与布线共 16 张 `1800×1800 RGBA`。
首组曝光过高，保留原图后只将本地曝光设为 `-2 EV`，未修改模型。
文件名的 `textured` 实际为无纹理素模；导入后的正面为 yaw +90°，背面为 -90°。
整体大头、双叶与四肢保留；手部末端粗糙、叶背沟痕与厚边不规则，输入中浅环状斑点在
输出中呈突出小片。身体存在较规整的四边形带，但这不证明关节受力时能自然变形。

本次保留结果作几何/拓扑参考，暂不追加贴图或自动绑骨。建议下一步先零积分评估身体
肩腋、肘、髋、膝的布线及开放边归属，形成局部修整范围与单次尝试的停止条件，再决定
新的有界施工路线。该建议不恢复历史关闭路线，也不把 WIP 晋升为 v002；
`assetUsabilityVerified`、`staticGateS0Passed`、`riggingAllowed` 继续为 false。

App 非敏感证据位于
`character_pipeline/sprout/v2/work/experiments/tripo-h31-input-preflight-20260905/stage1-result-evidence.json`；
用户可读实图入口为同目录 `stage1-result-review.md`。下载、原图和审计 Blend 留在本机私有目录，
历史 manifest/claim/completion 不改写。Node 144/144，Python/Blender 39/39（Stage 0 27 + 审计 12）；
工具测试通过不代表角色变形通过。正式资源、身份基准和静态合同哈希保持不变。

### 8.0.10 CHANGE-030 Tripo 自动绑定与动作能力试验

2026-09-08 用户审查整轮计划后回复“继续”，批准以质量与验证速度优先开展独立
`tripo-animation-trial-20260908`。历史静态试验的“不得自动绑骨”不适用于本轮诊断副本。
本轮沿用已批准的 rest 四视图，比较现有 H3.1、无智能减面的 H3.1 detailed 和 P1
20,000 面目标；新增生成通常 2 个，视图问题有证据时最多补充 1 个单图对照。
最多对 3 个模型执行新版双足自动绑定，最优 2 个各测试 idle/walk/run/jump/turn；
可作局部关节姿势、表情可行性、必要贴图/减面/清理和隔离 RealityKit 导出验证。
允许确定性 CLI 调用和必要输入上传，记录任务/参数/实际消费，不自动充值。

这些产物属于 vendor capability trial，不进入 formal normalizer 或 S0 assessor，
不设置生产 `riggingAllowed`，也不建立 v002。诊断通过与生产 32 关节合同通过分别记录；
身体动作、面部控制、身份质量、应用导入各自给出已验证/未通过/未验证结论。
原始输入、历史证据、生产 USDZ/sprite 和 master 保持不可变。

**本轮实际结果**：旧模型转 GLB 后 Rig Check 返回 false。P1 生成 19,149 三角面，
通用 v2.5 绑定产生 35 骨；H3.1 detailed 生成 1,977,636 三角面，同版绑定产生 26 骨。
两者均交付五种预设动作，P1 下肢/躯干严重卷曲，H3.1 肩臂皱缩且下肢动作不足，
均未通过自然动作筛选。使用剩余第三次绑定名额，对同一 H3.1 选择官方推荐的人形
v1.0 + Mixamo，得到 23 个人形关节；本地 14 个双方向姿势改善了转头和四肢控制，
但抬臂肩腋、抬腿躯干仍出现裂痕/折线。服务随后以 `1004` 拒绝该 rig 的相同五种预设：
`不支持mixamo骨骼的retarget`，没有交付新动作。该失败任务未返回消费字段；成功任务
消费之和与账户下降均为 260，冻结为 0，未见失败任务的额外净扣款。

一次隔离清理以 1e-6 阈值合并 20,898 个重合顶点，重跑 14 个姿势后问题仍存在。
三份 rig 的所有顶点均有近似归一化权重，但均没有 shape keys 或可用眼口控制。
没有模型通过身体筛选，故条件性的贴图、交付减面与 RealityKit 接入未启动；
未使用单图补充名额。下一轮优先考虑 H3.1 几何、有限减面、人形 v1.0 + 原生命名
预设动作的组合，并单独验证肩髋变形和表情；这不是本轮已完成结果或生产授权。

App 证据入口为 `character_pipeline/sprout/v2/work/experiments/tripo-animation-trial-20260908/README.md`；
`task-ledger.json` 保存十二个任务记录，`evidence.json` 绑定模型、视频和保护资产哈希。
回放脚本 7/7 测试通过，行覆盖 84.39%；真实动作共渲染 610 帧，agent 抽查每段
首/中/末及原尺寸失败帧，没有进行逐帧完整认证。工具通过不等于自然动作通过。

### 8.0.11 CHANGE-031 H3.1 减面与原生人形动作复测

用户对上一轮建议回复“继续”，授权复用 H3.1 detailed 源任务进行有限减面、
人形 v1.0 + Tripo 原生命名绑定和五种预设动作复测，无需逐步骤再次审批。
smart v2.0 请求 20,000 面，实际输出 27,595 三角面，眼圈/嘴和叶片损伤明显；
因此按质量目标补一次 basic v1.0 / 80,000 面对照。后者输出恰为 80,000 面、
45,032 顶点，较好保留原始 1,977,636 面外形，被选为绑定输入。

Rig Check 返回 true/biped；显式 `v1.0-20240301 / biped / spec=tripo` 产生 41 骨，
含四肢 twist 辅助骨，与上轮 23 骨 Mixamo 不同。`preset:biped:idle/walk/run/jump/turn`
全部生成并完成 305 帧本地回放，解决了上轮接口兼容性失败。另渲染双侧四肢和头颈
22 个正负姿势、44 张前后侧图，以及 10 张动作细节原图。

局部左臂锯齿拉痕减轻，腿部动作较通用 rig 明确；但单独旋转大腿仍牵连远端背部，
跑步胸腹有明显折痕，跳跃背面肩部/髋腿交界皱缩。0 morph targets、无独立眼口控制。
因此本轮结论为“供应商处理链路成功，自然动作/表情未通过”。没有满足条件的身体
成品，未追加贴图或 RealityKit 验证；不替换正式资源、不建立 v002、不修改 S0/32 骨合同。

旧高精度 rig 的 20,660 组重合坐标未见大于 0.001 的组内权重差；在内存副本中
清除自定义法线也未修复抬臂腋下缺陷。这些是局部排除证据，不是完整根因证明。
下一步应以 basic 80k 与相同动作固定对照，检查肩髋骨骼位置、权重区域和连续性，
再决定局部蒙皮修整或关节重拓扑范围；表情需要独立制作。

两种减面 30+10、检查 0、绑定 25、动作 50，总计 115 credits；余额 305→190，
冻结 0，无充值。绑定下载的 TLS 失败通过已核实的同一 CloudFront CNAME 恢复，
保留 HTTPS 校验及原 Host/任务签名，没有再次创建绑定或动作任务。

App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-h31-native-rig-20260908/README.md`。
task-ledger 保存五个请求/实际消费；evidence 绑定模型、视频、姿势及保护文件哈希。
新增原生姿势工具先红灯后实现，3/3 测试通过，行覆盖 66/76（86.84%）；回放工具
复用前轮版本，未修改。七项保护文件、四张输入、源高精度模型和既有未跟踪路径
清单不变。agent 复核动作/姿势总览及选定原图，不宣称逐帧生产认证。

### 8.0.12 CHANGE-032 原生人形局部权重修整

用户批准固定 CHANGE-031 的 80k 模型修整肩髋权重和远端牵连，再以原五段动作
复测。本轮只做一次本地隔离修整，没有新增 Tripo 请求、充值或修改正式资源。
属于已授权 vendor capability trial，不建立 formal candidate，不执行 S0 assessor。

以同一 native-motions GLB 的 45,036 顶点、80,000 三角面、41 骨及五段动画为对照。
依据真实 rest 骨位限制远端影响，进行 8 次、系数 0.35 的局部邻接扩散，保持四影响。
共改变 8,435 个顶点、116,802 个皮肤属性字节；冻结区修改为零。POSITION、法线、
UV、拓扑、材质、rest/bind、动作和 JSON 字节完全不变，源哈希仍为
`2dfc6fc7e7076a4a5752f48089d377f4ce7f950a39fd7cf0a9ddc7148cbf198e`。

指定上部中央躯干区域的大腿族最大权重从 0.189981386 降至 0；相邻边 L1 权重跳变
超过 1 的数量从 74 降至 27，第 99 百分位 0.509489→0.429548，全局最差值未改善。
视觉上跑步/走路上胸腹折痕和选定肩/大腿姿势远端胸背牵连减轻。但左大腿 +30°
的下背/髋部仍折叠；转身中帧下腰出现更集中的连续折痕，跳跃肩腋及髋腿压缩仍在。
因此仅为局部改善，存在腰部退化，不将修整副本晋升为基准或宣称身体通过。

四影响截断前最大丢弃权重质量为 0.225453，也是后续局部诊断需检查的因素。
下一步应固定失败姿势，拆查骨盆、大腿、twist 贡献和截断影响，建立符合形状的
骨盆到大腿过渡，再判断是否必须调整骨位或局部拓扑。本轮未动骨位/拓扑，不能
据此认定重拓扑必需；不继续盲目全局平滑。身体合格后再制作独立眼口/眨眼控制。

渲染修整后 305 个动作帧、44 张姿势图，另从相同原始动作 GLB 拍 44 张原始姿势，
前后共 20 张动作细节图。时间采样、姿势参数一致；agent 检查总览、选定对比及
缺陷原图，未完成逐帧、全关节范围、自交、足底接触或 RealityKit 认证。
新增工具 TDD 7/7、行覆盖 210/238（88.24%）；它只证明修改范围与处理行为。
11 项保护文件、5 项原始模型/报告和既有未跟踪路径清单不变。消费 0 credits，
最后核实余额为 CHANGE-031 的 190，本轮未查询余额。

App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-local-weights-20260908/README.md`。
repair-report/evidence 记录数值、133 项非逐帧文件哈希及 305 帧分组摘要。
修整副本仅保留为诊断证据，原模型仍是固定对照，生产 32 关节合同与所有门禁不变。

### 8.0.13 CHANGE-033 放大审查与逐部位蒙皮精修

用户授权放大观察、逐部位修整，方法有效才进入下一项。本轮先固定腰部失败姿势，
再在腹部改善后试修膝部；均为本地 vendor capability trial，无新增 Tripo 请求。
原始 native 五动作模型继续作固定对照，不把加工中间态当成正式候选或区域验收通过。

同源原始 / CHANGE-032 四影响 / 截断前多影响的 18 张近景表明：原有腰部折痕
在多影响状态仍存在，四影响截断不是其主要解释。CHANGE-032 的 22.55% 是全模型
最大截断质量，腰部 2,398 顶点区域实际最大为 6.21%。新扩散方案受截断的影响更大，
不能混用两种判断。临时重算已变形网格法线也未消除主要折痕，未输出改法线模型。

验证五动作 604 个整数帧后，16 对 limb twist / 主骨蒙皮矩阵最大差 4.76837e-7；
仅在局部求解中合并经验证的等效影响，冻结行原样恢复，不删骨。此结论不覆盖新的
独立 twist 控制。合并后按骨名列计算的边 L1 跳变不能直接作为前后变形质量指标。

多轮有界消融中，扩散、等效合并、四主驱动约束均未修好腰髋。按骨位重建连续
Waist / Spine01 / 左右大腿场后，转身腹部锯齿明显减轻；仍有宽折痕与背侧臀腿折叠。
这一中间态修改 3,685 顶点、63,547 皮肤属性字节，编辑外权重行、几何、法线、UV、
骨架 rest/bind、五动作及 JSON 完全不变。SHA-256：
`43e1ab242ba8f55b83faa498fdea691448412bdca69d9dc13eff86bf138145a7`。

单独膝盖 +60° 可复现看似臀腿交界的折线，因此在腰部中间态上试修大腿/小腿过渡。
该试修修改 2,488 顶点、35,854 字节，跳跃背侧略平，但转身前侧新增折痕，未采纳。
后续从腰部中间态继续，下一项仍是定位膝盖驱动的折线三角面、表面权重梯度与旋转
中心；不继续仅按高度统一过渡，不据此断定必须重拓扑，也未证明改骨位能解决。

腰部中间态复测五动作 305 帧、22 正负姿势的 44 张双视角图；本轮共有 68 张局部
近景。agent 检查总览和选定原尺寸图；膝部试修发现退化后未再跑全套或扩到肩膀。
全关节、自交、足底、逐帧视觉、面部和 RealityKit 仍未认证。工具 TDD 11/11，
行覆盖 270/293（92.15%），不代表美术通过。19 项保护/输入、上一轮 133 个非逐帧
文件与 4,725 个既有未跟踪路径不变。本轮消费 0，最后核实余额 190，本轮未查询。

App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-region-refine-20260908/README.md`，
含放大前后图、未采纳膝部对照及五段同步视频。evidence 记录 148 项非逐帧哈希、
305 帧有序摘要；保留局部改善，腰髋与全身仍未通过，生产合同与资源不变。

### 8.0.14 CHANGE-034 膝盖折线表面定位与局部修整

2026-09-08 开始、2026-09-09 复核完结。延续用户逐部位修复的授权，本轮只处理
膝盖驱动的臀腿折线，所有产物为 vendor capability trial，没有新付费请求或正式候选。
固定左膝 +60°，屏幕射线命中 114 个原始三角面、246 个顶点，绑定静止坐标与权重。
可见邻域包含原处于上下腿不同高度的表面，屈膝后挤到一起；该采样不等于完整故障分割。

后侧降低小腿权重、转移到同侧大腿的试修修改 1,362 顶点、17,737 字节，区域外权重
与几何/rest/bind/五动作不变，四影响截断丢弃质量为零；折痕却向下转移且跳跃退化，
未采纳。临时左腿非邻接相交诊断：对照 30、该试修 64。临时双四元数为 7；
仅此姿势虚拟旋转中心后移 0.04 为 0、前移 0.04 为 208，均未消除可见锐利折叠，
不据此修改源骨架。相邻折叠不会被非邻接检测计入，零相交也不代表自然。

直接对原导入网格做局部 Corrective Smooth 产生新裂口（非邻接相交 134），拒绝。
临时按重合静止坐标连通 45,036→40,000 个点、保留 80,000 三角面，再绑定静止
修形，可消除该分离顶点引入的新裂口；映射回原顶点的静止最大差 2.98023e-8。
此代理没有转移 UV，法线重算，未导出 GLB，仅保存诊断 Blend。关闭/开启修形均
使用同一代理，双视角共 20 张 1000px 原图逐张复核：跳跃背侧明显变平，腹部既有
改善保持；左右单膝仍有凸点/折角，右腿外侧更尖，转身背侧也有集中折痕。因此本轮
膝部修复未通过，代理与唯一导出的后侧权重试修均不作为新加工基准。

临时左腿相交数量 30→10 仅为辅助诊断，原临时脚本未另存该左腿选面清单；
后续以明确序列化的 114 个原始面 ID 补充复核，命中邻域相交 4→0，仍不抵消上述
可见退化。精确判定复用项目三角面工具；不宣称全身自交、相邻面折叠或全关节通过。

本轮共 52 张近景、61 项私有产物哈希；工具 TDD 8/8，stdlib trace 行覆盖
189/203（93.10%，原始口径含虚拟行 0），只证明工具行为。22 项保护/输入、上一轮
148 项非逐帧证据与 305 帧有序摘要不变；4,725 个无关未跟踪路径清单不变。
发现退化后未再渲染整套五动作视频，未做面部、贴图、RealityKit 或生产资源替换。
消费 0，最后核实余额 190，本轮未查询。

下一局部项：仍从 §8.0.13 腰部 GLB 开始，先给左膝受压表面设计明确的目标形状与
按弯曲角度生效的局部补偿，验证 0/15/30/45/60° 的轮廓、体积、接缝、折角及插值，
有效后再看右侧和原动作。修正位移需映射回原顶点，静止补偿归零、远端点保持。
本轮尚未制作这一补偿，不再继续盲调平滑强度，也未证明必须重拓扑。

App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-knee-surface-20260908/README.md`，
含全 20 张代理原尺寸前后对照、拒绝理由、选面绑定与后续局部范围。腰髋、全身、
表情及生产认证仍阻塞；正式 S0/32 关节合同与原始参考不变。

### 8.0.15 CHANGE-035 左膝按角度局部补偿

2026-09-09 从 CHANGE-033 腰部 GLB 开始，制作左膝 Hermite 弯曲截面目标，
对比初始坐标掩码、缩窄过渡带、真实网格邻接上的 harmonic 位移边界。
三组均检查 0/15/30/45/60°、yaw 70/-110°，共 60 张 1000×1000 近景。
原会话停止于最后一组实图审核；接手后复核该组全部 20 张原图和前两组 4 张关键图。

最新方法减轻 30–60° 背侧横向锯齿折线，但内侧/下缘仍有细褶；15° 下缘相较
原始蒙皮出现新的细长折痕。缩窄过渡带的版本使 60° 内侧折角集中，不采用。
**左膝仍未通过**，三组只留诊断参考，不替换加工基准。尚未扩大到右膝、组合姿势
或原始五动作，也未认证连续角度插值和全网格体积。

最新掩码涉及 1,351 个源顶点、2,465 个选中面；45,036 个源点临时连通为
40,000 个代理点。60° 涉及选区的非相邻相交对 30→0，其他四档修前后均 0；
该指标排除相邻折叠，不代表自然变形通过。0° 补偿严格归零，所有五档冻结区域
位移为零，源顶点重合映射最大差约 1.39e-17。最大局部位移为 0.03352684 源单位。
代理无 UV/原材质转移，无修复 GLB、morph driver 或 RealityKit 交付；
保存的 Blend 只是末姿势静态诊断场景。本试验不改变 macOS 14 身体完整性约束。

工具 TDD 12/12、正数可执行行覆盖 189/206（91.75%）。新增异常回归发现
无固定锚点的独立活动组件可返回任意解，已改为明确拒绝；真实源模型
0/15/60° 的修后坐标与接手前逐元素一致。25 个输入/历史/正式资源保护项、
接手前 69 个产物、前两轮 209 项非逐帧文件和 305 帧有序摘要均不变；
4,725 个无关未跟踪路径清单不变。消费 0，最后核实余额 190，本轮未查询。

下一处仍是左膝：先解决 15° 下缘新增细褶，再复核 30/45/60°。
当前方法只约束边界位置，没有显式约束切向/曲率；下一次局部试验应验证原表面
切向过渡能否保持，此为待验证方向，不预先宣称有效。左侧稳定后再扩到右侧和原动作。
App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-knee-corrective-20260909/README.md`，
含 60° 改善与 15° 退化并排图、全部最新原尺寸链接、输入哈希、保全和测试证据。

### 8.0.16 CHANGE-036 左膝低角度与切向过渡

2026-09-09 沿用 CHANGE-033 腰部 GLB 和冻结的 CHANGE-035 五档源姿势、
Hermite 目标、掩码及顶点对应，试验包含相邻固定行的二阶边界位移求解。
使用静止边长倒数加权的归一化图 Laplacian，最小化其平方；这是边界斜率过渡的
离散近似，不是严格 C1 约束。本轮同时改变边权与求解目标，不能单独归因于阶数。

源姿势、上轮 harmonic、本轮二阶方法各生成 0/15/30/45/60°、
yaw 70/-110° 共 30 张 1000×1000 图，已逐张原尺寸审核。
**本轮不采纳，左膝仍未通过**：15° 下缘细长折痕仍在，45–60° 内侧凹折与
下缘褶皱未解决；保留了上轮对源姿势横向锯齿的改善，但没有证据支持本轮足够增益。
只留有界失败诊断，GLB 加工基准仍为 CHANGE-033 腰部中间态。

15° 背侧下缘射线采样命中 19 面、30 个代理顶点，其中冻结点 10、
过渡点 17、目标固定点 3；静止 z 范围约 0.01618–0.09211 源单位。
这只是可见褶皱邻域，不是完整故障分割或根因证明。
下一处以这组绑定为入口，检查目标位移跨固定边界的方向差，
重新定义能接回原表面的 15° 局部目标及支持区域，再复核 30/45/60°；
此步骤尚未实现，不继续以更换边界平滑算法作为本轮迭代。

掩码仍涉及 1,351 个源顶点、2,465 个面；源 45,036 点临时连通为 40,000 点。
本轮相较上轮最大位移：15° 为 0.00093465、60° 为 0.00461080 源单位。
60° 选区非相邻相交对为源/上轮/本轮 30/0/0，其余四档均 0/0/0；
该统计不检查相邻面折叠。五档冻结点位移均 0，最终 0° 坐标显式恢复为源姿势，
映射误差最大约 1.39e-17，相对求解残差均低于 1e-8，均不构成美术验收。

工具测试 5/5、正数可执行行覆盖 169/193（87.56%），包含独立稠密解对照、
固定边界/非法输入和真实 Blender 回归；覆盖率测试不渲染，30 图及场景保存另行执行。
30 项保护输入、前两轮 209 项非逐帧产物及 305 帧、CHANGE-035 的 73 项产物、
4,725 条无关未跟踪路径清单均不变；新 Tripo 请求 0，消费 0。
无 UV 转移、修复 GLB、driver 或运行时交付，未扩到右膝/原动作。
本试验不改变 macOS 14 身体完整性约束及正式合同。

App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-knee-tangent-20260909/README.md`，
含 30 张原图、下缘放大对照、采样、实测覆盖率及 36 个私有产物哈希。
剩余左膝目标/边界匹配由 @winston（AI 执行）于下次局部修整优先处理，
右侧、腰髋、全身、表情与生产认证仍未完成。
2026-09-10 CHANGE-037 已将后续顺序整理为 [膝部修复计划](./pet-knee-repair-plan.md)：
先定位原因，最多两版有依据的局部目标试修，验证连续性及交付可行性后才扩展。
无实质增益时按证据选择结构性办法；本次仅完成计划，未启动新试修或改变上述结论。

### 8.0.17 CHANGE-038 左膝原因定位与两版局部目标

2026-09-10 完成 P1、两版 P2 及一次内侧定向补查；本轮归档并选定下一种修法。
原会话两次服务端 524 超时后由新会话接手，复核现有产物，不重置试修预算。
所有产物仍为 vendor capability trial，左膝未通过，生产合同与正式资源不变。

下缘 19 面样本扩为 71 面后，确认固定边界处存在实际几何折角。
首版用 15–30° 连续角度增益保留小角度源姿势，但 25° 下缘折角仍达到 84.51°，
原图显示细褶重新出现，未采纳。第二版保持原目标与 harmonic 求解器，
仅将下缘支持带 .04–.065 下移至 .02–.035；额外涉及 327 个源点，
总支持区 1,678 点、3,079 选中面。没有叠加首版角度增益。

第二版同一 71 面邻域最大折角，15° 由旧 66.96° 降为 28.18°，
60° 由 128.54° 降为 72.59°；原图下缘长细褶减轻，内侧凹折仍在。
七档角度的冻结点位移为 0，静止严格一致；60° 源/旧/新非相邻相交 30/0/0，
其余档均 0。这些指标不代表相邻压折、全身自然变形或体积通过。
P2 用完 2/2，第二版仅保留形状参考，加工 GLB 仍为 CHANGE-033 腰部中间态。

内侧定向补查绑定 75 面、80 代理点、101 源点（6 冻结、73 过渡、1 目标点）。
60° 内侧最大折角源/旧/新/解析目标为 155.53/73.12/68.89/24.63°。
边 19555–21097、18480–19488 完全冻结，分别保留源折角 51.33°、44.81°；
其静止内侧上缘端点仍含约 19%–29% 小腿影响和 44%–48% 腰部影响。
过渡边 14745–15872 则由源 43.68° 被放大为 68.89°，不能混淆两类残留。

条件分支 S 首选内侧上缘局部权重修整：按已绑定源面及真实邻接声明范围，
核实实际蒙皮矩阵后重新分配局部小腿影响，保持范围外权重、几何、UV、骨位和动作。
区别于 CHANGE-034 的后侧统一降权，不复用其失败掩码，不叠加失败补偿。
该方法尚未实施，仍须同时改善大小角度并保住腰部成果；未证明唯一根因或必须重拓扑。
预算为首版加最多一次有依据修正，具体约束见 [修复计划 §7](./pet-knee-repair-plan.md#7-执行记录与当前接续点)。

首版 36 图、第二版 42 图、定位 6 图和一张辅助裁剪图已保存。原会话记录已审查
首版 30 张与第二版全部 42 张，接手独立复核 18 张原图，清单绑定于 evidence。
工具 11/11，模块行覆盖率 84.25% / 86.32% / 88.72%；接手验证代码哈希仍匹配
成功测试记录，未修改实现。35 项保护文件、318 个历史非逐帧产物、305 帧以及
4,725 条无关未跟踪路径均未变；新请求和消费均为 0。
无修复 GLB、UV 转移、driver、P3 完整连续性、右膝/原动作扩展或 macOS 14 交付验证。
App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-knee-target-20260910/README.md`；
111 项私有产物及工具哈希、下缘与内侧测量、选路依据见 `evidence.json`。

### 8.0.18 CHANGE-039 内侧上缘局部蒙皮首版判定

2026-09-10 完成 S 首版及接手归档。源为 CHANGE-033 腰部 GLB，按真实邻接限定
140 个连续代理点，修改 183 个源点、2,057 个蒙皮字节；小腿影响按已有同侧大腿/腰部比例重分配。
未合并 twist 影响，几何、UV、骨位/rest/bind、动作及范围外权重保持不变。
七档 0/15/20/25/30/45/60°，加转身 47 帧、跳跃 27.5 帧，均来自实际 GLB 重新导入。
原 51 图及 8 张选区跟随补拍保留，本次独立复核其中 22 张 1000×1000 原图。

三条目标边的 60° 折角由 43.68/51.33/44.81° 降至 3.55/7.88/1.54°；
横向边 12391–12943 却由 155.53° 增至 159.51°，30–60° 原图横向压折仍在。
转身边 18480–19488 由 31.93° 增至 166.19°；本轮选区非相邻相交由 0 增至 19 对。
相交绑定到 20 面、23 代理点、28 源点，掩码 0.50558–1.0，全部位于编辑区内。
跳跃相交 7→6 不构成通过；相交统计范围比 P2 小，不跨轮直接比较数量。

这些结果否定首版作为加工模型，尚未证明特定接收比例或局部布线是唯一原因。
当前没有能同时解释横向折线及动作退化的单因素第二版依据，因此本轮比例分配配方结束。
S 已用 1/2、第二次未启动；P2 保持 2/2，不重置预算、不扩到 P3/P4。
下一步 DCC 制作需以绑定面片形成 15°/60°/转身/跳跃共同约束的压缩表面、轮廓及固定边界，
再提出有依据的局部权重方案；具体交付要求见修复计划 §8 和 App README。
不据首版失败宣称必须整体重做或更换骨架。首版 GLB 只保留诊断证据，腰部 GLB 继续作为输入。

范围外采样坐标差、接缝差、源/首版骨矩阵差均为 0；静止最大坐标差约 2.98e-8。
LBS 与 Blender 实际位置最大差约 1.46e-7；每点最多四个影响。
已有工具 8/8、覆盖率 100% / 91.87%，接手核实源码与成功日志一致，未改算法。
50 保护项、前轮 111 私有产物和 11 工具/文档、此前 318 产物、305 帧及 4,725 无关路径未变。
新增请求与消费 0；没有连续角度/完整动作回归、UV 代理转移、运行时 driver 或 macOS 14 交付验证。
正式合同与资源保持不变，原会话 HTTP 524 中断不作为形状失败依据。
App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-inner-skinning-20260910/README.md`；
82 项私有产物、原图审查清单、失败区域绑定及保全实测见 `evidence.json`。

### 8.0.19 CHANGE-040 四姿势牵引分析与检查场景

2026-09-10，沿用既有 S1/P2 数组，不创建新权重、修复 GLB 或目标形状。
固定 S1 减重、选区和组内比例后，15°/60° 大腿与腰部有效牵引位置最大差为 2.52e-8，
接收比例两端的最大位移跨度为 7.62e-9；转身/跳跃则为 0.0316323/0.0165869。
四姿势线性分解与 S1 实测最大坐标误差为 6.85e-8。因此单改接收比例不足以修复单膝横折，
但不能外推为所有权重修正或现有拓扑不可行。S 第二次未启动，P2 2/2、S 1/2 保持。

`constraints.blend` 有 10 个静态网格：四姿势源/S1，加两档拒绝 P2 对照；无 rig、modifier 或 shape key。
140 编辑点、23 转身失败点、横向边两点、51 相邻冻结点和 20 失败面均可直接选择，
完整源/代理映射、逐点牵引、面面积/法线与跟踪位置另存 NPZ/JSON。编辑区外全部点保持冻结。
20 张匹配镜头的 1000×1000 原图全部复核：60° 横折仍在，P2 内侧压折仍未合格；
动作有遮挡，不据小幅外观变化判定相交消失。本轮没有重算相交或完成连续动作回归。

工具 8/8，通过行覆盖 100% / 98.34%；143 保护输入、前轮 111 私有产物及 11 工具、
此前 318 产物、305 帧和 4,725 无关路径均未变。源与正式资源保持不变，消费 0。
尚缺四姿势可接受的轮廓/压缩目标及能解释 60° 横折改善的统一减重场；检查材料不代表修复方案已完成。
具体制作接续见修复计划 §9。无新架构/依赖、UV 转移、运行时 driver 或 macOS 14 交付验证。
App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-knee-pose-constraints-20260910/README.md`；
29 个私有产物、8 个工具/文档及逐项审查哈希见 `evidence.json`。

### 8.0.20 CHANGE-041 D1 四姿势局部目标

2026-09-11，完成一组依据真实边界拟合的 32 点 Bezier 位移笼目标。
630 连续代理点对应 793 源点，1,410 面、152 相邻冻结点；范围外坐标差为 0。
比 S1 多 490 个代理点，仅扩大目标制作范围，未变更原权重或 GLB。
四姿势共有 8 个静态网格、4 个控制笼、完整映射/控制点/原图，16 张 1000×1000 图全部复核。

15° 相交 0→0；60° 相交 30→0、>60° 折角边 135→13，但宽台阶与内侧压折仍在。
转身 68→57 含 10 对新增相交，绑定到 8 个大腿上缘面与 7 个固定左手面；
跳跃 23→22，折痕转移成宽脊和内侧凸起。不能只看总数改善；D1 目标组不采纳。
相交统计覆盖本轮 1,410 面，不能与 S1 小范围数字直接比较。

原非零骨集合、固定 rest/bind 下，合法统一蒙皮 RMS 误差下界 0.00612566，
是 D1 所需位移 RMS 的 72.5%；源姿势控制 RMS 仅 1.75e-8，数值截断方向已保守扣除。
这是针对该组目标的表达限制，不否定其他合理目标或证明必须重拓扑。没有生成拟合权重。
D1 保留失败/制作材料，结束当前控制笼办法；P2 2/2、S 1/2，S2 未启动。
下一项定点制作须纳入固定左手的活动净空，并处理 60° 台阶和跳跃转移折痕，详见修复计划 §10。

工具 10/10、行覆盖 97.37% / 98.64%；181 输入保护项、历史产物/305 帧及 4,725 无关路径未变。
无新增付费、原资源替换、UV/rest/bind 迁移、driver、P3/P4 或 macOS 14 交付验证。
App 入口：`character_pipeline/sprout/v2/work/experiments/tripo-knee-authored-targets-20260911/README.md`；
39 私有产物、8 工具/文档与完整审查/保全见 `evidence.json`。

### 8.0.21 CHANGE-042 D2 定点编辑

6 笔固定顶点操作共涉及 96 代理点 / 123 源点；实际为后台脚本点位编辑，非交互雕刻。
D1 范围及范围外冻结保持不变，15° 保留 D1 目标。60° 尖折边 13→21，
转身相交 57→64，原 D1 新增 10 对手部接触消失但产生 7 对新的大腿自身相交；
跳跃宽脊/折痕仍在。8 张 D2 原图已审查，8 张 before 图与 D1 已审查图逐像素相同。

合法共同蒙皮误差下界为所需位移的 73.07%。全部 41 原骨在 60° 的 y 变换跨度约 1e-7，
无法以非负归一化权重复现本轮 0.004 的横向推拉，扩大原骨集合也不能解决该位移。
不否定其他自然目标或判定必须重拓扑；本轮没有输出权重。
D2 拒绝晋升，结束此点改方案；S2 未启动，P2 2/2、S 1/2 保留。
仍缺可实现的自然目标，需要角色制作人员完成造型判断；确切失败面、调整边界和
UV/rest/bind/布线迁移成本见修复计划 §11 及 App 实验 README。
229 保护输入、历史产物/305 帧与 4,725 无关路径未变，工具 6/6、覆盖 96% / 100%。
0 credits，无源/正式资源替换、架构或依赖变更，P3/P4 和生产认证未执行。


### 8.0.22 CHANGE-043 计划重排（实施结果见 §8.0.23）

用户要求先重新定计划。当前执行入口改为修复计划 §12：
源矩阵/原权重的共同可达方向检查 → 固定一个联合权重方案 → 条件性 S2 → 连续性与交付。
AI 继续执行，人工协作是可选资源，不是已经证明的必要前提。
D1/D2 失败事实和历史证据不变，旧“先分别制作合格曲面再求权重”的接续顺序由新计划替代。

新目标由同一份非负归一化原骨权重在各姿势下生成，不再拟合 D1/D2 静态坐标。
S2 前检查源重建、连续选区、固定左手/边界和合法调整方向；合格形状在 S2 中实际检验，
不声称未求解就已证明一定可行。首次求/试新权重（含内存预览）即计 S2；
仅一套区域/骨集/目标、一个源起点，最多 200 次外层迭代或 30 分钟求解，先到即停。
P2 2/2、S 1/2 不重置；通过四姿势才进入未参与求解角度、连续动作与隔离交付核对。
失败记录确切约束/面片及结构调整成本，不自动加版、不直接判定必须重拓扑或人工接手。
本轮只修订文档，未运行分析/试修、未生成权重/目标/GLB，未改 App、私有证据或生产合同。


### 8.0.23 CHANGE-044 共同方向检查与一次 S2

A/B 已实施，源五姿势缓存差 0，原始 LBS 最大误差 1.45955e-7，接缝源行完全一致。
连续选区为 998 代理点 / 1,224 源点，614 核心、384 过渡、202 固定邻点；
原骨非负支持内存在三折叠姿势共同下降方向，左臂/手及范围外冻结。
固定一个共同几何目标后登记 S2：200 次外迭代、298 次内部线搜索，约 10.3 秒到达上限。

固定 2,383 面 / 3,708 边上，60°/转身/跳跃尖折边分别
142→44、136→17、103→28，但新增相交 5/1/8 对，原图仍有深横折与内侧折回。
60° 最坏边 21205–21576 仍达 177.82°；新增后膝相交围绕面 49736 和
49071–49179，跳跃涉及固定中线与可编辑内腿。新增对未涉及左手。
24 张原尺寸近景/补充侧图已审查；初次宽镜头只作留档，修正相机未重新求权重。

**S2 拒绝，S 2/2、P2 2/2；D 未执行，左膝仍未修好。**
真实 Blender/预测最大误差 1.45955e-7，固定坐标差 ≤1.49012e-7、接缝 0；
范围外权重字节及源几何/UV/rest 骨矩阵/动作指纹相同，隔离 Blend 重开已核对。
14/14 工具测试，四模块覆盖 95.52% / 98.53% / 95.95% / 98.13%；
272 保护输入、历史档案/305 帧及 4,725 无关路径未变，0 credits，无正式资源替换。
App 提交 `4560188`；78 私有产物、15 工具/文档由实验 evidence 绑定。

平均折角目标和试后碰撞筛查未达到自然形状要求；200 次上限不代表收敛或不可行。
下一项是含极端折回/碰撞约束及收敛退出标准的方案设计，预算待另行确定，
不视作自动批准的 S3；无充分证据要求扩大边界/骨集、改 rest/骨位、重拓扑或人工接手。
确切失败 ID 与迁移成本见修复计划 §13 /
App `character_pipeline/sprout/v2/work/experiments/tripo-knee-shared-skin-20260911/README.md`。

### 8.0.24 CHANGE-045 约束求解实施单与只读清单

新实施单已落档至修复计划 §14，求解器尚未实现，未生成或试用新权重。
固定 3,708 比较边中，3,398 边涉及可编辑顶点、310 边完全冻结；
202 边的边端点冻结但邻面的第三点可变，分类须读取两面全部顶点。
跳跃原有 7 条尖折边完全冻结，最大 154.11°；S2 可编辑部分仍有 21 条尖折边，
最大 133.47°。这细化数值约束范围，不撤销 S2 拒绝或降低全范围原图要求。

下一实现采用同一原支持权重场，先恢复涉及可编辑面的 184 个姿势相交对，
再压低最坏折角；每步通过连续碰撞检测保护原分离对和已恢复对。
双方冻结的 28 个上下文相交保全并列为未解决项。先完成合成/只读测试及
7 条冻结折边的原图定位；若固定折边属于必须消除的可见膝褶，先修订范围，不能启动原范围试修。
离线 QP/CCD 适配、许可证/版本锁定、收敛/停滞判定均须在首次新权重前完成。

提案为另增一次试修：最多 200 接受外步、400 外层尝试或 30 分钟，先到即停；
两阶段共用预算，新额度尚未确定。P2 2/2、S 2/2，D 未启动，无新费用/依赖安装/源替换。
本轮五姿势源/S2 指标核对一致，95 个输入前后哈希一致；完整清单与查询脚本只读归档。
App 保持提交 `4560188`，不把方案或查询运行记作求解器实现/造型通过。

### 8.0.25 CHANGE-046 冻结折边定位与约束准备

> 以下保留 CHANGE-046 当时状态；后续工具及 C1 结果见 §8.0.26。

24 张源/S2 形状对照确认：七条冻结边构成可见内侧折回，与后膝横折不是同一组面，
但属于内侧压折要求。原范围冻结目标冲突成立，不能按 §8.0.24 原范围直接试修。
四张未标记主视图与上轮逐像素一致，低视角补足原主/侧视图遮挡。

单一连接带提案增加 41 代理点 / 65 源顶点，998 / 1,224 扩至 1,039 / 1,289，
保留原区连通、右侧/左手/上腹冻结及原骨支持；4 张选区图仅着色未改源。
七条目标边都有可编辑角点，但下部内侧的腰髋外观影响仍须后续四姿势验证。
提案比较范围 2,460 面 / 3,824 边，未改源 R 清单 188 个姿势相交对、固定上下文 24 对。
另有三条固定尖折全部在右侧，保留上下文；原支持的非零方向不代表共同可行性。

App `e20016f` 已实现遮挡/只读范围工具与折角、分隔松弛及原支持数学模块；
18/18 测试，三个模块覆盖 95.73% / 97.80% / 100%。完整 QP/CCD 适配和 R/F 求解器未完成，
没有求或试新模型权重；28 张图等 45 私有文件及 11 工具/文档由 evidence 绑定。
369 保护输入、4,725 无关路径未变，0 credits，无依赖安装或源/正式资源替换。
下一入口为修复计划 §15.4，新增试修额度仍待具体工具和范围/参数完成后的登记。
P2 2/2、S 2/2，D 未启动，生产仍阻塞。

### 8.0.26 CHANGE-047 受控求解器与 C1 退出

> 本节为 C1 当时记录；后续首个 QP 验证已完成，见 §8.0.27。

App `bc26252` 实现 2,795 个原支持共享权重变量、188 组源相交分隔恢复、最坏折角优化、
IPC 连续碰撞和 R/F 共用预算；采用 §8.0.25 的 1,039 / 1,289 点单一区域。
41 项不同测试通过，六模块行覆盖 96.20%～100%；源/S2 静态回归及完整历史更新路径通过。
冻结点权重雅可比为零，0° 原支持跨度 4.361594056e-8。实际原图和腰髋保护仍是造型门禁。
依赖在独立 Python 环境按版本/哈希锁定，附带许可证归档，不进入 App 运行时。

用户继续指令下登记一次 C1，先冻结实现/输入/参数，200 接受外步 / 400 尝试 / 30 分钟共用预算。
真实结果为 R 的第一个 QP 达到 5,000 内迭代上限，`qp_failure`，1 次尝试、0 接受步、18.108 秒。
OSQP 报告的行缩放问题 primal / dual 残差为 4.740715436e-6 / 5.369823893e-4，
尚未进入独立原单位残差复算；没有生成替换权重、进入 F 或 D，也没有新的造型通过结论。

只读重建首个子问题（没有再次求解）确认零步违反量 2.220446049e-16、Hessian 对角为正。
当前记录不是不可行证书；系数尺度差异仅是待验证原因。失败未保留 x/y 和逐行残差，
下一项先补失败诊断及等价缩放合成验证，再独立登记首个 QP 回放，具体见修复计划 §16.3。
426 保护输入、4,725 无关路径未变，0 credits，无源/正式资源替换；P2 2/2、S 2/2、C1 1/1。

### 8.0.27 CHANGE-048 首个 QP 独立验证通过

> 本节为 Q1 当时记录；完整 C2 的实际结果与范围冲突见 §8.0.28。

App `f404f74` 实现完整失败向量留存、原单位残差、等价缩放及锥表示，27 项合成测试通过，
三模块覆盖 99.27%～100%。只读重建矩阵/目标/边界与 C1 原输入逐项一致。
固定 Q1 的两次调用中，原 OSQP 配置再次在 5,000 内步超限；Clarabel 在 30 内步 / 2.226 秒返回 Solved。
独立原单位 primal / dual 为 5.915431190e-18 / 1.444714593e-13，最大逐行互补性 9.115855041e-15，
乘子符号违反为 0，均满足 1e-7 门槛；另算原目标与对偶下界间隙 2.058461154e-11。

这确认第一个固定凸子问题可解，尚未验证后续 R/F、CCD 接受或自然造型。
QP 方向未应用模型，C1 仍为 0 接受步，D 未启动。下一项见修复计划 §17.3：接入新的 R/F 边界、
完整流程回归与冻结完整试修预算。539 历史文件 / 565 登记绑定 / 4,725 无关路径未变；0 credits。
Clarabel 及新增传递依赖只用于独立本机诊断，许可证/构建配方已归档，正式资源和合同不变。

### 8.0.28 CHANGE-049 完整接入通过，C2 恢复与造型拒绝

App `f6b4d68` 冻结新 Clarabel R/F 路径，29 项测试通过，原首个 QP 与 Q1 完全一致。
C2 1/1 按共同预算执行，23 QP 全部 Solved（27～30 内步，四类原单位残差最坏 ≤4.31e-13），
23 接受步 / 901.502 秒后在 R 停滞；最大恢复松弛下降 33.1056%，仍有 0/28/99/59 个恢复相交对。
没有进入 F 或 D，不能以子问题求解成功声明修复完成。

最终接受权重经 Blender 实测保持原支持、接缝、静态结构和动作，区域外权重字节不变；
20 张原图审查仍有膝后横折/凹口和转身拉伸折痕，C2 拒绝，仅保留隔离诊断。
全比较没有新增相交对，但转身最大折角增至 179.0719°，跳跃 >60° 边数 121→122。

追加固定子特征检查及快照输入验证共 10 项测试通过，两模块覆盖 100%。
精确有理数和 Blender 源坐标确认 6 处固定边穿过固定左手面，源到最终 C2 见证不变。
此前“面含可编辑点”的预检不足；当前冻结范围不可能完成零松弛/正净空恢复。
只读补 10 个端点仍留 6 个其他穿越；跳跃面 63174/76967 在旧 Hip 高度边界和手部冻结同时保留时不能解除。
下一项先重建完整膝—髋接触区域与有界保护边界提案，见修复计划 §18.4；不自动 C3，不替换源/正式资源。

### 8.0.29 CHANGE-050 全源接触闭包与有界保护提案

全源五姿势共 2,563 个相交对、5,126 个严格边—面见证，缓存/仿射 LBS/Blender 源坐标一致。
旧整臂冻结掩码、保留全部旧编辑区及清除全部受影响源相交的组合排除旧范围 46 点；
这不是这些点必须移动或模型整体无解的证明。只扩大髋部及有限躯干例外均仍有固定穿越。

最终只读提案为 2,189 代理点 / 2,690 源点，保留原 1,039 点，新增 1,150 点。
显式解除旧整臂保护中 925 点，范围到左躯干/腋下/肩臂/前臂接触带；
掌指掩码 1,909 点、右侧及范围外继续冻结，原骨支持/rest/bind/五动作保持。
源面 56269/56413 的静态相交可达净空上界仅 8.856e-8，低于 5e-6；
它们的顶点留在固定范围，全源遗留记录保留，不因此丢掉原 188 对恢复目标。

最终恢复清单为 0/30/463/1,007，共 1,500 对。固定子特征和原支持净空必要检查通过。
已准备新增点最大 0.01 源单位、0.012 边距离衰减的位移约束；原膝折角门槛保持，
新增接触区按 max(60°，逐边源值) 保护。源高折角和全身遗留相交仍明确保留，不能算通过。

31 项测试（26 合成、5 真实只读）通过，五模块覆盖 96.30%～100%；最终 16 张全身原图已检查。
987 输入和 4,725 无关路径保全，无新权重、费用或 C3。下一项是完整 R/F 适配、位移/折角/CCD 联合检查
和规模验证，详见修复计划 §19.4；当前仅为范围及保护提案，生产合同不变。

### 8.0.30 CHANGE-051 完整有界流程与 C3 拒绝

2,189 点范围、13,800 行位移盒、逐边折角硬保护及 1,500 对恢复清单已接入完整 R/F。
严格逐行拒绝任何正的位移盒越界；旧膝门槛不变，新增区使用相同仿射源坐标的逐边源值，
缓存/仿射坐标导致的起点误报单独留档。40 项测试通过，七模块覆盖 94.12%～100%；
真实源完整组装、导数、源接触及静止 CCD 准备通过，见修复计划 §20.1–20.2。

实现 `9ac8b58` 冻结推送后执行唯一 C3，登记绑定 1,153 文件。8 个 QP 均 Solved 且四类
原单位 KKT 通过；7 接受步后 `time_limit` 停在 R。实际 1,833.035 秒，最后同步核验跨过
1,800 秒截止点，截止后未接受步或新开 QP；时间检查粒度不足明确保留。
最大恢复松弛仅下降 0.537824%，总松弛略升，1,500 对原相交全部残留，没有新增相交。
F/D 未进入；快照只存隔离目录，C3 1/1 消耗，不自动 C4。

40 张原尺寸 Blender 图已检查，60°、转身、跳跃的深折/褶皱仍在，造型拒绝。
静态指纹、原支持、范围外权重、rest 与接缝通过，实际位移盒无越界。
原权重等值重写对照证明操作顺序可产生微小几何差；按同操作顺序比较后，范围外坐标差为 0，
新增区折角在转身/跳跃仍超限 0.0001637999204 / 0.0000951922790 rad，不能按 1e-6 门槛放行。
原报告与对照均保留，未修改生产门槛。C3 的仿射保护通过不能替代实际 Blender 验收。

冻结方向分析发现临近接触 CCD 截短步长，近切向折角方向的正二阶余量继续触发回退。
下一项先验证非线性修正、临近特征约束、提前硬拒绝与 Blender 可表示精度，详见修复计划 §20.5。
尚无扩大范围下的共同可行/不可行证明；不要求转人工，也不以测试通过宣告模型修复。

### 8.0.31 CHANGE-052 接触漏检修复与源清单重建

固定 C3 方向准备发现：转身面 56752/56985 实际在源中严格相交，旧谓词却判作分离。
两面的 Gram 行列式约 9.00e-11 / 8.83e-11，低于旧固定 1e-10 退化判据；
两份精确有理数见证确认穿越。§8.0.30 中“临近接触”对该面的分类更正，旧证据保留。

新隔离严格穿越筛选使用逐运算向外舍入与精确回退，保留旧包围盒、邻接及接触/共面阳性。
全源缓存、仿射和同操作 Blender 三套坐标复扫的接触 ID 一致；按姿势共补回 54 条，
其中编辑范围内 34 条。新恢复清单为 0/30/476/1,028，共 1,534，旧 1,500 条全部保留。
新增项未发现完全冻结的相交子特征，尚非联合可行证明。范围、原支持、掌指/右侧、位移/折角保护不变。

49 项测试通过，八模块覆盖 91.97%～100%；新源 R/F 组装为 105,354/134,216 行 ×13,578 列，
最大归一化导数误差 2.9093e-6，R 源硬违反 2.22e-16。源相交尚未恢复，F 不可进入。
同一冻结方向的 CCD 安全比例从 0.00541449 提升至 0.03492916，只证明错误限位解除。
仿射和 Blender 的 C3 终点复扫均仍有全部 1,534 条源相交，没有新增或移除，造型拒绝保持。

候选提前硬拒绝、逐姿势时间检查及合成非线性修正已验证；模拟 float32 权重和坐标仍会漏判
34/27 条转身/跳跃实际折角失败，不能替代 Blender 验收。K1 未登记，无新真实模型 QP 或 C4。
下一项按修复计划 §21.5 核验新增接触可达性、接回完整流程和实际精度；生产合同及正式资源保持。

### 8.1 Rig Gate 0：结构、绑定与静止状态

只有 `open_five_s0`、由其派生的 `closed_static_identity` 和用户静态审核均通过、固定 32 关节合同已重新应用且首版权重已生成后，才执行本门禁。

自动检查：

- 输入哈希、Blender 版本、导出脚本版本和随机种子已记录。
- 32 个导出关节名称、父级、顺序、bind/rest 矩阵与合同完全一致。
- 无控制骨、约束、driver、负缩放、非单位关节 scale、NaN 或无穷值进入导出文件。
- 主身体为一个连续组件；其余组件全部在 allowlist 中。
- 语义拓扑邻接图只包含第 4.3 节允许的解剖边；非解剖直连、内部封口、重叠壳和不可见自交为零。
- A-pose 中非相邻表面净空满足第 4.3 节要求；头、躯干、前臂和手之间没有接触或相交。
- 肩/腋下/肘部的闭合环数量、边流方向、顶点价数与极点位置通过结构化拓扑审计；临时变形探针通过肩抬、肘弯和前臂旋转检查。
- 手部局部身份、UV 翻折、可见 seam 和颜色连续性通过独立门禁；不得用非重建区域的全局平均值掩盖局部失败。
- 权重数量、归一化、区域隔离和未使用骨组检查通过。
- 三角形退化、翻面、非流形边和未声明内部几何为零。
- A-pose 八方位基准图与身份参考在轮廓、材质和比例上通过人工审核。

### 8.2 Gate 1：关键语义单关节

先测试所有主要关节的真实动作范围端点：

| 部位 | 必测范围 |
|------|---------|
| Hips/三段躯干 | 前后屈、左右侧屈、左右旋转 |
| Neck/Head | 俯仰 `±25°`、侧屈 `±25°`、转头 `±45°`，并测试颈头分配 |
| Crown/叶片 | 前后摆、左右摆和受限扭转 |
| Shoulder | 抬肩/沉肩、前伸/后收 |
| UpperArm | 前举至 `120°`、外展至 `135°`、后摆 `30°`、轴向旋转 `±60°` |
| LowerArm | 肘屈 `0°–120°`，不得反向过伸超过 `5°` |
| Forearm/Hand | 前臂扭转 `±60°`、手腕屈伸 `±45°`、偏摆 `±25°` |
| UpperLeg | 屈髋 `90°`、后伸 `30°`、外展 `45°`、内收 `20°`、轴向旋转 `±35°` |
| LowerLeg | 屈膝 `0°–120°`，不得反向过伸超过 `5°` |
| Foot/Toe | 踝背屈 `25°`、跖屈 `40°`、内外翻 `20°`、前脚掌弯曲 `35°` |

角度是认证边界，不代表每个产品动作都要达到该幅度。左右肢体必须对称执行，不得只验证当前计划使用的右手。

### 8.3 Gate 2：全关节局部轴压力矩阵

- 对全部 32 个导出关节执行局部 X/Y/Z 正负探针；`DEF_Root` 验证整体平移/旋转且不改变角色比例，其余关节使用不超过 Gate 1 语义范围的筛查角。
- 每个探针从 `0° / 45° / 90° / 135° / 180° / -135° / -90° / -45°` 八个真实相机方位输出原尺寸图。
- Gate 1 未全部通过时不得执行 Gate 2。

### 8.4 Gate 3：组合极限姿势

至少包含：

1. 左右单手挥手峰值，前臂近似与站立身体平行，头部向反侧协调避让。
2. 双臂上举伸展。
3. 左右跨体触碰。
4. 双手叉腰。
5. 躯干前屈、后伸、左右侧弯和左右扭转。
6. 左右高抬腿。
7. 深蹲最低点。
8. 走路 contact/down/passing/up 四个关键姿势。
9. 跑步 contact/passing/flight 关键姿势。
10. 头颈六动作峰值与叶冠跟随。

每个组合姿势均执行八方位原尺寸审核。组合门禁用于发现单关节正确但多关节叠加后出现的肩背断层、腹股沟塌陷、头手穿透和脚底漂移。

### 8.5 Gate 4：动作逐帧审核

- 候选动作按 `30 fps` 的每一帧输出八方位图；不得只截首、中、末关键帧。
- 单张审核图角色可见高度至少 `1600 px`，透明背景另提供中性灰检查版本。
- 接触表只用于导航，不作为细节验收证据。AI 必须逐张打开原图检查腹部、背部、肩、腋下、髋部、颈部、脸部、手头间距和脚底。
- 任一帧出现裂缝、非设计褶皱、远端拉扯、轮廓跳变、法线闪烁、意外穿模或脚底滑动，整个候选退回 DCC 修正。
- 挥手还要检查 anticipation、快速举手、手腕往返、follow-through 和自然收回，不能只有抬臂再放下。

### 8.6 自动指标与人工结论

自动工具至少报告：

- 非法 influence、跨区域权重、三角形翻转和未声明组件数量。
- 每个区域的位移、边长变化和体积变化分位数，用于定位异常帧。
- 手/头、手/躯干、双腿等非预期组件碰撞；发布动作不允许未声明穿透。
- 脚接触窗口内的世界空间滑移。

自动指标用于发现问题，不能替代原尺寸视觉审核。没有碰撞不代表蒙皮正确，缩略图看不出问题也不代表通过。

---

## 9. 坐标、单位与导出合同

### 9.1 DCC 坐标

- Blender：右手坐标，`+Z` 向上，角色正面朝 `-Y`，`+X` 为角色右侧。
- 场景单位：Metric，Unit Scale `1.0`，1 Blender unit = 1 meter。
- 角色脚底落在 `Z = 0`，`DEF_Root` 位于世界原点，角色中心线为 `X = 0`。
- 所有 mesh 和 armature object transform 在导出前应用，location/rotation 为零，scale 为一。

### 9.2 RealityKit 坐标

发布资产统一为 `+Y` 向上，角色正面朝 `+Z`。坐标转换只能由固定导出脚本执行一次，运行时不得为 Rig v2 再叠加历史 Z-up 修正。

### 9.3 候选目录

后续实施阶段在 App 仓库创建隔离目录：

```text
character_pipeline/sprout/v2/
├── source/              # DCC master、输入哈希和纹理
├── contract/            # 版本化机器合同；阈值单一真源
├── handoff/             # 当前执行说明与不可变历史归档
├── work/experiments/    # route/scoped WIP/formal candidate 隔离工作区
├── actions/             # 动作源与 manifest
├── build/               # 可删除的 GLB/FBX/USD/USDZ 中间产物
├── review/              # 门禁报告和原尺寸审核证据
└── release/             # 经批准的不可变发布 manifest
```

`build/` 和临时截图不作为源资产；`source/`、`contract/` 和 release manifest 必须备份并版本化。大文件存储策略确定前不得删除上一份可恢复 DCC master。

### 9.4 发布 manifest

每次导出记录：

- `characterId`、`rigVersion`、候选版本和审批状态。
- 源 GLB、DCC master、脚本、纹理和输出文件 SHA-256。
- Blender 完整版本、Apple SDK 版本和导出参数。
- 有序骨名/父级/bind 的 `skeletonContractHash`。
- 顶点、三角面、组件、材质、贴图、influence 统计。
- clip ID、时长、sample rate、事件和动作源哈希。
- GLB/FBX/USDZ/RealityKit 各门禁结果及证据目录。
- 若使用 licensed basemesh：source intake、原始 artifact/topology、许可与
  attribution hashes，以及衍生修改说明。

仅 byte hash 不足以证明格式往返正确；同时保存不受容器时间戳影响的语义合同哈希。

---

## 10. Blender 与 Apple 往返验证

### 10.1 固定环境

- Blender：`4.3.2`，路径 `/Applications/Blender.app/Contents/MacOS/Blender`。
- 批处理使用 `--background --factory-startup`，只显式启用所需内置 add-on。
- 脚本必须校验 Blender 主次版本，不匹配时快速失败。
- 随机过程固定 seed；三角化、采样率、纹理打包和坐标转换参数写入配置。

### 10.2 格式矩阵

每个可发布候选生成并检查：

| 路径 | 用途 | 必查项 |
|------|------|-------|
| `.blend` → GLB | 结构交换与诊断产物，不作为 Apple 发布输入 | 网格、材质、32 骨、bind、权重、动作采样 |
| `.blend` → FBX → 隔离重导入 | DCC 兼容烟测 | 骨名/层级、单位、静止姿势、动作关键帧；不作为主输入 |
| `.blend` → USD | Apple 主发布中间格式 | UsdSkel、材质、动画和可选 blend shape |
| USD → USDZ | App 发布包装 | `usdchecker`、资源完整性、无绝对路径 |
| USDZ → RealityKit | 最终运行时真相 | 加载、骨序、姿势、材质、动画、截图和性能 |

往返文件只进入临时隔离场景。禁止把 FBX、GLB 或 USDZ 重导入后覆盖 DCC master，以免累计坐标、法线和权重损失。

### 10.3 最小往返实验结果（2026-08-12）

实验使用 1 米连续网格、`TestRoot → TestMid → TestTip` 三骨链、`30 fps / 1 s` 动画和 `TestBulge`，结论如下：

| 路径 | 结构结果 | RealityKit 结果 | 判定 |
|------|----------|-----------------|------|
| Blender → GLB → Apple USDZ | Apple 导入将骨路径改为 `n2/n1/n0`，丢失 `TestBulge` | 可加载且时长为 1 秒，但中间骨实测峰值为 `0°`，无 shape 组件 | ❌ 不作为发布路径 |
| Blender → USD → USDZ | 保留三骨名/层级、bind/rest、31 个关节与 shape 采样 | 中间骨峰值 `35.000006°`，shape 播放 `0 → 1 → 0`；macOS 15+ 静态写入 `0.25` 可原值读回 | ✅ Rig v2 主发布路径 |

两条 USDZ 均通过通用 `usdchecker` 和 `usdchecker --arkit`；最终发布从 Blender 原生 USD 打包 USDZ。GLB 只作为结构交换、独立诊断和跨工具对照产物，不再作为 Apple 发布输入。

机器证据位于 App 仓库 `character_pipeline/sprout/v2/reports/roundtrip-report.json`，人可读结论见同目录 `roundtrip-report.md`，复现入口为 `tools/pet-model/rig_v2_roundtrip/run_roundtrip.py`。

App 最低支持 macOS 14，而直接 `BlendShapeWeightsComponent` 从 macOS 15 起可用。因此 shape 往返成功不改变以下硬约束：Rig v2 第一版必须仅靠拓扑、手工蒙皮和 twist 骨保持身体完整；运行时 corrective shape 只能作为 macOS 15+ 可选增强。

---

## 11. 运行时动画图合同

`PetAnimationGraph` 是关节最终姿势的唯一写入者，按固定顺序求值：

1. **Base**：`idle-neutral`、呼吸、移动或跟练基础姿势。
2. **Action**：挥手、伸展、庆祝等 override clip，支持 blend in/out 和中断窗口。
3. **Additive**：看向用户、轻微身体摆动等局部增量。
4. **IK**：脚底接触和必要的手部目标修正。
5. **Secondary**：左右叶片受限弹簧。
6. **Corrective**：经验证的姿势驱动修正。
7. **Commit**：一次性提交完整 `jointTransforms` 和可选 blend shape 权重。

运行时迁移要求：

- `PetIdleMotionPlanner` 只保留随机调度职责，后续改为 `PetIdleActionScheduler`；删除其中具体挥手/伸展骨骼角度。
- `PetSceneView.tick()` 不再独立拼接每一层姿势，只负责把状态输入动画图并提交结果。
- `PlantedFootSolver`、叶片弹簧和现有 Rig probe 可作为后处理或工具保留。
- 骨架不兼容必须显式报错并回退到已批准资产，不允许按骨名“尽量匹配”后继续播放。

---

## 12. 桌面 sprite strip 合同

每个动作单独发布透明横向 strip，不再使用固定 16 x 11 整张图集：

```text
sprout_rig2_idle-neutral.webp
sprout_rig2_idle-breathe.webp
sprout_rig2_idle-wave-goodbye.webp
sprout_rig2_idle-look-around.webp
sprout_rig2_idle-stretch-bounce.webp
sprout_rig2_look-direction.webp
sprout_rig2_animations.json
```

manifest 为每个资源定义 `frameCount`、`fps`、`loopMode`、`pixelWidth`、`pixelHeight`、`displayScale`、`anchor`、事件帧和 Reduce Motion 替代项。默认逻辑画布保持 `192 x 208 pt` 兼容现有布局，但像素倍率由 manifest 表达，不能从文件名或固定列数推断。

烘焙要求：

- 使用与大厅相同的 Rig v2 action、相机、灯光、色彩管理和批准材质。
- 透明背景直接渲染，不用绿幕/蓝幕抠像。
- 角色脚底 anchor 和画布边界在所有动作间固定，动作不能导致桌面窗口尺寸跳变。
- 一个动作变更只替换自己的 strip 和 manifest hash，不重烘焙无关动作。

---

## 13. 发布门禁与完成定义

Rig v2 只有同时满足以下条件才可称为“生产 rig 已批准”：

- Gate 0–3 全部通过，所有原尺寸证据和机器报告可追溯。
- GLB/FBX 结构交换审计通过，Blender USD → USDZ → RealityKit 主发布合同通过；GLB 不作为 Apple 发布输入。
- A-pose、`idle-neutral` 和六个跟练峰值在 RealityKit 中无裂缝、远端拉扯和比例漂移。
- 正式资源仍未被自动覆盖，用户已审核 Rig v2 静态八方位与核心组合姿势并明确批准。
- 发布 manifest 记录全部源/输出哈希，旧版本可一键回退。
- licensed derivative 的归因、许可链接和修改说明已进入发布 manifest 与
  产品第三方声明。

单个动作只有满足 Gate 4、动作语义审核和桌面 strip 同源验证后才可发布。Rig 获批不等于任意动作自动获批。

---

## 14. 分步实施顺序

1. ✅ 创建骨架与 blend shape 最小往返实验，不接触正式小草资产；已选择 Blender USD 主发布路径。
2. ✅ 已复制身份基准到只读隔离目录，完成八方位比例、材质和轮廓渲染，并于 2026-08-12 获得用户身份一致性批准。
3. ⚠️ v002 曾通过静态机器门禁、AI 八方位预审和用户静态审核；2026-08-27 新增的跨区域拓扑边审计发现 `90` 条 `torso ↔ forearm` 与 `29` 条 `head ↔ upper_arm` 非解剖连接，该批准仅保留为历史记录，不再允许进入生产蒙皮。
4. ⚠️ 基于 v002 建立的 32 关节无蒙皮骨位和 geodesic 区域合同保留作参考；底模来源失效后，其批准不能直接转移到新网格。v002 权重候选停止，v003 三组件封口方案因原尺寸可见接缝被拒绝。
5. ⚠️ v004 全局 Voxel Remesh + Quadriflow 候选通过单组件、闭合性、自交、邻接、净空与 GLB 重导入机器门禁，但原尺寸审核发现全身锯齿状 UV 接缝、粗直管手臂、手部轮廓丢失和缺少关节定向环流，已拒绝且不得修补后继续使用。
6. 🚫 v005 自动方法与 Meshy 30k/40k/60k 原生 DCC 有限候选均已完成止损。最终 Blend 审计确认所有 Meshy 候选都缺少双侧肩与髋定向环流；30k/40k 有肘膝左右不对称和肩部极点，60k 进一步出现大量三角/ngon。自动拓扑和绑定对照停止，进入人工 DCC 重拓扑交付。
7. ✅ AI 自建 v008 显式 template scaffold、冻结头手脚片区、64 点颈口、腕踝 reducer 与完整 v008-full-body-v001 装配均已通过机器门禁；v001 因方盒躯干和柱形腿未通过身份审核，细分后坐标拟合也已按平台止损。
8. ⚠️ v008-full-body-v002 曾通过当时的完整静态机器门禁；按当前术语仅记为历史 Static Gate S0 结构项通过。其无头身体 mean/min IoU `0.8016434605 / 0.7154556240`、mean boundary P95 `46.0378 mm` 三项均劣于止损基线，原尺寸身份审核拒绝；禁止继续 profile 强度变体。
9. ⚠️ v008-full-body-v003 曾尝试精确保留 `V008_TorsoCoreSafe_Frozen`，只在其 `260` 点 lower 与 `256` 点 upper 边界之外构建显式连接；该路线已在边界 fixture 阶段停止，不再处于进行中。
10. ⚠️ v003 frozen-torso fixture 保持 `4,814` 个身份面零 mismatch，但复杂切口 reduction 的最佳面比例仍为 `9.1209`，原计数延伸产生自交；完整候选未生成，路线停止。
11. ✅ 身份源规则 64-ring 躯干 loft fixture 已通过严格几何门禁。
12. ⚠️ CHANGE-018 两次直接手工布局均保持 pair-of-pants 组合拓扑和精确三边界，但唯一结构重排仍为 56 折面、357 自交、aspect `11.814`、最小角 `0.254°`，且每侧仅 3 条合格 hip rings；固定 `z=0.260` 分区已停止。
13. ⚠️ CHANGE-019 已证明 `safeZ=0.3770954363` 的 full Body / frozen torso 均为 50/64，升高仍无 64/64；`34/16/14` hybrid collar 未批准，fully-source 水平 seam 路线停止。
14. ⚠️ CHANGE-020 基础 topology contract 通过，但唯一 connectivity revision 后仍有 506 自交、48 folds、aspect `98.513`、最小角 `5.105°`，并有 shoulder/elbow/knee 门禁失败；no-seam proxy 路线停止。
15. ✅ CHANGE-024 已选择 Blender Studio CC BY 4.0 licensed basemesh source intake；源 artifact、许可、归因、对象/组件和拓扑哈希已绑定，真实 intake 返回 `approved_for_isolated_adaptation` 且 `riggingAllowed=false`。
16. 🚫 CHANGE-025 v009 adapted v001 已完成真实 S0 审计并拒绝：基础 topology/canonical/static-state 通过，strict geometry、8 个 joint flow 和 4 侧 support routes 失败；该 revision 已冻结。
17. ✅ CHANGE-026 已建立四 profile 机器合同、当前 handoff、Skill fail-closed 路由及合同驱动审计规则；历史 v001 与 schema v1 证据未改写。
18. 🚫 CHANGE-026 左肩/腋下 R0 已完成：`scoped_wip` 静态机器门通过，但一次性三骨与线性测试权重变形诊断失败；当前 licensed-basemesh AI 施工路线关闭。
19. 🚫 CHANGE-027 Tripo P1 scoped WIP 在付费前输入门停止：曝光修复后仍有肩腋/躯干拉扯；Tripo 未提交、未评估，`0 credits`，不创建 v002。
20. ✅ CHANGE-028 H3.1 单次生成与 CHANGE-029 产物恢复、离线结构/原尺寸评审已完成；任务实际消费 35 credits，恢复及评审追加 0。当前网格保留为 scoped WIP 参考，尚不能进入贴图/自动绑定或生产认证。建议先本地评估身体拓扑的有界修整范围；没有 v002、S0 pass 或生产骨架。
21. 仅当未来新路线产出的 `open_five_s0`、闭合身份装配和用户静态审核全部通过后，才应用固定 32 关节导出骨架，建立正式区域合同和手工权重，并按 Rig Gate 0 → Gate 1 → Gate 2 → Gate 3 放行。
22. 接入最小 `PetAnimationGraph`，再依次制作并单独审核挥手、张望、伸展和桌面 strips。

当前阻塞点是自然变形与表情控制，CHANGE-033 腰部场仍为加工 GLB，D1/D2 失败结果保留。CHANGE-043 已重排计划但未实施：AI 先检查共同合法方向并固定一个联合权重方案，有依据才进入 S2；不再将人工接手作为前提。P2 2/2、S 1/2 不重置，S2 未启动。详见 §8.0.22 / 修复计划 §12；左膝、腰髋、全身与生产认证仍未通过，源、资源及正式合同不变。

`character_pipeline/sprout/v2/handoff/manual-dcc-v001/` 保持 CHANGE-025 的不可变
历史归档。CHANGE-026 的当前说明位于
`character_pipeline/sprout/v2/handoff/static-topology-contract-v2/`，只引用上述机器
合同与哈希，不创建或授权 candidate v002。CHANGE-027 付费前证据保留在 App 仓库
`character_pipeline/sprout/v2/work/experiments/tripo-p1-static-wip-20260904/`。产品负责人只审批阶段结果和可见证据，
不需要代替 DCC 专业判断环流、极点或工具参数。
