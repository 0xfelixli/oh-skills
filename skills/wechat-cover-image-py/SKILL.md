---
name: wechat-cover-image-py
version: 1.0.0
description: Generate simple WeChat Official Account cover images locally with Python and Pillow. Use when the user wants an offline 900x383 WeChat cover image with title, subtitle, author label, and gradient colors.
repository: https://github.com/0xfelixli/oh-skills
license: MIT
author: 0xfelixli
allowed-tools:
  - Bash
  - Read
  - Write
---

# WeChat Cover Image Python

Generate a local WeChat Official Account cover image with `cover.py`.

## Requirements

- Python 3.8+
- Pillow
- A CJK font, preferably Noto Sans CJK SC, or an explicit `--font` path

## Usage

Resolve `{baseDir}` as this `SKILL.md` directory, then run:

```bash
python3 {baseDir}/cover.py \
  --title "标题" \
  --subtitle "副标题" \
  --author "作者" \
  --output assets/wechat-covers/cover.png
```

Optional color override:

```bash
python3 {baseDir}/cover.py \
  --title "标题" \
  --colors "#1a1a2e,#16213e" \
  --output assets/wechat-covers/cover.png
```

If Pillow is missing, ask before installing dependencies. If the default font lookup fails, ask the user for a CJK font path or suggest installing Noto Sans CJK SC.
