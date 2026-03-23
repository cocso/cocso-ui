import { source } from "~/libs/source";

export function GET() {
  const pages = source.getPages("en");

  const gettingStarted = pages.filter((p) => p.slugs[0] === "getting-started");
  const foundations = pages.filter((p) => p.slugs[0] === "foundations");
  const components = pages.filter((p) => p.slugs[0] === "components");

  const formatLinks = (items: typeof pages) =>
    items
      .map(
        (p) =>
          `- [${p.data.title}](https://cocso-ui.com/${p.slugs.join("/")}.md): ${p.data.description ?? ""}`
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
