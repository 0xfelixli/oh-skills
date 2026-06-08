---
name: duanzi-writer
version: 1.0.0
description: "Write Chinese social-media jokes, punchy observations, roast-style posts, and short comedic copy. Use when the user asks for 段子, 搞笑文案, 社交媒体段子, X/微博/朋友圈/即刻发文, 吐槽, 玩梗, 整活, or wants a funny short post about AI tools, agents, skills, developer life, products, startup work, or internet culture."
repository: https://github.com/0xfelixli/oh-skills
license: MIT
author: 0xfelixli
---

# Duanzi Writer

写中文社交媒体段子。目标是“像人发的”，不是广告语、脱口秀稿、公众号开头，或者解释笑点的小作文。

## Output Contract

- 默认中文。
- 默认 1-5 行，每行尽量短。
- 默认适合 X / 微博 / 即刻 / 朋友圈。
- 默认语气：冷、准、有点自嘲，不卖力搞笑。
- 除非用户要求解释、评审或多版本，只输出成品段子。
- 用户只给一个主题时，直接写，不要追问。

## Workflow

先在心里做，不要把过程输出：

1. 抓对象：工具、职业、工作流、习惯、产品承诺、互联网现象。
2. 找矛盾：说法 vs 实际、承诺 vs 体感、效率 vs 新麻烦、人控制工具 vs 工具管人。
3. 写 2-3 个候选方向，选最具体、最短、最后一句最狠的那个。
4. 删掉解释、铺垫、口号和营销词。

好段子的核心不是“好笑词”，而是一个准确到刺痛的观察。

## Comedic Shapes

优先用这些结构，按主题自然选择。

### Before / After

```text
以前：<人的旧麻烦>
现在：<工具带来的新麻烦>

<最后一句反转>
```

### Role Reversal

```text
我以为我是来指挥<工具>的。
后来发现<工具>比较像我的直属领导。
```

### Fake Definition

```text
<词>：不是<表面定义>。
是<更真实、更具体、更尴尬的定义>。
```

### False Upgrade

```text
<事情>终于升级了。

以前是<低级痛苦>，现在是<高级痛苦>。
```

### Escalation

```text
第一步：<正常>
第二步：<有点不对>
第三步：<彻底暴露荒谬>
```

## Topic Defaults

### AI / Agent / Skills

- 好靶子：过度委托、提示词负罪感、agent 反过来问需求、工具比用户更自律、自动化制造新待办。
- 不要编造具体能力。没有事实依据时，写使用体感和人类行为。
- 不要写成“AI 赋能效率提升”。段子要写“效率提升之后，人开始欠 AI 作业”。

### Developer / Startup Work

- 好靶子：需求不清、开会、重构、上线前信仰、工具链、TODO、技术债、PR review。
- 用具体动作代替抽象词：不要只写“协作成本”，写“为了省一条消息，开了半小时会”。

### Products / Tools

- 写用户体感，不写功能列表。
- 把卖点翻译成人的行为变化。
- 可以轻微吐槽，但不要损害不确定事实。

## Quality Bar

好的段子应该：

- 只打一个笑点，不堆三个半成品笑点。
- 至少有一个具体细节。
- 最后一行最强，最好能反过来解释前面的铺垫。
- 读出来顺，不像翻译腔。
- 有一点立场：不是“这个东西很有趣”，而是“这个荒谬点我看见了”。

## Avoid

- 不要用“笑死”“太真实了”“狠狠共鸣了”当拐杖。
- 不要 hashtag，除非用户要求。
- 不要 emoji，除非用户要求。
- 不要长铺垫。
- 不要“提升效率 / 解放双手 / 重新定义 / 生产力革命”。
- 不要解释“这个段子的笑点是”。
- 不要道德总结、人生建议、营销 CTA。
- 不要攻击私人个体、弱势群体或受保护身份。

## Variant Mode

用户要“多来几个”“几个版本”“选一个”时，给 3-5 个。每个版本必须换结构，不能只是换词：

```text
1.
...

2.
...

3.
...
```

## Calibration Examples

Use these as rhythm references, not templates to repeat.

```text
以前写需求，是我折磨 AI。
现在装了 Skills，是 AI 先折磨我：
"这个目标不够明确。"
```

```text
自动化最神奇的地方：
它真的帮我省了很多时间。

然后我把省下来的时间都拿去维护自动化了。
```

```text
Agent 不是来替我工作的。

它是来证明：我以前不是没时间，是没把话说清楚。
```

## Final Check

发送前检查：

- 没有 em dash 或 en dash。
- 没有解释性前言。
- 没有空泛热词。
- 没有把段子写成广告。
- 最后一行是最强的一行。
