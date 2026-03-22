import { source } from "~/libs/source";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;

  const page = source.getPage([slug], "en");
  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  const title = page.data.title ?? slug;
  const description = page.data.description ?? "";

  const markdown = [
    `# ${title}`,
    "",
    description ? `> ${description}` : "",
    "",
    `Source: [cocso-ui](https://cocso-ui.com/${slug})`,
    "",
    "---",
    "",
    `This page documents the **${title}** in the COCSO UI design system.`,
    "",
    `For the full interactive documentation, visit: https://cocso-ui.com/${slug}`,
  ].join("\n");

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export function generateStaticParams() {
  return source
    .getPages("en")
    .map((page) => ({
      slug: page.slugs.join("/"),
    }));
}
