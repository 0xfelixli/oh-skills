import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { convertMarkdown } from "./md-to-wechat.ts";

interface PreviewOptions {
  markdownPath: string;
  title?: string;
  theme?: string;
  color?: string;
  citeStatus: boolean;
  gallery: boolean;
  outputDir?: string;
  open: boolean;
}

interface PreviewResult {
  theme: string;
  color?: string;
  htmlPath: string;
}

const THEMES = ["zhiyuan", "default", "grace", "simple", "modern"];

function printUsage(): never {
  console.log(`Generate stable WeChat article style preview HTML.

Usage:
  npx -y bun style-preview.ts <markdown_file> [options]

Options:
  --theme <name>      Theme name (zhiyuan, default, grace, simple, modern)
  --color <name|hex>  Primary color (blue, green, vermilion, etc. or hex)
  --gallery           Generate all built-in theme previews
  --title <title>     Override title
  --no-cite           Disable bottom citations for ordinary external links
  --out-dir <path>    Output directory (default: post-to-wechat/previews/<slug>)
  --open              Open the first generated preview in the browser
  --help              Show this help

Examples:
  npx -y bun style-preview.ts article.md --theme zhiyuan
  npx -y bun style-preview.ts article.md --gallery
`);
  process.exit(0);
}

function slugFromPath(filePath: string): string {
  const base = path.basename(filePath, path.extname(filePath)).trim();
  const slug = base
    .replace(/[\\/:*?"<>|#%{}^~[\]`;\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "article";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function previewFilename(theme: string, color?: string): string {
  const colorPart = color ? `-${color.replace(/[^a-zA-Z0-9_-]+/g, "").toLowerCase()}` : "";
  return `${theme}${colorPart}.html`;
}

function rewritePreviewHtml(html: string, contentImages: Array<{ placeholder: string; localPath: string }>): string {
  let next = html;
  for (const image of contentImages) {
    const fileUrl = pathToFileURL(image.localPath).href;
    next = next.replace(new RegExp(escapeRegExp(image.placeholder), "g"), fileUrl);
  }
  return next;
}

function parseArgs(argv: string[]): PreviewOptions {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
  }

  let markdownPath = "";
  let title: string | undefined;
  let theme: string | undefined;
  let color: string | undefined;
  let citeStatus = true;
  let gallery = false;
  let outputDir: string | undefined;
  let open = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--title" && argv[i + 1]) {
      title = argv[++i];
    } else if (arg === "--theme" && argv[i + 1]) {
      theme = argv[++i];
    } else if (arg === "--color" && argv[i + 1]) {
      color = argv[++i];
    } else if (arg === "--no-cite") {
      citeStatus = false;
    } else if (arg === "--gallery") {
      gallery = true;
    } else if (arg === "--out-dir" && argv[i + 1]) {
      outputDir = argv[++i];
    } else if (arg === "--open") {
      open = true;
    } else if (!arg.startsWith("-")) {
      markdownPath = arg;
    }
  }

  if (!markdownPath) {
    throw new Error("Markdown file path is required");
  }
  if (!fs.existsSync(markdownPath)) {
    throw new Error(`File not found: ${markdownPath}`);
  }

  return {
    markdownPath,
    title,
    theme,
    color,
    citeStatus,
    gallery,
    outputDir,
    open,
  };
}

async function generatePreview(
  options: PreviewOptions,
  theme: string,
  outputDir: string,
): Promise<PreviewResult> {
  const rendered = await convertMarkdown(options.markdownPath, {
    title: options.title,
    theme,
    color: options.color,
    citeStatus: options.citeStatus,
  });

  const html = fs.readFileSync(rendered.htmlPath, "utf-8");
  const previewHtml = rewritePreviewHtml(html, rendered.contentImages);
  const htmlPath = path.join(outputDir, previewFilename(theme, options.color));
  fs.writeFileSync(htmlPath, previewHtml, "utf-8");

  return {
    theme,
    color: options.color,
    htmlPath,
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const slug = slugFromPath(options.markdownPath);
  const outputDir = path.resolve(options.outputDir || path.join(process.cwd(), "post-to-wechat", "previews", slug));
  fs.mkdirSync(outputDir, { recursive: true });

  const themes = options.gallery ? THEMES : [options.theme || "default"];
  const previews: PreviewResult[] = [];

  for (const theme of themes) {
    previews.push(await generatePreview(options, theme, outputDir));
  }

  if (options.open && previews[0]) {
    const first = previews[0].htmlPath;
    const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
    const args = process.platform === "win32" ? ["/c", "start", "", first] : [first];
    spawnSync(opener, args, { stdio: "ignore", detached: true });
  }

  console.log(JSON.stringify({ outputDir, previews }, null, 2));
}

await main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
