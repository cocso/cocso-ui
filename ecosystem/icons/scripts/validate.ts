import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Registry } from "./types";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = join(PKG_ROOT, "svg");
const REACT_DIST = join(PKG_ROOT, "dist", "react");
const FIGMA_DIST = join(PKG_ROOT, "dist", "figma", "icon-svgs.ts");
const REGISTRY_FILE = join(PKG_ROOT, "registry.json");

const VALID_CATEGORIES = new Set(["semantic", "brand"]);
const VALID_COLOR_STRATEGIES = new Set([
  "stroke",
  "fill",
  "hardcoded",
  "mixed",
]);

let errors = 0;

function fail(msg: string) {
  console.error(`  \x1b[31m✗\x1b[0m ${msg}`);
  errors++;
}

function pass(msg: string) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
}

console.log("\n\x1b[1mValidating icon package consistency\x1b[0m\n");

const registry: Registry = JSON.parse(readFileSync(REGISTRY_FILE, "utf-8"));

// 1. Registry schema validation
console.log("\x1b[36m1. Registry schema\x1b[0m");
for (const icon of registry.icons) {
  if (!(icon.name && icon.componentName && icon.category)) {
    fail(`Icon missing required fields: ${JSON.stringify(icon)}`);
    continue;
  }
  if (!VALID_CATEGORIES.has(icon.category)) {
    fail(`${icon.name}: invalid category "${icon.category}"`);
  }
  if (!VALID_COLOR_STRATEGIES.has(icon.colorStrategy)) {
    fail(`${icon.name}: invalid colorStrategy "${icon.colorStrategy}"`);
  }
}
if (errors === 0) {
  pass(`All ${registry.icons.length} registry entries have valid schema`);
}

// 2. Registry ↔ SVG file correspondence
console.log("\n\x1b[36m2. Registry ↔ SVG files\x1b[0m");
const prevErrors = errors;

const svgFiles = new Map<string, Set<string>>();
for (const cat of VALID_CATEGORIES) {
  const dir = join(SVG_DIR, cat);
  if (!existsSync(dir)) {
    fail(`SVG directory missing: svg/${cat}/`);
    continue;
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
  svgFiles.set(cat, new Set(files.map((f) => f.replace(".svg", ""))));
}

for (const icon of registry.icons) {
  const catFiles = svgFiles.get(icon.category);
  if (!catFiles) {
    continue;
  }
  if (!catFiles.has(icon.name)) {
    fail(
      `${icon.name}: in registry but no SVG at svg/${icon.category}/${icon.name}.svg`
    );
  }
}

for (const [cat, files] of svgFiles) {
  const registryNames = new Set(
    registry.icons.filter((i) => i.category === cat).map((i) => i.name)
  );
  for (const file of files) {
    if (!registryNames.has(file)) {
      fail(`svg/${cat}/${file}.svg: SVG exists but not in registry`);
    }
  }
}

if (errors === prevErrors) {
  const total = Array.from(svgFiles.values()).reduce((s, f) => s + f.size, 0);
  pass(`All ${total} SVG files match registry entries`);
}

// 3. Generated React components
console.log("\n\x1b[36m3. Generated React components\x1b[0m");
const prevErrors3 = errors;

if (existsSync(REACT_DIST)) {
  for (const icon of registry.icons) {
    const tsxPath = join(
      REACT_DIST,
      icon.category,
      `${icon.componentName}.tsx`
    );
    if (!existsSync(tsxPath)) {
      fail(
        `${icon.componentName}: missing at dist/react/${icon.category}/${icon.componentName}.tsx`
      );
    }
  }

  for (const file of ["icon.tsx", "child.tsx", "types.ts"]) {
    if (!existsSync(join(REACT_DIST, file))) {
      fail(`dist/react/${file} missing`);
    }
  }

  const indexPath = join(REACT_DIST, "index.ts");
  if (existsSync(indexPath)) {
    const indexContent = readFileSync(indexPath, "utf-8");
    if (
      !(
        indexContent.includes('"./semantic"') &&
        indexContent.includes('"./brand"')
      )
    ) {
      fail("dist/react/index.ts missing semantic or brand re-exports");
    }
  } else {
    fail("dist/react/index.ts missing");
  }
} else {
  fail("dist/react/ directory missing (run build first)");
}

if (errors === prevErrors3) {
  pass(`All ${registry.icons.length} React components present in dist/react/`);
}

// 4. Generated Figma output
console.log("\n\x1b[36m4. Generated Figma output\x1b[0m");
const prevErrors4 = errors;

if (existsSync(FIGMA_DIST)) {
  const figmaContent = readFileSync(FIGMA_DIST, "utf-8");

  const requiredKeys = [
    "check",
    "indeterminate",
    "close",
    "selector",
    "chevronDown",
    "chevronUp",
    "chevronLeft",
    "chevronRight",
    "arrowLeft",
    "arrowRight",
  ];

  for (const key of requiredKeys) {
    if (!new RegExp(`\\b${key}:`).test(figmaContent)) {
      fail(`Figma output missing required key: ${key}`);
    }
  }
} else {
  fail("dist/figma/icon-svgs.ts missing (run build first)");
}

if (errors === prevErrors4) {
  pass("Figma output contains all required keys");
}

// Summary
console.log();
if (errors === 0) {
  console.log("\x1b[32m\x1b[1mAll validation checks passed.\x1b[0m\n");
  process.exit(0);
} else {
  console.error(
    `\x1b[31m\x1b[1mValidation failed:\x1b[0m ${errors} error(s)\n`
  );
  process.exit(1);
}
