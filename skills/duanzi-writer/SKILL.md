---
name: duanzi-writer
description: "Write Chinese social-media jokes, punchy observations, and short comedic posts. Use when the user asks for 段子, 搞笑文案, 社交媒体段子, X/微博/朋友圈段子, 吐槽, 玩梗, or wants a funny short post about a product, tool, workflow, AI agent, developer life, startup, or internet culture."
---

# Duanzi Writer

Use this skill to write short Chinese social-media jokes with a clear setup, a turn, and a punchline. The output should feel like something a real person would post, not branded copy or stand-up homework.

## Defaults

- Language: Chinese unless the user requests another language.
- Length: 1-5 short lines.
- Surface: X / 微博 / 即刻 / 朋友圈 style.
- Tone: dry, sharp, slightly self-mocking, internet-native.
- Topic bias: AI tools, agents, skills, developer workflow, product building, startup life, and daily work absurdity.
- Output: the finished post only, unless the user asks for variants or notes.

## Workflow

1. Identify the object being joked about: product, role, workflow, habit, or social phenomenon.
2. Find the contradiction: what people say vs what actually happens, expectation vs reality, tool promise vs human behavior.
3. Pick one comedic shape:
   - **Before / after**: "以前...现在..."
   - **Fake seriousness**: over-explain a tiny thing like it is a major system design decision.
   - **Role reversal**: tool becomes the manager, user becomes the intern.
   - **Truth disguised as complaint**: a joke that is funny because it is too accurate.
   - **Escalation**: each line gets more specific until the last line snaps.
4. Write the shortest version that still lands.
5. Remove generic AI phrasing, slogans, and explainer language.

## Output Shapes

### Single Punchline

```text
<setup>
<turn>
<punchline>
```

### Before / After

```text
以前：<old behavior>
现在：<new behavior>

<punchline>
```

### Fake Definition

```text
<term>：不是<obvious definition>。
是<funny but accurate definition>。
```

### Mini Thread

Use only when the user asks for a longer post:

```text
1. <first beat>
2. <second beat>
3. <third beat>

<final punchline>
```

## Quality Bar

A good duanzi should:

- make one clear joke, not three half-jokes
- include one concrete detail from the topic
- sound postable without explaining why it is funny
- have a final line that changes how the earlier lines read
- be easy to read aloud

Avoid:

- "笑死", "太真实了", "狠狠共鸣了" unless used ironically and sparingly
- hashtags unless the user asks
- emoji unless the user asks
- long setup paragraphs
- generic contrasts like "提升效率 / 解放双手"
- punchlines that only repeat the premise
- moralizing, advice, or marketing CTA

## Topic Handling

For products or tools:

- Joke about the user's lived experience, not the feature list.
- Prefer "it made me behave differently" over "it supports X".
- If facts are unclear, avoid factual claims and joke about the pattern.

For AI / agents / skills:

- Good targets: over-delegation, prompt guilt, agents asking clarifying questions, tools becoming more disciplined than users, "automation" creating new work.
- Do not imply real product capabilities unless the user provides them.

For workplace topics:

- Keep it relatable and specific.
- Avoid punching down at individuals, protected groups, or private people.

## Variant Mode

If the user asks for multiple options, provide 3-5 variants. Make each variant structurally different, not just reworded:

```text
1.
...

2.
...

3.
...
```

## Final Check

Before responding, verify:

- no em dash or en dash
- no explanatory preface
- no "这个段子的笑点是"
- no empty hype words
- the last line is the strongest line
