/**
 * Brand themes, on top of the base design system.
 *
 * The base `interactive-primary` is neutral-950 — the `primary-*` ramp aliases
 * the neutral ramp, so the design system itself has no brand colour. cocso.co.kr
 * overrides it to the info ramp from `apps/web/src/styles/theme-override.css`,
 * and medicaldb-website does not override it at all. Two brands, one system.
 * Moving cocso's blue into the base would recolour medicaldb's buttons; leaving
 * it in the website means the same values live in website, mobile and nowhere
 * canonical. So a brand is a theme: this emits it from one source for every
 * platform, and the base stays neutral.
 *
 * Built as a separate AST: the base primitives plus the brand file. A brand
 * declares the same token names as the semantic layer (`$color.interactive.primary`),
 * and the resolver keys tokens by name, so mixing it into the base AST would
 * make the last declaration win silently. Kept apart, nothing collides.
 *
 *   pnpm --filter @cocso-ui/baseframe generate:brand
 *
 * Web:     import "@cocso-ui/css/theme-cocso.css" after token.css and theme-dark.css,
 *          then set data-brand="cocso" on the container that carries data-theme.
 *          `[data-brand][data-theme="dark"]` is (0,2,0), so the brand's dark value
 *          wins over theme-dark.css regardless of import order — the website
 *          reached for `:root:root` to get the same guarantee.
 * Mobile:  CocsoBrandCocso.swift / .kt carry the same tokens with the same names,
 *          resolved per scheme; the app applies them over CocsoTokens.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import YAML from "yaml";
import {
  buildValidatedAst,
  type Collections,
  cssVars,
  mobile,
  type Token,
} from "../src/core";
import { findYamlFiles } from "../src/utils/fs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
// Only the colour primitives. `primitive/shadow.yaml` references the semantic
// `$color.alpha.*`, which lives in the layer this AST must not include (its
// names collide with the brand's). A brand is colour, and colour is enough.
const primitiveColorPath = path.join(
  repoRoot,
  "packages/baseframe-sources/primitive/color.yaml"
);
const baseCollectionsPath = path.join(
  repoRoot,
  "packages/baseframe-sources/collections.yaml"
);
const brandsDir = path.join(repoRoot, "packages/baseframe-brands");
const snapshotsDir = path.join(
  repoRoot,
  "ecosystem/baseframe/src/__tests__/snapshots"
);
const cssDir = path.join(repoRoot, "packages/css");

export interface BrandOutput {
  css: string;
  kotlin: string;
  skipped: { name: string; reason: string }[];
  swift: string;
}

/** Load one brand into its own AST and emit every platform's artifact. */
export function buildBrand(brand: string): BrandOutput {
  const tokens: Token[] = [
    YAML.parse(fs.readFileSync(primitiveColorPath, "utf-8")) as Token,
  ];
  let brandCollections: Collections | null = null;
  for (const filePath of findYamlFiles(path.join(brandsDir, brand))) {
    const parsed = YAML.parse(fs.readFileSync(filePath, "utf-8"));
    if (parsed.kind === "Tokens") {
      tokens.push(parsed);
    } else if (parsed.kind === "TokenCollections") {
      brandCollections = parsed;
    }
  }
  if (!brandCollections) {
    throw new Error(`${brand}: collections.yaml not found`);
  }
  const base: Collections = YAML.parse(
    fs.readFileSync(baseCollectionsPath, "utf-8")
  );
  // The primitives belong to the base `global` collection; the brand adds its own.
  const collections: Collections = {
    ...base,
    data: [
      ...base.data.filter((c) => c.name === "global"),
      ...brandCollections.data,
    ],
  };

  const ast = buildValidatedAst(tokens, collections);
  const brandOnly = {
    ...ast,
    collections: ast.collections.filter((c) => c.name === "brand"),
  };
  const pascal = brand[0].toUpperCase() + brand.slice(1);

  const css = cssVars.generateFromAst(brandOnly, {
    prefix: "cocso",
    selectors: {
      brand: {
        light: `[data-brand="${brand}"]`,
        dark: `[data-brand="${brand}"][data-theme="dark"]`,
      },
    },
    banner: [
      `/* ${brand} brand theme. Import after token.css and theme-dark.css; set`,
      ` * data-brand="${brand}" on the container that carries data-theme. */`,
      "",
    ].join("\n"),
  });

  const out = mobile.generateMobileFromAst(ast, {
    only: ["brand"],
    packageName: "ai.cocso.ui",
    typeName: `CocsoBrand${pascal}`,
  });

  return { css, kotlin: out.kotlin, skipped: out.skipped, swift: out.swift };
}

/**
 * The identifiers each brand overrides, as the mobile emitter names them. The
 * base emitter takes this to give exactly those tokens a brand axis.
 */
export function brandOverrides(): { name: string; overrides: Set<string> }[] {
  return BRANDS.map((brand) => ({
    name: brand,
    overrides: new Set(
      [...buildBrand(brand).swift.matchAll(/public static (?:let|func) (\w+)/g)].map(
        ([, name]) => name
      )
    ),
  }));
}

export const BRANDS = fs
  .readdirSync(brandsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  for (const brand of BRANDS) {
    const pascal = brand[0].toUpperCase() + brand.slice(1);
    const output = buildBrand(brand);
    const targets: [string, string][] = [
      [path.join(cssDir, `theme-${brand}.css`), output.css],
      [path.join(snapshotsDir, `theme-${brand}.css.expected`), output.css],
      [
        path.join(
          repoRoot,
          `packages/swiftui/Sources/CocsoUI/CocsoBrand${pascal}.swift`
        ),
        output.swift,
      ],
      [
        path.join(
          repoRoot,
          `packages/compose/src/main/kotlin/ai/cocso/ui/CocsoBrand${pascal}.kt`
        ),
        output.kotlin,
      ],
    ];
    for (const [target, contents] of targets) {
      fs.writeFileSync(target, contents);
      console.log(`wrote ${path.relative(repoRoot, target)}`);
    }
    if (output.skipped.length > 0) {
      console.log(`\n${brand}: not carried across (${output.skipped.length}):`);
      for (const { name, reason } of output.skipped) {
        console.log(`  ${name} — ${reason}`);
      }
    }
  }
}
