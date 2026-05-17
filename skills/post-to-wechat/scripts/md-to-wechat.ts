import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

import {
  cleanSummaryText,
  extractSummaryFromBody,
  extractTitleFromMarkdown,
  parseFrontmatter,
  renderMarkdownDocument,
  replaceMarkdownImagesWithPlaceholders,
  resolveColorToken,
  resolveContentImages,
  serializeFrontmatter,
  stripWrappingQuotes,
} from "baoyu-md";

interface ImageInfo {
  placeholder: string;
  localPath: string;
  originalPath: string;
}

interface ParsedResult {
  title: string;
  author: string;
  summary: string;
  htmlPath: string;
  contentImages: ImageInfo[];
}

function applyWechatTypography(html: string): string {
  const serifFont = "'Source Han Serif SC','Noto Serif SC','Songti SC','STSong','SimSun',serif";
  const setCss = (style: string, prop: string, value: string): string => {
    const normalized = style.trim();
    const removed = normalized.replace(new RegExp(`${prop}\\s*:[^;]*;?`, "gi"), "").trim();
    const base = removed.replace(/;+\s*$/g, "");
    return `${base}${base ? "; " : ""}${prop}: ${value};`;
  };

  const withContainer = html.replace(
    /(<section[^>]*class="[^"]*\bcontainer\b[^"]*"[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => {
      let next = setCss(style, "font-family", serifFont);
      next = setCss(next, "font-size", "15px");
      return `${prefix}${next}${suffix}`;
    },
  );

  const withStyledTextNodes = withContainer.replace(
    /(<(?:p|li|blockquote)\b[^>]*\sstyle=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => {
      let next = setCss(style, "font-family", serifFont);
      next = setCss(next, "font-size", "15px");
      if (prefix.toLowerCase().includes("<p")) {
        next = setCss(next, "margin-top", "0.8em !important");
        next = setCss(next, "margin-bottom", "0.8em !important");
      }
      return `${prefix}${next}${suffix}`;
    },
  );

  const compactHeadingStyle = (tag: string, style: string): string => {
    let next = style;
    if (tag === "h1") {
      next = setCss(next, "margin-top", "1.4em !important");
      next = setCss(next, "margin-bottom", "0.8em !important");
      return next;
    }
    if (tag === "h2") {
      next = setCss(next, "margin-top", "1.6em !important");
      next = setCss(next, "margin-bottom", "0.9em !important");
      return next;
    }
    if (tag === "h3") {
      next = setCss(next, "margin-top", "1.1em !important");
      next = setCss(next, "margin-bottom", "0.6em !important");
      return next;
    }
    return next;
  };

  const withCompactHeadings = withStyledTextNodes.replace(
    /(<(h1|h2|h3)\b[^>]*\sstyle=")([^"]*)(")/gi,
    (_m, prefix, tag, style, suffix) => `${prefix}${compactHeadingStyle(String(tag).toLowerCase(), style)}${suffix}`,
  );

  return withCompactHeadings.replace(
    /<(p|li|blockquote)\b(?![^>]*\sstyle=)([^>]*)>/gi,
    (_m, tag, attrs) => {
      const styleParts = [`font-family: ${serifFont};`, "font-size: 15px;"];
      if (tag.toLowerCase() === "p") {
        styleParts.push("margin-top: 0.8em !important;");
        styleParts.push("margin-bottom: 0.8em !important;");
      }
      const style = styleParts.join(" ");
      return `<${tag}${attrs} style="${style}">`;
    },
  );
}

export async function convertMarkdown(
  markdownPath: string,
  options?: { title?: string; theme?: string; color?: string; citeStatus?: boolean },
): Promise<ParsedResult> {
  const baseDir = path.dirname(markdownPath);
  const content = fs.readFileSync(markdownPath, "utf-8");
  const citeStatus = options?.citeStatus ?? true;

  const { frontmatter, body } = parseFrontmatter(content);

  let title = stripWrappingQuotes(options?.title ?? "")
    || stripWrappingQuotes(frontmatter.title ?? "")
    || extractTitleFromMarkdown(body);
  if (!title) {
    title = path.basename(markdownPath, path.extname(markdownPath));
  }

  const author = stripWrappingQuotes(frontmatter.author ?? "");
  const frontmatterSummary = stripWrappingQuotes(frontmatter.description ?? "")
    || stripWrappingQuotes(frontmatter.summary ?? "");
  let summary = cleanSummaryText(frontmatterSummary);
  if (!summary) {
    summary = extractSummaryFromBody(body, 120);
  }

  const { images, markdown: rewrittenBody } = replaceMarkdownImagesWithPlaceholders(
    body,
    "WECHATIMGPH_",
  );
  const rewrittenMarkdown = `${serializeFrontmatter(frontmatter)}${rewrittenBody}`;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wechat-article-images-"));
  const htmlPath = path.join(tempDir, "temp-article.html");

  console.error(
    `[md-to-wechat] Rendering markdown with theme: ${options?.theme ?? "default"}${options?.color ? `, color: ${options.color}` : ""}, citeStatus: ${citeStatus}`,
  );

  const { html } = await renderMarkdownDocument(rewrittenMarkdown, {
    citeStatus,
    defaultTitle: title,
    keepTitle: false,
    primaryColor: resolveColorToken(options?.color),
    theme: options?.theme,
  });
  fs.writeFileSync(htmlPath, applyWechatTypography(html), "utf-8");

  const contentImages = await resolveContentImages(images, baseDir, tempDir, "md-to-wechat");

  return {
    title,
    author,
    summary,
    htmlPath,
    contentImages,
  };
}

function printUsage(): never {
  console.log(`Convert Markdown to WeChat-ready HTML with image placeholders

Usage:
  npx -y bun md-to-wechat.ts <markdown_file> [options]

Options:
  --title <title>     Override title
  --theme <name>      Theme name (default, grace, simple, modern)
  --color <name|hex>  Primary color (blue, green, vermilion, etc. or hex)
  --no-cite           Disable bottom citations for ordinary external links
  --help              Show this help

Output JSON format:
{
  "title": "Article Title",
  "htmlPath": "/tmp/wechat-article-images/temp-article.html",
  "contentImages": [
    {
      "placeholder": "WECHATIMGPH_1",
      "localPath": "/tmp/wechat-image/img.png",
      "originalPath": "imgs/image.png"
    }
  ]
}

Example:
  npx -y bun md-to-wechat.ts article.md
  npx -y bun md-to-wechat.ts article.md --theme grace
  npx -y bun md-to-wechat.ts article.md --theme modern --color blue
  npx -y bun md-to-wechat.ts article.md --no-cite
`);
  process.exit(0);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printUsage();
  }

  let markdownPath: string | undefined;
  let title: string | undefined;
  let theme: string | undefined;
  let color: string | undefined;
  let citeStatus = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === "--title" && args[i + 1]) {
      title = args[++i];
    } else if (arg === "--theme" && args[i + 1]) {
      theme = args[++i];
    } else if (arg === "--color" && args[i + 1]) {
      color = args[++i];
    } else if (arg === "--cite") {
      citeStatus = true;
    } else if (arg === "--no-cite") {
      citeStatus = false;
    } else if (!arg.startsWith("-")) {
      markdownPath = arg;
    }
  }

  if (!markdownPath) {
    console.error("Error: Markdown file path is required");
    process.exit(1);
  }

  if (!fs.existsSync(markdownPath)) {
    console.error(`Error: File not found: ${markdownPath}`);
    process.exit(1);
  }

  const result = await convertMarkdown(markdownPath, { title, theme, color, citeStatus });
  console.log(JSON.stringify(result, null, 2));
}

await main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
