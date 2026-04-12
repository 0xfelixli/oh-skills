---
name: wechat-cover
description: 生成公众号头条封面图（900×383），渐变背景 + 标题/副标题/作者
---

# WeChat Cover Generator

生成公众号头条封面图。

## Usage

```bash
uv run skills/wechat-cover/cover.py --title "标题" --subtitle "副标题" --author "作者"
```

## Options

- `--title` (required): 主标题
- `--subtitle`: 副标题
- `--author`: 作者名（左上角显示）
- `--output`: 输出路径，默认 `cover.png`
- `--colors`: 渐变色，默认 `#1a1a2e,#16213e`
- `--font`: 自定义字体文件路径

## Requirements

- [uv](https://github.com/astral-sh/uv): `brew install uv`
- Font: Noto Sans CJK SC (`brew install font-noto-sans-cjk-sc`)
