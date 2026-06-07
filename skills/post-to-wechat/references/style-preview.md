# Style Preview

Use this when the user asks for 样式展示, style preview, theme comparison, or when `preview_before_publish: 1` is enabled.

## Commands

Generate one preview:

```bash
${BUN_X} {baseDir}/scripts/style-preview.ts <article.md> --theme zhiyuan
```

Generate a gallery for all built-in themes:

```bash
${BUN_X} {baseDir}/scripts/style-preview.ts <article.md> --gallery --color gray
```

Open the first preview automatically only when asked:

```bash
${BUN_X} {baseDir}/scripts/style-preview.ts <article.md> --gallery --color gray --open
```

## Output

Preview files are written under:

```text
post-to-wechat/previews/<article-slug>/
```

Expected files for gallery mode:

```text
zhiyuan-gray.html
default-gray.html
grace-gray.html
simple-gray.html
modern-gray.html
```

The preview script rewrites local image placeholders to `file://` URLs so the local HTML preview displays article images. Publishing scripts still use their original upload and placeholder handling.

## Selection Guidance

Default recommendation for `智元安全`:

- Start with `zhiyuan + gray`, a conservative default-compatible WeChat style.
- Use `simple` only when the article is short and image-light.
- Use `grace` when the article has more reflective commentary.
- Use `modern` sparingly; it can feel too rounded for security or engineering analysis.

After the user chooses a style, publish with the same `--theme` and `--color` values.
