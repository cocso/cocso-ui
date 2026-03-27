/**
 * Validates backward compatibility by scanning consumer packages for
 * @cocso-ui/react-icons imports and verifying every imported component
 * name exists in the icon registry.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { Registry } from "./types";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = join(PKG_ROOT, "..", "..");

const REGISTRY_FILE = join(PKG_ROOT, "registry.json");

const SCAN_DIRS = [
  join(REPO_ROOT, "packages", "react", "src"),
  join(REPO_ROOT, "apps", "storybook"),
  join(REPO_ROOT, "apps", "website"),
];

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".mdx"]);

const IMPORT_BLOCK_REGEX =
  /(?:import(?:\s+type)?\s*\{([^}]*)\}|export\s*\{([^}]*)\})\s*from\s*["']@cocso-ui\/react-icons(?:\/[^"']*)?["']/gs;
const TYPE_IMPORT_REGEX = /^import\s+type\b/;

interface ImportOccurrence {
  file: string;
  names: string[];
}

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  let entries: string[];

  try {
    entries = readdirSync(dir, {
      recursive: true,
      encoding: "utf-8",
    }) as string[];
  } catch {
    // Directory may not exist in all environments
    return results;
  }

  for (const entry of entries) {
    if (entry.includes("/node_modules/") || entry.startsWith("node_modules/")) {
      continue;
    }
    const ext = entry.slice(entry.lastIndexOf("."));
    if (SCAN_EXTENSIONS.has(ext)) {
      results.push(join(dir, entry));
    }
  }

  return results;
}

const AS_SPLIT_RE = /\s+as\s+/;

function extractImportedNames(source: string): string[] {
  const names: string[] = [];
  IMPORT_BLOCK_REGEX.lastIndex = 0;

  for (const match of source.matchAll(IMPORT_BLOCK_REGEX)) {
    const fullMatch = match[0];

    // Skip type-only imports: "import type { ... }"
    if (TYPE_IMPORT_REGEX.test(fullMatch)) {
      continue;
    }

    // Named list is in group 1 (import) or group 2 (export re-export)
    const nameList = match[1] ?? match[2];
    if (!nameList) {
      continue;
    }

    for (const raw of nameList.split(",")) {
      // Handle "Foo as Bar" — the exported name is before "as"
      const name = raw.trim().split(AS_SPLIT_RE)[0].trim();
      if (name) {
        names.push(name);
      }
    }
  }

  return names;
}

function scanForImports(files: string[]): ImportOccurrence[] {
  const occurrences: ImportOccurrence[] = [];

  for (const file of files) {
    let source: string;
    try {
      source = readFileSync(file, "utf-8");
    } catch {
      continue;
    }

    if (!source.includes("@cocso-ui/react-icons")) {
      continue;
    }

    const names = extractImportedNames(source);
    if (names.length > 0) {
      occurrences.push({ file, names });
    }
  }

  return occurrences;
}

// ---------- main ----------

console.log(
  "\n\x1b[1mValidating @cocso-ui/react-icons backward compatibility\x1b[0m\n"
);

// 1. Load registry
const registry: Registry = JSON.parse(readFileSync(REGISTRY_FILE, "utf-8"));
const validNames = new Set(registry.icons.map((icon) => icon.componentName));
console.log(`\x1b[36mRegistry:\x1b[0m ${validNames.size} components loaded\n`);

// 2. Collect files
const allFiles: string[] = [];
for (const dir of SCAN_DIRS) {
  const files = collectFiles(dir);
  allFiles.push(...files);
}
console.log(
  `\x1b[36mScanning:\x1b[0m ${allFiles.length} files across ${SCAN_DIRS.length} directories\n`
);

// 3. Scan for imports
const occurrences = scanForImports(allFiles);

// 4. Report findings and collect missing names
const missing: Array<{ file: string; name: string }> = [];

if (occurrences.length === 0) {
  console.log("  \x1b[33m⚠\x1b[0m No @cocso-ui/react-icons imports found\n");
} else {
  console.log("\x1b[36mFound imports:\x1b[0m");
  for (const { file, names } of occurrences) {
    const rel = relative(REPO_ROOT, file);
    console.log(`  \x1b[34m${rel}\x1b[0m`);
    for (const name of names) {
      const ok = validNames.has(name);
      if (ok) {
        console.log(`    \x1b[32m✓\x1b[0m ${name}`);
      } else {
        console.log(
          `    \x1b[31m✗\x1b[0m ${name} \x1b[31m(not in registry)\x1b[0m`
        );
        missing.push({ file, name });
      }
    }
  }
  console.log();
}

// 5. Summary
if (missing.length === 0) {
  console.log("\x1b[32m\x1b[1mAll imports are valid.\x1b[0m\n");
  process.exit(0);
} else {
  console.error("\x1b[31m\x1b[1mMissing icons detected:\x1b[0m");
  for (const { file, name } of missing) {
    const rel = relative(REPO_ROOT, file);
    console.error(`  \x1b[31m✗\x1b[0m ${name}  ←  ${rel}`);
  }
  console.error(
    `\n\x1b[31mFailed:\x1b[0m ${missing.length} icon(s) imported but not found in registry.json\n`
  );
  process.exit(1);
}
