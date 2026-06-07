import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

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

function setCssDeclaration(style: string, prop: string, value: string): string {
  const normalized = style.trim();
  const removed = normalized.replace(new RegExp(`${prop}\\s*:[^;]*;?`, "gi"), "").trim();
  const base = removed.replace(/;+\s*$/g, "");
  return `${base}${base ? "; " : ""}${prop}: ${value};`;
}

function applyWechatTypography(html: string): string {
  const serifFont = "'Source Han Serif SC','Noto Serif SC','Songti SC','STSong','SimSun',serif";
  const setCss = setCssDeclaration;

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

function applyZhiyuanArticleStyle(html: string): string {
  const bodyFont = "-apple-system-font,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei UI','Microsoft YaHei',Arial,sans-serif";
  const serifFont = "'Songti SC','STSong','SimSun','Noto Serif CJK SC',serif";
  const monoFont = "'SFMono-Regular','Menlo','Consolas','Liberation Mono',monospace";
  const ink = "#3f3f3f";
  const emphasis = "#4b5563";
  const muted = "#8a8f98";
  const border = "#d9dde3";
  const soft = "#f7f7f7";
  const accent = "#5f6368";

  const applyStyle = (style: string, entries: Array<[string, string]>): string => (
    entries.reduce((next, [prop, value]) => setCssDeclaration(next, prop, value), style)
  );

  let next = html.replace(/引用链接/g, "参考来源");

  next = next.replace(
    /(<body\b[^>]*\sstyle=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["background", "#ffffff"],
      ["color", ink],
      ["font-family", serifFont],
      ["font-size", "16px"],
      ["line-height", "1.78"],
      ["padding", "24px"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<section[^>]*class="[^"]*\bcontainer\b[^"]*"[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["font-family", serifFont],
      ["font-size", "15px"],
      ["line-height", "1.82"],
      ["color", ink],
      ["background", "#ffffff"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<p\b[^>]*class="[^"]*\bp\b[^"]*"[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["font-family", serifFont],
      ["font-size", "15px"],
      ["line-height", "1.82"],
      ["letter-spacing", "0.02em"],
      ["color", ink],
      ["margin-top", "1.15em !important"],
      ["margin-bottom", "1.15em !important"],
      ["margin-left", "8px"],
      ["margin-right", "8px"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<p\b[^>]*class="[^"]*\bp\b[^"]*"[^>]*style=")([^"]*)("(?:(?!<\/p>)[\s\S])*(?:<code\b|(?:^|[>\s])https?:\/\/)(?:(?!<\/p>)[\s\S])*<\/p>)/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["font-family", bodyFont],
      ["font-size", suffix.includes("https://") || suffix.includes("http://") ? "14px" : "15px"],
      ["letter-spacing", "0"],
      ["color", suffix.includes("https://") || suffix.includes("http://") ? "#6f7782" : ink],
      ["word-break", suffix.includes("https://") || suffix.includes("http://") ? "break-all" : "normal"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<p\b[^>]*class="[^"]*\bfootnotes\b[^"]*"[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["font-family", bodyFont],
      ["font-size", "13px"],
      ["line-height", "1.7"],
      ["letter-spacing", "0.02em"],
      ["color", muted],
      ["margin", "0.45em 8px !important"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<h2\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["display", "inline-block"],
      ["padding", "0.16em 0.72em"],
      ["margin", "2.8em 0 1.4em !important"],
      ["color", "#ffffff"],
      ["background", accent],
      ["border-radius", "2px"],
      ["font-family", serifFont],
      ["font-size", "17px"],
      ["font-weight", "700"],
      ["line-height", "1.55"],
      ["letter-spacing", "0.02em"],
      ["text-align", "left"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<h3\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["padding-left", "8px"],
      ["margin", "2.2em 8px 0.9em 0 !important"],
      ["color", ink],
      ["background", "transparent"],
      ["border-left", `3px solid ${accent}`],
      ["font-family", serifFont],
      ["font-size", "16px"],
      ["font-weight", "700"],
      ["line-height", "1.45"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<h4\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["margin", "2.2em 8px 0.65em"],
      ["color", muted],
      ["font-family", bodyFont],
      ["font-size", "14px"],
      ["font-weight", "700"],
      ["letter-spacing", "0.03em"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<blockquote\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["margin", "1.5em 0"],
      ["padding", "0.85em 1em"],
      ["border-left", `3px solid ${muted}`],
      ["border-radius", "4px"],
      ["background", "#f8f8f8"],
      ["color", ink],
      ["font-family", serifFont],
      ["font-size", "15px"],
      ["line-height", "1.8"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<blockquote\b[^>]*>[\s\S]*?<p\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["font-family", serifFont],
      ["letter-spacing", "0.02em"],
      ["margin", "0 !important"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<blockquote\b[^>]*>)([\s\S]*?)(<\/blockquote>)/gi,
    (_m, open, inner, close) => `${open}${inner.replace(
      /(<p\b[^>]*style=")([^"]*)(")/gi,
      (_p, prefix, style, suffix) => `${prefix}${applyStyle(style, [
        ["font-family", serifFont],
        ["letter-spacing", "0.02em"],
        ["margin", "0.45em 0 !important"],
      ])}${suffix}`,
    )}${close}`,
  );

  next = next.replace(
    /(<p\b[^>]*class="[^"]*\bp\b[^"]*"[^>]*style="[^"]*"[^>]*>\s*<strong\b[^>]*>[\s\S]*?<\/strong>\s*<\/p>)/gi,
    (match) => match.replace(
      /(<p\b[^>]*style=")([^"]*)(")/i,
      (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
        ["margin-top", "1.55em !important"],
        ["margin-bottom", "1.35em !important"],
      ])}${suffix}`,
    ),
  );

  next = next.replace(
    /(<pre\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["margin", "1.35em 8px"],
      ["background", "#fbfbfb"],
      ["border", `1px solid ${border}`],
      ["border-radius", "6px"],
      ["line-height", "1.6"],
      ["overflow-x", "scroll"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<code\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["font-family", monoFont],
      ["font-size", "13px"],
      ["color", "#24292f"],
      ["background", "rgba(175, 184, 193, 0.16)"],
      ["border-radius", "4px"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<pre\b[^>]*>[\s\S]*?<code\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["display", "block"],
      ["padding", "0.65em 1em 1em"],
      ["color", "#24292f"],
      ["background", "transparent"],
      ["font-size", "13px"],
      ["line-height", "1.6"],
      ["white-space", "pre-wrap"],
      ["overflow-x", "scroll"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<a\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["color", "#576b95"],
      ["text-decoration", "none"],
      ["border-bottom", "0"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<strong\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["color", emphasis],
      ["font-weight", "700"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<(?:ul|ol)\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["padding-left", "1em"],
      ["margin", "1em 0"],
      ["color", ink],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<li\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["font-family", serifFont],
      ["font-size", "15px"],
      ["line-height", "1.78"],
      ["letter-spacing", "0.02em"],
      ["color", ink],
      ["margin", "0.45em 8px"],
    ])}${suffix}`,
  );

  next = next.replace(
    /(<img\b[^>]*style=")([^"]*)(")/gi,
    (_m, prefix, style, suffix) => `${prefix}${applyStyle(style, [
      ["display", "block"],
      ["width", "100%"],
      ["margin", "1.65em auto"],
      ["border-radius", "4px"],
    ])}${suffix}`,
  );

  return next;
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

  const theme = options?.theme === "zhiyuan" ? "default" : options?.theme;
  const color = options?.theme === "zhiyuan" ? (options?.color ?? "gray") : options?.color;

  const { html } = await renderMarkdownDocument(rewrittenMarkdown, {
    citeStatus,
    defaultTitle: title,
    keepTitle: false,
    primaryColor: resolveColorToken(color),
    theme,
  });
  const typedHtml = applyWechatTypography(html);
  fs.writeFileSync(
    htmlPath,
    options?.theme === "zhiyuan" ? applyZhiyuanArticleStyle(typedHtml) : typedHtml,
    "utf-8",
  );

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
  --theme <name>      Theme name (zhiyuan, default, grace, simple, modern)
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
  npx -y bun md-to-wechat.ts article.md --theme zhiyuan
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

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  await main().catch((error) => {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
