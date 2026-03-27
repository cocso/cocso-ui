/**
 * Generates Figma-compatible SVG template strings from canonical SVG source files.
 *
 * Reads SVGs from svg/semantic/ and svg/brand/, applies color strategy
 * transforms (replacing `currentColor` with `{color}` for stroke/fill/mixed
 * icons, leaving hardcoded icons as-is), strips width/height attributes from
 * the <svg> tag, and writes dist/figma/icon-svgs.ts exporting ICON_SVGS.
 *
 * Also emits backward-compatible aliases for keys consumed by existing callers.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Registry } from "./types";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = join(PKG_ROOT, "svg");
const FIGMA_DIST = join(PKG_ROOT, "dist", "figma");

// ---------- helpers ----------

/** Convert kebab-case filename (without .svg) to camelCase key. */
function kebabToCamel(s: string): string {
  const parts = s.split("-");
  return (
    parts[0] +
    parts
      .slice(1)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("")
  );
}

/**
 * Transform a raw SVG string for Figma export:
 * - Remove width and height attributes from the <svg> tag.
 * - Replace currentColor with {color} globally (for stroke/fill/mixed icons).
 * - Leave hardcoded icons untouched (except stripping width/height).
 */
function transformSvg(raw: string, colorStrategy: string): string {
  // Strip width and height from the opening <svg ...> tag only
  let svg = raw.replace(/(<svg\b[^>]*?)\s+width="[^"]*"/g, "$1");
  svg = svg.replace(/(<svg\b[^>]*?)\s+height="[^"]*"/g, "$1");

  if (colorStrategy !== "hardcoded") {
    // Global replace of currentColor with {color} (attributes and text values)
    svg = svg.replace(/currentColor/g, "{color}");
  }

  return svg.trim();
}

// ---------- backward-compatible alias map ----------

/**
 * Maps legacy consumer keys to the camelCase key generated from the source SVG.
 * Keys present here will be emitted as alias entries in addition to the primary entries.
 */
const ALIASES: Record<string, string> = {
  indeterminate: "checkIndeterminateSmall", // check-indeterminate-small.svg
  chevronDown: "keyboardArrowDown", // keyboard-arrow-down.svg
  chevronUp: "chevronUp", // chevron-up.svg
  chevronLeft: "arrowIosBackward", // arrow-ios-backward.svg
  chevronRight: "arrowIosForward", // arrow-ios-forward.svg
  arrowLeft: "arrowBackward", // arrow-backward.svg
  arrowRight: "arrowForward", // arrow-forward.svg
};

// ---------- main ----------

function main() {
  console.log("\n\x1b[1mGenerating Figma SVG templates\x1b[0m\n");

  const registry: Registry = JSON.parse(
    readFileSync(join(PKG_ROOT, "registry.json"), "utf-8")
  );

  // Clean and recreate dist/figma/
  if (existsSync(FIGMA_DIST)) {
    rmSync(FIGMA_DIST, { recursive: true });
  }
  mkdirSync(FIGMA_DIST, { recursive: true });

  // Build primary entries from registry
  const entries: Array<{ key: string; svg: string; comment?: string }> = [];
  const svgByKey = new Map<string, string>();

  for (const icon of registry.icons) {
    const svgPath = join(SVG_DIR, icon.category, `${icon.name}.svg`);
    if (!existsSync(svgPath)) {
      throw new Error(`Missing SVG: ${svgPath}`);
    }

    const raw = readFileSync(svgPath, "utf-8").trim();
    const svg = transformSvg(raw, icon.colorStrategy);
    const key = kebabToCamel(icon.name);

    svgByKey.set(key, svg);
    entries.push({ key, svg });
    console.log(
      `  \x1b[32m✓\x1b[0m ${icon.category}/${icon.name}.svg → ${key}`
    );
  }

  // Sort primary entries alphabetically
  entries.sort((a, b) => a.key.localeCompare(b.key));

  console.log();

  // Build alias entries
  const aliasEntries: Array<{ key: string; svg: string; comment: string }> = [];

  for (const [aliasKey, sourceKey] of Object.entries(ALIASES)) {
    const svg = svgByKey.get(sourceKey);
    if (!svg) {
      throw new Error(
        `Alias "${aliasKey}" references missing key "${sourceKey}"`
      );
    }
    aliasEntries.push({
      key: aliasKey,
      svg,
      comment: `alias for ${sourceKey}`,
    });
    console.log(`  \x1b[34malias\x1b[0m ${aliasKey} → ${sourceKey}`);
  }

  // Sort alias entries alphabetically
  aliasEntries.sort((a, b) => a.key.localeCompare(b.key));

  // Assemble output file
  const primaryLines = entries
    .map(({ key, svg }) => `  ${key}: ${JSON.stringify(svg)},`)
    .join("\n");

  const aliasLines = aliasEntries
    .map(
      ({ key, svg, comment }) =>
        `  ${key}: ${JSON.stringify(svg)}, // ${comment}`
    )
    .join("\n");

  const output = `export const ICON_SVGS = {
  // Generated from SVG sources
${primaryLines}
  // Backward-compatible aliases
${aliasLines}
} as const satisfies Record<string, string>;
`;

  const outPath = join(FIGMA_DIST, "icon-svgs.ts");
  writeFileSync(outPath, output);

  const total = entries.length + aliasEntries.length;
  console.log(
    `\n\x1b[1mDone:\x1b[0m ${total} entries (${entries.length} generated, ${aliasEntries.length} aliases) → dist/figma/icon-svgs.ts\n`
  );
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
