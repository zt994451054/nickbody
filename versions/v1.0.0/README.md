# v1.0.0

**最新角色状态（CHANGE-125／126，2026-10-17）**：正式小草换为身份基准重绑骨版本——网格、UV、材质、贴图不变，仍为 24 骨，只平移关节位置并重算蒙皮权重；歪头时下巴跟随、头胸褶皱、跨肢体渗漏均已修复，用户已在 App 3D 窗口确认。阶段 1 集成已在 App 仓库分支 `feat/v1.0.0-sprout-rerig` 完成（正式资产替换、测试夹具、桌面精灵图重烘焙；构建与测试全部通过，正式 App 截图与已验收候选逐像素一致）。用户查看 v3 动态截图后指出侧弯肚皮撕裂、摆臂时臂根变细和肩顶下陷，CHANGE-126 改为 v4 权重（躯干、肩根、手腕脚踝、头颈），关键门禁 196 张逐张原尺寸审查通过；2026-10-19 用户体验通过，下一步阶段 2 动作设计（桌面宠物图集重影与仰头侧视亮线已登记，见 CHANGE-126）。Rig v2 重拓扑路线暂停、文件全部保留，见 [CHANGE-125](./CHANGES.md) 与 [ADR-004](../../foundation/tech-arch/decisions/ADR-004-identity-mesh-rerig-for-v1.md)。

**CHANGE-122 历史角色状态（路线已暂停）**：固定UV有界修订后的cut、source分区、atlas及136角forward实际与独审已通过；左右140固定角／39完全固定Q／全部固定边保持。历史原core每侧调用／返回2，历史CHANGE-123 r2每侧current调用／返回1、PII各0的失败证据完整保留。CHANGE-124数学双独审、Target/v6十源封存／111项PURE／非作者PQA与fresh ENTRY及ROOT完整字节复验通过；唯一新actual左右每侧current调用／返回1，fresh原seed／PI／PII各1，原PI／PII／strict disk及当前施工门全部通过，无重试、source查询或模型。SavedTargetQA/v4完整51项PURE、非作者47tiny／fresh51＋10真实CLI及ROOT43,432角色准入全部通过；唯一真实保存复算def14b1e及ROOT193,594角色完整后验通过，左右原全部几何／PI／PII和当前施工门重算通过，无新求解／source查询。Point/v4九源封存、66项完整PURE与非作者PQA通过，fresh ENTRY独审及ROOT82,459角色／342,412 owner字段完整准入通过，唯一实际在原field辅助文件导入PIL时失败037a3cda，作者调用／返回0、field构造部分进入未返回，原失败／输入字节保全；Point/v5十一源880c0019已封存、101项完整PUREa2d91618通过，ROOT33,021角色完整作者后验5637df83通过，非作者首次正式PQA在NumPy memmap类定义处被过宽profile拒绝，封存失败保留；新五源观察器v2 c09b8560封存、48项fresh控制通过，失败后32,993角色完整字节保全ba801027通过，新正式PQA9432c02c通过101＋48＋45／28控制、33,017完整角色／8,678路径及Pillow定义边界复验，ROOT66,051角色完整后验342ea438及生产准入通过，新14份配置972d1be0齐，唯一metadata配方冻结331ffad2／b70e231d通过，真实ENTRYde0e2dc9／唯一进程b09c9573严格通过，ROOT347,627角色／8,715路径／343,200 owner字段完整入口后验6e690862通过；新ROOT实际外层v4 c854e7d6的24纯证据控制及非作者静审38ce6776通过，唯一guarded CLI已启动、作者返回和实际结果仍待真证据；SavedPointQA/v3七源已封存、34项完整PURE通过，非作者33项与完整静态审核通过，正式readiness5c952b5e失败：fresh34为33通过／1被原module guard拒绝，原证据保全；新独占profile capsule-v2准备通过；SavedPointQA/v4七源68e10378正式封存、52项完整PURE7e7fe835通过，66,026角色／8,705路径完整字节一致，ROOT66,037角色完整作者后验cafed72d通过；新非作者九源观察器10c82279封存，完整66,431角色／8,782路径静态审查与fresh39通过，ROOT132,876角色完整独审静态后验eb1b0f2a通过；新正式readiness外层v3三源29b40bb9封存、18完整纯控及ROOT310角色完整支持后验8b6958a7通过；ROOT真实QA外层v9 fb38d827和32项纯证据控制通过、独立静审3ccbb892无已知阻挡；真ENTRY及ROOT入口后验已齐，唯一正式readiness失败444ffe13／d1bd0c2e：capsule runtime公开2字段与完整3字段不等，suite启动0、52／39／3CLI均未运行，bdd172dc限定因果核真；新observer-v2边界补完整runtime元数据，原作者与capsule guard不改，不授实际QA资格。Whole/v3九源封存、50项完整definition-only PURE通过，独审v1拒绝保留；v2独审P1/P2=0、fresh50＋12 tiny及ROOT完整93,099角色／生产准入复验通过；Point14份真实upstream已齐，真实141,224,671字节recipe冻结通过，fresh ENTRY811fce77及原进程77ec9082通过，Whole/v4最终12源a8daea88封存后的唯一完整77 PURE失败9d82a612：62实际60通过／2旧mock缺Point5家族字段ERROR，15容量未派发，152,679角色／21,158路径完整前后保持；限定因果观察a4db7c12通过，历史失败与sealed源保留，新exclusive Whole/v5仅补两mock三字段及边界文字后独审／重封／fresh77，四项未来实际资格仍未晋升。保存前Post-G0/v1容量拒绝完整保留；v2十一源封存、83完整PURE与ROOT178,735角色完整复核通过，独立59项本地控制及真实账本重建通过；当前真实账本容量上界832,813,416字节低于原1GiB，原namespace／长度／字节／23-20-167数学均保持，非作者fresh83＋fresh59＋6生产负控PQA严格0及ROOT178,948角色完整后验／生产准入通过，仅四个presave动作准备；后续六动作保存层十一源c5464c33封存、106项完整PURE072fe463通过，ROOT178,750角色完整复核d469b5c5通过，六源observer3ded94dc封存、64本地控制及真实账本预检通过，fresh106＋64＋6生产负控PQA2c74153a通过、ROOT178,970角色完整后验7682b6c7及生产准入通过，不授实际资格。原577实际点尚未生成，首次失败未进入作者；969-922整带／完整表／条件保存与重读尚未执行，新增模型0；生产／S0／rig仍阻塞。 导航：Rig§8.0.100／源布局§37／方法§38；实际门及诊断见[施工记录§8](./engineering/pet-hip-transition-band-construction.md#8-change-122固定uv有界修订与实际完整target诊断)与[CHANGE-122](./CHANGES.md)。

**CHANGE-121 历史角色状态**：当前可达依赖账本迁移及重独审通过，136行forward实际回放通过；Source78直接复用、零新source求解。唯一target入口在原固定必要几何拒绝：left face147／right face381及3／10固定边接触，完整solver尚未调用。577、969/922整带、完整表与保存未执行，新增模型0；生产／S0／rig仍阻塞。导航：Rig§8.0.99／源布局§36／方法§37；实际门与双仓交付见[施工记录§7](./engineering/pet-hip-transition-band-construction.md#7-change-121可达账本迁移与原完整整带接续)及[CHANGE-121](./CHANGES.md)。


**CHANGE-120 历史角色状态（严格闭包阻塞）**：当前新切缝Source78已实际通过有限源检查及独审（`0b642b60…`／`221f0b7d…`）。forward v3／target v4／point v3的100／13／49＋16项控制与PURE独审全部通过；forward冻结被历史收据`fbea292e…`的额外`preservedSnapshot`及旧script身份拒绝（诊断`fca69ea7…`）。forward recipe未导出，本次26／104映射、target、577、969／922全检、完整表和保存均未执行，新增模型0，生产／S0／rig仍阻塞。下一步新版本迁移历史失败收据依赖账本并重资格，再从forward冻结接续。[本次接续结果](./engineering/pet-hip-transition-band-construction.md#6-change-120-接续结果与严格闭包停止点)。导航：Rig§8.0.98／源布局§35／方法§36；归档与双仓推送状态见[CHANGE-120](./CHANGES.md)。

**已消费的历史有限前置**：本轮实际源已消费2026-10-11 17:07（UTC+8）合格native28回执（`e8aa2255…`），45支持点／28Q的原native、finite与AR检查通过，折面／all4交对／T点／退化／重复均0，maxAR3.4961213125＜3.5；本轮未重跑。旧GUIDE-ONLY“零Native28／未通过”是当时早期尝试状态，后续这一有限28Q前置已通过；完整14星／全部cofaces／完整表／模型保存仍未获资格。

**CHANGE-119 历史角色施工（原事实保留）**：原969/922图保持。度量Source78（left`362e46a2…`／right`5037243b…`／review`23bb9b2d…`）与upper209二维目标及固定必要条件（target`0e8b5241…`／fixed`c1a102a2…`／recipe`898af2df…`）已实际通过，均不认证完整三维。唯一577作者（409上域+168literal根下域）的完整969/922已实际执行（G0`e7e0be41…`／geometry`8ede39fc…`／v3`0324650f…`），最新54折/100个all4交对/40坏AR、max15.00978865及8保护星失败，仍拒绝（summary`c1b2e022…`）。168腿根Q与336保留面各自0折/交/坏AR，8环/168连接/双groin全过；旧168根与批准26点保持逐值原锚及native float32字节，JSON double并非全部逐值相同（precision`3ada593f…`）。§4.16两侧buffer21原PL重选及12Q/两6星native实际通过（`cdb87012…`／`18f13ceb…`），完整141/374仍待22。早期相位Source V2固定外接AR预算前/后区间空交，当时零新84/native42；桥侧Source V2仅left22/23两guide/两站完成，left24非unit共边父视图拒绝（`feb03dcd…`／`7a8d76ec…`）。V3.1唯一实际五条leftguide/四站后在left26拒绝（`7c4f593f…`）；固定face145径向必要13.4848mm而真实下界短支仅6.5333mm，原区间严格空（`17af150f…`）。四翼26原native12Q/两6星（`2ac104e6…`）与新自然相位84的原native42Q/12处3/5星（`2011837e…`／`1fc4d314…`／closeout`28661437…`）及84原锚forward（`c52a5e7d…`；`6cc01503…` bounded closure保全）已有限通过，不授完整14星。新全20同列sourcePL唯一实际路径及190全路径交对通过，但首left22在face141双AR域空交而拒绝（`13df01b7…`／`8c479323…`）：零站位、零Native28执行，完整20站与native28未通过。GUIDE-ONLY新84约束图唯一实际（`065c72ea…`）固定必要条件通过（每侧130固定角/28固定Q、固定边0接触），完整209却每侧6个坏Q/17对边接触，`guideGraphPassed`与provider均false；未采用失败导向图，零新source路径/站位/Native28执行。后继单一共同余量LP+unit Dirichlet QP实际亦被拒绝（`ad87013c…`／独审`ef4b53a2…`）：每侧9511线性行及131固定三角通过，但完整209每侧仍6坏Q/25边接触，15个非正三角均含2或3个自由角；右侧dual sign亦未通过。provider仍false，没有采用失败UV。已预登记完整836三角的两阶段耦合构造，26项纯控制通过（core`3462586a…`／controls`6db3bfb6…`／closeout`92846de4…`）；只执行合成盘，当前真实249角构造/新路径/站位/Native28均未执行。最新保全022（`4fb85b36…`）：6766旧文件0漂移，三仓HEAD/branch、App4725与用户4项状态保持，仅Panel9项在授权范围内。前轮53/95/38/7拒绝记录保持；零认证完整表、零新Blend、无保存许可，未重载originalBlend故无G1实际认证，归档、生产、S0及rig仍阻塞。旧自然固定6面反例经intrinsic修正消除后的全84目标15个UV坏面失败保持，当前二维通过仅属新的root4上部凸域。[当前施工记录](./engineering/pet-hip-transition-band-construction.md)。历史导航：Rig§8.0.97 / 源布局§34 / 方法§35；CHANGE-118八份895点表被拒绝的结项证据保持：[上一轮施工记录](./engineering/pet-hip-shared-chart-construction.md)。

## 版本信息

| 字段 | 值 |
|------|-----|
| 版本类型 | major（首个版本，0→1）|
| 版本背景 | 验证核心假设：「桌面宠物养成 + 摄像头动作评分」能否治愈休息提醒品类的留存墓地效应，在 macOS 英文市场跑通完整闭环并上架商业化 |

## 版本目标

交付 nick MVP：疲劳提醒 → 宠物邀请 → 摄像头头颈操跟练评分 → 健康分/段位养成的完整核心循环，单宠物 + 前 3 段位 + 订阅上架 Mac App Store。

## 版本范围

| 功能模块 | 优先级 | 说明 |
|---------|--------|------|
| 疲劳追踪 | P0 | 三档预设 + 键鼠活动检测 |
| 提醒模块 | P0 | 宠物耍宝邀请，绝不锁屏 |
| 姿态识别引擎 | P0 | Vision framework + PoseProvider 抽象 |
| 运动跟练 | P0 | 头颈肩操 6 动作、影子镜像、降级模式 |
| 评分引擎 | P0 | 幅度/保持/节奏 + 宽容带 |
| 养成系统 | P0 | 健康分/段位/软惩罚衰减 |
| 桌面宠物 UI | P0 | 悬浮窗 + 低功耗透明动作资源 + 闲时逗趣 |
| Onboarding | P0 | 选宠物→档位→首次跟练 |
| 订阅/内购 | P1 | StoreKit 2，免费档慷慨 |
| 数据统计页 | P1 | 段位页 + 周视图 |

## 阶段进度

| 阶段 | 状态 | 开始时间 | 完成时间 | 进展说明 |
|------|------|---------|---------|---------|
| 需求分析 | ✅ 完成 | 2026-07-14 | 2026-07-15 | 需求文档已定稿结项 |
| 产品设计 | ✅ 完成 | 2026-07-14 | 2026-07-15 | Stitch设计规范落地，宠物动作原画就绪 |
| 技术方案 | ✅ 完成 | 2026-07-15 | 2026-07-16 | 含 ADR-002 桌面预烘焙帧与 ADR-003 生产级角色动画管线；Rig v2 细化规范在开发阶段按 CHANGE-011 补充 |
| 开发中   | 🔄 进行中 | 2026-07-16 | - | CHANGE-125／126：正式小草换为重绑骨资产，v4 权重修复完成并经用户体验通过，下一步阶段 2 动作设计，Rig v2 重拓扑路线暂停、文件保留。历史：CHANGE-122新源／atlas／136角forward与完整固定条件通过；原target两次每侧尝试拒绝；CHANGE-123新构造设计及误差重审中，新target实际0，577／整带／保存未执行。历史记录：P0核心链路已跑通。CHANGE-116三份实物拒绝且原额度关闭；CHANGE-119度量Source78与upper209二维目标已实际通过，旧168根/批准26点原锚及native float32保持，double不全部逐值相同；最新577与969/922完整3D已执行，54折/100个all4交对/40坏AR、max15.00978865及8保护星失败；168腿根Q/336保留面自身0折/交/坏AR，8环/168连接/双groin通过。§4.16两buffer21/12Q有限native通过，原新相位外接预算空交保持；四翼26/12Q与新84/42Q有限native通过；桥侧V3.1 left26有限预算失败保持，新全20同列PL路径/190对实际通过但left22双AR域空、零站/零Native28；84原锚forward实际通过（`c52a5e7d…`），GUIDE-ONLY`065c72ea…`每侧6坏Q/17接触及后继LP/QP`ad87013c…`每侧6坏Q/25接触均providerfalse，CHANGE-119当时完整836双阶段纯准备26控通过、真实构造0次，零采用/新站/native；零认证完整表/新Blend、无保存许可。正式S0/CLI仍v2，原骨轴/fit/masks、骨架/资源及CHANGE-113未验收形体保持；完整身体/S0/身份/32骨及动画、养成、Onboarding、StoreKit、统计页待完成 |
| 测试     | ⏳ 待开始 | - | - | |
| 发布     | ⏳ 待开始 | - | - | |

> 图例：⏳ 待开始 / 🔄 进行中 / ✅ 完成 / 🚫 阻塞
> 进展说明示例：「前端 80% / 后端 60%」「登录模块阻塞，依赖第三方 SDK」
>
> ⚠️ **时间字段规约（SOP-07 强制填写）**：
> - 进入某阶段时：将该阶段「开始时间」填为当日日期（YYYY-MM-DD），状态改为 🔄
> - 完成某阶段时：将该阶段「完成时间」填为当日日期，状态改为 ✅
> - 「-」表示尚未到达该阶段，不得留空（-）的阶段已处于进行中
> - AI 在 §3 速查时会根据「开始时间」计算当前阶段持续天数，超过 14 天将提示停滞预警

## 发布关键项

> 技术方案定稿后完善此表，发布时按项执行。

| 类型 | 说明 | 状态 |
|------|------|------|
| 增量 DDL | 无（SwiftData 本地容器，首启动按 Schema 自动建库）| — |
| 数据迁移脚本 | 无（v1.0.0 创世版本）| — |
| 配置变更 | 无（纯端侧零环境变量，偏好走 @AppStorage）| — |
| 代码脚本 | 无 | — |
| 服务依赖 | 无后端服务；仅依赖系统内置 StoreKit 2 / Vision（App Store Connect 需配置订阅商品 com.nickbody.app.pass）| ⏳ |

→ 详细发布步骤见 [engineering/release.md](./engineering/release.md)

## 文档导航

| 域 | 文档 | 状态 |
|----|------|------|
| 产品 | [需求文档](./product/requirements.md) | ✅ |
| 产品 | [产品设计](./product/design-spec.md) | ✅ |
| 产品 | [统一原型](../../foundation/design/prototype/README.md) | 🚫 停更（CHANGE-003）|
| 研发 | [技术方案](./engineering/tech-solution.md) | ✅ |
| 研发 | [人形小草 Rig v2 规范](./engineering/pet-character-rig-v2.md) | ⏸ 路线暂停（CHANGE-125），文件保留；🚫 完整角色未通过；当前CHANGE-122见§8.0.100；历史CHANGE-121见§8.0.99／CHANGE-120见§8.0.98／CHANGE-119见§8.0.97，原CHANGE-116合同与结项见§8.0.94 |
| 研发 | [髋裆连续映射与共同边界修复](./engineering/pet-hip-embedding-repair-design.md) | CHANGE-117根因/输入已验证；完整连接与几何施工前提未过 |
| 研发 | [真实髋裆过渡带施工](./engineering/pet-hip-transition-band-construction.md) | ⏸ 路线暂停（CHANGE-125），文件保留；CHANGE-122新源／atlas／136角forward及全固定条件通过；完整target右侧PI拒绝，577/整带/保存未执行；历史CHANGE-121账本迁移及原固定必要失败保持／CHANGE-120严格闭包阻塞；历史CHANGE-119：度量源78与upper209二维实际通过，577/完整3D实际54折/100个all4交对/40坏AR、max15.00978865及8保护星失败；root168/ret336自身与8环/168连接/groin通过，§4.16四翼26/12Q及新84/42Q有限native通过；桥侧新20同列PL路径/190对通过但left22双AR域空、零站/零Native28；84原锚forward实际通过（`c52a5e7d…`），GUIDE-ONLY`065c72ea…`每侧6坏Q/17接触及后继LP/QP`ad87013c…`每侧6坏Q/25接触均providerfalse，CHANGE-119当时完整836双阶段纯准备26控通过、真实构造0次，零采用/新站/native；零认证完整表/新Blend、无保存许可 |
| 研发 | [共享髋裆完整施工与预检](./engineering/pet-hip-shared-chart-construction.md) | CHANGE-118已结项；八份完整点表被拒绝，零新模型，失败证据保持 |
| 研发 | [髋枢轴、表面腿根与修复设计](./engineering/pet-hip-repair-design.md) | CHANGE-115冻结设计；CHANGE-116实物初稿+2修订均失败、额度用尽 |
| 研发 | [完整重建决策与 DCC 工单](./engineering/pet-character-production-rebuild-decision.md) | 全身工单保持；最新对应工作由顶部链接接续 |
| 研发 | [真实肩腋参考与迁移设计](./engineering/pet-character-shoulder-migration-study.md) | 保留历史局部证据；最新对应工作由顶部链接接续 |
| 研发 | [剩余八类问题：方法与有效性验证](./engineering/pet-character-method-validation.md) | 当前统一入口；§32：局部贴合改善，三份实物联合验收均失败 |
| 研发 | [原始面流布局与施工缺口](./engineering/pet-character-source-layout.md) | §31：真实512新quad+336原面，最终失败、停止模型修订 |
| 研发 | [外部四边网格方法筛选](./engineering/pet-character-quad-method-research.md) | 历史方法研究；[核心约束最新结果 §43](./engineering/pet-character-core-constraint-design.md) |
| 研发 | [结构施工结果与下一步](./engineering/pet-knee-structure-review.md) | §9–10 保留 B1 失败证据；§11 为后续决策结论 |
| 研发 | [R1 方案收敛结论](./engineering/pet-knee-r1-decision.md) | 当前纯权重路线关闭，R2/R3 不启动 |
| 研发 | [修复路线评审与总计划](./engineering/pet-knee-route-review.md) | §12 记录完整生产路径与当前能力判断；原工时与旧路线冻结 |
| 研发 | [膝部修复历史与证据](./engineering/pet-knee-repair-plan.md) | §34 记录本次决策；无新模型，历史实验保持冻结 |
| 研发 | [接口设计](./engineering/api-design.md) | ✅ |
| 研发 | [数据库设计](./engineering/db-design.md) | ✅ |
| 研发 | [发布流程](./engineering/release.md) | ⏳ |
| 测试 | [测试计划](./testing/test-plan.md) | ⏳ |
| 测试 | [测试用例](./testing/test-cases.md) | ⏳ |
| 测试 | [缺陷记录](./testing/defects.md) | ⏳ |
| 测试 | [测试报告](./testing/test-report.md) | ⏳ |
| 测试 | [验收计划与用例](./testing/acceptance.md) | ⏳ |

## 变更记录

→ 见 [CHANGES.md](./CHANGES.md)
