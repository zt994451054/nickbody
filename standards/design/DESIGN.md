# nick Design System

> 遵循 awesome-design-md 格式。本文件是产品设计的唯一视觉约束基线。
> 参考：https://github.com/VoltAgent/awesome-design-md
> ⚠️ 当前为 v0.1 基线（来自首轮 Pencil 概念稿的配色与规则），**视觉方向待 Claude Design 重新设计后更新本文件**。重设计输出应回写此处，保持本文件为唯一基线。

---

## Overview

nick 是"住在桌面上的健康小宠物"。视觉哲学：**治愈系但不低龄**——温暖奶油底色 + 生命感薄荷绿，圆角与柔和阴影传达安全感；宠物是画面的绝对主角，UI 退为舞台。所有打断性交互（提醒/评分）必须以宠物的情绪表达呈现，禁止系统级弹窗的冰冷感。深色场景（跟练"影子面板"）用于聚焦与隐私隐喻。

---

## Color System

### Primary Colors
```
Primary:       #2FBF98   /* 薄荷绿——宠物本体、主按钮、进度 */
Primary Hover: #27A583
Primary Light: #F2FBF7   /* 浅薄荷背景（气泡、教练面板） */
```

### Neutral Colors
```
Gray 50:   #FAF6EF   /* 奶油页面背景 */
Gray 100:  #F4F1EA   /* 卡片/标题栏背景 */
Gray 200:  #EDE9E0   /* 边框、进度轨道 */
Gray 400:  #B9B3C2   /* 禁用文字、锁定段位 */
Gray 700:  #6B657A   /* 次要文字 */
Gray 900:  #2F2A33   /* 主要文字、墨色（也是"影子面板"底色）*/
```

### Semantic Colors
```
Success:  #2FBF98   /* 与 Primary 合一：完成/得分 */
Warning:  #FFC948   /* 阳光黄：实时 tips、Gold 段位 */
Error:    #FF6B5E   /* 珊瑚红：仅用于极少数错误 */
Info:     #7EDCC4   /* 浅薄荷：进行中状态 */
Accent:   #FF8A70   /* 珊瑚橙：宠物腮红、情感点缀 */
```

---

## Typography

### Font Family
```
Sans:  'SF Pro Rounded', system-ui, -apple-system, sans-serif   /* 圆体传达亲和力 */
Mono:  'SF Mono', 'Courier New', monospace
```

### Type Scale
```
xs:   11px / line-height: 1.5   /* 标签、日期轴 */
sm:   13px / line-height: 1.5   /* 次要文字、tips */
base: 15px / line-height: 1.6   /* 正文、按钮 */
lg:   17px / line-height: 1.5   /* 跟练动作标题 */
xl:   20px / line-height: 1.4
2xl:  24px / line-height: 1.3   /* 段位名 */
3xl:  36px / line-height: 1.2   /* 健康分大数字 */
```

### Font Weights
```
Regular:   400
Medium:    500
Semibold:  600
Bold:      700
Extrabold: 800   /* 仅健康分大数字 */
```

---

## Spacing System

> 基于 4px 网格

```
1:   4px
2:   8px
3:   12px
4:   16px
5:   20px
6:   24px
8:   32px
10:  40px
12:  48px
16:  64px
```

---

## Border Radius

> nick 整体偏大圆角（治愈感）

```
sm:   6px    /* 小标签 */
md:   10px   /* 段位条、进度块 */
lg:   14px   /* 按钮、窗口 */
xl:   16-24px /* 面板、邀请卡片 */
full: 9999px /* 胶囊（疲劳 pill、段位 chip）*/
```

---

## Shadows

```
sm:  0 1px 2px rgba(0,0,0,0.05)
md:  0 4px 14px rgba(0,0,0,0.10)    /* 疲劳 pill */
lg:  0 12px 36px rgba(0,0,0,0.13)   /* 工作窗口 mock、跟练窗口 */
xl:  0 20px 60px rgba(0,0,0,0.18)   /* 邀请卡片（宠物登场时刻）*/
```

---

## Components

### Button
```
Height:        44px (primary CTA) / 38px (secondary)
Padding:       0 20px
Border Radius: lg (14px)
Font:          15px / bold (primary), 13px / semibold (secondary)

Variants:
  Primary:   bg=Primary, text=white            /* Let's move */
  Secondary: bg=Gray100, text=Gray400          /* 5 more minutes（弱化延迟选项）*/
  Ghost:     bg=transparent, text=Gray700      /* Skip move */
```

### Card（邀请卡片/面板）
```
Background:    white
Border:        none（用阴影分层）
Border Radius: xl (24px)
Padding:       28px
Shadow:        xl
```

### Pill（疲劳胶囊/段位 chip）
```
Height:        fit（padding 7-8px 12px）
Border Radius: full
Font:          11-12px / semibold-bold
```

### 段位色板
```
Bronze:   bg #E8D8C6 / text #8C6B4F
Silver:   bg #E9EDF2 / text #7C8894
Gold:     bg #FFC948 / text #2F2A33（当前段位加 Gold 光晕阴影）
Platinum/Diamond/Legend: 锁定态 bg Gray100 / text Gray400
```

---

## Motion & Animation

```
Duration Fast:   150ms   /* hover、tips 出现 */
Duration Normal: 250ms   /* 卡片弹出、宠物表情切换 */
Duration Slow:   400ms   /* 宠物移动、段位晋升庆祝 */
Easing:          cubic-bezier(0.34, 1.56, 0.64, 1)  /* 轻微回弹，生命感 */

宠物动画原则：
- 一切状态变化通过 Rive 状态机过渡，禁止硬切
- 闲时动作随机间隔 3-8 分钟，避免规律感
- 疲劳可视化四阶：清醒 → 打哈欠 → 眯眼 → 趴下
```

---

## Layout & Grid

```
跟练窗口:     960×640，左右双面板等宽 gap 16
邀请卡片:     400px 宽，屏幕居中
统计窗口:     760×640
桌面宠物:     约 200×180，默认停靠屏幕右下，可拖动/半隐藏
Menu bar:     文字状态（🌱 分数 + 段位）
```

---

## Icons

```
Library:  SF Symbols（系统一致性）+ 少量 emoji 点缀（🌱⏱🔒）
Size:     16px (sm) / 20px (default)
Style:    rounded / filled
```

---

## 隐私视觉语言（产品特有）

- 摄像头相关界面必须常驻 `🔒 On-device only — video never leaves your Mac` 声明
- 跟练"影子面板"永不渲染真实摄像头画面，只渲染姿态驱动的宠物空壳形象（深色底 #2F2A33）
- 摄像头激活指示清晰可见，会话结束立即释放
