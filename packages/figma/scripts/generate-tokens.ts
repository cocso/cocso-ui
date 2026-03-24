import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

import type {
  FigmaColorValue,
  FigmaSkippedToken,
  FigmaTokenData,
  FigmaTokenDef,
} from "../src/types/token-schema";

const sourcesDir = dirname(
  require.resolve("@cocso-ui/baseframe-sources/package.json")
);

function findYamlFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      results.push(...findYamlFiles(join(dir, entry.name)));
    } else if (entry.name.endsWith(".yaml")) {
      results.push(join(dir, entry.name));
    }
  }
  return results;
}

const HEX_RE = /^#([0-9a-fA-F]{3,8})$/;
const RGBA_RE =
  /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/;
const SIZE_RE = /^(-?[\d.]+)(px|rem)$/;
const TOKEN_REF_RE = /^\$/;
const SHADOW_COMPOSITE_RE = /,.*\d+px/;
const DOLLAR_PREFIX_RE = /^\$/;
const DOT_RE = /\./g;

export function parseHex(hex: string): FigmaColorValue {
  const m = hex.match(HEX_RE);
  if (!m) {
    throw new Error(`Invalid HEX: ${hex}`);
  }
  let h = m[1];

  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length === 4) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }

  const r = Number.parseInt(h.slice(0, 2), 16) / 255;
  const g = Number.parseInt(h.slice(2, 4), 16) / 255;
  const b = Number.parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? Number.parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

export function parseRgba(str: string): FigmaColorValue {
  const m = str.match(RGBA_RE);
  if (!m) {
    throw new Error(`Invalid rgba: ${str}`);
  }
  return {
    r: Number(m[1]) / 255,
    g: Number(m[2]) / 255,
    b: Number(m[3]) / 255,
    a: m[4] !== undefined ? Number(m[4]) : 1,
  };
}

export function parseSize(str: string): number {
  const m = str.match(SIZE_RE);
  if (!m) {
    throw new Error(`Invalid size: ${str}`);
  }
  const value = Number(m[1]);
  return m[2] === "rem" ? value * 16 : value;
}

export function isTokenRef(value: string): boolean {
  return TOKEN_REF_RE.test(value);
}

export function isShadowComposite(value: string): boolean {
  return SHADOW_COMPOSITE_RE.test(value);
}

export function toFigmaName(tokenName: string): string {
  return tokenName.replace(DOLLAR_PREFIX_RE, "").replace(DOT_RE, "/");
}

interface RawToken {
  collection: string;
  modes: string[];
  name: string;
  rawValue: string | number;
}

function loadRawTokens(): {
  tokens: RawToken[];
  modes: string[];
} {
  const yamlFiles = findYamlFiles(sourcesDir);
  const allTokens: RawToken[] = [];
  let modes: string[] = ["default"];

  for (const file of yamlFiles) {
    const content = readFileSync(file, "utf-8");
    const doc = parseYaml(content);

    if (doc?.kind === "TokenCollections" && doc.data) {
      for (const col of doc.data) {
        if (col.modes) {
          modes = col.modes;
        }
      }
      continue;
    }

    if (doc?.kind !== "Tokens" || !doc.data?.tokens) {
      continue;
    }

    const collection = doc.data.collection ?? "global";
    const tokens = doc.data.tokens;

    for (const [tokenName, tokenDef] of Object.entries(tokens)) {
      const values = (tokenDef as { values: Record<string, string | number> })
        .values;
      const rawValue = values.default;
      allTokens.push({
        name: tokenName,
        collection,
        rawValue: typeof rawValue === "number" ? rawValue : String(rawValue),
        modes: Object.keys(values),
      });
    }
  }

  return { tokens: allTokens, modes };
}

export function resolveTokenRef(
  tokenName: string,
  tokenMap: Map<string, string | number>,
  visited: Set<string> = new Set()
): string | number {
  if (visited.has(tokenName)) {
    throw new Error(
      `Circular reference detected: ${[...visited, tokenName].join(" -> ")}`
    );
  }

  const rawValue = tokenMap.get(tokenName);
  if (rawValue === undefined) {
    throw new Error(`Unresolved token reference: ${tokenName}`);
  }

  if (typeof rawValue === "number") {
    return rawValue;
  }
  if (!isTokenRef(rawValue)) {
    return rawValue;
  }

  visited.add(tokenName);
  return resolveTokenRef(rawValue, tokenMap, visited);
}

export function parseResolvedValue(
  value: string | number
):
  | { type: "COLOR"; value: FigmaColorValue }
  | { type: "FLOAT"; value: number } {
  if (typeof value === "number") {
    return { type: "FLOAT", value };
  }

  if (HEX_RE.test(value)) {
    return { type: "COLOR", value: parseHex(value) };
  }

  if (RGBA_RE.test(value)) {
    return { type: "COLOR", value: parseRgba(value) };
  }

  if (SIZE_RE.test(value)) {
    return { type: "FLOAT", value: parseSize(value) };
  }

  const num = Number(value);
  if (!Number.isNaN(num)) {
    return { type: "FLOAT", value: num };
  }

  throw new Error(`Unable to parse token value: ${value}`);
}

export function generateTokenData(): FigmaTokenData {
  const { tokens: rawTokens, modes } = loadRawTokens();

  const tokenMap = new Map<string, string | number>();
  for (const t of rawTokens) {
    tokenMap.set(t.name, t.rawValue);
  }

  const tokens: FigmaTokenDef[] = [];
  const skipped: FigmaSkippedToken[] = [];

  for (const raw of rawTokens) {
    if (typeof raw.rawValue === "string" && isShadowComposite(raw.rawValue)) {
      skipped.push({
        sourceTokenName: raw.name,
        reason:
          "Composite shadow is not mappable to Figma COLOR/FLOAT variable types",
      });
      continue;
    }

    try {
      const resolved = resolveTokenRef(raw.name, tokenMap);
      const parsed = parseResolvedValue(resolved);

      tokens.push({
        name: toFigmaName(raw.name),
        sourceTokenName: raw.name,
        collection: "cocso-ui",
        resolvedType: parsed.type,
        values: { default: parsed.value },
      });
    } catch (err) {
      skipped.push({
        sourceTokenName: raw.name,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    collections: [{ name: "cocso-ui", modes }],
    tokens,
    skipped,
  };
}

function main() {
  const data = generateTokenData();
  const outDir = resolve(SCRIPT_DIR, "../src/generated");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "tokens.json"),
    JSON.stringify(data, null, 2),
    "utf-8"
  );

  console.log(
    `Generated ${data.tokens.length} tokens, skipped ${data.skipped.length}`
  );
  if (data.skipped.length > 0) {
    console.log("Skipped tokens:");
    for (const s of data.skipped) {
      console.log(`  - ${s.sourceTokenName}: ${s.reason}`);
    }
  }
}

main();
