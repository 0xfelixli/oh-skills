# oh-skills

我觉得好用的一些 agent skills，以及安装到 Claude Code / Codex 的方法。

## Usage

从这个仓库安装某个 skill：

```bash
npx skills add 0xfelixli/oh-skills@<skill-name> -a claude -a codex
```

例如：

```bash
npx skills add 0xfelixli/oh-skills@post-to-wechat -a claude -a codex
npx skills add 0xfelixli/oh-skills@browser-deck -a claude -a codex
```

只装到某一个 agent：

```bash
npx skills add 0xfelixli/oh-skills@post-to-wechat -a claude
npx skills add 0xfelixli/oh-skills@post-to-wechat -a codex
```

如果已经 clone 了本仓库，也可以用本地路径安装：

```bash
npx skills add ./skills/post-to-wechat -a claude -a codex
npx skills add ./skills/browser-deck -a claude -a codex
```

## Skills

### 1) `post-to-wechat`

Post content to WeChat Official Account (微信公众号), supporting:

- Article posting (文章): Markdown / HTML / plain text
- Image-text posting (贴图/图文)
- API publish and browser publish modes

Path: `skills/post-to-wechat/`

Main entry docs:

- `skills/post-to-wechat/SKILL.md`
- `skills/post-to-wechat/references/`

### 2) `wechat-cover-image`

Generate finished WeChat cover images (公众号封面图成品), default size `900x383`, with brand label and title-safe layout.

Path: `skills/wechat-cover-image/`

Main entry docs:

- `skills/wechat-cover-image/SKILL.md`
- `skills/wechat-cover-image/references/`

### 3) `last30days`

Research what people actually say about any topic in the last 30 days across Reddit, X, YouTube, Hacker News, Polymarket, GitHub, and the web.

Source: <https://github.com/mvanhorn/last30days-skill>

Path: `skills/last30days/`

Main entry docs:

- `skills/last30days/SKILL.md`
- `skills/last30days/references/`

## Notes

- 本仓库主要是个人常用 skills 的整理，不是传统应用项目。
- Local runtime artifacts like `.env`, `node_modules`, `.DS_Store` should not be committed.
