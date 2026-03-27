/**
 * Extracts canonical SVG files from @cocso-ui/react-icons TSX components.
 *
 * Reads each TSX file, extracts the <svg>...</svg> block, converts JSX
 * attributes to standard SVG attributes, and replaces useId() dynamic IDs
 * with deterministic static IDs.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// biome-ignore lint/correctness/noGlobalDirnameFilename: tsx runs in CJS mode, import.meta.dirname is undefined
const ICONS_PKG = join(__dirname, "..");
const REACT_ICONS_DIR = join(ICONS_PKG, "../react-icons/src/components");
const OUTPUT_DIR = join(ICONS_PKG, "svg");

// JSX camelCase → SVG kebab-case attribute mapping
const JSX_TO_SVG_ATTRS: Record<string, string> = {
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeWidth: "stroke-width",
  strokeDasharray: "stroke-dasharray",
  strokeDashoffset: "stroke-dashoffset",
  strokeMiterlimit: "stroke-miterlimit",
  strokeOpacity: "stroke-opacity",
  fillRule: "fill-rule",
  fillOpacity: "fill-opacity",
  clipRule: "clip-rule",
  clipPath: "clip-path",
  stopColor: "stop-color",
  stopOpacity: "stop-opacity",
  colorInterpolation: "color-interpolation",
  colorInterpolationFilters: "color-interpolation-filters",
  floodColor: "flood-color",
  floodOpacity: "flood-opacity",
  lightingColor: "lighting-color",
  baselineShift: "baseline-shift",
  dominantBaseline: "dominant-baseline",
  textAnchor: "text-anchor",
  textDecoration: "text-decoration",
  writingMode: "writing-mode",
  glyphOrientationHorizontal: "glyph-orientation-horizontal",
  glyphOrientationVertical: "glyph-orientation-vertical",
};

const SVG_BLOCK_RE = /<svg[\s\S]*?<\/svg>/;
const INDENT_RE = /^(\s*)/;
const USE_ID_DECL_RE = /const\s+(\w+)\s*=\s*useId\(\)/g;

function pascalToKebab(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function componentNameToFileName(name: string): string {
  // Strip "Icon" suffix for semantic icons (brand icons keep "Logo")
  const stripped = name.endsWith("Icon") ? name.slice(0, -4) : name;
  return pascalToKebab(stripped);
}

function convertJsxAttrsToSvg(content: string): string {
  let result = content;
  for (const [jsx, svg] of Object.entries(JSX_TO_SVG_ATTRS)) {
    // Match attribute="value" pattern
    result = result.replace(new RegExp(`\\b${jsx}=`, "g"), `${svg}=`);
  }
  return result;
}

function extractSvgFromTsx(content: string, iconName: string): string {
  // Find the <svg ... </svg> block
  const svgMatch = content.match(SVG_BLOCK_RE);
  if (!svgMatch) {
    throw new Error("No <svg> block found in component");
  }

  let svg = svgMatch[0];

  // Remove aria-hidden (added by Icon wrapper at runtime, not canonical)
  svg = svg.replace(/\s*aria-hidden="true"\n?\s*/g, "\n        ");

  // Remove width="..." and height="..." from root <svg> (Icon wrapper handles sizing)
  // Keep them only if they match viewBox dimensions (informational)
  // Actually, for canonical SVG source we should keep them for standalone rendering
  // No, per plan: Icon wrapper handles sizing. Keep viewBox, remove explicit w/h
  // Actually let's keep width/height for SVG file validity - they can be overridden

  // Handle useId() replacements
  svg = replaceUseIdExpressions(svg, content, iconName);

  // Convert JSX attributes to SVG attributes
  svg = convertJsxAttrsToSvg(svg);

  // Clean up whitespace
  svg = cleanupWhitespace(svg);

  return svg;
}

function replaceUseIdExpressions(
  svgInput: string,
  fullContent: string,
  iconName: string
): string {
  if (!fullContent.includes("useId")) {
    return svgInput;
  }

  const idVars = Array.from(fullContent.matchAll(USE_ID_DECL_RE), (m) => m[1]);

  if (idVars.length === 0) {
    return svgInput;
  }

  let result = svgInput;
  let clipCount = 0;
  let gradCount = 0;

  for (const varName of idVars) {
    const isClipPath =
      result.includes(`<clipPath id={${varName}}`) ||
      result.includes(`clipPath={\`url(#\${${varName}})\`}`);
    const isGradient =
      result.includes("<linearGradient") &&
      (result.includes(`id={${varName}}`) ||
        result.includes(`fill={\`url(#\${${varName}})\`}`));

    let staticId: string;
    if (isClipPath) {
      clipCount++;
      staticId = `${iconName}-clip-${clipCount}`;
    } else if (isGradient) {
      gradCount++;
      staticId = `${iconName}-grad-${gradCount}`;
    } else {
      staticId = `${iconName}-id-${clipCount + gradCount + 1}`;
    }

    result = result.replace(
      new RegExp(`id=\\{${varName}\\}`, "g"),
      `id="${staticId}"`
    );
    result = result.replace(
      new RegExp(`\\{\\s*\`url\\(#\\$\\{${varName}\\}\\)\`\\s*\\}`, "g"),
      `"url(#${staticId})"`
    );
    result = result.replace(
      new RegExp(`fill=\\{\\s*\`url\\(#\\$\\{${varName}\\}\\)\`\\s*\\}`, "g"),
      `fill="url(#${staticId})"`
    );
    result = result.replace(
      new RegExp(
        `clipPath=\\{\\s*\`url\\(#\\$\\{${varName}\\}\\)\`\\s*\\}`,
        "g"
      ),
      `clip-path="url(#${staticId})"`
    );
  }

  return result;
}

function cleanupWhitespace(svg: string): string {
  // Normalize indentation: remove the JSX-level extra indentation
  const lines = svg.split("\n");
  // Find minimum non-empty indentation
  let minIndent = Number.POSITIVE_INFINITY;
  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }
    const indent = line.match(INDENT_RE)?.[1].length ?? 0;
    if (indent < minIndent) {
      minIndent = indent;
    }
  }

  // Remove common indentation
  const dedented = lines
    .map((line) => (line.trim().length === 0 ? "" : line.slice(minIndent)))
    .join("\n")
    .trim();

  return `${dedented}\n`;
}

function processCategory(
  category: "semantic" | "brand"
): { name: string; componentName: string; fileName: string }[] {
  const inputDir = join(REACT_ICONS_DIR, category);
  const outputDir = join(OUTPUT_DIR, category);
  const results: { name: string; componentName: string; fileName: string }[] =
    [];

  const files = readdirSync(inputDir).filter((f) => f.endsWith(".tsx"));

  for (const file of files) {
    const componentName = file.replace(".tsx", "");
    const fileName = componentNameToFileName(componentName);
    const content = readFileSync(join(inputDir, file), "utf-8");

    try {
      const svg = extractSvgFromTsx(content, fileName);
      writeFileSync(join(outputDir, `${fileName}.svg`), svg);
      results.push({
        name: fileName,
        componentName,
        fileName: `${fileName}.svg`,
      });
      console.log(`  \x1b[32m✓\x1b[0m ${componentName} → ${fileName}.svg`);
    } catch (err) {
      console.error(
        `  \x1b[31m✗\x1b[0m ${componentName}: ${(err as Error).message}`
      );
    }
  }

  return results;
}

// Main
console.log(
  "\n\x1b[1mExtracting SVG icons from @cocso-ui/react-icons\x1b[0m\n"
);

console.log("\x1b[36mSemantic icons:\x1b[0m");
const semantic = processCategory("semantic");

console.log("\n\x1b[36mBrand icons:\x1b[0m");
const brand = processCategory("brand");

console.log(
  `\n\x1b[1mDone:\x1b[0m ${semantic.length} semantic + ${brand.length} brand = ${semantic.length + brand.length} total\n`
);
