---
name: browser-deck
version: 1.0.0
description: |
  生成浏览器可直接放映的幻灯片 HTML。双模式：默认文档浏览（滚动），
  toolbar 按钮或幻灯片 hover 按钮切换全屏逐张放映。无需构建，打开即用。
  适合发链接分享，与 kami slides-weasy（PDF 导出）不同。
  Use when: 用户说"PPT/幻灯片/可以放映/发链接给别人看/直接打开能翻页/browser deck"。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
triggers:
  - browser deck
  - 可放映
  - 发链接放映
  - 直接打开能翻页
  - 浏览器幻灯片
---

# browser-deck

浏览器可放映的幻灯片 HTML。生成前先扫 `CHEATSHEET.md`，详细规范见 `references/design.md`（CSS/JS）、`references/writing.md`（内容规则）、`references/anti-patterns.md`（典型错误），模板见 `assets/templates/browser-deck.html`。

---

## Step 0 · 意图确认（必做）

用户说 "PPT / 幻灯片 / 做成 PPT / 弄成 PPT" 时，**先问一句**，不要猜：

> "需要浏览器直接放映（发链接对方点开就能翻页），还是导出 PDF 在投影上播放？"

| 用户后续说 | 路由 |
|---|---|
| "发给别人看" / "分享链接" / "发邮件" | → 本 skill（browser-deck） |
| "打印" / "导出 PDF" / "投影仪" | → kami `slides-weasy.html` |

---

## Step 1 · 内容确认

确认以下信息（上下文已有的跳过）：

| 项目 | 说明 |
|---|---|
| 标题 | toolbar 显示用 |
| 张数目标 | 15 min ≈ 10 张，30 min ≈ 20 张 |
| 内容来源 | 已有文档 / 报告 / 大纲，还是从零写 |
| 受众 | 技术 / 管理 / 混合 |

---

## Step 2 · 生成

1. 扫 `CHEATSHEET.md` 确认六条不变量
2. 复制 `assets/templates/browser-deck.html` 到目标路径
3. 替换所有 `{{PLACEHOLDER}}` 字段
4. 每张 `.slide` 填入内容，末尾加 `.slide-play` 按钮（在 `.pg` 之前）

**内容规则（简版）：**
- ghost deck test：只读标题顺序能讲清论点才可以开始排版
- one evidence per slide：每张只放一种证据形式（表格 / 图 / 代码 / 结论）
- 每张卡片在文档模式（1100×618px）下内容要完整可见，不被 `overflow:hidden` 裁掉

---

## 可用组件

与 kami `long-doc.html` 共享设计 token，以下组件可直接使用：

`.sev` · `.callout` · `table.dt` · `.card` · `.step` · `.fi` · `.chart-wrap` · `.big-stats` · `.c2` · `.c3`
