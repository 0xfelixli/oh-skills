# oh-skills

A collection of custom Claude Code skills.

## Skills

### wechat-cover

Generate WeChat Official Account cover images (900×383) with gradient background, title, subtitle, and author.

```bash
uv run skills/wechat-cover/cover.py --title "标题" --subtitle "副标题" --author "作者"
```

Options:
- `--title` (required): Main title
- `--subtitle`: Subtitle
- `--author`: Author name (top-left corner)
- `--output`: Output path (default: `cover.png`)
- `--colors`: Gradient colors, comma-separated hex (default: `#1a1a2e,#16213e`)
- `--font`: Custom font file path

## Installation

### As Claude Code Plugin

Add to your `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "oh-skills": {
      "source": {
        "source": "github",
        "repo": "feesec/oh-skills"
      }
    }
  },
  "enabledPlugins": {
    "wechat-cover@oh-skills": true
  }
}
```

Restart Claude Code.

### Manual Installation

```bash
# Install uv (if you don't have it)
brew install uv

# Clone the repo
git clone https://github.com/feesec/oh-skills.git

# Symlink to Claude Code skills directory
ln -s $(pwd)/oh-skills/skills/wechat-cover ~/.claude/skills/wechat-cover

# Install font (if you don't have Noto Sans CJK SC)
brew install font-noto-sans-cjk-sc
```

No need to `pip install` anything — `uv run` handles dependencies automatically.

Restart Claude Code.
