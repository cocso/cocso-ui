/**
 * Emits the SwiftUI and Jetpack Compose token files from
 * `packages/baseframe-sources`.
 *
 * Same AST as `generate-css.ts`, so the three platforms cannot disagree about
 * what a token is: a value missing for a mode its collection declares is
 * rejected before any of them is written.
 *
 *   pnpm --filter @cocso-ui/baseframe generate:mobile
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import YAML from "yaml";
import { buildValidatedAst, type Collections, mobile, type Token } from "../src/core";
import { findYamlFiles } from "../src/utils/fs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const sourcesDir = path.join(repoRoot, "packages/baseframe-sources");

const targets = {
  kotlin: path.join(
    repoRoot,
    "packages/compose/src/main/kotlin/ai/cocso/ui/CocsoTokens.kt"
  ),
  swift: path.join(repoRoot, "packages/swiftui/Sources/CocsoUI/CocsoTokens.swift"),
};

const tokens: Token[] = [];
let collections: Collections | null = null;

for (const filePath of findYamlFiles(sourcesDir)) {
  const parsed = YAML.parse(fs.readFileSync(filePath, "utf-8"));
  if (parsed.kind === "Tokens") {
    tokens.push(parsed);
  } else if (parsed.kind === "TokenCollections") {
    collections = parsed;
  }
}

if (!collections) {
  throw new Error("collections.yaml not found");
}

const ast = buildValidatedAst(tokens, collections);
const output = mobile.generateMobileFromAst(ast);

for (const [language, target] of Object.entries(targets)) {
  fs.mkdirpSync(path.dirname(target));
  fs.writeFileSync(target, output[language as "kotlin" | "swift"]);
  console.log(`wrote ${path.relative(repoRoot, target)}`);
}

// Printed, never silent. A token dropping out of the mobile artifacts without
// anyone noticing is the failure this generator exists to replace.
if (output.skipped.length > 0) {
  console.log(`\nnot emitted (${output.skipped.length}):`);
  for (const { name, reason } of output.skipped) {
    console.log(`  ${name} — ${reason}`);
  }
}
