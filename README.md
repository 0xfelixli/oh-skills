# oh-skills

Agent-first skill collection for Claude Code style runtimes.

This repository contains reusable `skills/*` bundles that help agents complete concrete tasks.

## Naming Convention

To keep naming consistent:

- Folder name: `verb-target` (e.g. `post-to-wechat`)
- Skill `name` in `SKILL.md`: same as folder name
- README display name: same as folder name

## Included Skills

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

## Repository Layout

- `skills/`: skill packages used by agents
- `docs/`: design/spec/planning notes

## Notes

- This repo is for **agent skills**, not a traditional app package.
- Old `skills/wechat-cover/` has been removed.
- Local runtime artifacts like `.env`, `node_modules`, `.DS_Store` should not be committed.
