import { TtlCache } from "./cache.js";
import { DOCUMENT_CACHE_TTL_MS } from "./config.js";
import { LogStatus, log } from "./logger.js";
import type { ComponentEntry } from "./types.js";

const cache = new TtlCache();

function docCacheKey(componentSlug: string): string {
  return `component-doc:${componentSlug}`;
}

export async function getComponentMarkdown(
  component: ComponentEntry
): Promise<string> {
  const key = docCacheKey(component.slug);
  const cached = cache.get<string>(key);
  if (cached) {
    return cached;
  }

  const startedAt = Date.now();
  const response = await fetch(component.url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch component markdown: ${component.slug} (${response.status})`
    );
  }

  const markdown = await response.text();
  if (markdown.trim().length === 0) {
    throw new Error(`Received empty component markdown for ${component.slug}`);
  }

  cache.set(key, markdown, DOCUMENT_CACHE_TTL_MS);

  log({
    event: "component_markdown_fetched",
    status: LogStatus.SUCCESS,
    durationMs: Date.now() - startedAt,
    details: {
      slug: component.slug,
      url: component.url,
    },
  });

  return markdown;
}
