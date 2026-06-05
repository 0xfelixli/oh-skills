# browser-deck · Cheatsheet

填模板前扫一遍。完整规范见 `references/design.md`。

## 六条不变量

1. 背景 `#e8e4da`（暖沙），不用纯黑，不用纯白
2. 单一强调色 ink-blue `#1B365D`，≤ 5% 页面面积
3. 所有灰色**暖色调**（黄棕底色），不用冷灰
4. 字体缩放用 `cqw`，不用 `vw`（见 design.md §字体）
5. 默认模式必须是**可滚动文档**，放映是可选模式
6. 每张幻灯片在 1100×618px 下内容要完整可见（`overflow:hidden` 会裁）

## 颜色速查

| 角色 | Hex | 用途 |
|---|---|---|
| 暖沙背景 | `#e8e4da` | 页面背景 |
| Parchment | `#f5f4ed` | 幻灯片卡片背景 |
| Ivory | `#faf9f5` | 卡片 / 浮起容器 |
| Brand | `#1B365D` | 强调色 · CTA · 边框 |
| 封面背景 | `#1B365D` | `.s-cover` / `.s-end` |
| border | `#d4cfc3` | 卡片边框 |

## 模式切换核心

```
文档模式（默认）→ 正常 flow，.slide 有 aspect-ratio:16/9
放映模式（body.pres）→ .slide position:fixed, 100vw×100vh
切换方式 → JS 给 body 加/去 .pres class
```

## 字体尺寸参考

| 元素 | clamp 值 |
|---|---|
| h1（封面） | `clamp(21pt, 4.4cqw, 44pt)` |
| h2（页标题） | `clamp(15pt, 2.55cqw, 26pt)` |
| .lead | `clamp(10.5pt, 1.44cqw, 14pt)` |
| .fi（finding） | `clamp(9pt, 1.15cqw, 11pt)` |
| .pg（页码） | `clamp(7pt, 0.92cqw, 9.5pt)` |

## 内容规则（三条核心）

1. **Ghost deck test**：只读标题顺序要能讲清论点，标题不能是标签
2. **One evidence per slide**：每张只放一种证据形式，混合的拆开
3. **Slide title = assertion**：「Q3 Results」❌ → 「Q3 营收超预期 12%」✅
