import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Registry } from "./types";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = join(PKG_ROOT, "svg", "semantic");
const REGISTRY_FILE = join(PKG_ROOT, "registry.json");

const TABLER_BASE_URL =
  "https://raw.githubusercontent.com/tabler/tabler-icons/main/icons";

const VIEW_BOX_REGEX = /viewBox="([^"]+)"/;

// ANSI helpers
const c = {
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
};

function parseArgs(): { names: string[]; variant: "outline" | "filled" } {
  const args = process.argv.slice(2);
  const names: string[] = [];
  let variant: "outline" | "filled" = "outline";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && args[i + 1]) {
      names.push(args[i + 1]);
      i++;
    } else if (args[i] === "--variant" && args[i + 1]) {
      const v = args[i + 1];
      if (v !== "outline" && v !== "filled") {
        console.error(
          `${c.red("✗")} Invalid variant "${v}". Must be "outline" or "filled".`
        );
        process.exit(1);
      }
      variant = v;
      i++;
    }
  }

  if (names.length === 0) {
    console.error(
      `${c.red("✗")} At least one --name <icon-name> argument is required.`
    );
    console.error(
      "  Usage: tsx scripts/fetch-tabler.ts --name <icon-name> [--name <icon-name>] [--variant outline|filled]"
    );
    process.exit(1);
  }

  return { names, variant };
}

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function detectColorStrategy(svgContent: string): "stroke" | "fill" {
  if (svgContent.includes('stroke="currentColor"')) {
    return "stroke";
  }
  return "fill";
}

function extractViewBox(svgContent: string): string {
  const match = VIEW_BOX_REGEX.exec(svgContent);
  return match ? match[1] : "0 0 24 24";
}

async function fetchSvg(name: string, variant: string): Promise<string> {
  const url = `${TABLER_BASE_URL}/${variant}/${name}.svg`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

function validateSvg(content: string, name: string): void {
  if (!content.includes("<svg")) {
    throw new Error(
      `Fetched content for "${name}" does not contain an <svg> tag`
    );
  }
}

type ProcessResult = "added" | "skipped" | "failed";

async function processIcon(
  name: string,
  variant: string,
  existingNames: Set<string>,
  registry: Registry
): Promise<ProcessResult> {
  process.stdout.write(`  Fetching ${c.cyan(name)}... `);

  if (existingNames.has(name)) {
    console.log(c.yellow("⚠ already in registry, skipping"));
    return "skipped";
  }

  let svgContent: string;
  try {
    svgContent = await fetchSvg(name, variant);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`${c.red("✗")} fetch failed: ${msg}`);
    return "failed";
  }

  try {
    validateSvg(svgContent, name);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`${c.red("✗")} invalid SVG: ${msg}`);
    return "failed";
  }

  const colorStrategy = detectColorStrategy(svgContent);
  const viewBox = extractViewBox(svgContent);
  const componentName = `${kebabToPascal(name)}Icon`;

  writeFileSync(join(SVG_DIR, `${name}.svg`), svgContent);

  registry.icons.push({
    aliases: [],
    category: "semantic",
    colorStrategy,
    componentName,
    name,
    source: "tabler",
    tags: [],
    viewBox,
  });
  existingNames.add(name);

  console.log(
    `${c.green("✓")} saved → ${c.bold(componentName)} [${colorStrategy}] viewBox="${viewBox}"`
  );
  return "added";
}

function printSummary(
  added: string[],
  skipped: string[],
  failed: string[]
): void {
  console.log(`\n${c.bold("Summary")}`);
  console.log(`  Added:   ${c.green(String(added.length))}`);
  if (skipped.length > 0) {
    console.log(
      `  Skipped: ${c.yellow(String(skipped.length))} (already in registry)`
    );
  }
  if (failed.length > 0) {
    console.log(`  Failed:  ${c.red(String(failed.length))}`);
    for (const name of failed) {
      console.log(`    ${c.red("✗")} ${name}`);
    }
  }
}

async function main() {
  const { names, variant } = parseArgs();

  console.log(`\n${c.bold("Fetching Tabler Icons")}\n`);
  console.log(`${c.cyan("Variant:")} ${variant}`);
  console.log(`${c.cyan("Icons:")}   ${names.join(", ")}\n`);

  const registry: Registry = JSON.parse(readFileSync(REGISTRY_FILE, "utf-8"));
  const existingNames = new Set(registry.icons.map((icon) => icon.name));

  const added: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const name of names) {
    const result = await processIcon(name, variant, existingNames, registry);
    if (result === "added") {
      added.push(name);
    } else if (result === "skipped") {
      skipped.push(name);
    } else {
      failed.push(name);
    }
  }

  if (added.length > 0) {
    registry.icons.sort((a, b) => a.name.localeCompare(b.name));
    writeFileSync(REGISTRY_FILE, `${JSON.stringify(registry, null, 2)}\n`);
    console.log(`\n  ${c.green("✓")} registry.json updated`);
  }

  printSummary(added, skipped, failed);

  if (added.length > 0) {
    console.log(
      `\n${c.bold("Next step:")} run ${c.cyan("pnpm build")} to generate React components and Figma output.\n`
    );
  } else {
    console.log();
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(
    `\n${c.red("✗")} Unexpected error: ${err instanceof Error ? err.message : String(err)}\n`
  );
  process.exit(1);
});
