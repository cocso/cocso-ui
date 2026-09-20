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
// `name(_ scheme:) { scheme == .dark ? Color(hex: 0xA) : Color(hex: 0xB) }`.
const SWIFT_SCHEME_BODY =
  /public static func (\w+)\(\s*_ scheme: ColorScheme[^)]*\)[^{]*\{\s*(?:return )?scheme == \.dark \? SwiftUI\.Color\(hex: (0x[0-9A-Fa-f]+)\) : SwiftUI\.Color\(hex: (0x[0-9A-Fa-f]+)\)/g;
const STATE_SUFFIXES = ["Hover", "Active", "Muted", "Subtle", "Disabled"];
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

  it("gives a token's states values you can tell apart from each other", () => {
    // `interactive.primary-muted` and `interactive.primary-active` were the same
    // byte in dark, so a disabled send button read as a pressed one — an
    // inactive control that looks live. The resting-vs-state check above could
    // not see it: both differed from `interactive.primary`.
    const values = new Map<string, { dark: string; light: string }>();
    for (const [, name, dark, light] of output.swift.matchAll(
      SWIFT_SCHEME_BODY
    )) {
      values.set(name, { dark, light });
    }
    const groups = new Map<string, string[]>();
    for (const name of values.keys()) {
      const suffix = STATE_SUFFIXES.find((s) => name.endsWith(s));
      if (!suffix) {
        continue;
      }
      const resting = name.slice(0, -suffix.length);
      if (!values.has(resting)) {
        continue;
      }
      groups.set(resting, [...(groups.get(resting) ?? []), name]);
    }
    expect([...groups.keys()].length).toBeGreaterThan(0);
    for (const [resting, states] of groups) {
      for (const scheme of ["dark", "light"] as const) {
        const seen = new Map<string, string>();
        for (const state of states) {
          const value = values.get(state)?.[scheme] as string;
          expect(
            seen.get(value),
            `${state} is ${seen.get(value)} in ${scheme} (both states of ${resting})`
          ).toBeUndefined();
          seen.set(value, state);
        }
      }
    }
  });

  it("carries nothing it could not express", () => {
    expect(output.skipped).toEqual([]);
  });

  it("gives every state of a token a value you can tell from the resting one", () => {
    // `interactive.primary-muted` was `info-500` — the same value the brand
    // gives `interactive.primary` in light, so a muted control was pixel-for-
    // pixel a live one. The base got this right and the overlay lost it, which
    // no other test here could see: the overlay was internally consistent, it
    // matched its snapshot, and both platforms agreed on the wrong colour.
    const values = new Map<string, { dark: string; light: string }>();
    for (const [, name, dark, light] of output.swift.matchAll(
      SWIFT_SCHEME_BODY
    )) {
      values.set(name, { dark, light });
    }
    expect(values.size).toBeGreaterThan(0);
    const states = [...values.keys()].filter((n) =>
      STATE_SUFFIXES.some(
        (s) => n.endsWith(s) && values.has(n.slice(0, -s.length))
      )
    );
    expect(states.length).toBeGreaterThan(0);
    for (const state of states) {
      const suffix = STATE_SUFFIXES.find((s) => state.endsWith(s)) as string;
      const resting = state.slice(0, -suffix.length);
      for (const scheme of ["dark", "light"] as const) {
        expect(
          values.get(state)?.[scheme],
          `${state} is ${resting} in ${scheme}`
        ).not.toBe(values.get(resting)?.[scheme]);
      }
    }
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
 * The brand's dark surfaces, measured.
 *
 * cocso lifts the dark page and card a step off the base's near-black, on the
 * app's ask ("too dark"), and that moves everything drawn on them: the quiet
 * ink loses contrast, the dividers and the feedback tints lose their lift, and
 * the card can stop reading as a card. Each of those is a number, so each is
 * asserted here rather than looked at once.
 */
describe("brand cocso dark surfaces", () => {
  const output = buildBrand("cocso");
  const values = new Map<string, string>();
  for (const [, name, dark] of output.swift.matchAll(SWIFT_SCHEME_BODY)) {
    values.set(name, dark);
  }
  const BASE = {
    // The base's own dark values, for what the brand does not override.
    textPrimary: "0xF4F5F6",
    textSecondary: "0x8A949E",
  };
  // Everything else the brand leaves to the base, read from the base rather
  // than copied here, so a base change moves these checks with it.
  const baseDark = new Map<string, string>();
  for (const [, name, dark] of fs.readFileSync(
    path.join(REPO_ROOT, "packages/swiftui/Sources/CocsoUI/CocsoTokens.swift"),
    "utf-8"
  ).matchAll(SWIFT_SCHEME_BODY)) {
    baseDark.set(name, dark);
  }

  function channels(hex: string): number[] {
    const digits = hex.slice(2);
    return [0, 2, 4].map(
      (i) => Number.parseInt(digits.slice(i, i + 2), 16) / 255
    );
  }
  function luminance(hex: string): number {
    const [r, g, b] = channels(hex).map((c) =>
      c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a: string, b: string): number {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }
  const card = () => values.get("surfacePrimary") as string;
  const page = () => values.get("surfaceSecondary") as string;

  it("overrides the surfaces it claims to", () => {
    expect(card()).toBeDefined();
    expect(page()).toBeDefined();
    expect(values.get("borderSecondary")).toBeDefined();
  });

  it.each([
    ["text-primary", BASE.textPrimary, 4.5],
    // The quiet ink is the one with the least room: it is 5.25 on the base's
    // dark page and every step of lift spends some of that.
    ["text-secondary", BASE.textSecondary, 4.5],
  ])("keeps %s above AA on both dark surfaces", (_name, ink, floor) => {
    expect(contrast(card(), ink)).toBeGreaterThanOrEqual(floor);
    expect(contrast(page(), ink)).toBeGreaterThanOrEqual(floor);
  });

  it("keeps the card distinct from the page, and the same way round", () => {
    // Mobile draws a page lighter than its cards. Lose the order and a card
    // sinks into the page; lose the gap and its edge disappears.
    expect(luminance(page())).toBeGreaterThan(luminance(card()));
    expect(contrast(card(), page())).toBeGreaterThanOrEqual(1.13);
  });

  it("keeps the divider visible on the lifted surfaces", () => {
    // `border-secondary` reads 1.52 on the base's dark card. Lifting the card
    // without lifting the divider drops it to 1.40.
    const divider = values.get("borderSecondary") as string;
    expect(contrast(card(), divider)).toBeGreaterThanOrEqual(1.5);
    expect(contrast(page(), divider)).toBeGreaterThanOrEqual(1.3);
  });

  it.each([
    "feedbackDangerBorder",
    "feedbackSuccessBorder",
    "feedbackWarningBorder",
    "feedbackInfoBorder",
  ])("%s is a boundary you can see on both dark surfaces", (token) => {
    // WCAG 1.4.11 asks 3:1 of a control's boundary. The base's dark values are
    // the ramp's `*-800`: on the lifted surfaces danger measured 1.12 on the
    // page, so "an irreversible action is entered through an outlined button"
    // rested on the label's colour alone.
    const border = values.get(token) as string;
    expect(contrast(page(), border)).toBeGreaterThanOrEqual(3);
    expect(contrast(card(), border)).toBeGreaterThanOrEqual(3);
  });

  it("does not let the warning ink outshout the danger ink", () => {
    // Both are read on the same surfaces, and the gate screen puts them side by
    // side: "waiting" in warning, "unmet" in danger. In dark the warning ink was
    // `interactive-warning` — 9.30 on the card against danger's 6.89 — so the
    // row the reader cannot act on shouted the louder.
    const warning = values.get("feedbackWarningText") as string;
    const danger = baseDark.get("feedbackDangerText") as string;
    expect(contrast(card(), warning)).toBeLessThanOrEqual(
      contrast(card(), danger)
    );
    // And it still has to be readable on its own panel.
    const panel = values.get("feedbackWarningSubtle") as string;
    expect(contrast(panel, warning)).toBeGreaterThanOrEqual(4.5);
  });

  it.each([
    "feedbackDangerSubtle",
    "feedbackSuccessSubtle",
    "feedbackWarningSubtle",
    "feedbackInfoSubtle",
  ])("%s lifts off both surfaces", (token) => {
    // The base's dark tints are the ramp's *-950, which sit within 1.01–1.29
    // of the lifted surfaces — an alert with no panel.
    const tint = values.get(token) as string;
    expect(contrast(page(), tint)).toBeGreaterThanOrEqual(1.2);
    expect(contrast(card(), tint)).toBeGreaterThanOrEqual(1.35);
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
