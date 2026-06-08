# oh-skills

[![skills.sh](https://skills.sh/b/0xfelixli/oh-skills)](https://skills.sh/0xfelixli/oh-skills)

A small collection of agent skills for Claude Code, Codex, and other agents supported by the `skills` CLI.

Each skill lives under `skills/<skill-name>/` and is defined by a `SKILL.md` file with YAML frontmatter.

## Usage

### Browse

List the skills in this repository:

```bash
npx skills add 0xfelixli/oh-skills --list
```

### Install

Install a skill from this repository:

```bash
npx skills add 0xfelixli/oh-skills --skill <skill-name> -a claude-code -a codex
```

Examples:

```bash
npx skills add 0xfelixli/oh-skills --skill post-to-wechat -a claude-code -a codex
npx skills add 0xfelixli/oh-skills --skill browser-deck -a claude-code -a codex
```

Install for only one agent:

```bash
npx skills add 0xfelixli/oh-skills --skill post-to-wechat -a claude-code
npx skills add 0xfelixli/oh-skills --skill post-to-wechat -a codex
```

Install all skills from this repository:

```bash
npx skills add 0xfelixli/oh-skills --skill '*' -a claude-code -a codex
```

If you have cloned this repository, you can also install from a local path:

```bash
npx skills add ./skills/post-to-wechat -a claude-code -a codex
npx skills add ./skills/browser-deck -a claude-code -a codex
```

### Update

If the skill was installed with `npx skills add`, update installed skills with:

```bash
npx skills update
```

If you installed from a local clone, pull the latest repo first, then install the skill again:

```bash
git pull
npx skills add ./skills/browser-deck -a claude-code -a codex
```

### Uninstall

If the skill was installed with `npx skills add`, remove it with:

```bash
npx skills remove browser-deck
```

Remove it from a specific agent:

```bash
npx skills remove browser-deck -a claude-code
npx skills remove browser-deck -a codex
```

If the skill was copied manually, remove the installed skill directory instead:

```bash
rm -rf ~/.agents/skills/browser-deck
rm -rf ~/.codex/skills/browser-deck
```

If you only want to remove a skill from this repository checkout:

```bash
rm -rf skills/browser-deck
```

Restart Claude Code or Codex after installing, updating, or uninstalling skills.

## Skills

### 1) `post-to-wechat`

Publish Markdown, HTML, or image content to WeChat Official Account, with API and browser-assisted publishing modes.

### 2) `wechat-cover-image`

Generate WeChat Official Account cover images, defaulting to `900x383`, with brand labels and title-safe layout.

### 3) `last30days`

Research how people discussed a topic over the last 30 days across Reddit, X, YouTube, Hacker News, GitHub, and more.

### 4) `browser-deck`

Create browser-ready HTML slide decks that can be opened, shared, and presented directly.

### 5) `conduit`

Use the Conduit CLI to manage Phabricator / Phorge tasks, diffs, repositories, and projects.

### 6) `threat-scout`

Run entrypoint-based security audits that produce evidence-backed findings, PoCs, and durable audit artifacts.

### 7) `duanzi-writer`

Write Chinese social-media jokes, punchy observations, and short comedic posts for AI tools, developer workflows, products, and internet culture.

### 8) `wechat-cover-image-py`

Generate simple WeChat Official Account cover images locally with Python and Pillow.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the expected structure and review checklist.

## Security

Skills can execute tools and scripts depending on the agent runtime. Review a skill before installing it, especially if it uses credentials, browser automation, local files, or network APIs. To report a vulnerability, see [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).

## Notes

- This repository is a collection of skills, not a traditional application project.
- Local runtime artifacts like `.env`, `node_modules`, `.DS_Store`, credentials, cookies, and generated drafts should not be committed.
