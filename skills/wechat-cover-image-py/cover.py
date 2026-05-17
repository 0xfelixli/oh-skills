#!/usr/bin/env python3
# /// script
# requires-python = ">=3.8"
# dependencies = ["Pillow"]
# ///
"""Generate WeChat Official Account cover images."""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIDTH = 900
HEIGHT = 383

TITLE_SIZE = 48
SUBTITLE_SIZE = 24
AUTHOR_SIZE = 18
SPACING = 16

FONT_NAMES_BOLD = ["NotoSansCJKsc-Bold.otf", "NotoSansCJKsc-Bold.ttf"]
FONT_NAMES_REGULAR = ["NotoSansCJKsc-Regular.otf", "NotoSansCJKsc-Regular.ttf"]
FONT_SEARCH_DIRS = [
    Path.home() / "Library" / "Fonts",
    Path("/usr/share/fonts"),
    Path("/usr/local/share/fonts"),
    Path.home() / ".local" / "share" / "fonts",
]


def find_font(names: list[str], override: str | None = None) -> str:
    """Find a font file by searching common directories."""
    if override and Path(override).is_file():
        return override
    for d in FONT_SEARCH_DIRS:
        for name in names:
            p = d / name
            if p.is_file():
                return str(p)
    raise FileNotFoundError(
        f"Font not found: {names}. Install Noto Sans CJK SC or use --font to specify a path."
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate WeChat cover image")
    parser.add_argument("--title", required=True, help="主标题")
    parser.add_argument("--subtitle", default="", help="副标题")
    parser.add_argument("--output", default="cover.png", help="输出路径")
    parser.add_argument("--author", default="", help="作者名（左上角显示）")
    parser.add_argument(
        "--colors",
        default="#1a1a2e,#16213e",
        help="渐变起止色，逗号分隔 (default: #1a1a2e,#16213e)",
    )
    parser.add_argument("--font", default=None, help="自定义字体文件路径")
    return parser.parse_args()


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def draw_gradient(
    width: int, height: int, start_color: str, end_color: str
) -> Image.Image:
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


def draw_text(
    img: Image.Image,
    title: str,
    subtitle: str,
    author: str = "",
    font_override: str | None = None,
) -> None:
    """Draw centered title and subtitle, and author at top-left."""
    draw = ImageDraw.Draw(img)
    bold_path = find_font(FONT_NAMES_BOLD, font_override)
    regular_path = find_font(FONT_NAMES_REGULAR, font_override)
    title_font = ImageFont.truetype(bold_path, TITLE_SIZE)
    subtitle_font = ImageFont.truetype(regular_path, SUBTITLE_SIZE)

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
            fill=(255, 255, 255, 204),
        )

    # Draw author at top-left
    if author:
        author_font = ImageFont.truetype(regular_path, AUTHOR_SIZE)
        draw.text((24, 20), author, font=author_font, fill=(255, 255, 255, 204))


def main() -> None:
    args = parse_args()
    start_color, end_color = args.colors.split(",")
    img = draw_gradient(WIDTH, HEIGHT, start_color.strip(), end_color.strip())
    draw_text(img, args.title, args.subtitle, args.author, args.font)
    img.save(args.output)
    print(f"Saved: {args.output}")


if __name__ == "__main__":
    main()
