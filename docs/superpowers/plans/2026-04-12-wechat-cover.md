# WeChat Cover Image Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Python CLI that generates 900×383 公众号头条封面图，渐变背景 + 标题/副标题。

**Architecture:** 单文件脚本 `cover.py`，使用 Pillow 绘制渐变背景和文字。CLI 通过 argparse 接收参数。

**Tech Stack:** Python 3.8+, Pillow, JetBrains Maple Mono 字体

---

### File Structure

- Create: `skills/wechat-cover/cover.py` — 主脚本（渐变绘制 + 文字排版 + CLI）
- Create: `skills/wechat-cover/SKILL.md` — Skill 描述文件

---

### Task 1: 创建脚本骨架和 CLI 参数解析

**Files:**
- Create: `skills/wechat-cover/cover.py`

- [ ] **Step 1: 创建 cover.py 骨架**

```python
#!/usr/bin/env python3
"""Generate WeChat Official Account cover images."""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIDTH = 900
HEIGHT = 383


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate WeChat cover image")
    parser.add_argument("--title", required=True, help="主标题")
    parser.add_argument("--subtitle", default="", help="副标题")
    parser.add_argument("--output", default="cover.png", help="输出路径")
    parser.add_argument(
        "--colors",
        default="#667eea,#764ba2",
        help="渐变起止色，逗号分隔 (default: #667eea,#764ba2)",
    )
    return parser.parse_args()


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def main() -> None:
    args = parse_args()
    print(f"Would generate: {args.title} / {args.subtitle} -> {args.output}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: 验证 CLI 参数解析**

Run: `python skills/wechat-cover/cover.py --title "测试" --subtitle "子标题"`
Expected: `Would generate: 测试 / 子标题 -> cover.png`

- [ ] **Step 3: Commit**

```bash
git add skills/wechat-cover/cover.py
git commit -m "feat: add cover.py skeleton with CLI argument parsing"
```

---

### Task 2: 实现渐变背景绘制

**Files:**
- Modify: `skills/wechat-cover/cover.py`

- [ ] **Step 1: 添加渐变绘制函数**

在 `hex_to_rgb` 之后添加：

```python
def draw_gradient(width: int, height: int, start_color: str, end_color: str) -> Image.Image:
    """Draw a left-to-right linear gradient."""
    img = Image.new("RGB", (width, height))
    r1, g1, b1 = hex_to_rgb(start_color)
    r2, g2, b2 = hex_to_rgb(end_color)
    for x in range(width):
        t = x / (width - 1)
        r = int(r1 + (r2 - r1) * t)
        g = int(g1 + (g2 - g1) * t)
        b = int(b1 + (b2 - b1) * t)
        ImageDraw.Draw(img).line([(x, 0), (x, height)], fill=(r, g, b))
    return img
```

- [ ] **Step 2: 在 main 中调用渐变绘制并保存**

替换 main 中的 print 为：

```python
def main() -> None:
    args = parse_args()
    start_color, end_color = args.colors.split(",")
    img = draw_gradient(WIDTH, HEIGHT, start_color.strip(), end_color.strip())
    img.save(args.output)
    print(f"Saved: {args.output}")
```

- [ ] **Step 3: 验证渐变背景**

Run: `python skills/wechat-cover/cover.py --title "测试" && python3 -c "from PIL import Image; img=Image.open('cover.png'); print(img.size)"`
Expected: `(900, 383)`

- [ ] **Step 4: Commit**

```bash
git add skills/wechat-cover/cover.py
git commit -m "feat: implement gradient background drawing"
```

---

### Task 3: 实现文字排版

**Files:**
- Modify: `skills/wechat-cover/cover.py`

- [ ] **Step 1: 添加文字绘制函数**

在 `draw_gradient` 之后添加：

```python
FONT_PATH = "/Users/defei.li/Library/Fonts/MapleMono-NF-CN-Bold.ttf"
FONT_PATH_REGULAR = "/Users/defei.li/Library/Fonts/MapleMono-NF-CN-Regular.ttf"
TITLE_SIZE = 48
SUBTITLE_SIZE = 24
SPACING = 16


def draw_text(img: Image.Image, title: str, subtitle: str) -> None:
    """Draw centered title and subtitle on the image."""
    draw = ImageDraw.Draw(img)
    title_font = ImageFont.truetype(FONT_PATH, TITLE_SIZE)
    subtitle_font = ImageFont.truetype(FONT_PATH_REGULAR, SUBTITLE_SIZE)

    # Calculate text sizes
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]

    total_h = title_h
    if subtitle:
        sub_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        sub_w = sub_bbox[2] - sub_bbox[0]
        sub_h = sub_bbox[3] - sub_bbox[1]
        total_h += SPACING + sub_h

    # Draw title
    y = (HEIGHT - total_h) // 2
    draw.text(((WIDTH - title_w) // 2, y), title, font=title_font, fill="white")

    # Draw subtitle
    if subtitle:
        y += title_h + SPACING
        draw.text(
            ((WIDTH - sub_w) // 2, y),
            subtitle,
            font=subtitle_font,
            fill=(255, 255, 255, 204),  # 80% opacity
        )
```

- [ ] **Step 2: 在 main 中调用文字绘制**

在 `img.save` 之前添加：

```python
    draw_text(img, args.title, args.subtitle)
```

- [ ] **Step 3: 验证完整生成**

Run: `python skills/wechat-cover/cover.py --title "Claude Code 实践指南" --subtitle "从入门到精通" && open cover.png`
Expected: 打开一张蓝紫渐变背景 + 居中白色标题/副标题的 900×383 图片

- [ ] **Step 4: Commit**

```bash
git add skills/wechat-cover/cover.py
git commit -m "feat: add centered title and subtitle text rendering"
```

---

### Task 4: 创建 SKILL.md

**Files:**
- Create: `skills/wechat-cover/SKILL.md`

- [ ] **Step 1: 创建 SKILL.md**

```markdown
---
name: wechat-cover
description: 生成公众号头条封面图（900×383），渐变背景 + 标题/副标题
---

# WeChat Cover Generator

生成公众号头条封面图。

## Usage

```bash
python skills/wechat-cover/cover.py --title "标题" --subtitle "副标题"
```

## Options

- `--title` (required): 主标题
- `--subtitle`: 副标题
- `--output`: 输出路径，默认 `cover.png`
- `--colors`: 渐变色，默认 `#667eea,#764ba2`

## Requirements

- Python 3.8+
- Pillow: `pip install Pillow`
- Font: JetBrains Maple Mono (NF CN)
```

- [ ] **Step 2: Commit**

```bash
git add skills/wechat-cover/SKILL.md
git commit -m "docs: add SKILL.md for wechat-cover"
```

---

### Task 5: 端到端验证

- [ ] **Step 1: 默认参数生成**

Run: `python skills/wechat-cover/cover.py --title "AI 时代的开发者工具" --subtitle "2026 年趋势解读"`
Expected: 生成 `cover.png`，蓝紫渐变 + 白色居中文字

- [ ] **Step 2: 自定义颜色生成**

Run: `python skills/wechat-cover/cover.py --title "深度学习" --colors "#ff6b6b,#ee5a24" --output red_cover.png`
Expected: 生成 `red_cover.png`，红色渐变背景

- [ ] **Step 3: 清理测试文件**

```bash
rm -f cover.png red_cover.png
```
