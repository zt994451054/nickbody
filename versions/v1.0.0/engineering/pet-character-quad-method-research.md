# 外部四边网格方法筛选与局部验证计划

> CHANGE-070，2026-09-15，@winston（AI 执行）。本轮只核查资料和源码，没有新网格、工具执行或几何通过项。

## 1. 结论

选择下一次验证方向：**在真实源曲面上先定义受保护的规则区域与胸背转换区域，再按共享边的固定分段数生成局部模板。**
主要参考 Takayama 等人的 Pattern-Based Quadrangulation，而非直接运行 QuadWild 的完整重拓扑命令。
这是根据公开构造规则和代码接口作出的适配判断，尚未证明 Sprout 的实际分区可行。

这次核查补足了两项信息：局部连接可以利用已有的模板算法；现成 QuadWild/BiMDF 流程不能直接满足我们的固定接口。
最主要的缺口仍是源曲面分区，以及新四边面在三维中同时满足净空、形状、贴合和无交叠的能力。
不能把“公开算法对合法边数能生成连接”解释为我们的肩腋网格已经可行。

CHANGE-069 的失败状态保持：143 对自交、91 个不同折面、核心及真实一圈 10 个极点，局部联合静态验收失败。
本轮未改变 App、正式资源、生产合同、旧证据或已关闭路线。

## 2. 筛选结果

| 方法 | 已核实的能力 | 对当前问题的缺口 | 决策 |
|---|---|---|---|
| Pattern-Based Quadrangulation | 对 2–6 边区域，按给定边分段数构造四边连接；参考代码公开，QuadWild 中也有独立模板模块 | 输入必须是已经划定的区域；算法的保证针对连接，不能保证三维面无交叠、贴合或极点避开关节 | **选为局部构造依据**；先验证真实分区及共享边约束 |
| QuadWild / BiMDF 完整命令行流程 | 支持从分区生成四边网格；BiMDF 版本可不依赖 Gurobi | 当前 BiMDF 不接受预设部分边数；CLI 未传固定位置边界，后续仍有全体顶点投影和额外平滑 | **不直接用于现有冻结接口**；只参考其分层及局部模块 |
| SLIM / libigl | 防止局部单元翻转的步长搜索和畸变优化，有公开实现 | 需要合格初始映射；默认点位约束为软约束；不能据此保证三维表面无自交或关节拓扑 | 留作以后可能的几何改善工具，本次验证不引入 |
| SQuadGen | 原作者公开了生成简单四边布局的研究、结果和说明 | 核查时官网代码与数据仍标记 coming soon；未获得可运行实现，也未验证固定接口和关节语义控制 | 暂不纳入执行计划 |

来源：[Pattern-Based Quadrangulation 原项目](https://igl.ethz.ch/projects/patch-quad/)、
[QuadWild/BiMDF](https://github.com/cgg-bern/quadwild-bimdf)、
[SLIM 原项目](https://igl.ethz.ch/projects/slim/)、
[SQuadGen 原项目](https://youkang-kong.github.io/squadgen/)。

## 3. 代码核查依据

### 3.1 固定接口与 BiMDF 的实际限制

核查版本为 `cgg-bern/quadwild-bimdf@e722c7e961982cf61db7c10812329dd0fc7d60df`，只 clone 主仓、读取源码，未构建或运行。

- `components/quad_from_patches/quad_from_patches.cpp:78` 将所有边数初始化为待求解；`:322` 创建空的 `fixedPositionSubsides` 并交给底层构造函数。配置中的 `fixedChartClusters` 是分组数量，不能当作接口冻结开关。
- `libs/quadretopology/quadretopology/qr_flow.cpp:697` 的 `findSubdivisionsFlow` 逐项断言输入都是 `ILP_FIND_SUBDIVISION`，明确没有实现预设部分边数。不能只在 CLI 上追加 64/32 就认为端口分段数已被强制保持。
- `quadretopology_impl.h:495` 的底层路径确有复制固定边界顶点的能力；但 `:1010` 的投影循环未跳过这些点，不能从参数名称推导全流程坐标精确保留。
- `components/quad_from_patches/main.cpp:145` 虽将三种内部平滑次数清零，`:238` 之后仍启用独立的输出平滑。这也不能当作整个流程没有后处理。

以上足以否定“现成命令直接适配”的判断，不是否定整个算法，也不是运行后发现模型失败。
来源：[CLI 调用](https://github.com/cgg-bern/quadwild-bimdf/blob/e722c7e961982cf61db7c10812329dd0fc7d60df/components/quad_from_patches/quad_from_patches.cpp#L78)、
[BiMDF 输入限制](https://github.com/cgg-bern/quadwild-bimdf/blob/e722c7e961982cf61db7c10812329dd0fc7d60df/libs/quadretopology/quadretopology/qr_flow.cpp#L697)、
[底层投影](https://github.com/cgg-bern/quadwild-bimdf/blob/e722c7e961982cf61db7c10812329dd0fc7d60df/libs/quadretopology/quadretopology/quadretopology_impl.h#L1010)、
[输出平滑](https://github.com/cgg-bern/quadwild-bimdf/blob/e722c7e961982cf61db7c10812329dd0fc7d60df/components/quad_from_patches/main.cpp#L238)。

### 3.2 可借鉴的局部模板模块

论文 §2 明确区分连接与几何：边界总边数必须为偶数，算法负责连接，演示坐标由固定边界的二维 Laplacian 求解得到，再通过参数化映射到三维。
因此它不能替代源曲面分区和三维几何验收。

代码核查到独立的 `patchgen::generate_topology(l, param, patch)` 入口，以及输入完整 `PatchParam` 的重载。
`Pattern<4,0>` 的约束使两组对边各自等长，可用于规则区域的连接；其他模板负责边数转换。
QuadWild 的 `qr_patterns.cpp` 已把这些模板转换为点、四边面、边界、角点和逐边索引，说明连接输出不必与完整重拓扑流程绑定。
上述只是接口存在和实现内容的确认，本机尚未验证编译及输出。

对 Sprout 的适配推断：保护区采用规则区域，把必要的边数转换限制在已证明位于保护区之外的胸背区域。
区域接缝和角点必须在拼接后的完整图上查价数；“每块内部规整”不保证接缝处没有极点。
极点的真实一圈也必须全部满足原保护要求，不能只检查极点中心。

来源：[论文 §2](https://igl.ethz.ch/projects/patch-quad/pattern-based-quadrangulation.pdf)、
[模板输入/输出](https://github.com/cgg-bern/quadwild-bimdf/blob/e722c7e961982cf61db7c10812329dd0fc7d60df/libs/quadretopology/quadretopology/includes/qr_patterns.cpp#L38)、
[规则四边模板](https://github.com/cgg-bern/quadwild-bimdf/blob/e722c7e961982cf61db7c10812329dd0fc7d60df/libs/quadretopology/patterns/patterns/patchgen/Pattern_4_0.h)。

### 3.3 SLIM 不能直接代替当前布点求解

核查 `libigl@7100764c2a2833284a8bdfa9b948d2b3bf124624`：

- `slim.cpp:272` 的 `add_soft_constraints` 给线性系统和能量添加带权惩罚，没有消去固定点自由度；`b/bc` 的名称不等于精确冻结。
- `slim.cpp:745` 区分三角面与四面体；四列索引在这里是四面体，不能直接把四边面表当作输入。
- `flip_avoiding_line_search.cpp:299` 根据单元退化时刻限制步长。它不是非相邻三维表面之间的碰撞检测器。

若未来采用，需另行解决硬约束、合法初值和独立三维检测；本次选定的第一份补片不调用 SLIM 或其他形状优化器。
来源：[SLIM 实现](https://github.com/libigl/libigl/blob/7100764c2a2833284a8bdfa9b948d2b3bf124624/include/igl/slim.cpp#L272)、
[步长限制](https://github.com/libigl/libigl/blob/7100764c2a2833284a8bdfa9b948d2b3bf124624/include/igl/flip_avoiding_line_search.cpp#L299)。

## 4. 下一次局部验证设计

**验证问题**：固定原接口和导向，在真实源曲面上建立规则保护区与局部转换区，能否得到一份同时满足几何和面流要求的肩腋补片？
本节是执行计划，本轮未开始下列工作；不会把研究用时或失败试跑隐藏在新额度之外。

### 4.1 输入与范围

- 使用原真实身份参考及已验证源三角图；保持 CHANGE-069 的 64/32 两端口、四个 32 点导向环、`.195 m` 精确缓冲及其对应关系。共 256 个点按原 float32 坐标固定。
- 保留原局部窗口和贴合评估范围，不裁掉困难胸背/腋下区域后与旧结果比较。
- 保持原核心位置、75 mm 半径及真实一圈定义；源曲面分区是辅助施工约束，不能代替或缩小验收保护区。
- 内部允许新分区、新连接和点位；不沿用 CHANGE-069 的整张固定连接图继续调权重。仍仅 `scoped_wip`，不装配完整身体或进入绑定。

### 4.2 执行顺序与交付

1. **真实分区与边数设计。** 为每块区域登记源三角覆盖、角点、按顺序的边界、共享边方向及分段数。区域内部不能相互覆盖，边界不能交叉，合起来须覆盖原窗口。明确肩上盖/腋下的成对连续带，以及规则保护区和转换区的连接。所有共享边只保存一份坐标和索引。
2. **模板与完整图预检。** 规则区域强制对边分段数相同；转换区域选择满足固定边数的模板。原端口数作为等式约束，不能退化成目标值。检查每块边数正值/总和偶数、模板约束、拼接价数、完整连续条带及保护区真实一圈。不能只过 Euler 和全四边检查。
3. **一次源绑定布点。** 在每个有效分区内建立映射、生成内部位置；保留源三角/重心坐标对应，精确复制固定点。二维不翻折和源点对应是中间检查，三维面仍须独立检查。不能依靠全局最近面投影把点移到相邻表面，也不调用完整 QuadWild 后处理。
4. **独立实物验收。** 保存一份局部 Blend，执行已有几何/面流/双向贴合审计及八张匹配原尺寸图。审计失败后不调整系数或生成第二份补片。

实现上优先借鉴论文明确的模板规则，核对公开模块的连接输出；第三方实现如实际引入，须先锁定准确版本与依赖，并作为离线工具接入。
原 2014 demo 包已下载用于阅读，未找到其顶层许可声明，不能把下载成功当作商用集成许可；QuadWild 仓库声明 GPL-3.0，不能把其中代码当作无许可限制的 App 源码直接复制。
本轮未引入新的运行时或基础设施依赖，不变更架构基线。

### 4.3 预算与停止条件

下一次完整局部验证**总上限 90 分钟**，从首次为其读取/准备输入开始计时，包含工具适配、测试、构造、审计和归档。
一套实际分区/边数设计、最多一份真实源补片、最多一次 Blender 静态审计；零形状优化、零审计后修正版。

- 前 30 分钟必须落实可执行的模板入口，以及真实分区和完整共享边/连接设计；实现不可用、区域无法覆盖或边数不一致即停止，不先跑一份猜测网格。
- 第 60 分钟前须得到唯一源绑定补片并启动独立审计；否则停止，保留实际完成内容。
- 余下时间用于审计、原图检查、证据和结论；不追加工具搜索、换源、放宽门禁或借用旧预算。
- 尚未获得三维可行起点时，不能把模板连接预检通过写成模型修复进展。

**联合通过条件**：自交/两种对角线折面/内部非流形/退化/重复面均为零，全四边，最大边长比 ≤3.5；核心及真实一圈无极点；固定点和接口精确保持；四环与两组实际连续支撑带通过；双向贴合仍按原有限采样口径达到 P95 ≤1 mm、最大 ≤2 mm，并通过八张原尺寸图检查。
最小角继续作为诊断，不另设或放宽合同门槛。通过只记局部通过，完整身体、S0、身份/UV、32 关节与动画仍需后续工作。

## 5. 核查范围与证据

源码和原始下载隔离在本机 `~/Library/Application Support/nick/quad-method-research-20260915/`，没有复制进 App 或驱动面板。

- `source-manifest.json`：14 项准确来源/文件 SHA-256；QuadWild 与 libigl 固定提交，所读 libigl main 文件已逐字节与固定提交复核一致。
- `patch-quad.zip`：原作者站点提供的 2014 demo/source 包，SHA-256 `511250f0017ac770bba76b1b4a6ca1e2e2e1295235f02a389ea830bc86857190`；只在压缩包内读取源码，未运行旧二进制。
- `before-state.json`、`verification.json`：合同及四份用户文件保全、工作树状态、研究文件绑定与文档检查。
- `receipt.json`：本次文档提交、远端核验和实际结束时间。

本机为 arm64，有 `clang++`，当前 shell 的 PATH 未找到 `cmake`；**没有完成第三方构建验证**，不能宣称现成程序已经可运行。
第三方构建、重拓扑运行、Blender、新网格、付费调用均为零。研究筛选完成；几何能力仍待下一次有界实测。
