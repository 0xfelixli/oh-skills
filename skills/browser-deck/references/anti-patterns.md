# Anti-Patterns

browser-deck 生成过程中发现的典型错误。每条都有根因说明，便于判断边界情况。

---

## 模式错误

| # | 错误 | 表现 | 修复 |
|---|---|---|---|
| 1 | 默认打开就是放映模式 | `html, body { overflow: hidden }` 放在全局，打开文件直接进全屏 | `overflow:hidden` 只能放在 `body.pres` 选择器下；`position:fixed` 的 `.slide` 只在 `body.pres .slide` 下 |
| 2 | 放映时背景露出页面色 | `body.pres` 没有处理 `.deck` 的 max-width | 加 `body.pres .deck { max-width:none; padding:0; gap:0; }` |
| 3 | 点放映自动强制全屏 | `startPres()` 里调用 `requestFullscreen()`，用户不一定想全屏 | `startPres()` 不调用 `requestFullscreen`；保留 `F` 键让用户主动触发；`exitPres()` 应同时 `exitFullscreen`（若当前在全屏） |

---

## 字体缩放错误

| # | 错误 | 表现 | 修复 |
|---|---|---|---|
| 4 | 用 `vw` 代替 `cqw` | 文档模式下字体过大（1vw ≈ 12–16px，但卡片只有 1100px 宽） | 改用 `cqw`；`.slide` 需要 `container-type: inline-size` |
| 5 | 忘记加 `container-type` | `cqw` 单位无效，字体回退到 clamp 最小值 | 每个 `.slide` 元素都加 `container-type: inline-size` |
| 6 | 直接用 `pt` / `px` 固定字号 | 放映模式撑满全屏后字体偏小 | 所有字号用 `clamp(min, Xcqw, max)` 格式 |

---

## 内容溢出错误

| # | 错误 | 表现 | 修复 |
|---|---|---|---|
| 7 | 内容被静默裁切 | `.slide` 有 `overflow:hidden`，超出卡片高度的内容不可见也不报错 | 每张卡片填内容后在 1100×618px 窗口下目视检查 |
| 8 | 一张幻灯片塞多种证据 | `.fi` 列表 + 表格 + callout 全在一张，密度超标 | 拆成多张，每张一种证据形式 |
| 9 | 列表条目过多 | `.fi` 超过 8 条，字号被压到最小值仍溢出 | 超过 8 条拆两张，或用表格替代 finding list |

---

## UI 控件错误

| # | 错误 | 表现 | 修复 |
|---|---|---|---|
| 10 | 放映按钮遮挡内容 | `position:fixed` 的 `#btn-start` 悬在页面右上角，遮挡幻灯片内容 | 用 sticky toolbar，放映按钮放 toolbar 内 |
| 11 | hover 播放按钮触发翻页或隐形拦截点击 | 点 `.slide-play` 进入放映后，click 事件冒泡触发翻页；或 opacity 为 0 的按钮仍拦截右下角点击 | click 全局监听里加 `e.target.closest('.slide-play')` 排除；`.slide-play` 默认 `pointer-events:none`，hover 时再启用 |
| 12 | 底部文字和控件挤在一起 | `.pg`、`.slide-play`、封面 `.c-meta` 都贴在右下角，页码或署名显得压底/重叠 | 用 `--slide-pad-bottom:6.8%`、`--slide-pres-pad-bottom:11vh`、`--control-bottom:5%`、`--meta-bottom:6%`、`--meta-right-safe:12%` 统一控制底部安全区 |

---

## 设计风格错误

| # | 错误 | 表现 | 修复 |
|---|---|---|---|
| 13 | 深色背景（`#1e1e1e`） | 把 slides-weasy 的暗色 print 风格直接套过来 | 背景改 `#e8e4da`，卡片用 `#f5f4ed`，阴影改轻柔版本 |
| 14 | 冷灰色 toolbar | `background: #111` 或 `#333` | toolbar 用 `rgba(232,228,218,0.92)` + `backdrop-filter:blur` |
| 15 | 幻灯片标题是标签 | "Security Issues"、"Next Steps" | 改为断言：说出数字或结论 |
