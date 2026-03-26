import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { source } from "~/libs/source";

const CONTENT_DIR = join(process.cwd(), "content", "en");
const EXAMPLE_DIR = join(process.cwd(), "src", "components", "example");

const FRONTMATTER_RE = /^---[\s\S]*?---\n*/;
const SELF_CLOSING_EXAMPLE_RE = /<ComponentExample\s+name="([^"]+)"\s*\/>/g;
const CODE_TAG_RE = /<code>(.*?)<\/code>/g;
const SECTION_TITLE_RE = /<Section\.Title>(.*?)<\/Section\.Title>/g;
const SUB_HEADING_RE = /<SubHeading>(.*?)<\/SubHeading>/g;
const SECTION_TEXT_RE = /<Section\.Text>\s*([\s\S]*?)\s*<\/Section\.Text>/g;
const SECTION_LIST_ITEM_RE =
  /<Section\.ListItem>([\s\S]*?)<\/Section\.ListItem>/g;
const PROPS_TABLE_RE = /<PropsTable\s+data=\{(\[[\s\S]*?\])\}\s*\/>/g;
const SECTION_WRAPPER_RE = /<\/?Section(?:\.[A-Za-z]+)?>/g;
const COMPONENT_EXAMPLE_OPEN_RE = /<ComponentExample[^>]*>/g;
const COMPONENT_EXAMPLE_CLOSE_RE = /<\/ComponentExample>/g;
const PAGE_NAV_RE = /<PageNavigation\s*\/>/g;
const JSX_INDENT_RE = /^ {2,4}/gm;
const EXAMPLE_PLACEHOLDER_RE = /<!--EXAMPLE:([^>]+)-->/g;
const EXCESSIVE_NEWLINES_RE = /\n{3,}/g;
const PROPS_ENTRY_RE = /\{[^{}]*\}/g;
const PIPE_RE = /\|/g;
const SECTION_SPLIT_RE = /^## /gm;
const MARKDOWN_CODE_FENCE_RE = /```([^\n`]*)\n([\s\S]*?)\n```/g;
const MARKDOWN_INLINE_CODE_RE = /`([^`\n]+)`/g;
const INDENTED_CODE_FENCE_RE = /^([ \t]*)```([^\n`]*)\n([\s\S]*?)\n\1```/gm;
const CODE_FENCE_PLACEHOLDER_RE = /<!--CODE_FENCE:(\d+)-->/g;

const OVERVIEW_SECTION_TITLES = new Set(["overview"]);
const API_REFERENCE_SECTION_TITLES = new Set(["api reference"]);
const ACCESSIBILITY_SECTION_TITLES = new Set(["accessibility", "접근성"]);
const IMPORT_SECTION_TITLES = new Set(["import", "가져오기"]);

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;

  const page = source.getPage(slug, "en");
  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  const title = page.data.title ?? slug.join("/");
  const description = page.data.description ?? "";

  let body: string;
  try {
    const mdxPath = resolve(CONTENT_DIR, `${slug.join("/")}.mdx`);
    if (!mdxPath.startsWith(CONTENT_DIR)) {
      return new Response("Forbidden", { status: 403 });
    }
    const rawMdx = await readFile(mdxPath, "utf-8");
    const converted = await mdxToMarkdown(rawMdx);
    body = converted.includes("## API Reference")
      ? restructureComponentDoc(converted)
      : converted;
  } catch {
    body = "";
  }

  const parts = [`# ${title}`];
  if (description) {
    parts.push("", description);
  }
  if (body) {
    parts.push("", "---", "", body);
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

// ---------------------------------------------------------------------------
// MDX → Markdown conversion
// ---------------------------------------------------------------------------

async function mdxToMarkdown(raw: string): Promise<string> {
  let md = raw.replace(FRONTMATTER_RE, "");

  // Replace self-closing <ComponentExample /> with placeholders
  const exampleNames = new Set<string>();
  md = md.replace(SELF_CLOSING_EXAMPLE_RE, (_, name: string) => {
    exampleNames.add(name);
    return `<!--EXAMPLE:${name}-->`;
  });

  // Read example files in parallel
  const examples = new Map<string, string>();
  await Promise.all(
    [...exampleNames].map(async (name) => {
      try {
        const code = await readFile(join(EXAMPLE_DIR, `${name}.tsx`), "utf-8");
        examples.set(name, code.trim());
      } catch {
        // skip missing example files
      }
    })
  );

  // Protect code fences from JSX transformations
  const codeFences: string[] = [];
  md = md.replace(
    INDENTED_CODE_FENCE_RE,
    (_, indent: string, infoString: string, code: string) => {
      const indentRe = new RegExp(`^${indent}`, "gm");
      const strippedCode = code.replace(indentRe, "");
      const index = codeFences.length;
      codeFences.push(`\`\`\`${infoString}\n${strippedCode}\n\`\`\``);
      return `<!--CODE_FENCE:${index}-->`;
    }
  );

  // Inline HTML → markdown
  md = md.replace(CODE_TAG_RE, "`$1`");

  // Headings
  md = md.replace(SECTION_TITLE_RE, "## $1");
  md = md.replace(SUB_HEADING_RE, "### $1");

  // Text and lists
  md = md.replace(SECTION_TEXT_RE, "$1");
  md = md.replace(SECTION_LIST_ITEM_RE, "- $1");

  // PropsTable → markdown table
  md = md.replace(PROPS_TABLE_RE, (_, data: string) =>
    propsTableToMarkdown(data)
  );

  // Strip remaining JSX wrapper tags
  md = md.replace(SECTION_WRAPPER_RE, "");
  md = md.replace(COMPONENT_EXAMPLE_OPEN_RE, "");
  md = md.replace(COMPONENT_EXAMPLE_CLOSE_RE, "");
  md = md.replace(PAGE_NAV_RE, "");

  // Strip any remaining custom JSX component tags (PascalCase)
  md = md.replace(/<\/?[A-Z][A-Za-z.]*(?:\s[^>]*)?\/?>/g, "");

  // Remove JSX nesting indentation (2–4 spaces)
  md = md.replace(JSX_INDENT_RE, "");

  // Restore protected code fences
  md = md.replace(
    CODE_FENCE_PLACEHOLDER_RE,
    (_, idx: string) => codeFences[Number(idx)]
  );

  // Resolve example placeholders into code blocks (after indent strip)
  md = md.replace(EXAMPLE_PLACEHOLDER_RE, (_, name: string) =>
    examples.has(name) ? `\`\`\`tsx\n${examples.get(name)}\n\`\`\`` : ""
  );

  md = decodeMarkdownCodeEntities(md);

  // Clean up excessive blank lines
  md = md.replace(EXCESSIVE_NEWLINES_RE, "\n\n");

  return md.trim();
}

// ---------------------------------------------------------------------------
// Component doc restructuring (kumo-ui style)
// ---------------------------------------------------------------------------

interface MdSection {
  content: string;
  title: string;
}

function splitIntoSections(md: string): MdSection[] {
  const parts = md.split(SECTION_SPLIT_RE);
  const sections: MdSection[] = [];

  for (let i = 1; i < parts.length; i++) {
    const newlineIdx = parts[i].indexOf("\n");
    if (newlineIdx === -1) {
      sections.push({ title: parts[i].trim(), content: "" });
    } else {
      sections.push({
        title: parts[i].substring(0, newlineIdx).trim(),
        content: parts[i].substring(newlineIdx + 1).trim(),
      });
    }
  }

  return sections;
}

function restructureComponentDoc(md: string): string {
  const sections = splitIntoSections(md);

  const isOverviewSection = (title: string) =>
    OVERVIEW_SECTION_TITLES.has(normalizeSectionTitle(title));
  const isApiReferenceSection = (title: string) =>
    API_REFERENCE_SECTION_TITLES.has(normalizeSectionTitle(title));
  const isAccessibilitySection = (title: string) =>
    ACCESSIBILITY_SECTION_TITLES.has(normalizeSectionTitle(title));
  const isImportSection = (title: string) =>
    IMPORT_SECTION_TITLES.has(normalizeSectionTitle(title));

  const overview = sections.find((s) => isOverviewSection(s.title));
  const apiRef = sections.find((s) => isApiReferenceSection(s.title));

  const contentSections = sections.filter(
    (s) => !(isOverviewSection(s.title) || isApiReferenceSection(s.title))
  );
  const accessibility = contentSections.find((s) =>
    isAccessibilitySection(s.title)
  );
  const usage =
    contentSections.find((s) => isImportSection(s.title)) ??
    contentSections.find((s) => !isAccessibilitySection(s.title));
  const examples = contentSections.filter(
    (s) => s !== accessibility && s !== usage
  );

  const parts: string[] = [];

  // Overview text as intro paragraph
  if (overview?.content) {
    parts.push(overview.content, "");
  }

  if (accessibility?.content) {
    parts.push("## Accessibility", "", accessibility.content, "");
  }

  // Installation
  parts.push(
    "## Installation",
    "",
    "```bash",
    "npm install @cocso-ui/react",
    "```"
  );

  // Usage — first example section
  if (usage?.content) {
    parts.push("", "## Usage", "", usage.content);
  }

  // Examples — remaining sections demoted to ###
  if (examples.length > 0) {
    parts.push("", "## Examples");
    for (const section of examples) {
      parts.push("", `### ${section.title}`, "", section.content);
    }
  }

  // API Reference
  if (apiRef) {
    parts.push("", "## API Reference", "", apiRef.content);
  }

  return parts.join("\n");
}

function normalizeSectionTitle(title: string): string {
  return title.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// PropsTable helpers
// ---------------------------------------------------------------------------

function propsTableToMarkdown(dataStr: string): string {
  const entries = dataStr.match(PROPS_ENTRY_RE);
  if (!entries) {
    return "";
  }

  const rows: string[] = [];
  for (const entry of entries) {
    const name = extractField(entry, "name");
    const type = extractField(entry, "type");
    const defaultVal = extractField(entry, "default");
    const description = extractField(entry, "description");
    if (!name) {
      continue;
    }

    const escapedType = type ? `\`${type.replace(PIPE_RE, "\\|")}\`` : "-";
    const def = defaultVal ? `\`${defaultVal}\`` : "-";
    rows.push(`| ${name} | ${escapedType} | ${def} | ${description ?? "-"} |`);
  }

  if (rows.length === 0) {
    return "";
  }
  return [
    "| Prop | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

const HTML_ENTITY_MAP: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
};
const HTML_ENTITY_RE = /&(?:lt|gt|amp|quot|#39);/g;

function decodeHtmlEntities(text: string): string {
  return text.replace(
    HTML_ENTITY_RE,
    (entity) => HTML_ENTITY_MAP[entity] ?? entity
  );
}

function decodeMarkdownCodeEntities(markdown: string): string {
  const decodedFences = markdown.replace(
    MARKDOWN_CODE_FENCE_RE,
    (_fullMatch, infoString: string, code: string) => {
      const decodedCode = decodeHtmlEntities(code);
      return `\`\`\`${infoString}\n${decodedCode}\n\`\`\``;
    }
  );

  return decodedFences.replace(
    MARKDOWN_INLINE_CODE_RE,
    (_fullMatch, code: string) => {
      const decodedCode = decodeHtmlEntities(code);
      return `\`${decodedCode}\``;
    }
  );
}

function extractField(objStr: string, field: string): string | undefined {
  const singleQuoted = objStr.match(new RegExp(`${field}:\\s*'([^']*)'`));
  if (singleQuoted) {
    return singleQuoted[1];
  }
  const doubleQuoted = objStr.match(new RegExp(`${field}:\\s*"([^"]*)"`));
  if (doubleQuoted) {
    return doubleQuoted[1];
  }
  return undefined;
}

export function generateStaticParams() {
  return source.getPages("en").map((page) => ({
    slug: page.slugs.filter((s) => s !== "en"),
  }));
}
