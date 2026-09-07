/**
 * The brand theme, against the base it sits on.
 *
 * A brand redeclares semantic token names with its own values. Two things can
 * go wrong quietly: the overlay can name a token the base does not have (so the
 * app applies it to nothing), and the two mobile overlays can drift from each
 * other or from the CSS. Both are checked here the way the base tokens are.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BRANDS, buildBrand } from "../../scripts/generate-brand";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../.."
);
const SNAPSHOTS = path.join(
  REPO_ROOT,
  "ecosystem/baseframe/src/__tests__/snapshots"
);

const SWIFT_NAMES = /public static (?:let|func) (\w+)/g;
const KOTLIN_NAMES = /(?:val|fun) (\w+)\b/g;
const DARK_MIX_LIGHT_INFO =
  /interactivePrimary\(_ scheme: ColorScheme\)[\s\S]*?\.dark \? SwiftUI\.Color\(hex: 0x2260D3\) : SwiftUI\.Color\(hex: 0x256EF4\)/;
const SWIFT_TEXT_PRIMARY_BODY =
  /public static func textPrimary\([^{]*\{([\s\S]*?)\n {8}\}/;
const WHITE_ON_PRIMARY_BOTH =
  /textOnPrimary\(_ scheme: ColorScheme\)[\s\S]*?0xFFFFFF\) : SwiftUI\.Color\(hex: 0xFFFFFF\)/;

function names(source: string, pattern: RegExp): Set<string> {
  return new Set([...source.matchAll(pattern)].map(([, n]) => n));
}

describe.each(BRANDS)("brand %s", (brand) => {
  const pascal = brand[0].toUpperCase() + brand.slice(1);
  const output = buildBrand(brand);

  it("theme CSS matches the published file and its snapshot", () => {
    const published = fs.readFileSync(
      path.join(REPO_ROOT, `packages/css/theme-${brand}.css`),
      "utf-8"
    );
    const expected = fs.readFileSync(
      path.join(SNAPSHOTS, `theme-${brand}.css.expected`),
      "utf-8"
    );
    expect(published).toBe(output.css);
    expect(expected).toBe(output.css);
  });

  it("emits the same tokens on both platforms, and the published files are what it emits", () => {
    const swiftPath = path.join(
      REPO_ROOT,
      `packages/swiftui/Sources/CocsoUI/CocsoBrand${pascal}.swift`
    );
    const kotlinPath = path.join(
      REPO_ROOT,
      `packages/compose/src/main/kotlin/ai/cocso/ui/CocsoBrand${pascal}.kt`
    );
    expect(fs.readFileSync(swiftPath, "utf-8")).toBe(output.swift);
    expect(fs.readFileSync(kotlinPath, "utf-8")).toBe(output.kotlin);

    const swift = names(output.swift, SWIFT_NAMES);
    const kotlin = names(output.kotlin, KOTLIN_NAMES);
    expect([...swift].filter((n) => !kotlin.has(n))).toEqual([]);
    expect([...kotlin].filter((n) => !swift.has(n))).toEqual([]);
    expect(swift.size).toBeGreaterThan(10);
  });

  it("only overrides tokens the base defines", () => {
    // An overlay token the base lacks is applied to nothing — the app would
    // carry a value with no consumer and the theme would look complete.
    const base = names(
      fs.readFileSync(
        path.join(
          REPO_ROOT,
          "packages/swiftui/Sources/CocsoUI/CocsoTokens.swift"
        ),
        "utf-8"
      ),
      SWIFT_NAMES
    );
    const overlay = names(output.swift, SWIFT_NAMES);
    expect([...overlay].filter((n) => !base.has(n))).toEqual([]);
  });

  it("carries nothing it could not express", () => {
    expect(output.skipped).toEqual([]);
  });
});

describe("brand cocso", () => {
  const output = buildBrand("cocso");

  it("is the info ramp in the light theme and a fixed mix in the dark one", () => {
    // The website's override used color-mix(info-500 85%, surface-primary) for
    // dark, which the generator cannot emit; the fixed value is that mix.
    expect(output.swift).toMatch(DARK_MIX_LIGHT_INFO);
    expect(output.css).toContain(
      "--cocso-color-interactive-primary: var(--cocso-color-info-500);"
    );
  });

  it("wins over the dark theme regardless of import order", () => {
    // `[data-brand][data-theme="dark"]` is (0,2,0); theme-dark.css is (0,1,0).
    // The website reached for `:root:root` to get the same guarantee.
    expect(output.css).toContain('[data-brand="cocso"][data-theme="dark"] {');
  });

  it("keeps white on the fill in both themes", () => {
    // The fill is blue in both themes, so the text on it is white in both. The
    // base flips text-on-primary dark because the base fill flips light.
    expect(output.swift).toMatch(WHITE_ON_PRIMARY_BOTH);
  });
});

/**
 * The base tokens know the brand.
 *
 * An overlay the views never read is a theme the app applies to nothing it did
 * not draw itself: the app's own `interactivePrimary` turns blue while every
 * design-system view keeps drawing the base black, and one screen shows two
 * primaries. So for every token a brand overrides, the base function takes a
 * brand and delegates — and for no other token, so the axis stays honest about
 * what it changes.
 */
describe("Base tokens delegate to the brand", () => {
  const swift = fs.readFileSync(
    path.join(REPO_ROOT, "packages/swiftui/Sources/CocsoUI/CocsoTokens.swift"),
    "utf-8"
  );
  const kotlin = fs.readFileSync(
    path.join(
      REPO_ROOT,
      "packages/compose/src/main/kotlin/ai/cocso/ui/CocsoTokens.kt"
    ),
    "utf-8"
  );

  it.each(
    BRANDS
  )("every themed token %s overrides has a case on both platforms", (brand) => {
    const pascal = brand[0].toUpperCase() + brand.slice(1);
    const overlay = buildBrand(brand).swift;
    // Only what is themed in the base. The overlay also carries the `primary-*`
    // ramp, which the base keeps as constants on purpose — no recipe reads a
    // ramp directly, the semantic tokens carry the brand, and turning a constant
    // into a function would hide that the ramp is single-mode.
    const baseThemed = new Set(
      [...swift.matchAll(/public static func (\w+)\(/g)].map(([, n]) => n)
    );
    const themed = [...overlay.matchAll(/public static func (\w+)\(_ scheme/g)]
      .map(([, n]) => n)
      .filter((n) => baseThemed.has(n));
    expect(themed.length).toBeGreaterThan(0);
    const ramps = [
      ...overlay.matchAll(/public static func (primary\d+)\(/g),
    ].map(([, n]) => n);
    for (const ramp of ramps) {
      expect(swift, `${ramp} stays a constant in the base`).toContain(
        `public static let ${ramp}`
      );
    }
    for (const name of themed) {
      expect(swift, `${name} (Swift)`).toContain(
        `case .${brand}: return CocsoBrand${pascal}.Color.${name}(scheme)`
      );
      expect(kotlin, `${name} (Kotlin)`).toContain(
        `CocsoBrand.${pascal} -> CocsoBrand${pascal}.Color.${name}()`
      );
    }
  });

  it("gives no brand case to a token no brand overrides", () => {
    // text-primary is themed and no brand touches it.
    const fn = swift.match(SWIFT_TEXT_PRIMARY_BODY)?.[1] ?? "";
    expect(fn).not.toContain("case .");
  });

  it("declares the brand and its environment on both platforms", () => {
    expect(swift).toContain("public enum CocsoBrand");
    expect(swift).toContain("var cocsoBrand: CocsoBrand");
    expect(kotlin).toContain("enum class CocsoBrand");
    expect(kotlin).toContain("val LocalCocsoBrand = compositionLocalOf");
  });
});
