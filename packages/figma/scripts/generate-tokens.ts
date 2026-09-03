import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

import type {
  FigmaColorValue,
  FigmaSkippedToken,
  FigmaTokenData,
  FigmaTokenDef,
} from "../src/types/token-schema";

const require = createRequire(import.meta.url);
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

const sourcesDir = dirname(
  require.resolve("@cocso-ui/baseframe-sources/package.json")
);

const BASE_FONT_SIZE_PX = 16;

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

const HEX_RE =
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
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
    a: m[4] === undefined ? 1 : Number(m[4]),
  };
}

export function parseSize(str: string): number {
  const m = str.match(SIZE_RE);
  if (!m) {
    throw new Error(`Invalid size: ${str}`);
  }
  const value = Number(m[1]);
  return m[2] === "rem" ? value * BASE_FONT_SIZE_PX : value;
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
  values: Record<string, string | number>;
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
      // Figma carries one set of modes per collection, and everything here is
      // emitted into one. Take the richest set — the themed collection's — and
      // let single-mode collections fill every mode with their one value.
      for (const col of doc.data) {
        if (col.modes && col.modes.length > modes.length) {
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
      allTokens.push({
        name: tokenName,
        collection,
        values,
        modes: Object.keys(values),
      });
    }
  }

  return { tokens: allTokens, modes };
}

/**
 * The value a token carries in a given Figma mode.
 *
 * A token declares the modes its own collection has, and those differ: the
 * primitives live in a single-mode collection and the semantic layer in a
 * light/dark one. Figma wants one set of modes per collection, so a primitive
 * contributes its single value to every mode — which is also what it does in
 * CSS, where the dark theme does not redefine the raw ramps.
 */
function valueForMode(
  token: RawToken,
  mode: string
): string | number | undefined {
  return token.values[mode] ?? token.values.default;
}

/**
 * Recursively resolve a token reference to its final raw value.
 * @throws If the reference is circular or the target token does not exist.
 */
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

/**
 * Parse a resolved (non-ref) token value into a Figma-ready typed value.
 * @returns An object with `type` ("COLOR" | "FLOAT") and the parsed `value`.
 */
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

/**
 * Read all baseframe YAML sources and produce a {@link FigmaTokenData} object.
 * TokenRefs are resolved to final values; composite shadows are skipped.
 */
export function generateTokenData(): FigmaTokenData {
  const { tokens: rawTokens, modes } = loadRawTokens();

  // One map per mode, so a semantic token resolves through the ramp using the
  // value that mode gives it. `feedback-danger` reaches `danger-500` in light
  // and `danger-400` in dark, and the ramp itself is the same in both.
  const mapsByMode = new Map<string, Map<string, string | number>>();
  for (const mode of modes) {
    const map = new Map<string, string | number>();
    for (const t of rawTokens) {
      const value = valueForMode(t, mode);
      if (value !== undefined) {
        map.set(t.name, value);
      }
    }
    mapsByMode.set(mode, map);
  }

  const tokens: FigmaTokenDef[] = [];
  const skipped: FigmaSkippedToken[] = [];

  for (const raw of rawTokens) {
    const firstValue = valueForMode(raw, modes[0]);
    if (typeof firstValue === "string" && isShadowComposite(firstValue)) {
      skipped.push({
        sourceTokenName: raw.name,
        reason:
          "Composite shadow is not mappable to Figma COLOR/FLOAT variable types",
      });
      continue;
    }

    try {
      const values: Record<string, unknown> = {};
      let resolvedType: FigmaTokenDef["resolvedType"] | undefined;
      for (const mode of modes) {
        const resolved = resolveTokenRef(
          raw.name,
          mapsByMode.get(mode) as Map<string, string | number>
        );
        const parsed = parseResolvedValue(resolved);
        resolvedType = parsed.type;
        values[mode] = parsed.value;
      }

      tokens.push({
        name: toFigmaName(raw.name),
        sourceTokenName: raw.name,
        collection: "cocso-ui",
        resolvedType: resolvedType as FigmaTokenDef["resolvedType"],
        values: values as FigmaTokenDef["values"],
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
