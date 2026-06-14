import { source } from "~/libs/source";

const LEADING_SLASHES_RE = /^\/+/;
const TRAILING_SLASHES_RE = /\/+$/;

export function GET() {
  const pages = source.getPages("en");

  const toCanonicalPath = (url: string) =>
    url.replace(LEADING_SLASHES_RE, "").replace(TRAILING_SLASHES_RE, "");
  const topLevelSection = (url: string) =>
    toCanonicalPath(url).split("/")[0] ?? "";

  const gettingStarted = pages.filter(
    (page) => topLevelSection(page.url) === "getting-started"
  );
  const foundations = pages.filter(
    (page) => topLevelSection(page.url) === "foundations"
  );
  const components = pages.filter(
    (page) => topLevelSection(page.url) === "components"
  );

  const formatLinks = (items: typeof pages) =>
    items
      .map(
        (page) =>
          `- [${page.data.title}](https://cocso-ui.com/${toCanonicalPath(page.url)}.md): ${page.data.description ?? ""}`
      )
      .join("\n");

  const content = `# COCSO UI

> COCSO UI is a React component library built on Base UI with CSS Modules and design tokens. It provides 23+ accessible, composable components following WAI-ARIA standards. The token system uses CSS custom properties with the \`--cocso-*\` prefix.

## Getting Started

${formatLinks(gettingStarted)}

## Foundations

${formatLinks(foundations)}

## Components

${formatLinks(components)}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
