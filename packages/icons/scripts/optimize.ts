import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SVG_DIR = join(PKG_ROOT, "svg");

async function loadConfig() {
  const configPath = join(PKG_ROOT, "svgo.config.js");
  const mod = await import(configPath);
  return mod.default;
}

interface OptResult {
  after: number;
  before: number;
  file: string;
}

function optimizeCategory(
  category: string,
  config: Record<string, unknown>
): OptResult[] {
  const dir = join(SVG_DIR, category);
  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
  const results: OptResult[] = [];

  for (const file of files) {
    const filePath = join(dir, file);
    const input = readFileSync(filePath, "utf-8");
    const before = Buffer.byteLength(input, "utf-8");

    const result = optimize(input, { ...config, path: filePath });
    writeFileSync(filePath, result.data);
    const after = Buffer.byteLength(result.data, "utf-8");

    results.push({ file, before, after });
  }

  return results;
}

function validateViewBox(category: string): string[] {
  const dir = join(SVG_DIR, category);
  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
  const errors: string[] = [];

  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf-8");
    if (!content.includes("viewBox")) {
      errors.push(`${category}/${file}: missing viewBox`);
    }
  }

  return errors;
}

async function main() {
  const config = await loadConfig();

  console.log("\n\x1b[1mOptimizing SVG icons with SVGO\x1b[0m\n");

  let totalBefore = 0;
  let totalAfter = 0;
  let totalFiles = 0;

  for (const category of ["semantic", "brand"]) {
    console.log(`\x1b[36m${category}:\x1b[0m`);
    const results = optimizeCategory(category, config);

    for (const r of results) {
      totalBefore += r.before;
      totalAfter += r.after;
      totalFiles++;
      const saved = r.before - r.after;
      const pct = r.before > 0 ? ((saved / r.before) * 100).toFixed(1) : "0";
      console.log(
        `  \x1b[32m✓\x1b[0m ${r.file} (${r.before}B → ${r.after}B, -${pct}%)`
      );
    }
    console.log();
  }

  const totalSaved = totalBefore - totalAfter;
  const totalPct =
    totalBefore > 0 ? ((totalSaved / totalBefore) * 100).toFixed(1) : "0";

  console.log(
    `\x1b[1mTotal:\x1b[0m ${totalFiles} files, ${totalBefore}B → ${totalAfter}B (-${totalPct}%)\n`
  );

  console.log("\x1b[1mValidating viewBox preservation...\x1b[0m");
  const errors = [...validateViewBox("semantic"), ...validateViewBox("brand")];

  if (errors.length > 0) {
    console.error("\n\x1b[31mviewBox validation failed:\x1b[0m");
    for (const err of errors) {
      console.error(`  ✗ ${err}`);
    }
    process.exit(1);
  }

  console.log(`  \x1b[32m✓\x1b[0m All ${totalFiles} SVGs retain viewBox\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
