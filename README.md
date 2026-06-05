# oh-skills

A small collection of agent skills I find useful, plus installation commands for Claude Code and Codex.

## Usage

### Install

Install a skill from this repository:

```bash
npx skills add 0xfelixli/oh-skills@<skill-name> -a claude-code -a codex
```

Examples:

```bash
npx skills add 0xfelixli/oh-skills@post-to-wechat -a claude-code -a codex
npx skills add 0xfelixli/oh-skills@browser-deck -a claude-code -a codex
```

Install for only one agent:

```bash
npx skills add 0xfelixli/oh-skills@post-to-wechat -a claude-code
npx skills add 0xfelixli/oh-skills@post-to-wechat -a codex
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

## Notes

- This repository is mainly a personal collection of useful skills, not a traditional application project.
- Local runtime artifacts like `.env`, `node_modules`, `.DS_Store` should not be committed.
