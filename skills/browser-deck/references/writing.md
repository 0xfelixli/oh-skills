# Writing Rules

browser-deck 继承 kami slides 的所有内容规则，以下是核心摘录和 browser-deck 专有规则。

---

## 幻灯片结构规则

### Ghost deck test（必做）

把所有幻灯片标题按顺序列出来，只读标题能讲清完整论点才可以开始排版。标题不通，结构不对，改结构而不是加内容。

### One evidence per slide

每张幻灯片只放一种证据形式：

| 证据形式 | 对应组件 |
|---|---|
| 数据对比 | `table.dt` |
| 趋势 / 占比 | `.chart-wrap` + SVG |
| 关键结论 | `.callout` |
| 步骤 / 流程 | `.steps` |
| 发现列表 | `.fi` + `.fi-type` |
| 核心数字 | `.big-stats` + `.bn` |

混合证据形式的幻灯片必须拆开。

### 标题是断言，不是标签

| ❌ 标签 | ✅ 断言 |
|---|---|
| Q3 Results | Q3 营收超预期 12% |
| Security Issues | 越权漏洞占 64%，共享同一根因 |
| Next Steps | 立即修复 4 项，两周内 lint 批量扫描 |
| Scope | 5 项目，47 漏洞，AI 静态分析覆盖 9 类 |

---

## browser-deck 专有规则

### 文档模式完整可读

每张幻灯片在文档模式（1100px 宽 × 618px 高）下内容要完整可见。`.slide` 的 `overflow:hidden` 会静默裁掉超出内容，不会报错。

检查方法：在浏览器里把窗口缩到 1200px 宽，观察每张卡片是否有内容被截断。

### 页码定位

`.pg` 始终用 `position:absolute; bottom:var(--control-bottom); right:5%`，两种模式下都有效，不需要区分 `body.pres`。

封面和结语的 `.c-meta` 使用 `bottom:var(--meta-bottom); right:var(--meta-right-safe)`，不要铺满右下角；右下角要留给 `.pg` 和 `.slide-play`。

### 幻灯片密度控制

每张幻灯片的内容量应能在 30–60 秒内读完。超过以下阈值需要拆：
- `.fi` 条目 > 8 条
- `.callout` > 3 个
- `.step` > 4 步
- 卡片网格（`.c2` / `.c3`）> 6 格

### 封面和结语

- 封面（`.s-cover`）用 `--brand` 背景，配 `.c-stats` 展示核心数字
- 结语（`.s-cover.s-end`）居中对齐，重申 3 个最重要的数字
- 两者都不计入内容张数（不占用证据 slot）
