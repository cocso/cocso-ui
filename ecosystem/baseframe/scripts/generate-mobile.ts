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
import { brandOverrides, brandResolved } from "./generate-brand";

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
// The same resolution as data, published with `@cocso-ui/css` for consumers
// that are programs — `cocso/mobile`'s sync script parsed the Swift.
const jsonTarget = path.join(repoRoot, "packages/css/tokens.json");

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
// Brand-aware tokens: for every semantic token a brand overrides, the base
// function gains a `brand` axis and delegates. See generate-brand.ts.
const output = mobile.generateMobileFromAst(ast, { brands: brandOverrides() });

for (const [language, target] of Object.entries(targets)) {
  fs.mkdirpSync(path.dirname(target));
  fs.writeFileSync(target, output[language as "kotlin" | "swift"]);
  console.log(`wrote ${path.relative(repoRoot, target)}`);
}
fs.writeFileSync(
  jsonTarget,
  mobile.generateTokensJson(ast, { brands: brandResolved() })
);
console.log(`wrote ${path.relative(repoRoot, jsonTarget)}`);

// Printed, never silent. A token dropping out of the mobile artifacts without
// anyone noticing is the failure this generator exists to replace.
if (output.skipped.length > 0) {
  console.log(`\nnot emitted (${output.skipped.length}):`);
  for (const { name, reason } of output.skipped) {
    console.log(`  ${name} — ${reason}`);
  }
}
