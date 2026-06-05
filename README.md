# oh-skills

A small collection of agent skills I find useful, plus installation commands for Claude Code and Codex.

## Usage

Install a skill from this repository:

```bash
npx skills add 0xfelixli/oh-skills@<skill-name> -a claude -a codex
```

Examples:

```bash
npx skills add 0xfelixli/oh-skills@post-to-wechat -a claude -a codex
npx skills add 0xfelixli/oh-skills@browser-deck -a claude -a codex
```

Install for only one agent:

```bash
npx skills add 0xfelixli/oh-skills@post-to-wechat -a claude
npx skills add 0xfelixli/oh-skills@post-to-wechat -a codex
```

If you have cloned this repository, you can also install from a local path:

```bash
npx skills add ./skills/post-to-wechat -a claude -a codex
npx skills add ./skills/browser-deck -a claude -a codex
```

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

## Notes

- This repository is mainly a personal collection of useful skills, not a traditional application project.
- Local runtime artifacts like `.env`, `node_modules`, `.DS_Store` should not be committed.
