# nick 项目进度盘点与交接说明

> 交接时间：2026-07-27
> 交接人：Claude（接手自 Gemini）→ 下一位 AI 协作者
> 本文目的：让接手者**冷启动**即可继续干活，不需要读历史对话。
> 本文只写「经代码/命令验证过的事实」，推断与判断会显式标注。

---

## 0. 接手前必读的 3 个坑

这 3 条如果不知道，接手后大概率踩坑或改错地方。

### 坑 1：App 代码不在这个仓库里，而在一个**嵌套的独立 git 仓库**

```
Documents/project/nick/              ← 外层「驱动面板」仓库（产品/版本/规范文档）
└── engineering/workspace/macos-app/ ← ★ 真正的 App 代码，独立 git 仓库
                                        remote: github.com/zt994451054/nickbody-macos
                                        branch: feat/appkit-migration
```

外层仓库 `.gitignore:23` 有 `engineering/workspace/*`，**故意**把工程代码排除在驱动面板之外
（注释原文：「研发工程代码不纳入驱动面板（所有工程 clone 到 engineering/workspace/<name>/）」）。

后果：在外层仓库跑 `git status` 看到 clean，**不代表 App 没有改动**。改 App 代码要
`cd engineering/workspace/macos-app` 再提交，提到 `feat/appkit-migration`（不是 main）。

### 坑 2：UsdSkel 蒙皮模型不能用「父级 Empty 缩放」来归一化

这是我实际踩过并修复的 bug（提交 `43ad986`）。给 3D 宠物换模型时若重蹈覆辙，
资产会变成 1/4 大小并悬浮在半空，而且**编译、构建、导入全都不报错**，只有实测包围盒才看得出来。

- 错误做法：把骨架+网格塞进一个 Empty，缩放 Empty → 父 Xform **不会**合成进导出的 UsdSkel 顶点。
- 正确做法：直接缩放/平移 **Armature 对象本身**，蒙皮子网格会跟随。
- 另一个陷阱：Meshy 的 `rigged.glb` 根节点带一个游离的单位 **Icosphere**（包围盒辅助体），
  必须先删掉再量包围盒，否则归一化基准完全错误。
- 现在 `tools/pet-model/glb_to_usdz_rigged.py` 末尾内置了回 import 校验
  （高度≈1.1 / 脚踩 z=0 / 骨骼数>0），不达标直接 `sys.exit` 报错，杜绝静默产出坏资产。
  **不要删掉这个校验。**

### 坑 3：宠物模型的坐标约定

USDZ 文件保持 **Blender Z-up** 不变，由 `PetSceneView.swift` 在运行时做 `-90° 绕 X` 旋转
（常量 `zUpToYUp`）转成 RealityKit 的 Y-up。所以：

- 导出时**不要**自己转成 Y-up，会转两次。
- 归一化目标必须是「高 1.1 / 脚踩 z=0 / x,y 居中」，与旧资产同口径，这样现有相机参数不用重调。

---

## 1. 项目是什么

macOS 原生桌面宠物健康 App（英文市场 / Mac App Store）：

**核心循环**：久坐疲劳追踪 → 宠物耍宝邀请（绝不锁屏）→ 摄像头头颈操跟练 + 动作评分
→ 健康分/段位养成。

**技术定位**：纯端侧、零后端。AppKit + Vision + SwiftData + StoreKit 2 +
RealityKit（仅用于有界的跟练窗口）。

**核心假设**：「桌面宠物养成 + 摄像头动作评分」能治愈休息提醒品类的留存墓地效应。

---

## 2. 版本与阶段现状

| 项 | 值 |
|---|---|
| 主线开发版本 | **v1.0.0**（`versions/CURRENT.md`） |
| 阶段 | **开发中**，2026-07-16 进入，至今 11 天 |
| 测试/发布阶段 | 均未开始 |
| 产品/设计/技术方案文档 | ✅ 均已定稿 |
| 测试域文档 | ⏳ test-plan / test-cases / defects / test-report / acceptance **全部空白** |

`versions/v1.0.0/README.md` 的「阶段进度」已同步到实际代码状态，并补记了 2026-07-27
真实 GUI 验证结果。版本仍处于开发中，下一项 P0 主线是补齐养成系统。

---

## 3. 功能模块盘点（对照 v1.0.0 版本范围，逐条查过代码）

| 模块 | 优先级 | 状态 | 证据 |
|---|---|---|---|
| 疲劳追踪 | P0 | ✅ 已建成 | `Services/FatigueMonitor.swift`，阈值/等级 publisher 已被 main.swift、PetWidget、Lobby 消费 |
| 提醒模块 | P0 | ✅ 已建成 | `UI/AppKit/InviteCardController.swift` 邀请卡 |
| 姿态识别引擎 | P0 | ✅ 已建成 | `Services/PoseTracker.swift` + `PoseCalibration.swift` + `PoseDiagnostics.swift` |
| 运动跟练 | P0 | ✅ 已建成 | `WorkoutSessionController.swift`：六动作、影子镜像 `LiveMirrorView`、无摄像头照常降级 |
| 评分引擎 | P0 | ✅ 已建成 | `Services/ScoringEngine.swift`，幅度+宽容带，常模取自 AAOS 统一来源 |
| 桌面宠物 UI | P0 | ✅ 已建成 | `PetWidgetController.swift` + `UI/PetSpriteEngine.swift` 精灵图集 |
| **养成系统** | **P0** | ⚠️ **半成品** | `healthScore` 跟练后 `+75` 有效；但 `rankRoadPoints` **只在 `PetEntity.init` 写入一次，全项目从未被读取或更新**（`grep -rn rankRoadPoints Sources` 只有 2 处命中，都在 Entities.swift）→ 段位、软惩罚衰减**都没实现** |
| **Onboarding** | **P0** | ❌ **完全没有** | `grep -rli "onboarding"` 零命中。选宠物逻辑在 `LobbyViewController` 里，不存在「首启动引导流」 |
| **订阅/内购** | P1 | ❌ **纯占位** | **全项目没有任何文件 `import StoreKit`**。只有 `LobbyViewController.swift:257` 一个 NSAlert：「$39.99 / 年（7 天免费试用）」+「确认订阅」按钮，点了不发生任何事 |
| **数据统计页** | P1 | ❌ **没有** | `WorkoutRecordEntity` 写入后，只被 `PersistenceController.todayWorkoutCount()` 数了个数；周视图、段位页均不存在 |

**结论**：P0 里 6 个已通、1 个半成品（养成）、1 个空白（Onboarding）；P1 两个基本都是空的。
核心循环「疲劳→邀请→跟练→评分」已经跑通，**缺的是「养成」这一环和商业化**。

---

## 4. 我这次做了什么（已提交并推送）

全部提交在 **nickbody-macos 仓库的 `feat/appkit-migration` 分支**（非 main）：

| 提交 | 内容 |
|---|---|
| `734f458` | 换用 A-pose 候选 B 的 24 骨全身骨架模型，替换 `pet_sprout_s2.usdz` |
| `43ad986` | **修复**上一提交的归一化 bug（见「坑 2」），并给转换脚本加回 import 校验 |
| `9e086e5` | 跟练教练面板接入 3D 宠物，真实头部演示六个颈椎动作 |

### 4.1 3D 宠物选型（已定案，不用重做）

起因：原「团子」宠物太圆润，四肢缩在身体里，Meshy 人形自动绑骨直接 `422 Pose estimation failed`，
只能做 2 骨（脊柱+头）绑定 → **永远只能转头**。而产品愿景要宠物用摄像头**镜像用户全身**。

做法：把同一个小草形象重画成 **A-pose 站姿**（四肢分开）→ Meshy `image-to-3d`（`pose_mode: a-pose`）
→ Meshy 自动绑骨（5 credits，附赠走/跑动画）。

生成了 4 个候选 A/B/C/D，**4 个全部成功绑上完全相同的 24 骨 Mixamo 人形骨架**，蒙皮干净。
winston 在 Xcode 里逐个看 usdz 后**选定 B**——理由是**表面最光滑**，D/C/A 都有线性纹路
（那是 Meshy 网格生成在**静态模型**上的artifact，与绑骨无关，所以选 B 没有绑骨方面的代价）。

24 骨骨架结构（已验证）：
```
Hips → {LeftUpLeg→LeftLeg→LeftFoot→LeftToeBase,
        RightUpLeg→…,
        Spine02→Spine01→Spine→{LeftShoulder→LeftArm→LeftForeArm→LeftHand,
                               RightShoulder→…,
                               neck→Head→{head_end, headfront}}}
```

### 4.2 跟练面板接入方式（混合渲染，有优雅回退）

`WorkoutSessionController` 的教练面板现在这样选渲染方式：

```swift
if PetSceneView.hasAsset(species: species, stage: 2) {
    // 用 3D PetSceneView，调 petScene.play(movement, secondsPerRep:)
} else {
    // 回退到原 2D sprite（bear/fox 走这条，不会出现空面板）
}
```

- 目前**只有 sprout 有 3D 模型**，bear/fox 仍是 sprite。
- 3D 路径下宠物用**真实头部旋转**演示六个动作，按节拍每次一循环，
  不再需要逐动作的演示美术（sprite 路径需要 `demoStripName` 那套图）。
- `PetEntity` **没有 stage 字段**，stage 2 是硬编码对应唯一一个已发布资产。
- 功耗：RealityKit 持续渲染约 **45% 单核** vs sprite ~0.1%。所以 3D 只允许用在
  **有界的前台跟练窗口**，常驻桌面宠物必须继续用 sprite（`PetSceneView` 文件头注释有实测记录）。

### 4.3 已验证 / 未验证（重要，别把没验的当验过）

已验证：
- `swift build` 通过，资产正确 bundle（`Copying pet3d`）。
- `swift test` 通过：28 个测试、0 失败。
- 资产实测：高度 1.1000 / 脚踩 z=0.0000 / 24 骨 / 往返校验 PASS。
- 用 Blender 复刻 App 的真实相机与坐标系（`zUpToYUp` + 相机 `[0,0.58,2.35]` 看向 `[0,0.50,0]` fov 34）
  渲染确认：构图不裁切、正面朝向、头部偏航约 40° 形变干净。教练卡片实际宽高比（210×216）也确认过。
- 2026-07-27 在 `feat/appkit-migration@9e086e5` 上真实启动 GUI：Debug 3D 窗口和正式跟练窗口均能加载候选 B，
  模型完整、居中、无悬浮或裁切；正式流程自动跑完六个动作并完成结算，大厅显示今日跟练 1 次、健康评分 420。
- 隔离功耗采样：常驻状态约 0% CPU / 100 MB；跟练时约 35%-64% CPU / 915-925 MB；正式退出后 CPU
  回落至 0.1%-0.2%。第二轮短会话退出后内存约 611 MB，未出现逐轮递增；高驻留内存更像框架缓存，仍建议后续长期压测。

**仍需人工主观确认**：
- 六个动作在峰值姿态上的美术表现、节奏观感与产品接受度仍应由 winston 看完整动态过程后拍板；
  本次验证确认的是渲染、流程、结算和资源释放链路，不替代产品审美验收。

---

## 5. 资产与工具位置

### 5.1 已入库（nickbody-macos 仓库）
- `Sources/NickBodyCore/pet3d/pet_sprout_s2.usdz` — 候选 B 成品，20.6MB
- `tools/pet-model/glb_to_usdz_rigged.py` — **已绑骨**模型的 glb→usdz 转换（本次新增）
- `tools/pet-model/rig_pet.py` — **未绑骨**模型的老流程（会 weld/decimate/重蒙皮，
  ⚠️ 千万别拿它处理已绑骨模型，会把绑定搞坏）
- `tools/pet-model/split_head.py` — 更早的「切头刚体」方案，已被淘汰

### 5.2 持久化保存的源文件（不在 git 里）
`~/Downloads/nick-pet-review/B_source_源文件/`（47MB，我在交接前特意抢救出来的）
- `rigged.glb` — ★ **重新导出 USDZ 的唯一源文件**，要改高度/重导必须用它
- `anim_walking.glb` / `anim_running.glb` — Meshy 附赠的走/跑动画（**目前 App 里完全没用上**）
- `model.glb`、`thumbnail.png`、`glb_to_usdz_rigged.py` 副本

> ⚠️ 这些原本只存在于 `~/.claude/jobs/d01aa26a/tmp/`，那是**会被清理的临时目录**。
> 已复制到上述持久位置。接手者请勿依赖 job 临时目录里的任何东西。

### 5.3 其他素材
- `~/Downloads/nick-pet-designs/apose/` — 4 个候选的设计原图（`cand_B_refined.png` 是选中的）
- `~/Downloads/nick-pet-review/` — 4 候选 usdz、对比图 `compare_4candidates.png`、
  B 的动效 GIF（`B_walk.gif` / `B_joints.gif`）

### 5.4 工具链
- Blender 4.3：`/Applications/Blender.app/Contents/MacOS/Blender -b -P 脚本.py -- 参数`
  （EEVEE 引擎名是 `BLENDER_EEVEE_NEXT`）
- Meshy API：skill `meshy-3d-generation`。余额约 **1175 credits**（image-to-3d 30 + 绑骨 5 = 35/个）
  - ⚠️ **API key 绝不能写进任何提交的文件**，只能在单条命令里内联使用。
- grok CLI `image_edit`：做参考图条件的重绘（4 个 A-pose 候选就是这么来的）

---

## 6. 建议的下一步（按我的判断排序）

### 第 0 步：✅ 实机运行 + 文档同步（2026-07-27 已完成）
真实 GUI、六动作流程、结算和退出后的 CPU 回落均已验证；版本 README 已同步。
六个动作的最终美术观感仍由 winston 主观验收。

### 第 1 步（P0，我认为最该补）：养成系统
版本目标原文是「健康分/**段位**养成的完整核心循环」，而 `rankRoadPoints` 是个死字段——
这正是「治愈留存墓地效应」这个**核心假设的载体**，却是整个 P0 里唯一的半成品。
需要：段位晋升规则、软惩罚衰减、段位页展示。

### 第 2 步（P0）：Onboarding
「选宠物 → 选疲劳档位 → 首次跟练」的首启动引导流，目前完全不存在。

### 第 3 步（P1）：订阅 StoreKit 2
把占位弹窗换成真的：商品 `com.nickbody.app.pass`、免费/付费档界限、7 天试用、恢复购买。
`versions/v1.0.0/README.md` 的「发布关键项」里 App Store Connect 商品配置仍是 ⏳。

### 第 4 步（P1）：数据统计页（段位页 + 周视图）

### 并行/长线：3D 宠物线的延续
- **全身体态镜像**——这是当初做 A-pose 全身骨架的**真正目的**。24 骨已就位，
  `PoseTracker` 已产出上半身 8 个关节，但 `PetSceneView` 目前**只驱动 `Head` 关节**
  （`bindSkeleton` 只找 head，`tick()` 只写 `jointTransforms[headJoint]`）。
  下一步是把人体关节映射到 `LeftArm/RightArm` 等骨骼。
- bear / fox 的 3D 模型（走同样的 grok→Meshy→glb_to_usdz_rigged.py 流水线）
- Meshy 附赠的走/跑动画目前完全没用上，可以考虑用在待机/庆祝状态
- B 的眼睛星形高光位置略有偏差（可选的贴图微调）

---

## 7. 协作约定（沿用）

- 沟通用**简体中文**；代码实体（变量/函数/类名）和技术术语保持英文；**代码注释写英文**。
- 流程：**Research → Plan → Implement**，不要直接跳到写代码。
- **winston 会亲自确认每一个生成的资产**，再让它进仓库（先预览/展示，后应用）。
- App 代码提交到 `nickbody-macos` 的 `feat/appkit-migration`；**不要**推 main、不要 force-push。
