import { TtlCache } from "./cache.js";
import {
  COCSO_DOCS_CANONICAL_ORIGIN,
  DEFAULT_MAX_RESULTS,
  IMPORT_PACKAGE_BY_PLATFORM,
  LLM_INDEX_URL,
  REGISTRY_CACHE_TTL_MS,
  STOP_WORDS,
} from "./config.js";
import { LogStatus, log } from "./logger.js";
import {
  type ComponentEntry,
  type DocLink,
  DocumentationSectionId,
  PlatformId,
  type RegistrySnapshot,
} from "./types.js";

const cache = new TtlCache();
const REGISTRY_CACHE_KEY = "registry:snapshot";

const SECTION_HEADING_RE = /^##\s+(.+)$/gm;
const LINK_LINE_RE = /^-\s+\[(.+?)\]\((https?:\/\/[^)]+)\):\s*(.*)$/gm;
const TRAILING_SLASHES_RE = /\/+$/;
const MARKDOWN_EXTENSION_RE = /\.md$/;
const TOKEN_SPLIT_RE = /[^a-z0-9]+/;

const SECTION_LABEL_TO_ID: Record<string, DocumentationSectionId> = {
  "getting started": DocumentationSectionId.GETTING_STARTED,
  foundations: DocumentationSectionId.FOUNDATIONS,
  components: DocumentationSectionId.COMPONENTS,
};

function normalizeSectionLabel(value: string): string {
  return value.trim().toLowerCase();
}

function toComponentSlug(url: string): string {
  const noQuery = url.split("?")[0] ?? url;
  const trimmed = noQuery.replace(TRAILING_SLASHES_RE, "");
  const parts = trimmed.split("/");
  const last = parts.at(-1) ?? "";
  return last.replace(MARKDOWN_EXTENSION_RE, "");
}

function toCanonicalDocUrl(url: string): string {
  const parsed = new URL(url);
  const canonicalBase = new URL(COCSO_DOCS_CANONICAL_ORIGIN);
  parsed.protocol = canonicalBase.protocol;
  parsed.hostname = canonicalBase.hostname;
  parsed.port = canonicalBase.port;
  return parsed.toString();
}

function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(TOKEN_SPLIT_RE)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function scoreComponent(entry: ComponentEntry, tokens: string[]): number {
  if (tokens.length === 0) {
    return 0;
  }

  const title = entry.title.toLowerCase();
  const slug = entry.slug.toLowerCase();
  const description = entry.description.toLowerCase();

  return tokens.reduce((score, token) => {
    if (title.includes(token)) {
      return score + 4;
    }
    if (slug.includes(token)) {
      return score + 3;
    }
    if (description.includes(token)) {
      return score + 1;
    }
    return score;
  }, 0);
}

export function parseLlmsIndex(markdown: string): DocLink[] {
  const sectionRanges: Array<{
    id: DocumentationSectionId;
    start: number;
  }> = [];

  let sectionMatch = SECTION_HEADING_RE.exec(markdown);
  while (sectionMatch) {
    const section =
      SECTION_LABEL_TO_ID[normalizeSectionLabel(sectionMatch[1] ?? "")];
    if (section) {
      sectionRanges.push({
        id: section,
        start: sectionMatch.index,
      });
    }
    sectionMatch = SECTION_HEADING_RE.exec(markdown);
  }

  const results: DocLink[] = [];
  let linkMatch = LINK_LINE_RE.exec(markdown);
  while (linkMatch) {
    const matchIndex = linkMatch.index;
    const [_, title, url, description] = linkMatch;
    const nearest = [...sectionRanges]
      .reverse()
      .find((range) => range.start <= matchIndex);

    const section = nearest?.id ?? DocumentationSectionId.COMPONENTS;

    results.push({
      title: title.trim(),
      url: toCanonicalDocUrl(url.trim()),
      description: description.trim(),
      section,
    });

    linkMatch = LINK_LINE_RE.exec(markdown);
  }

  return results;
}

function linksToComponents(
  links: DocLink[],
  platform: PlatformId = PlatformId.REACT
): ComponentEntry[] {
  if (platform === PlatformId.REACT_NATIVE) {
    return [];
  }

  return links
    .filter((link) => link.section === DocumentationSectionId.COMPONENTS)
    .map((link) => ({
      title: link.title,
      slug: toComponentSlug(link.url),
      url: link.url,
      description: link.description,
      importPackage: IMPORT_PACKAGE_BY_PLATFORM[platform],
    }));
}

export async function getRegistrySnapshot(): Promise<RegistrySnapshot> {
  const cached = cache.get<RegistrySnapshot>(REGISTRY_CACHE_KEY);
  if (cached) {
    return cached;
  }

  const startedAt = Date.now();
  const response = await fetch(LLM_INDEX_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch llms index: ${response.status}`);
  }

  const markdown = await response.text();
  const links = parseLlmsIndex(markdown);

  const snapshot: RegistrySnapshot = {
    fetchedAtIso: new Date().toISOString(),
    links,
    components: linksToComponents(links),
  };

  cache.set(REGISTRY_CACHE_KEY, snapshot, REGISTRY_CACHE_TTL_MS);

  log({
    event: "registry_snapshot_fetched",
    status: LogStatus.SUCCESS,
    durationMs: Date.now() - startedAt,
    details: {
      componentCount: snapshot.components.length,
      linkCount: snapshot.links.length,
    },
  });

  return snapshot;
}

export async function listComponents(
  platform: PlatformId
): Promise<ComponentEntry[]> {
  const snapshot = await getRegistrySnapshot();
  return linksToComponents(snapshot.links, platform);
}

export async function searchComponents(
  query: string,
  platform: PlatformId,
  maxResults = DEFAULT_MAX_RESULTS
): Promise<ComponentEntry[]> {
  const components = await listComponents(platform);
  const tokens = tokenizeQuery(query);

  return [...components]
    .map((component) => ({
      component,
      score: scoreComponent(component, tokens),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.component);
}

export function rankComponentsForPrompt(
  prompt: string,
  components: ComponentEntry[],
  maxResults = DEFAULT_MAX_RESULTS
): ComponentEntry[] {
  const tokens = tokenizeQuery(prompt);
  return [...components]
    .map((component) => ({
      component,
      score: scoreComponent(component, tokens),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.component);
}
