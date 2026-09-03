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
import {
  buildValidatedAst,
  type Collections,
  cssVars,
  type Token,
  tailwind,
} from "../src/core";
import { findYamlFiles } from "../src/utils/fs";

const DARK_BANNER = `/**
 * Opt-in dark theme for @cocso-ui. GENERATED — edit
 * \`packages/baseframe-sources/semantic/color.yaml\` and run
 * \`pnpm --filter @cocso-ui/baseframe generate:css\`.
 *
 * Import AFTER \`token.css\` and set \`data-theme="dark"\` on a container:
 *
 *   import "@cocso-ui/css/token.css";
 *   import "@cocso-ui/css/theme-dark.css";
 *
 *   <html data-theme="dark"> … </html>
 *
 * Only the semantic layer is here. The raw ramps stay in \`token.css\` and are
 * not repeated, so an app that overrides \`--cocso-color-primary-*\` keeps that
 * override in both themes. Every semantic token declares a dark value in the
 * source, including the ones that deliberately do not move — the reasoning for
 * each is in the YAML next to the value.
 */
`;

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

const ast = buildValidatedAst(tokens, collections);

/**
 * The two published stylesheets come from the same AST, split by which
 * collection and mode each one carries.
 *
 * `token.css` is the primitives plus the light theme, both in `:root`.
 * `theme-dark.css` is the same semantic tokens in their dark mode, under
 * `[data-theme="dark"]` — and only those, which is what keeps a consumer's
 * `primary-*` override alive when the theme flips. Emitting the primitives
 * there too would overwrite it.
 */
function astFor(entries: [string, string[]][]) {
  const wanted = new Map(entries);
  return {
    ...ast,
    collections: ast.collections
      .filter((collection) => wanted.has(collection.name))
      .map((collection) => ({
        ...collection,
        modes: wanted.get(collection.name) as string[],
      })),
  };
}

const tokenCss = cssVars.generateFromAst(
  astFor([
    ["global", ["default"]],
    ["theme", ["light"]],
  ]),
  {
    prefix: "cocso",
    selectors: { global: { default: ":root" }, theme: { light: ":root" } },
  }
);

const themeDarkCss = cssVars.generateFromAst(astFor([["theme", ["dark"]]]), {
  prefix: "cocso",
  selectors: { theme: { dark: '[data-theme="dark"]' } },
  banner: DARK_BANNER,
});

const tailwindCss = tailwind.generateTailwindCSS(tokens, collections, {});

const targets: [string, string][] = [
  [path.join(snapshotsDir, "token.css.expected"), tokenCss],
  [path.join(snapshotsDir, "tailwind4.css.expected"), tailwindCss],
  [path.join(snapshotsDir, "theme-dark.css.expected"), themeDarkCss],
  [path.join(cssDir, "token.css"), tokenCss],
  [path.join(cssDir, "tailwind4.css"), tailwindCss],
  [path.join(cssDir, "theme-dark.css"), themeDarkCss],
];

for (const [target, contents] of targets) {
  fs.writeFileSync(target, contents);
  console.log(`wrote ${path.relative(repoRoot, target)}`);
}
