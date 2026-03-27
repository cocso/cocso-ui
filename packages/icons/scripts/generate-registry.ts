/**
 * Generates registry.json by reading TSX components from @cocso-ui/react-icons
 * and SVG files from @cocso-ui/icons, classifying each icon's metadata.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICONS_PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
const REACT_ICONS_DIR = join(ICONS_PKG, "../react-icons/src/components");
const SVG_DIR = join(ICONS_PKG, "svg");
const OUTPUT_FILE = join(ICONS_PKG, "registry.json");

// Icons that use clipPath/linearGradient with IDs and need static IDs in SVG output
const STATIC_ID_ICONS = new Set([
  "KakaoLogo",
  "NaverLogo",
  "NaverOutlineLogo",
  "HuonsLogo",
]);

// Top-level regex constants (biome: lint/performance/useTopLevelRegex)
const HEX_FILL_REGEX = /fill="#[0-9a-fA-F]/;
const VIEW_BOX_REGEX = /viewBox="([^"]+)"/;

function pascalToKebab(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function componentNameToIconName(
  componentName: string,
  category: "semantic" | "brand"
): string {
  if (category === "semantic") {
    // Strip "Icon" suffix before converting
    const stripped = componentName.endsWith("Icon")
      ? componentName.slice(0, -4)
      : componentName;
    return pascalToKebab(stripped);
  }
  // Brand icons: full name to kebab-case
  return pascalToKebab(componentName);
}

type ColorStrategy = "stroke" | "fill" | "mixed" | "hardcoded";

function detectColorStrategy(content: string): ColorStrategy {
  const hasStroke = content.includes('stroke="currentColor"');
  const hasFillCurrent = content.includes('fill="currentColor"');
  const hasHexFill = HEX_FILL_REGEX.test(content);

  if (hasStroke) {
    return "stroke";
  }
  if (hasFillCurrent && hasHexFill) {
    return "mixed";
  }
  if (hasFillCurrent) {
    return "fill";
  }
  return "hardcoded";
}

function extractViewBox(svgContent: string): string {
  const match = VIEW_BOX_REGEX.exec(svgContent);
  return match ? match[1] : "0 0 24 24";
}

interface RegistryEntry {
  aliases: string[];
  category: "semantic" | "brand";
  colorStrategy: ColorStrategy;
  componentName: string;
  name: string;
  source: "tabler" | "custom";
  tags: string[];
  useStaticIds?: true;
  viewBox: string;
}

function processCategory(category: "semantic" | "brand"): RegistryEntry[] {
  const tsxDir = join(REACT_ICONS_DIR, category);
  const svgDir = join(SVG_DIR, category);
  const entries: RegistryEntry[] = [];

  const files = readdirSync(tsxDir).filter((f) => f.endsWith(".tsx"));

  for (const file of files) {
    const componentName = file.replace(".tsx", "");
    const iconName = componentNameToIconName(componentName, category);

    const tsxContent = readFileSync(join(tsxDir, file), "utf-8");
    const colorStrategy = detectColorStrategy(tsxContent);

    // Read viewBox from SVG file
    const svgPath = join(svgDir, `${iconName}.svg`);
    let viewBox = "0 0 24 24";
    try {
      const svgContent = readFileSync(svgPath, "utf-8");
      viewBox = extractViewBox(svgContent);
    } catch {
      console.warn(
        `  \x1b[33m⚠\x1b[0m SVG not found for ${componentName} (${iconName}.svg), using default viewBox`
      );
    }

    const entry: RegistryEntry = {
      aliases: [],
      category,
      colorStrategy,
      componentName,
      name: iconName,
      source: category === "semantic" ? "tabler" : "custom",
      tags: [],
      viewBox,
    };

    if (STATIC_ID_ICONS.has(componentName)) {
      entry.useStaticIds = true;
    }

    entries.push(entry);
    console.log(
      `  \x1b[32m✓\x1b[0m ${componentName} → ${iconName} [${colorStrategy}]`
    );
  }

  return entries;
}

// Main
console.log("\n\x1b[1mGenerating icon registry\x1b[0m\n");

console.log("\x1b[36mSemantic icons:\x1b[0m");
const semantic = processCategory("semantic");

console.log("\n\x1b[36mBrand icons:\x1b[0m");
const brand = processCategory("brand");

const all = [...semantic, ...brand];

writeFileSync(OUTPUT_FILE, `${JSON.stringify(all, null, 2)}\n`);

// Summary
const strategyCounts = all.reduce(
  (acc, e) => {
    acc[e.colorStrategy] = (acc[e.colorStrategy] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

console.log(
  `\n\x1b[1mDone:\x1b[0m ${semantic.length} semantic + ${brand.length} brand = ${all.length} total`
);
console.log("\x1b[1mColor strategies:\x1b[0m", strategyCounts);
console.log(`\x1b[1mOutput:\x1b[0m ${OUTPUT_FILE}\n`);
