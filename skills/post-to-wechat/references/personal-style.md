# Account Style

Use this reference as an example account style guide. Replace the placeholder brand values with the user's actual WeChat Official Account name when configuring a private project. It is a publish-time quality gate for `post-to-wechat`, not a full writing workflow.

## Defaults

Use these unless the user explicitly overrides them:

```md
default_theme: zhiyuan
default_color: gray
default_publish_method: api
default_author: 你的品牌名
preview_before_publish: 1
default_style_gallery: 1
need_open_comment: 1
only_fans_can_comment: 0
```

The `zhiyuan` theme should read as a technical-column version of the built-in `default` WeChat layout, with restrained professional tweaks:

- grayscale H2 blocks instead of bright brand colors
- standard H3 left rules
- short-label H2 blocks instead of full-width bars
- light blockquotes with a 3px muted gray rule
- light code blocks
- comfortable paragraph spacing
- Songti for Chinese body prose, H2, H3, lists, and blockquotes
- system sans-serif for paragraphs that contain long URLs or inline code, to protect mixed Chinese-English readability
- naked URL paragraphs use smaller muted system text with `word-break: break-all`
- monospace for code and inline code
- WeChat blue links (`#576b95`) without button, card, or underline treatment
- strong emphasis in medium neutral gray (`#4b5563`), never pale disabled gray
- standalone strong paragraphs get slightly larger vertical spacing than inline emphasis
- footnotes and utility text in muted gray (`#8a8f98`) and system sans-serif
- no decorative bubbles, badges, heavy editorial rules, dark code panels, or large rounded cards

## Publish-Time Checks

Before dry-run or publish, verify:

- `author` resolves to the configured account/brand name.
- `title` is explicit, not auto-generated from an accidental first paragraph.
- `summary` is 80-120 Chinese characters when possible and reads like a WeChat digest.
- `cover` exists and is under `assets/wechat-covers/` unless the user intentionally provides another path.
- Inline image paths are local relative paths and files exist.
- Markdown external links keep the default bottom-citation behavior unless the user explicitly requests inline links.
- A style preview has been generated for Markdown input.

Do not rewrite the body here. If the article needs style, topic, voice, or image changes, hand back to `wechat-media-workflow`.

## Reporting

Include these in the final publishing report:

- article path
- selected theme/color
- preview HTML path or gallery paths
- author
- cover path
- publish method
- draft result or blocking error
