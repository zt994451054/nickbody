# 人形小草生产角色 Rig v2 规范

> 本文档是 v1.0.0 人形小草生产网格、骨架、蒙皮、动作、导出和认证的单一权威合同。
> 当前状态：实施基线已确定，尚未创建或批准 Rig v2 候选资产。
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

### 4.4 法线、材质与纹理

- 导出前应用确定性的三角化和自定义法线流程；不得依赖导入器临时重算法线。
- 材质使用 RealityKit 可稳定表达的 PBR 通道。颜色空间必须显式区分 sRGB 颜色贴图与线性数据贴图。
- 纹理不得包含密钥、生成服务元数据或绝对本机路径。
- Blender、GLB、FBX、USDZ 和 RealityKit 基准截图中的主色、眼睛位置和叶片轮廓必须一致。

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

认证按顺序执行。前一门禁失败时立即停止，禁止继续生成大量动作来“看看是否能用”。

### 8.1 Gate 0：结构与静止状态

自动检查：

- 输入哈希、Blender 版本、导出脚本版本和随机种子已记录。
- 32 个导出关节名称、父级、顺序、bind/rest 矩阵与合同完全一致。
- 无控制骨、约束、driver、负缩放、非单位关节 scale、NaN 或无穷值进入导出文件。
- 主身体为一个连续组件；其余组件全部在 allowlist 中。
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
├── contract/            # skeleton、mesh region、action schema
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

单个动作只有满足 Gate 4、动作语义审核和桌面 strip 同源验证后才可发布。Rig 获批不等于任意动作自动获批。

---

## 14. 分步实施顺序

1. ✅ 创建骨架与 blend shape 最小往返实验，不接触正式小草资产；已选择 Blender USD 主发布路径。
2. ✅ 已复制身份基准到只读隔离目录，完成八方位比例、材质和轮廓渲染，并于 2026-08-12 获得用户身份一致性批准。
3. ✅ 64 个源组件审计已完成；v002 连续主身体与独立叶冠静态重拓扑已通过机器门禁、AI 八方位原尺寸预审，并于 2026-08-24 获得用户静态拓扑批准。
4. ✅ 已建立 32 关节 export skeleton 和 Blender control rig，结构、IK/FK 传播及 16 张原尺寸骨位图通过 AI 预审，并于 2026-08-24 获得用户骨位批准。
5. 🔄 手工蒙皮：修正版 geodesic 无权重区域合同已通过 8 方位原大图和逐部位 AI 审核，并于 2026-08-25 获得用户批准；下一步生成首版权重候选并按 Gate 1 逐关节修正。
6. 制作组合姿势并通过 Gate 3。
7. 接入最小 `PetAnimationGraph`，先只播放 `idle-neutral` 和现有六动作迁移样例。
8. 依次制作挥手、张望、伸展；每个动作单独 Gate 4 和用户审核。
9. 最后生成独立桌面 strips，经批准后切换正式资源。

当前执行第 5 项。v002 静态拓扑、32 关节无蒙皮骨位和修正版无权重区域合同均已获得用户批准。区域合同将 `41,887` 个顶点互斥分配到 13 个基础区域，清理 5 个非允许微小孤岛；旧 9 个 mask 只保留为 topology audit evidence，新 9 个生产过渡带从相邻基础区域完整交界 geodesic 扩张生成，全部单连通、边界覆盖率 `100%`，且脖子穿肩连接被肩过渡带完整覆盖。下一步可生成 SKIN-002 首版权重候选；候选仍须通过权重数量、归一化、语义左右配对、区域隔离和逐关节原尺寸审核。Gate 1 全部通过前不得执行 Gate 2，变形、动作和正式资源替换仍未获批准。
