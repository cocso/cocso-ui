import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { source } from "~/libs/source";

const EN_PREFIX_PATTERN = /^en\//;
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
    const rawMdx = await readFile(join(CONTENT_DIR, `${slug.join("/")}.mdx`), "utf-8");
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

  // Remove JSX nesting indentation (2–4 spaces)
  md = md.replace(JSX_INDENT_RE, "");

  // Resolve example placeholders into code blocks (after indent strip)
  md = md.replace(EXAMPLE_PLACEHOLDER_RE, (_, name: string) =>
    examples.has(name) ? `\`\`\`tsx\n${examples.get(name)}\n\`\`\`` : ""
  );

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

  const overview = sections.find((s) => s.title === "Overview");
  const apiRef = sections.find((s) => s.title === "API Reference");
  const exampleSections = sections.filter(
    (s) => s.title !== "Overview" && s.title !== "API Reference"
  );

  const parts: string[] = [];

  // Overview text as intro paragraph
  if (overview?.content) {
    parts.push(overview.content, "");
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
  if (exampleSections.length > 0) {
    parts.push("", "## Usage", "", exampleSections[0].content);
  }

  // Examples — remaining sections demoted to ###
  if (exampleSections.length > 1) {
    parts.push("", "## Examples");
    for (const section of exampleSections.slice(1)) {
      parts.push("", `### ${section.title}`, "", section.content);
    }
  }

  // API Reference
  if (apiRef) {
    parts.push("", "## API Reference", "", apiRef.content);
  }

  return parts.join("\n");
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
