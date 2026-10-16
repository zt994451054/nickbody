# 技术架构变更历史

## 2026-10-16 | CHANGE-125：正式小草换为重绑骨资产，Rig v2 路线暂停

新增 ADR-004：v1.0.0 正式小草沿用身份基准网格与 24 骨骨架，只平移关节位置并重算蒙皮权重，App 运行时代码不变，原资产存档可回滚。ADR-003 的 Rig v2 重拓扑 + 32 关节生产路线暂停，文件全部保留；ADR-003 其余决策（Blender 脚本化 DCC、原生 USD 发布、桌面预烘焙帧、不引入游戏引擎）保持。

## 2026-10-12 | CHANGE-122：固定UV修订与完整target诊断

固定UV有界修订后的cut、source分区、atlas及136角forward实际与独审已通过；左右140固定角／39完全固定Q／全部固定边保持。历史原core每侧调用／返回2，历史CHANGE-123 r2每侧current调用／返回1、PII各0的失败证据完整保留。CHANGE-124数学双独审、Target/v6十源封存／111项PURE／非作者PQA与fresh ENTRY及ROOT完整字节复验通过；唯一新actual左右每侧current调用／返回1，fresh原seed／PI／PII各1，原PI／PII／strict disk及当前施工门全部通过，无重试、source查询或模型。SavedTargetQA/v4完整51项PURE、非作者47tiny／fresh51＋10真实CLI及ROOT43,432角色准入全部通过；唯一真实保存复算def14b1e及ROOT193,594角色完整后验通过，左右原全部几何／PI／PII和当前施工门重算通过，无新求解／source查询。Point/v4九源封存、66项完整PURE与非作者PQA通过，fresh ENTRY独审及ROOT82,459角色／342,412 owner字段完整准入通过，唯一实际在原field辅助文件导入PIL时失败037a3cda，作者调用／返回0、field构造部分进入未返回，原失败／输入字节保全；Point/v5十一源880c0019已封存、101项完整PUREa2d91618通过，ROOT33,021角色完整作者后验5637df83通过，非作者首次正式PQA在NumPy memmap类定义处被过宽profile拒绝，封存失败保留；新五源观察器v2 c09b8560封存、48项fresh控制通过，失败后32,993角色完整字节保全ba801027通过，新正式PQA9432c02c通过101＋48＋45／28控制、33,017完整角色／8,678路径及Pillow定义边界复验，ROOT66,051角色完整后验342ea438及生产准入通过，新14份配置972d1be0齐，唯一metadata配方冻结331ffad2／b70e231d通过，真实ENTRYde0e2dc9／唯一进程b09c9573严格通过，ROOT347,627角色／8,715路径／343,200 owner字段完整入口后验6e690862通过；新ROOT实际外层v4 c854e7d6的24纯证据控制及非作者静审38ce6776通过，唯一guarded CLI已启动、作者返回和实际结果仍待真证据；SavedPointQA/v3七源已封存、34项完整PURE通过，非作者33项与完整静态审核通过，正式readiness5c952b5e失败：fresh34为33通过／1被原module guard拒绝，原证据保全；新独占profile capsule-v2准备通过；SavedPointQA/v4七源68e10378正式封存、52项完整PURE7e7fe835通过，66,026角色／8,705路径完整字节一致，ROOT66,037角色完整作者后验cafed72d通过；新非作者九源观察器10c82279封存，完整66,431角色／8,782路径静态审查与fresh39通过，ROOT132,876角色完整独审静态后验eb1b0f2a通过；新正式readiness外层v3三源29b40bb9封存、18完整纯控及ROOT310角色完整支持后验8b6958a7通过；ROOT真实QA外层v9 fb38d827和32项纯证据控制通过、独立静审3ccbb892无已知阻挡；真ENTRY及ROOT入口后验已齐，唯一正式readiness失败444ffe13／d1bd0c2e：capsule runtime公开2字段与完整3字段不等，suite启动0、52／39／3CLI均未运行，bdd172dc限定因果核真；新observer-v2边界补完整runtime元数据，原作者与capsule guard不改，不授实际QA资格。Whole/v3九源封存、50项完整definition-only PURE通过，独审v1拒绝保留；v2独审P1/P2=0、fresh50＋12 tiny及ROOT完整93,099角色／生产准入复验通过；Point14份真实upstream已齐，真实141,224,671字节recipe冻结通过，fresh ENTRY811fce77及原进程77ec9082通过，Whole/v4最终12源a8daea88封存后的唯一完整77 PURE失败9d82a612：62实际60通过／2旧mock缺Point5家族字段ERROR，15容量未派发，152,679角色／21,158路径完整前后保持；限定因果观察a4db7c12通过，历史失败与sealed源保留，新exclusive Whole/v5仅补两mock三字段及边界文字后独审／重封／fresh77，四项未来实际资格仍未晋升。保存前Post-G0/v1容量拒绝完整保留；v2十一源封存、83完整PURE与ROOT178,735角色完整复核通过，独立59项本地控制及真实账本重建通过；当前真实账本容量上界832,813,416字节低于原1GiB，原namespace／长度／字节／23-20-167数学均保持，非作者fresh83＋fresh59＋6生产负控PQA严格0及ROOT178,948角色完整后验／生产准入通过，仅四个presave动作准备；后续六动作保存层十一源c5464c33封存、106项完整PURE072fe463通过，ROOT178,750角色完整复核d469b5c5通过，六源observer3ded94dc封存、64本地控制及真实账本预检通过，fresh106＋64＋6生产负控PQA2c74153a通过、ROOT178,970角色完整后验7682b6c7及生产准入通过，不授实际资格。原577实际点尚未生成，首次失败未进入作者；969-922整带／完整表／条件保存与重读尚未执行，新增模型0；生产／S0／rig仍阻塞。 详见[施工记录§8](../../versions/v1.0.0/engineering/pet-hip-transition-band-construction.md#8-change-122固定uv有界修订与实际完整target诊断)及[CHANGE-122](../../versions/v1.0.0/CHANGES.md)。本轮新增证据尚未归档／提交，无基础设施或正式架构选型变更，无需ADR。

## 2026-10-12 | CHANGE-121：可达账本迁移与原整带接续

当前可达依赖账本迁移及重独审通过，136行forward实际回放通过；Source78直接复用、零新source求解。唯一target入口在原固定必要几何拒绝：left face147／right face381及3／10固定边接触，完整solver尚未调用。577、969/922整带、完整表与保存未执行，新增模型0；生产／S0／rig仍阻塞。迁移common v3及兼容层原core/cap通过独审，完整已发布base按exact身份复用。详细实际门结果、旧失败及交付范围见[施工记录§7](../../versions/v1.0.0/engineering/pet-hip-transition-band-construction.md#7-change-121可达账本迁移与原完整整带接续)及[CHANGE-121](../../versions/v1.0.0/CHANGES.md)。无运行时/基础设施/正式资源变更，无需新增ADR。

## 2026-10-11 | CHANGE-120：源展开与PURE通过，历史收据严格闭包阻塞

**CHANGE-120 当前接续结果（2026-10-11，阻塞）**：当前新切缝 Source78 左右度量 atlas 已实际完成，各侧原 mean-value 求解调用及返回均为1；本次完整父域、两fan与UV交对重新检查通过（left `a3b7bcce…`／right `f29caef8…`／source review `0b642b60…`），有限源独审 `221f0b7d…` 通过。forward v3 的100项控制、target v4 的13项控制、point v3 的49＋16项控制及各自 PURE 独审全部通过（`1567982e…`／`2b721827…`／`07cbf2aa…`）；历史资格别名准入、仅9个固定当前源身份的完整严格 EOF 读取和577 producer账本／直接seed分层已修正，原数学、作者、field、阈值与冻结条件保持。

**已消费的历史有限前置**：本轮实际源已消费2026-10-11 17:07（UTC+8）合格native28回执（`e8aa2255…`），45支持点／28Q的原native、finite与AR检查通过，折面／all4交对／T点／退化／重复均0，maxAR3.4961213125＜3.5；本轮未重跑。旧GUIDE-ONLY“零Native28／未通过”是当时早期尝试状态，后续这一有限28Q前置已通过；完整14星／全部cofaces／完整表／模型保存仍未获资格。

forward 配方冻结在原严格fallback读取历史 `bridge-transverse-path-preparation/actual-entry-controls-first-attempt.json`（`fbea292e…`）时拒绝，`BindingSyntaxError` 位于line8,column6：三项 `inputBindings` 记录含额外 `preservedSnapshot`，不符合exact `{path,sha256}`；旧script SHA亦不代表当前原path字节。只读诊断 `fca69ea7…` 保留完整见证。forward recipe未导出，当前26／104映射未执行；本次实际target、577作者、969／922整带全检、完整坐标表与模型保存均未执行，新增保存模型为0，角色生产／S0／rig仍阻塞。该失败属于历史收据的依赖账本准入，不能解释为几何无解。

下一步在新的独占版本迁移该历史失败收据的依赖账本并重资格：明确历史原path、对应保全snapshot与各自完整SHA，执行依赖角色仅使用真实exact path／SHA身份；原收据、旧文件与严格解析规则保留。新迁移及控制、独审通过后再从forward冻结接续，随后仍依次核实际映射、target、577和整带门禁。归档与双仓推送的实际状态统一见 CHANGE-120；下列 CHANGE-119 记录保持历史事实，不继承为本次几何资格。

无App运行时、基础设施、正式资源或架构边界变更；无需新增ADR。[本次施工记录](../../versions/v1.0.0/engineering/pet-hip-transition-band-construction.md#6-change-120-接续结果与严格闭包停止点)。

## 2026-10-11 | CHANGE-119：真实过渡带与严格可行性施工（历史，未达完整验收）

**CHANGE-119 历史实际施工（原事实保留）**：同一raw root4原PL几何与78边界的度量Source78已实际通过全部有限源检查（left`362e46a2…`／right`5037243b…`／review`23bb9b2d…`）；左右6295/6194分析cell、6327/6226 atlas三角保持。每侧249V/457E/209Q的upper209目标盘与固定必要条件已实际二维通过（target`0e8b5241…`／fixed`c1a102a2…`／recipe`898af2df…`），非正cross、非邻接边contact和quad overlap均为0；这些通过不认证完整三维。唯一577作者（409上域+168literal根下域）与原969/922完整三维已实际执行（G0`e7e0be41…`／geometry`8ede39fc…`／v3`0324650f…`）；最新结果仍拒绝：54折面、100个all4交对、40坏AR/max15.00978865，完整14星保护8异常点失败（summary`c1b2e022…`）。168腿根Q与336保留面在各自范围均0折/0交/0坏AR，8环、168有向连接及双groin全部通过。392硬点（含56接口）的baseline native float32字节保持；旧168根及批准26点的原锚逐值、native float32字节保持，JSON double坐标并非全部逐值相同（根0/168、批准26点13/26）；336保留面sourceID和有序cycle保持（precision`3ada593f…`）。§4.16的两侧buffer21已在原PL有限区间重选：原26点中仅两点改变，12Q及两6星原native实际通过（points`cdb87012…`／native`18f13ceb…`），141/374只通过已定边必要界，完整外接Q仍待22点。早期相位Source V2的六组support解析完成，但固定外接AR共同预算的前/后区间空交（interval`2c79493c…`／cause`675092c4…`／necessary`b4d1deb7…`），零新84点/零native42。桥侧Source V1在13个已声明raw副本视图处拒绝；Source V2仅left22/23两条guide及两站完成，left24的既有非unit共边父视图未被消费而拒绝（actual`feb03dcd…`／cause`7a8d76ec…`），不是完整20通过。旧V3仅PREPARE、未实际执行；V3.1唯一实际已完成left22..26五条guide及22..25四站，left26原有限区间为空而拒绝（actual`7c4f593f…`）。真实路径在root4原域下界终止；face145固定47.1968mm边要求径向≥13.4848mm，而全部4片最多6.5333mm，原必要多项式全片严格负，与前四站greedy选择无关（cause`17af150f…`／独立终点`22636aee…`）。当前四翼26端部的原native12Q/两6星已实际通过（`faa027e0…`／`2ac104e6…`，maxAR3.3018111），647固定点域及536已知外接必要检查通过；新自然相位84原锚源与原native42Q/12处3/5星亦实际通过（source`2011837e…`／native`1fc4d314…`／closeout`28661437…`），84原锚forward亦实际通过（`c52a5e7d…`；`6cc01503…` bounded closure保全），均限局部，不授完整14星或外接922面。新全20同列sourcePL规则的唯一实际完成全部20条路径及190全路径交对、无非许可接触（recipe`426a67ae…`／actual`13df01b7…`，683输入前后exact）；首站left22在face141两AR必要域空交而拒绝：弧长须≥16.862508mm同时≤15.276447mm，63个PL片均被有限证书覆盖（`8c479323…`）。零已选站位、零Native28执行，used-prefix检查未执行；只否当前直UV导向，不证明源域或图无解。旧版本/失败/独审保持；完整20站与Native28均未通过。GUIDE-ONLY新84约束图唯一实际（`065c72ea…`）固定必要条件通过（每侧130固定角/28固定Q、固定边0接触），完整209却每侧6个坏Q/17对边接触，`guideGraphPassed`与provider均false；未采用失败导向图，零新source路径/站位/Native28执行。后继单一共同余量LP+unit Dirichlet QP实际亦被拒绝（`ad87013c…`／独审`ef4b53a2…`）：每侧9511线性行及131固定三角通过，但完整209每侧仍6坏Q/25边接触，15个非正三角均含2或3个自由角；右侧dual sign亦未通过。provider仍false，没有采用失败UV。已预登记完整836三角的两阶段耦合构造，26项纯控制通过（core`3462586a…`／controls`6db3bfb6…`／closeout`92846de4…`）；只执行合成盘，当前真实249角构造/新路径/站位/Native28均未执行。最新保全022（`4fb85b36…`）：6766旧文件0漂移，三仓HEAD/branch、App4725与用户4项状态保持，仅Panel9项在授权范围内。前轮`7852a22a…`／`4fb318a0…`的53折/95交/38坏AR/7保护星拒绝及`b91c4985…`原因定位证据保留。旧自然切缝的6个固定UV坏面已由intrinsic对应修正消除，但随后全84目标盘的15个UV坏面原失败保持；当前二维通过来自新的root4上部严格凸域。旧全目标88盘候选68折/74交/42坏AR、八环仅2过及76连接失败的原记录保持拒绝。零认证完整表、零新Blend、无保存许可；未重载originalBlend，故无G1实际认证，归档/生产/S0/rig仍阻塞；原骨轴、fit域、场和masks不变。

969/922实际图与14处异常价完整星联合施工；六组42Q有限小片通过。同态续算原全检86折面/10交对/97坏AR，八髋环/双groin/14星保护通过，43条nT失败。实际尺寸诊断确认数值余量有方向盲区，显式无量纲恢复已在902.115秒结束，无BEST或重启；原全检78折面/0交对/45坏AR，八环仅4过、37条连接失败，双groin/14完整星通过；完整预检仍拒绝。原变量/参考/冻结点与门槛保持。完整表与条件保存/独立重读尚未通过，零新Blend、生产角色阻塞；无架构/运行时依赖或正式资源变更。[施工记录](../../versions/v1.0.0/engineering/pet-hip-transition-band-construction.md)。

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
