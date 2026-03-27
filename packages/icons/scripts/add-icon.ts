import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Registry, RegistryIcon } from "./types";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = join(PKG_ROOT, "svg");
const REGISTRY_FILE = join(PKG_ROOT, "registry.json");

const VIEW_BOX_REGEX = /viewBox="([^"]+)"/;

type ColorStrategy = "stroke" | "fill" | "mixed" | "hardcoded";

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function detectColorStrategy(content: string): ColorStrategy {
  const hasStroke = content.includes('stroke="currentColor"');
  const hasFillCurrent = content.includes('fill="currentColor"');

  if (hasStroke && hasFillCurrent) {
    return "mixed";
  }
  if (hasStroke) {
    return "stroke";
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

interface RawArgs {
  category?: string;
  colorStrategy?: string;
  componentName?: string;
  file?: string;
  name?: string;
  tags: string[];
}

/** Build a flag→value map from a flat argv array. */
function extractFlags(args: string[]): RawArgs {
  const result: RawArgs = { tags: [] };
  const pairs: Record<string, (v: string) => void> = {
    "--file": (v) => {
      result.file = v;
    },
    "--name": (v) => {
      result.name = v;
    },
    "--category": (v) => {
      result.category = v;
    },
    "--component-name": (v) => {
      result.componentName = v;
    },
    "--color-strategy": (v) => {
      result.colorStrategy = v;
    },
    "--tags": (v) => {
      result.tags = v.split(",").filter(Boolean);
    },
  };
  const keys = new Set(Object.keys(pairs));
  let skipNext = false;
  for (const [idx, arg] of args.entries()) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (!keys.has(arg)) {
      continue;
    }
    const handler = pairs[arg];
    if (handler) {
      handler(args[Number(idx) + 1] ?? "");
    }
    skipNext = true;
  }
  return result;
}

/** Validate parsed flags and exit with a message on failure. */
function validateArgs(raw: RawArgs): {
  file: string;
  name: string;
  category: "semantic" | "brand";
  componentName?: string;
  colorStrategy?: ColorStrategy;
  tags: string[];
} {
  if (!(raw.file && raw.name && raw.category)) {
    console.error(
      "\x1b[31m✗\x1b[0m Missing required arguments: --file, --name, --category"
    );
    console.error(
      "  Usage: tsx scripts/add-icon.ts --file <path.svg> --name <kebab-name> --category <semantic|brand>"
    );
    console.error(
      "         [--component-name <PascalName>] [--color-strategy <stroke|fill|hardcoded|mixed>] [--tags tag1,tag2]"
    );
    process.exit(1);
  }
  if (raw.category !== "semantic" && raw.category !== "brand") {
    console.error(
      `\x1b[31m✗\x1b[0m Invalid category "${raw.category}". Must be "semantic" or "brand".`
    );
    process.exit(1);
  }
  const validStrategies = new Set(["stroke", "fill", "hardcoded", "mixed"]);
  if (
    raw.colorStrategy !== undefined &&
    !validStrategies.has(raw.colorStrategy)
  ) {
    console.error(
      `\x1b[31m✗\x1b[0m Invalid color-strategy "${raw.colorStrategy}". Must be one of: stroke, fill, hardcoded, mixed.`
    );
    process.exit(1);
  }
  return {
    file: raw.file,
    name: raw.name,
    category: raw.category as "semantic" | "brand",
    componentName: raw.componentName,
    colorStrategy: raw.colorStrategy as ColorStrategy | undefined,
    tags: raw.tags,
  };
}

function parseArgs(argv: string[]) {
  return validateArgs(extractFlags(argv.slice(2)));
}

const opts = parseArgs(process.argv);

console.log("\n\x1b[1mAdding icon to registry\x1b[0m\n");

// Resolve and validate source SVG
const srcPath = resolve(opts.file);
if (!existsSync(srcPath)) {
  console.error(`\x1b[31m✗\x1b[0m SVG file not found: ${srcPath}`);
  process.exit(1);
}

const svgContent = readFileSync(srcPath, "utf-8");

// Load registry
const registry: Registry = JSON.parse(readFileSync(REGISTRY_FILE, "utf-8"));

// Check for duplicate
if (registry.icons.some((icon) => icon.name === opts.name)) {
  console.error(
    `\x1b[31m✗\x1b[0m Icon "${opts.name}" already exists in registry.`
  );
  process.exit(1);
}

// Derive fields
const pascal = kebabToPascal(opts.name);
const suffix = opts.category === "brand" ? "Logo" : "Icon";
const componentName = opts.componentName ?? `${pascal}${suffix}`;
const colorStrategy = opts.colorStrategy ?? detectColorStrategy(svgContent);
const viewBox = extractViewBox(svgContent);

// Copy SVG to destination
const destPath = join(SVG_DIR, opts.category, `${opts.name}.svg`);
copyFileSync(srcPath, destPath);
console.log(
  `  \x1b[32m✓\x1b[0m Copied SVG → svg/${opts.category}/${opts.name}.svg`
);

// Build registry entry
const entry: RegistryIcon = {
  aliases: [],
  category: opts.category,
  colorStrategy,
  componentName,
  name: opts.name,
  source: "custom",
  tags: opts.tags,
  viewBox,
};

// Insert and sort alphabetically by name
const icons = [...registry.icons, entry].sort((a, b) =>
  a.name.localeCompare(b.name)
);

writeFileSync(REGISTRY_FILE, `${JSON.stringify({ icons }, null, 2)}\n`);
console.log("  \x1b[32m✓\x1b[0m Added entry to registry.json");

// Summary
console.log("\n\x1b[1mSummary\x1b[0m");
console.log(`  name:          \x1b[36m${opts.name}\x1b[0m`);
console.log(`  componentName: \x1b[36m${componentName}\x1b[0m`);
console.log(`  category:      \x1b[36m${opts.category}\x1b[0m`);
console.log(`  colorStrategy: \x1b[36m${colorStrategy}\x1b[0m`);
console.log(`  viewBox:       \x1b[36m${viewBox}\x1b[0m`);
if (opts.tags.length > 0) {
  console.log(`  tags:          \x1b[36m${opts.tags.join(", ")}\x1b[0m`);
}
console.log(
  "\n\x1b[32m\x1b[1mDone.\x1b[0m Run \x1b[1mpnpm build\x1b[0m in packages/icons to regenerate components.\n"
);
