# Contributing

Contributions are welcome when they keep skills focused, auditable, and easy to install.

## Skill Structure

Each skill should live in its own directory:

```text
skills/<skill-name>/
  SKILL.md
  references/
  scripts/
  assets/
```

Only `SKILL.md` is required. Use supporting folders only when they make the main skill easier to read.

## SKILL.md Frontmatter

Use YAML frontmatter with at least:

```yaml
---
name: skill-name
version: 1.0.0
description: Clear one-sentence description. Include "Use when..." triggers when helpful.
repository: https://github.com/0xfelixli/oh-skills
license: MIT
author: 0xfelixli
---
```

Keep `name` stable, lowercase, and URL-safe.

## Review Checklist

Before opening a PR:

- Run `npx skills add . --list` from the repository root.
- Do not commit `.env`, cookies, account tokens, API keys, private paths, or generated drafts.
- Document required binaries, environment variables, and external services.
- Prefer examples with placeholders over real account names or credentials.
- Keep scripts small and explain any file, browser, or network access in the skill.
