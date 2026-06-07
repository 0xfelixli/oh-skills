---
name: wechat-media-workflow
description: Use when planning, writing, illustrating, reviewing, or publishing Chinese WeChat Official Account articles (微信公众号) for AI, open-source tools, security, developer workflows, GitHub projects, or technical product analysis. Covers 公众号选题、文章编写、正文图片/封面图生成、Markdown 成稿、发布到公众号草稿箱.
---

# WeChat Media Workflow

End-to-end workflow for Chinese WeChat Official Account work: topic selection, research, article writing, inline images, cover image, and publishing.

## Defaults

- Default working folder: `/Users/felix/Wspace/wechat_media` when it exists; otherwise use the current project root.
- Default account/brand/author: `智元安全`.
- Default output: Markdown article with frontmatter, local image assets, and source links.
- Default topic domain: AI tools, open-source projects, developer workflows, security incidents, and technical product analysis.
- Use the user's language for conversation. Articles are Chinese unless explicitly requested otherwise.

## Related Skills

Use these skills when their task appears:

- `ian-xiaohei-illustrations`: default skill for WeChat article inline illustrations (正文配图). Use it for shot lists and generated article images.
- `wechat-cover-image`: dedicated WeChat cover image generation.
- `post-to-wechat`: publishing Markdown/HTML to WeChat Official Account drafts.
- `imagegen`: only as the underlying image tool when the illustration skill calls for actual generation.

## Reference Loading

Read `references/wechat-style.md` when doing any of these:

- choosing or scoring topics
- writing or rewriting article body
- designing inline images or cover direction
- checking whether an article matches the existing `wechat_media` style

Before writing, inspect 3-5 recent Markdown files in the working folder if available. Use them to avoid repeated topics and match naming/path conventions.

## Workflow

```
- [ ] Step 1: Resolve brief and workspace
- [ ] Step 2: Select or validate topic
- [ ] Step 3: Research and verify facts
- [ ] Step 4: Write article Markdown
- [ ] Step 5: Generate inline images and cover
- [ ] Step 6: Review the package
- [ ] Step 7: Publish when requested
```

### Step 1: Resolve Brief and Workspace

Determine what the user wants:

| User asks | Deliver |
| --- | --- |
| 选题 / 题库 / 今天写什么 | topic candidates only unless they ask to continue |
| 写一篇 / 编写 / 成稿 | publish-ready Markdown article |
| 配图 / 图片生成 / 封面 | finished local image files and updated Markdown links |
| 发布 / 发公众号 / 草稿箱 | publish via `post-to-wechat` after dry-run |
| 全流程 | topic, article, images, review, then publish only if explicitly requested |

If the request gives no source material, choose a topic from current public sources and verify it. For current GitHub projects, products, security news, laws, prices, stats, or recent events, verify with current sources before making claims.

### Step 2: Select or Validate Topic

For topic selection, produce 5-10 candidates with:

- proposed title
- one-sentence angle
- reader pain point
- why it is timely or worth publishing
- required sources to verify
- image plan
- publish risk: `low`, `medium`, or `high`

Score candidates using:

- reader utility: can a technical reader do or judge something after reading?
- specificity: named project/event/tool beats generic trend
- freshness: recent release, incident, debate, or visible adoption
- tension: clear contrast, controversy, tradeoff, or misunderstanding
- evidence: primary sources are available
- visual potential: concept can become 1 cover + 2-4 useful inline images

Avoid topics that are only broad opinions, cannot be verified, or duplicate recent articles in the working folder.

### Step 3: Research and Verify Facts

Use primary sources whenever possible:

- GitHub: README, docs, releases, issues/PRs, project website
- Security/news: vendor advisory, researcher post, CVE/NVD, official response, reputable reporting
- Products/tools: official docs, changelog, pricing page, announcement post
- Academic/medical/legal/high-stakes claims: primary paper or official regulator/source

Do not invent features, metrics, dates, commands, or numbers. If a claim is inferred, phrase it as interpretation, not fact. Keep source URLs in the draft, either inline as plain URLs or as bottom citations.

### Step 4: Write Article Markdown

Create a Markdown file in the working folder unless the user gives another path. Use a readable Chinese filename or stable slug.

Use frontmatter:

```md
---
title: 标题
summary: 80-120 字摘要
author: 智元安全
cover: assets/wechat-covers/<cover-file>.png
---
```

Recommended article shape:

```md
# 标题

痛点开场。

项目/事件一句话定位 + 关键来源链接。

## 一、它解决什么问题

![概念图](assets/<slug>/01-overview.png)

## 二、它怎么工作 / 事情怎么发生

## 三、关键设计、争议或风险

![机制图](assets/<slug>/02-mechanism.png)

## 四、怎么使用 / 普通人该怎么判断

## 五、适合谁 / 不适合谁

## 我的看法

## 结尾
```

Writing rules:

- Start from a concrete pain point, not background boilerplate.
- Explain the project/event in Chinese for a technical but non-specialist reader.
- Prefer scenes, contrasts, and consequences over feature lists.
- Keep technical terms, commands, repo names, and product names precise.
- Add judgment, but separate judgment from sourced facts.
- Remove AI-like filler: no empty slogans, no generic "时代浪潮", no repeated "真正重要的是".

### Step 5: Generate Inline Images and Cover

Inline images:

- Use `$ian-xiaohei-illustrations` for all WeChat article inline illustrations unless the user explicitly requests another visual system.
- Generate actual PNGs, not prompts only.
- Save under `assets/<topic-slug>/`.
- Use relative Markdown links.
- Use numbered names: `01-overview.png`, `02-architecture.png`, `03-workflow.png`, `04-impact.png`.
- Each image must explain one useful idea: concept contrast, workflow, architecture, threat path, decision tree, or impact map.
- Follow the Ian Xiaohei defaults: 16:9 horizontal article illustration, pure white background, black hand-drawn linework, small black character as the core actor, sparse red/orange/blue handwritten Chinese annotations, large whitespace, no PPT-like diagrams.

Cover image:

- Use `wechat-cover-image`.
- Save under `assets/wechat-covers/`.
- Keep main cover text short, usually 8-18 Chinese characters.
- Ensure brand label is `智元安全`.
- Update the article frontmatter `cover:` path after the file exists.

Do not leave image references pointing to temporary generated-image cache paths.

### Step 6: Review the Package

Before saying the article is ready, check:

- Markdown frontmatter has `title`, `summary`, `author`, and cover if publishing.
- All local image paths exist.
- Source URLs exist and match the claims.
- Install commands, version numbers, dates, stars, and prices were verified if mentioned.
- The title is strong but not misleading.
- The summary fits WeChat draft usage.
- The article does not read like a README translation.

### Step 7: Publish When Requested

Only publish when the user explicitly asks to publish or save to WeChat draft.

Use `post-to-wechat`. Run dry-run first:

```bash
bun skills/post-to-wechat/scripts/wechat-api.ts \
  "<article.md>" \
  --theme zhiyuan \
  --color gray \
  --author "智元安全" \
  --title "<title>" \
  --summary "<summary>" \
  --cover assets/wechat-covers/<cover>.png \
  --dry-run
```

If dry-run passes, publish with the same command without `--dry-run`.

If WeChat returns `40164 invalid ip`, report the exact IP and ask the user to add it to the Official Account IP whitelist. Do not retry blindly.

## Completion Report

For topic work, report selected candidates and recommended next action.

For article/image work, report:

- article file path
- cover file path
- inline image paths
- sources used
- verification performed

For publishing, report:

- method: API or browser
- draft result or error
- media_id when available
