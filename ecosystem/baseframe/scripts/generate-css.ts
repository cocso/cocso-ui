/**
 * Regenerates every CSS artifact that `packages/baseframe-sources` is the
 * source of truth for.
 *
 * `packages/css/token.css` and `tailwind4.css` are published files, but they
 * are not written by hand — they are this generator's output. They drifted
 * once: twelve semantic tokens (`border-strong`, `text-on-success` and
 * friends) were added to `token.css` directly and never made it back into the
 * YAML, so they were missing from `tailwind4.css` and invisible to the Figma
 * token export. `golden.test.ts` now fails when the published files and the
 * YAML disagree; this script is how you make them agree again.
 *
 *   pnpm --filter @cocso-ui/baseframe generate:css
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import YAML from "yaml";
import { type Collections, cssVars, type Token, tailwind } from "../src/core";
import { findYamlFiles } from "../src/utils/fs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const sourcesDir = path.join(repoRoot, "packages/baseframe-sources");
const snapshotsDir = path.join(repoRoot, "ecosystem/baseframe/src/__tests__/snapshots");
const cssDir = path.join(repoRoot, "packages/css");

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

const tokenCss = cssVars.generateCssVariables(tokens, collections, {
  prefix: "cocso",
  selectors: { global: { default: ":root" } },
});
const tailwindCss = tailwind.generateTailwindCSS(tokens, collections, {});

const targets: [string, string][] = [
  [path.join(snapshotsDir, "token.css.expected"), tokenCss],
  [path.join(snapshotsDir, "tailwind4.css.expected"), tailwindCss],
  [path.join(cssDir, "token.css"), tokenCss],
  [path.join(cssDir, "tailwind4.css"), tailwindCss],
];

for (const [target, contents] of targets) {
  fs.writeFileSync(target, contents);
  console.log(`wrote ${path.relative(repoRoot, target)}`);
}
