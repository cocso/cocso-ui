import { PlatformId } from "./types.js";

export const SERVER_NAME = "@cocso-ui/cocso-ui-mcp";
export const SERVER_VERSION = "0.0.1";

export const COCSO_DOCS_CANONICAL_ORIGIN = "https://cocso-ui.com";
export const LLM_INDEX_URL = `${COCSO_DOCS_CANONICAL_ORIGIN}/llms.txt`;

export const REACT_PACKAGE_NAME = "@cocso-ui/react";
export const REACT_NATIVE_PACKAGE_NAME = "@cocso-ui/react-native";

export const DEFAULT_MAX_RESULTS = 8;
export const REGISTRY_CACHE_TTL_MS = 5 * 60 * 1000;
export const DOCUMENT_CACHE_TTL_MS = 10 * 60 * 1000;

export const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "build",
  "create",
  "for",
  "in",
  "new",
  "of",
  "on",
  "page",
  "screen",
  "the",
  "to",
  "with",
]);

export const IMPORT_PACKAGE_BY_PLATFORM: Record<PlatformId, string> = {
  [PlatformId.REACT]: REACT_PACKAGE_NAME,
  [PlatformId.REACT_NATIVE]: REACT_NATIVE_PACKAGE_NAME,
};
