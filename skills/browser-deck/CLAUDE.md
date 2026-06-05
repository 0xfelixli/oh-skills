# browser-deck · 维护指南

Agent 在**维护本 skill**（改模板、加功能）时读这里。生成幻灯片时读 `SKILL.md`。

## 文件地图

- `SKILL.md` — skill 入口：触发词、生成步骤、组件速查
- `CHEATSHEET.md` — 快速设计参考，生成前扫一遍
- `references/design.md` — CSS 架构、双模式、字体、颜色
- `references/writing.md` — 内容规则、幻灯片结构、ghost deck test
- `references/anti-patterns.md` — 典型错误 checklist
- `assets/templates/browser-deck.html` — 完整可用模板

## 改模板时的规则

- 改 CSS 时同步更新 `references/design.md` 中对应章节
- 改 JS 时同步更新 `references/design.md` 的 JavaScript 章节
- 新增内容组件时同步更新 `SKILL.md` 的「可用组件」表和 `CHEATSHEET.md`
- 模板内联 CSS，不抽公共文件

## 两种模式必须同时测试

改模板后，在浏览器里验证：
1. **文档模式**（默认打开）：15+ 张卡片可滚动，内容无裁切
2. **放映模式**（点开始放映）：全屏，键盘翻页，Esc 退出后回到原位

## 和 kami 的关系

browser-deck 共享 kami 的设计 token（颜色变量、字体栈、parchment 背景）和内容组件（`.sev`、`.callout`、`table.dt` 等）。kami `assets/templates/browser-deck.html` 是同源文件，两边改动需手动同步。
