# WeChat Cover Image Generator — Design Spec

## Purpose

一个 Python CLI 脚本，用于快速生成公众号头条封面图（900×383px）。每次只需改标题和副标题，其余元素固定。

## Architecture

单文件脚本 `cover.py`，使用 Pillow 绘制图片。无需额外系统依赖。

```
skills/wechat-cover/
├── SKILL.md      # Skill 描述文件
└── cover.py      # 主脚本
```

## CLI Interface

```bash
python cover.py --title "标题" --subtitle "副标题"
```

### 参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `--title` | 是 | — | 主标题文字 |
| `--subtitle` | 否 | 空 | 副标题文字 |
| `--output` | 否 | `cover.png` | 输出文件路径 |
| `--colors` | 否 | `#667eea,#764ba2` | 渐变起止色，逗号分隔的两个 hex 色值 |

## Visual Design

- **尺寸**：900×383px（公众号头条封面 2.35:1）
- **背景**：从左到右的线性渐变，默认蓝紫渐变（#667eea → #764ba2）
- **标题**：苹方粗体（PingFang SC Bold），48px，白色，水平居中，垂直偏上
- **副标题**：苹方常规（PingFang SC Regular），24px，白色 80% 透明度，水平居中，位于标题下方
- **标题与副标题间距**：16px

## Implementation Details

### 渐变背景

逐像素列计算颜色插值，从 start_color 线性过渡到 end_color。

### 文字排版

- 标题和副标题作为整体垂直居中
- 使用 Pillow 的 `ImageDraw.textbbox()` 计算文字尺寸
- 水平居中对齐

### 字体路径

macOS 苹方字体路径：
- Bold: `/System/Library/Fonts/PingFang.ttc`（index 0 或查找 Bold weight）
- Regular: `/System/Library/Fonts/PingFang.ttc`

使用 `ImageFont.truetype()` 加载，指定 font index。

### 依赖

- Python 3.8+
- Pillow (`pip install Pillow`)

## Output

生成 PNG 文件到 `--output` 指定路径（默认当前目录 `cover.png`）。

## Success Criteria

1. `python cover.py --title "测试标题" --subtitle "测试副标题"` 生成 900×383 的 PNG 文件
2. 渐变背景从左到右平滑过渡
3. 中文标题和副标题正确渲染、居中显示
4. `--colors` 参数能自定义渐变色
