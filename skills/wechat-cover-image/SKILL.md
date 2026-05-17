---
name: wechat-cover-image
description: Generate finished WeChat Official Account cover images (公众号封面图成品) from article title/topic. Use when user asks for "公众号封面", "微信封面图", "wechat cover", "封面图生成", or "文章封面".
---

# WeChat Cover Image

Generate a ready-to-use WeChat Official Account cover image.

## Output Contract

- Output must be a finished image, not prompt text only.
- Default canvas should be WeChat-article cover ratio (`900x383`, about `2.35:1`), unless user explicitly asks for another size.
- Ensure title text is clear, high contrast, and not cropped.
- Keep text concise: usually 8-18 Chinese characters for the main title.
- Generated image must be copied to a project-local fixed folder before completion.
- Default brand text must appear at top-left: `智元安全`.

## Brand Placement (Required)

- Default brand name: `智元安全`.
- Brand must be placed at top-left corner in a small, clear label area.
- Brand style should be subtle but readable; must not compete with the main title.
- If user provides another brand name, user input overrides the default.

## Output Path Policy (Required)

After image generation:

1. Ensure folder exists: `assets/wechat-covers/` under current project root.
2. Copy generated image into this folder.
3. Return the project-local image path as the final output reference.

Filename rule:

- If user provides a filename, use it.
- Otherwise use `wechat-cover-<YYYYMMDD>-<slug>.png`.
- `slug` should be kebab-case from article title/topic (2-6 words).

Do not rely on temporary generated-image cache path as the final deliverable path.

## Input Priority

Use values in this order:

1. Explicit user instruction
2. Article frontmatter (`title`, `summary`, `keywords`) when a markdown file is provided
3. Inferred from user topic

## Workflow

1. Extract core topic:
   - Main title
   - Optional subtitle
   - Audience (if known)
2. Choose visual direction:
   - `professional-tech` (default)
   - `business-clean`
   - `education-knowledge`
   - `ai-futuristic`
3. Build one concise image prompt with:
   - Scene/style
   - Layout instruction (text-safe area)
   - Top-left brand text
   - Chinese display text
   - Aspect ratio and quality requirements
4. Call image generation tool and return the generated image directly.

## Prompt Template

Use this structure:

```text
Design a WeChat Official Account article cover image.
Style: {style}.
Theme: {topic}.
Canvas: 900x383, wide horizontal composition, strong visual hierarchy.
Text layout: reserve safe text area on left/center, avoid cropping.
Top-left brand label: "智元安全" (small but clear, not dominant).
Main Chinese title: "{title}".
Subtitle (optional): "{subtitle}".
Look: clean, modern, professional, high contrast, no watermark, no unrelated logo, no clutter.
```

## Quality Checks

Before finalizing, verify:

- Title is readable at thumbnail size.
- No obvious typo in Chinese text.
- Foreground text does not blend into background.
- Composition still looks good after center-crop tolerance.
- Brand `智元安全` appears in top-left and remains legible.

If quality is weak, regenerate once with stronger contrast and simpler background.
