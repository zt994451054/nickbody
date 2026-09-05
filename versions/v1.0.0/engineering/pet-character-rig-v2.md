# 人形小草生产角色 Rig v2 规范

> 本文档是 v1.0.0 人形小草生产网格、骨架、蒙皮、动作、导出和认证的单一权威合同。
> 当前状态：CHANGE-025 的 `licensed_basemesh_adapted` v001 已作为 S0 失败证据冻结，CHANGE-026 licensed-basemesh AI 施工路线已按止损条件关闭。CHANGE-027 的 Tripo P1 四视图因旧 24 骨权重污染在付费前被拒绝，Tripo task 从未提交、生成能力尚未评估、消费为 `0 credits`。CHANGE-028 已完成阶段 0，只从 `char1` 原始 mesh data 制作未变形 rest 四视图并交用户复核；本地执行路径未上传、未创建 task，账户侧用量未查询。H3.1 阶段 1 尚未授权。当前仍无通过 S0 的 proxy，R0/Tripo scoped WIP 均不是候选且不占用 v002 编号；v002、production Rig Gate 0、生产骨架、权重和动作均未授权，正式资源继续冻结。
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
不授权凭证读取、余额查询、上传、task 创建或付费调用。阶段 1 仍是尚未授权的候选计划：
单次 `v3.1-20260211` multiview-to-model，参数固定为
`texture=false`、`pbr=false`、`quad=true`、`smart_low_poly=true`、`face_limit=10000`、
`geometry_quality=standard`、`generate_parts=false`、`model_seed=424242`。
官方公开价目响应与参数文档已按原始 bytes 保存并绑定到精确请求：H3.1 无纹理多视图
`20` + Quad `5` + Smart Low-poly `10` = `35 credits`。`50 credits` 只是用户审批阈值，
不是服务端消费上限；实际扣费未观察，且提交前必须重新验证同一官方价目。CLI `0.3.1`
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
20. 🔄 CHANGE-028 阶段 0 与输入用户批准已完成；精确 H3.1 请求的官方公开价目为 `35 credits`，项目单次守卫已通过独立复审和全量测试。阶段 1 仍未授权，当前等待一次性执行授权与凭证轮换/非独占风险决策；未读取凭证、查询账户、上传或创建 task。
21. 仅当未来新路线产出的 `open_five_s0`、闭合身份装配和用户静态审核全部通过后，才应用固定 32 关节导出骨架，建立正式区域合同和手工权重，并按 Rig Gate 0 → Gate 1 → Gate 2 → Gate 3 放行。
22. 接入最小 `PetAnimationGraph`，再依次制作并单独审核挥手、张望、伸展和桌面 strips。

当前阻塞点是第 20 项的 CHANGE-028 一次性阶段 1 执行授权与凭证风险决策。CHANGE-027 的两组四视图、CHANGE-026 R0、CHANGE-025 v001、CHANGE-020 与既有自动、seam、hybrid collar 路线均冻结；不得提交被拒绝输入、继续调 R0 权重追求通过、创建 v002、身份拟合、正式绑定、恢复 Auto-Rig 或在独立授权前调用付费 API。现有正式 sprite/USDZ 继续可用并保持原哈希。

`character_pipeline/sprout/v2/handoff/manual-dcc-v001/` 保持 CHANGE-025 的不可变
历史归档。CHANGE-026 的当前说明位于
`character_pipeline/sprout/v2/handoff/static-topology-contract-v2/`，只引用上述机器
合同与哈希，不创建或授权 candidate v002。CHANGE-027 付费前证据保留在 App 仓库
`character_pipeline/sprout/v2/work/experiments/tripo-p1-static-wip-20260904/`。产品负责人只审批阶段结果和可见证据，
不需要代替 DCC 专业判断环流、极点或工具参数。
