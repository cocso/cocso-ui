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

function transformSvg(raw: string, colorStrategy: string): string {
  let svg = raw.replace(/(<svg\b[^>]*?)\s+width="[^"]*"/g, "$1");
  svg = svg.replace(/(<svg\b[^>]*?)\s+height="[^"]*"/g, "$1");

  if (colorStrategy !== "hardcoded") {
    svg = svg.replace(/currentColor/g, "{color}");
  }

  return svg.trim();
}

const ALIASES: Record<string, string> = {
  indeterminate: "checkIndeterminateSmall", // check-indeterminate-small.svg
  chevronDown: "keyboardArrowDown", // keyboard-arrow-down.svg
  chevronUp: "chevronUp", // chevron-up.svg
  chevronLeft: "arrowIosBackward", // arrow-ios-backward.svg
  chevronRight: "arrowIosForward", // arrow-ios-forward.svg
  arrowLeft: "arrowBackward", // arrow-backward.svg
  arrowRight: "arrowForward", // arrow-forward.svg
};

function main() {
  console.log("\n\x1b[1mGenerating Figma SVG templates\x1b[0m\n");

  const registry: Registry = JSON.parse(
    readFileSync(join(PKG_ROOT, "registry.json"), "utf-8")
  );

  if (existsSync(FIGMA_DIST)) {
    rmSync(FIGMA_DIST, { recursive: true });
  }
  mkdirSync(FIGMA_DIST, { recursive: true });

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

  entries.sort((a, b) => a.key.localeCompare(b.key));

  console.log();

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

  aliasEntries.sort((a, b) => a.key.localeCompare(b.key));

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
