# nick 3D 跟练宠物动效交接

> 交接时间：2026-07-27 18:55（Asia/Singapore）
> 交接给：Claude Code
> 当前目标：完成 3D 跟练宠物的方向修正、全身协同、叶冠次级动效、脚底稳定和实机验收
> 本文是当前工作的唯一最新交接说明；历史会话 `d01aa26a-b70c-46e4-96d3-c01b34bea8f6` 中的旧结论以本文为准。

---

## 1. 先进入正确工作区

这次工作发生在 Claude worktree，不是项目根目录下的另一个 clone。

外层驱动面板：

```text
/Users/zhoutong/Documents/project/nick/.claude/worktrees/takeover-doc-sync
branch: worktree-takeover-doc-sync
HEAD: 16bc0f6
```

App 独立仓库：

```text
/Users/zhoutong/Documents/project/nick/.claude/worktrees/takeover-doc-sync/engineering/workspace/macos-app
branch: feat/appkit-migration
HEAD: 9e086e5
remote: github.com/zt994451054/nickbody-macos
```

不要进入这个同名但错误的 clone：

```text
/Users/zhoutong/Documents/project/nick/engineering/workspace/macos-app
```

接手后的第一组命令：

```bash
cd /Users/zhoutong/Documents/project/nick/.claude/worktrees/takeover-doc-sync/engineering/workspace/macos-app
git status --short --branch
sed -n '1,360p' plans/001-layer-workout-pet-motion.md
swift test --filter PlantedFootSolverTests
```

不要先 `git pull`、reset、checkout 或清理未跟踪文件。两个仓库都有需要保留的未提交修改。

---

## 2. 用户本轮反馈与验收目标

用户明确反馈：

1. 当前看起来只有摇头，无法判断是否有更多动作、是否丝滑。
2. 3D 宠物与原设计图视觉差距大；左右转头方向反了，仰头和低头也反了。
3. 宠物呆板；希望头顶叶子随状态晃动，手脚在运动中做应景动作。

本轮拆成两个计划：

- `plans/001-layer-workout-pet-motion.md`：**IN PROGRESS**。修正方向、动作层次、时钟、叶冠、脚底和渲染生命周期。
- `plans/002-rebuild-sprout-visual-identity.md`：**BLOCKED**。视觉模型重做必须先让 @winston 确认权威设计目标；动画无法修复轮廓、眼睛、比例、叶片数量和材质语言。

当前不要替换或重新生成 `pet_sprout_s2.usdz`，也不要把视觉模型差距伪装成已由动画解决。

---

## 3. 必须保留的约束

- 中文沟通；代码实体和代码注释使用英文。
- 按 TDD 推进：测试先红后绿；新增纯逻辑行覆盖率至少 80%。
- 不修改 `WorkoutMovement.direction` 和评分语义。视觉轴映射属于 Candidate B 的 rig profile。
- 不替换、不重新生成 USDZ；当前资产 SHA-256：
  `0c2f165b6a8be7aa36cf3b0668f6557919de09a8609243403a1822ea1a05273d`。
- 不使用 Meshy 走/跑 clip 代替固定教练动作，它会产生脚滑且不能表达颈部拉伸。
- RealityKit 仅用于前台有界跟练窗口，常驻桌面宠物继续使用低功耗 sprite。
- 不新增第三方动画运行时。
- 当前所有改动均未提交、未 push；完成验证前不要提交半成品。
- 外层已有暂存/未提交内容属于前序工作，不得覆盖或撤销。

---

## 4. 当前已完成的实现

### 4.1 六方向与上半身动作

`PetMotionPlanner.swift` 已把 Candidate B 的视觉轴与评分方向解耦，峰值标定为：

| 动作 | 模型局部轴 | 总幅度 |
|---|---|---:|
| 左侧倾 | roll Z | -26° |
| 右侧倾 | roll Z | +26° |
| 向左转头 | yaw Y | +42° |
| 向右转头 | yaw Y | -42° |
| 低头 | pitch X | +24° |
| 仰头 | pitch X | -22° |

主动作按 20% neck + 80% Head 分配，并加入 Spine02 / Spine01 / Spine、肩膀和上臂的克制协同。Reduce Motion 保留教学头颈动作，把辅助动作缩放到 25%。

动作曲线已经改为：

```text
0.00-0.10 prepare
0.10-0.42 move
0.42-0.62 exact hold
0.62-0.92 return
0.92-1.00 settle
```

### 4.2 首拍、混合和统一时钟

- playing 使用 `phase = positiveModulo(0.10 + u, 1)`。
- 同一动作 `ready -> playing` 不重复启动 220ms blend，首拍与准备姿势连续。
- 不同动作仍从当前可见姿势做 220ms ease-out 混合，不再 snap 回 rest。
- 跟练动作、计数和语音调度共享单调时钟；后续 rep 由绝对 deadline 推导，Timer 迟到不累积漂移。
- 2D strip 按绝对时间计算帧，不再用回调次数递增。
- 2D Timer 首次触发已对齐下一个绝对帧边界。
- strip 加载失败不会先破坏旧播放状态；普通 atlas 加载会原子重置 timer、网格、row/frame 和 idle 状态。

### 4.3 叶冠三维弹簧

- `head_end` 已从标量单轴升级为 SIMD3 rotation-vector spring。
- 输入来自 blend 后完整 Head model orientation 的最短弧角速度，包含 Hips、spine、neck 和 Head 祖先链。
- 0.30s natural response、0.68 damping、12°球面限制。
- 碰到 12°边界只移除向外径向速度，保留切向速度。
- 轴变化时状态连续，并做 Head 父空间共轭补偿。
- Reduce Motion、暂停、恢复、重载会重置弹簧。
- 当前资产只有一个 `head_end`，因此两片叶子只能整簇运动；独立双叶控制属于 plan 002 的新资产范围。

### 4.4 生命周期和调试入口

- 结果页和窗口退出会取消 RealityKit update subscription。
- 后续动作需要渲染时会幂等恢复。
- Debug 3D 窗口支持六动作切换与 phase 0.52 峰值定格。
- 启动入口：`.build/NickBody.app/Contents/MacOS/NickBody --pet-scene`。

### 4.5 文档

- `tools/pet-model/README.md` 已更新为 24 骨 Candidate B 管线及 `head_end` 限制。
- 外层 `versions/v1.0.0/CHANGES.md` 已新增 `CHANGE-006`，但其中“下肢整链锁定”是旧策略，最终接入 planted-foot solver 后要改成实际实现并逐项勾选。

---

## 5. 已有验证证据

在新增 planted-foot 红灯测试之前，最后一次完整绿灯为：

- `swift test`：71/71 通过。
- `swift build`：通过。
- `git diff --check`：通过。
- 叶冠专项：12/12 通过。
- 独立 diff review：没有 P0/P1；发现的两个 2D P2 已修复并回归。

当前工作树加入 `PlantedFootSolverTests.swift` 后处于**有意的机械红灯**，所以现在运行全量 `swift test` 会在编译阶段失败。这不是已完成状态，也不是旧测试回归。

2026-07-27 18:51 已重新执行：

```bash
swift test --filter PlantedFootSolverTests
```

结果：exit 1；测试 helper 已能编译，错误只剩生产 API 尚不存在：

- `SkeletonRestPose`
- `LowerBodyIntent`
- `PlantedFootSolver`
- `PetMotionPlanner.lowerBodyIntent(...)`

上一位执行代理在实现前连接中断，没有留下 solver 半成品；没有 Swift build/test 进程在后台运行。

---

## 6. 当前精确停点：planted-foot solver

新测试：

```text
Tests/NickBodyTests/PlantedFootSolverTests.swift
```

测试 fixture 已记录：

- USDZ SHA-256。
- 资产 scale：`0.021999998`。
- 24 个真实 joint path 和 local rest matrix。
- 左腿长度：upper `5.98089743` / lower `4.38095093`。
- 右腿长度：upper `4.77215719` / lower `6.3895874`。
- 六动作 × 101 phase。
- 不完整链降级、共享 bisection、至少 6°膝弯、有限归一化和 Reduce Motion。

测试里原来的 `simd_float3x3(transform)` 编译问题已经修成显式三列构造。不要再重复处理。

### 重要：先修测试契约缺口

当前脚底断言在重建 FK 时仍使用 fixture 的 rest translations：

```swift
localTranslations: fixture.localRestTransforms.map(translation)
```

这意味着 `LowerBodyIntent.pelvisTranslation` 尚未真正进入脚底位置断言。若直接实现，测试可能在没有应用 pelvis translation 的情况下变绿，形成“脚底稳定”的假证明。

在写生产 solver 前先补红灯：

1. 让 solution 暴露完整 `localTranslations`，或暴露能应用到 Hips 的等价局部 transform。
2. FK 使用 solution 的 rotations **和** translations。
3. 增加一个非零 pelvis translation 的断言：Hips 确实移动，而左右 ankle 仍固定在 rest target。
4. incomplete-chain fallback 同时验证 rotations 和 translations 都回到 rest。

### 生产实现合同

完整算法以 `plans/001-layer-workout-pet-motion.md` 的 Target 和 Steps 4/7 为准。核心要求：

1. 在原始 skeleton space 求解，早于 0.022 entity scale 和 `zUpToYUp`。
2. 从真实 child translation 推导腿长和 rest direction，不假设骨轴是 +Y。
3. 缓存 ankle rest position、foot model orientation、bend plane 和 rest local rotations。
4. 对共享 pelvis intent 做有界二分缩放，直到双腿同时满足 reach 和至少 6°膝弯；不可单帧拒绝并跳姿势。
5. 用 law of cosines 解析求 knee；pole direction 由 rest bend plane 运输后只加 authored swivel。
6. 用最短 model-space swing 对齐上下腿 child direction，再转换回 local rotation，保留 rest twist。
7. foot local rotation补偿父级，保持 foot rest model orientation；ToeBase 保持 rest。
8. 任一腿链不完整时，整个共享下肢层禁用，不能让单侧继承移动的 Hips。

不要把旧的“锁死 Hips 到 ToeBase”当完成方案，也不要只旋转 Hips 后接受脚滑。

---

## 7. Claude 接下来的执行顺序

1. 修正上面的 pelvis translation 测试契约，确认 focused suite 只因缺失生产行为而红。
2. 实现纯 `SkeletonRestPose`、`LowerBodyIntent`、`PlantedFootSolver` 和 `PetMotionPlanner.lowerBodyIntent`。
3. 先让 `PlantedFootSolverTests` 转绿，再跑全量测试；不要同时接 RealityKit。
4. 对纯 solver 做独立 diff review，重点查矩阵乘法顺序、model/local 空间、foot orientation 和 fallback。
5. 接入 `PetSceneView`：加载资产时构建 rest pose/solver；每帧把上半身 planner frame 与 solver 的完整下肢 pose 合并后一次性写入 `jointTransforms`。
6. 增加场景接入/生命周期测试；验证 missing leg chain 时上半身仍能动、下肢回 rest。
7. 跑覆盖率，新增纯逻辑至少 80%。
8. 用真实 app 构建脚本打包。
9. 用 `--pet-scene` 截六张 phase 0.52 峰值图。
10. 录完整约 124.4 秒跟练，检查方向、首拍、脚底、叶冠、肢体协同和动作过渡。
11. 测 idle / workout / summary / closed CPU，summary 和 closed 应回到非跟练基线。
12. 更新 plan 状态、`CHANGE-006`、版本 README 和本文，再分别提交/push 两个仓库。

建议命令：

```bash
swift test --filter PlantedFootSolverTests
swift test
swift test --enable-code-coverage
./scripts/build-app.sh debug
.build/NickBody.app/Contents/MacOS/NickBody --pet-scene
```

真实 GUI 验收不能被单元测试替代。尤其要把 rest 和 peak 帧在脚底区域叠加：目标是 210×216 教练卡中 sole edge 移动不超过 1 px。

---

## 8. 当前 App 仓库改动清单

已修改、未提交：

```text
Sources/NickBodyCore/UI/AppKit/PetSceneController.swift
Sources/NickBodyCore/UI/AppKit/PetSceneView.swift
Sources/NickBodyCore/UI/AppKit/WorkoutSessionController.swift
Sources/NickBodyCore/UI/PetSpriteEngine.swift
tools/pet-model/README.md
```

新建、未跟踪：

```text
Sources/NickBodyCore/Services/PetMotionPlanner.swift
Tests/NickBodyTests/LeafSpringTests.swift
Tests/NickBodyTests/PetMotionPlannerTests.swift
Tests/NickBodyTests/PlantedFootSolverTests.swift
Tests/NickBodyTests/SkeletonBindingTests.swift
Tests/NickBodyTests/SpriteStripTimelineTests.swift
Tests/NickBodyTests/WorkoutRepTimelineTests.swift
plans/001-layer-workout-pet-motion.md
plans/002-rebuild-sprout-visual-identity.md
plans/README.md
```

当前 App diff（不含未跟踪文件）约 593 additions / 237 deletions。不要根据 `git diff --stat` 看不到未跟踪源码就误判它不存在。

外层驱动面板也不是 clean：

```text
M  .gitignore                 # 已暂存，前序修改
A  HANDOFF.md                 # 已暂存后又更新为本文
 M versions/v1.0.0/CHANGES.md
M  versions/v1.0.0/README.md  # 已暂存，前序修改
```

不要撤销或重排这些前序改动。

---

## 9. 资产与工具提醒

- 生产资产：`Sources/NickBodyCore/pet3d/pet_sprout_s2.usdz`，Candidate B，24 骨。
- 持久化源文件：`~/Downloads/nick-pet-review/B_source_源文件/rigged.glb`。
- 已绑骨模型只能走 `tools/pet-model/glb_to_usdz_rigged.py`；不要用 `rig_pet.py` 重绑。
- UsdSkel 归一化必须缩放/平移 Armature 本身，不能靠父级 Empty；根节点游离 Icosphere 要排除。
- USDZ 保持 Blender Z-up，由运行时 `zUpToYUp` 转成 RealityKit Y-up；不要导出时再转一次。
- 任何新资产都必须先给 @winston 预览并明确批准，之后才能替换 bundle。

---

## 10. 完成定义

Plan 001 只有同时满足以下条件才算完成：

- 六个中文动作标签与用户视角方向一致。
- 头颈、脊柱、肩臂和下肢有克制但可见的协同，不撕裂。
- 双脚在完整动作中视觉落地稳定。
- 叶冠有受限惯性、回弹和收敛，无抖动。
- 首拍、计数、语音调度和动作时钟一致，动作切换不 snap。
- Reduce Motion 行为正确。
- 全量测试、覆盖率、build 和真实 GUI 验收都通过。
- summary / closed 状态停止渲染并回到 CPU 基线。
- 视觉模型差距仍诚实记录为 plan 002 BLOCKED，等待权威目标确认。
