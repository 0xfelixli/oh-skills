# WeChat Style Reference

This reference captures the local `wechat_media` article style. Use it to plan topics, write drafts, and design images.

## Existing Pattern

Representative article themes:

- AI coding tools and agent workflows: `oh-my-pi`, `ECC`, `free-claude-code`
- AI engineering education and skills: `AI Engineering from Scratch`, `Taste Skill`, `Stop Slop`
- code understanding tools: `Understand Anything`
- security/product risk analysis: Edge password memory issue
- practical AI in personal health, with careful boundaries and real evidence

The style is technical, opinionated, and reader-facing. It does not just summarize a README.

## Topic Angles That Fit

Good angles usually have one of these forms:

- "别再把 X 当成 Y": correcting a common misunderstanding
- "X 不该只是 Y": raising the product/engineering bar
- "这个开源项目把 A 做成了 B": concrete project with a clear mechanism
- "厂商回应/行业争议背后真正的问题": security/product risk interpretation
- "从零构建/系统学习": structured technical learning path

Prefer named objects: a repo, release, incident, paper, tool, workflow, or specific vendor response.

Avoid generic topics like "AI 的未来", "程序员如何提升效率", or "大模型改变世界" unless grounded in a concrete artifact.

## Headline Rules

Use Chinese titles with:

- a concrete noun: project/tool/company/event
- a tension or promise
- a clear reader benefit or concern

Examples of local title shapes:

- `别再把AI编程当聊天：ECC把Agent工作流做成工程系统`
- `AI编程工具不该只是聊天框：oh-my-pi把IDE调试器和浏览器都接进来了`
- `别再盲读代码了：Understand-Anything把代码库变成交互式知识图谱`
- `去掉AI味：Stop-Slop教你把机器腔改成人话`
- `微软回应炸了：Edge把密码明文放进内存，这不是漏洞？`

Do not overpromise. If the article is exploratory, make the headline curious, not absolute.

## Opening Pattern

Start with a concrete situation or friction:

- developer trying to use AI inside a real repo
- reader overwhelmed by scattered AI learning resources
- user trusting browser password managers
- writer seeing obvious AI prose
- team trying to make agent workflows repeatable

Then move to the core thesis in 1-3 short paragraphs. The thesis should be quotable but specific.

Good thesis forms:

- `AI 编程工具不能只会“聊天”，它还得会“工作”。`
- `问题不在定义之争，而在暴露窗口。`
- `它不是一个模板市场，而是一组给 AI Agent 用的审美约束。`

## Body Rhythm

Use short paragraphs. Let single-sentence paragraphs carry important turns.

Typical section sequence:

1. pain point or misconception
2. what the project/event is
3. how it works
4. why it matters
5. how to use it or how to judge it
6. limits, risks, or who should not use it
7. personal view

Use bullets for dense facts, but do not turn the article into a feature table.

## Voice

Use plain Chinese with technical precision:

- Keep English names and commands exact.
- Explain technical terms when they affect the reader's judgment.
- Prefer "我的判断是" for interpretation.
- Use "如果这一点成立" or "从公开信息看" when evidence is partial.
- State uncertainty instead of hiding it.

Avoid:

- generic AI filler: `在这个快速变化的时代`, `这背后有一个更大的问题`, `值得所有人思考`
- decorative slogans at the end
- repeating the same contrast pattern too often
- pretending a tool solves all problems

## Image Pattern

Inline images should be explanatory, not decorative. The default visual system is `$ian-xiaohei-illustrations`.

For body illustrations, use Ian Xiaohei style:

- 16:9 horizontal Chinese article illustration
- pure white background
- black hand-drawn linework
- "小黑" as the core actor, not a side decoration
- sparse red/orange/blue handwritten Chinese annotations
- lots of whitespace
- strange but valid metaphor for the article's idea
- no PPT-style flowchart, commercial vector illustration, cute cartoon, or dense architecture diagram

Good image set for a technical article:

- `01-overview.png`: big contrast or concept map
- `02-architecture.png`: components and data/tool flow
- `03-workflow.png`: user/process steps
- `04-impact.png`: risk/benefit/decision map

Use local paths:

```md
![图说明](assets/<topic-slug>/01-overview.png)
```

Cover images should work as WeChat thumbnails:

- ratio about `900x383`
- high contrast
- short Chinese main text
- brand label `智元安全`
- no clutter, no unrelated logos, no tiny unreadable code

## Markdown Packaging

Preferred frontmatter:

```md
---
title: 标题
summary: 摘要
author: 智元安全
cover: assets/wechat-covers/<cover>.png
---
```

Use source links in the body. For GitHub projects, include the GitHub URL and official website if available.
