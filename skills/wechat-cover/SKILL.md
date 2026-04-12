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
