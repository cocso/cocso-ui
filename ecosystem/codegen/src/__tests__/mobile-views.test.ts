/**
 * The hand-written view layer, across the two platforms.
 *
 * The styles are generated and therefore cannot disagree. The views are not —
 * they are the part a person writes, and so the part that drifts: a component
 * added to one platform and forgotten on the other, or one whose parameters
 * stop matching its counterpart.
 *
 * `cocso/mobile` uses opencross for exactly this, comparing files and symbols
 * across its two platforms. This is the same idea at the design-system layer,
 * kept here rather than pulled in as a harness because what it compares is two
 * directories in one repository.
 */

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const SWIFT_DIR = path.join(repoRoot, "packages/swiftui/Sources/CocsoUI");
const KOTLIN_DIR = path.join(
  repoRoot,
  "packages/compose/src/main/kotlin/ai/cocso/ui"
);

/**
 * Files the generators own. The views are everything else.
 *
 * By prefix, not by list: every generated file is named `Cocso*` and every view
 * `CC*`. A list held two names until a third generated file — the brand
 * overlay `CocsoBrandCocso` — arrived and was read as a component with no
 * recipe behind it.
 */
const GENERATED = /^Cocso/;

function componentNames(dir: string, extension: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(extension))
    .map((f) => f.slice(0, -extension.length))
    .filter((name) => !GENERATED.test(name))
    .sort();
}

const swift = componentNames(SWIFT_DIR, ".swift");
const kotlin = componentNames(KOTLIN_DIR, ".kt");

describe("Both platforms carry the same components", () => {
  it("has components to compare", () => {
    expect(swift.length).toBeGreaterThan(0);
  });

  it("has no component on iOS that Android lacks", () => {
    expect(swift.filter((n) => !kotlin.includes(n))).toEqual([]);
  });

  it("has no component on Android that iOS lacks", () => {
    expect(kotlin.filter((n) => !swift.includes(n))).toEqual([]);
  });
});

describe("A component's variants agree across platforms", () => {
  const shared = swift.filter((n) => kotlin.includes(n));

  it.each(shared)("%s takes the same variant dimensions", (name) => {
    const swiftSource = readFileSync(
      path.join(SWIFT_DIR, `${name}.swift`),
      "utf-8"
    );
    const kotlinSource = readFileSync(
      path.join(KOTLIN_DIR, `${name}.kt`),
      "utf-8"
    );

    // The generated enums are named `<Component><Dimension>`, so the set a view
    // mentions is the set of dimensions it exposes.
    // `Style` is the struct the resolver returns, not a variant dimension.
    const dimensions = (source: string) =>
      new Set(
        [...source.matchAll(new RegExp(`${name}([A-Z]\\w+)`, "g"))]
          .map(([, dimension]) => dimension)
          .filter((dimension) => dimension !== "Style")
      );

    const inSwift = dimensions(swiftSource);
    const inKotlin = dimensions(kotlinSource);

    expect(
      [...inSwift].filter((d) => !inKotlin.has(d)).sort(),
      `${name} exposes these on iOS but not Android`
    ).toEqual([]);
    expect(
      [...inKotlin].filter((d) => !inSwift.has(d)).sort(),
      `${name} exposes these on Android but not iOS`
    ).toEqual([]);
  });
});

/**
 * A view is recipe-backed when the generator emitted a style for it. Not every
 * view is: `CCTouchTarget` is a shared primitive holding a WCAG minimum,
 * `CCMotion` builds the shared animations from the motion tokens, `CCGlass` is
 * the glass surface bars sit on, `CCShadow` draws a shadow token's layers, and
 * `CCStrings` is the words the views speak — each reads tokens or resources
 * directly because there is no variant to resolve.
 *
 * The set is read from the generated styles rather than assumed, and the
 * leftovers are then checked against the one name expected to be among them —
 * so a resolver that stops being emitted fails here rather than quietly
 * exempting the view that used to call it.
 */
const generatedStyles = new Set(
  [
    ...readFileSync(
      path.join(SWIFT_DIR, "CocsoStyles.swift"),
      "utf-8"
    ).matchAll(/public struct (CC\w+)Style\b/g),
  ].map(([, name]) => name)
);

describe("Views take their values from the generated styles", () => {
  const shared = swift.filter((n) => kotlin.includes(n));
  const recipeBacked = shared.filter((n) => generatedStyles.has(n));

  it("exempts only the views with no recipe behind them", () => {
    expect(shared.filter((n) => !generatedStyles.has(n))).toEqual([
      "CCGlass",
      "CCMotion",
      "CCShadow",
      "CCStrings",
      "CCTouchTarget",
    ]);
  });

  it.each(recipeBacked)("%s resolves a style rather than naming tokens", (name) => {
    const swiftSource = readFileSync(
      path.join(SWIFT_DIR, `${name}.swift`),
      "utf-8"
    );
    const kotlinSource = readFileSync(
      path.join(KOTLIN_DIR, `${name}.kt`),
      "utf-8"
    );

    // A view reaching past the resolver to pick tokens per variant is how
    // `cocso/mobile`'s CCButton ended up choosing colours by hand, which is
    // the drift the generated layer exists to remove. Fallbacks are allowed —
    // they are what a nil style property means — but the resolver has to be
    // the source.
    expect(
      swiftSource,
      `${name} (iOS) never calls its generated resolver`
    ).toContain(`${name}Style.resolve(`);
    expect(
      kotlinSource,
      `${name} (Android) never calls its generated resolver`
    ).toMatch(new RegExp(`${name[0].toLowerCase()}${name.slice(1)}Style\\(`));
  });
});

/**
 * Every value the resolver hands a view is used by it.
 *
 * Carrying a value across and then not reading it is the same loss as never
 * carrying it, and it is quieter — the generator reports success. Four
 * properties were arriving unread when this was written, and each one was a
 * visible difference from the web:
 *
 * - `CCCard` picked its inset from the spacing scale by hand, giving 8/12/20
 *   where the recipe says 12/16/24. Every card was tighter than the web's.
 * - `CCButton` dropped the padding the recipe puts inside the label.
 * - `CCProgress` drew a capsule on iOS and honoured the radius on Android, so
 *   the same bar was a different shape on the two platforms.
 * - `CCCheckbox` never drew its focus ring, which WCAG 2.4.7 asks for wherever
 *   there is a keyboard — and both platforms have one.
 */
describe("Views read every value their resolver gives them", () => {
  const styles = readFileSync(
    path.join(SWIFT_DIR, "CocsoStyles.swift"),
    "utf-8"
  );

  const properties = new Map(
    [
      ...styles.matchAll(
        /public struct (CC\w+)Style: Equatable, Sendable \{([\s\S]*?)\n\}/g
      ),
    ].map(([, name, body]) => [
      name,
      [...body.matchAll(/public var (\w+):/g)].map(([, property]) => property),
    ])
  );

  const shared = swift.filter(
    (n) => kotlin.includes(n) && properties.has(n) && properties.get(n)?.length
  );

  it("has resolvers to check", () => {
    expect(shared.length).toBeGreaterThan(0);
  });

  it.each(shared)("%s leaves nothing on the table", (name) => {
    for (const [platform, dir, extension] of [
      ["iOS", SWIFT_DIR, ".swift"],
      ["Android", KOTLIN_DIR, ".kt"],
    ] as const) {
      const source = readFileSync(
        path.join(dir, `${name}${extension}`),
        "utf-8"
      );
      const unread = (properties.get(name) ?? []).filter(
        (property) => !new RegExp(`\\b${property}\\b`).test(source)
      );
      expect(
        unread,
        `${name} (${platform}) is given these and never reads them`
      ).toEqual([]);
    }
  });
});

/**
 * `alpha` before `background`, on Compose.
 *
 * A Compose modifier affects what is drawn after it in the chain. `alpha`
 * placed below the fill dims only the content on top of it, so a disabled
 * button kept its fill at full strength on Android while iOS — where
 * `.opacity` covers the whole view — dimmed it. The two platforms disagreed on
 * what "disabled" looks like, and nothing here said so.
 */
describe("Compose dims the whole control, not only its content", () => {
  const views = kotlin.filter((n) => generatedStyles.has(n));
  it.each(views)("%s applies alpha before background", (name) => {
    const source = readFileSync(path.join(KOTLIN_DIR, `${name}.kt`), "utf-8");
    const alpha = source.indexOf(".alpha(");
    const background = source.indexOf(".background(");
    if (alpha === -1 || background === -1) {
      return;
    }
    expect(
      alpha,
      `${name}: .alpha( comes after .background(, so the fill is never dimmed`
    ).toBeLessThan(background);
  });
});

/**
 * A view that animates honours reduced motion and times itself from the
 * tokens.
 *
 * The web's rule (`module-css-motion-rtl.test.ts`): a module that animates
 * MUST honour `prefers-reduced-motion`, because motion is decoration and every
 * component reads the same without it. The same here, through
 * `accessibilityReduceMotion` on iOS and the animator duration scale on
 * Android — both reached through `CCMotion`. And the duration and curve come
 * from the motion tokens: before they crossed, the spinner turned in `0.8` and
 * the skeleton pulsed in `1000`, numbers that matched nothing on the web.
 */
describe("Views that animate honour reduced motion and use the motion tokens", () => {
  const SWIFT_ANIMATES = /\.animation\(|\.transition\(|withAnimation/;
  const KOTLIN_ANIMATES =
    /animate\w+AsState|rememberInfiniteTransition|AnimatedContent|AnimatedVisibility|Crossfade/;
  // A literal duration where a token should be.
  const SWIFT_LITERAL = /\.(?:linear|easeIn|easeOut|easeInOut)\(duration: \d|Easing\.\w+\(\d/;
  const KOTLIN_LITERAL = /tween\(\d/;
  /** Literal durations that are deliberate, with the reason. */
  const LITERAL_ALLOWED: Readonly<Record<string, string>> = {
    // The web's `spinner-reduced-pulse` is a literal `2s` as well: the pulse
    // that replaces the spin under reduced motion has no token on any platform.
    CCSpinner: "spinner-reduced-pulse is a literal 2s on the web too",
  };

  const views = swift.filter(
    (n) => kotlin.includes(n) && n !== "CCMotion" && n !== "CCTouchTarget"
  );

  it.each(views)("%s", (name) => {
    const swiftSource = readFileSync(
      path.join(SWIFT_DIR, `${name}.swift`),
      "utf-8"
    );
    const kotlinSource = readFileSync(
      path.join(KOTLIN_DIR, `${name}.kt`),
      "utf-8"
    );
    if (SWIFT_ANIMATES.test(swiftSource)) {
      expect(
        swiftSource,
        `${name} (iOS) animates without reading reduceMotion`
      ).toMatch(/reduceMotion/);
    }
    if (KOTLIN_ANIMATES.test(kotlinSource)) {
      expect(
        kotlinSource,
        `${name} (Android) animates without CCMotion or reducedMotion()`
      ).toMatch(/CCMotion\.|reducedMotion\(\)/);
    }
    if (!(name in LITERAL_ALLOWED)) {
      expect(
        SWIFT_LITERAL.test(swiftSource),
        `${name} (iOS) hard-codes a duration; use CocsoTokens.Duration`
      ).toBe(false);
      expect(
        KOTLIN_LITERAL.test(kotlinSource),
        `${name} (Android) hard-codes a duration; use CocsoTokens.Duration`
      ).toBe(false);
    }
  });
});

/**
 * A view never carries a word.
 *
 * "On", "Off", "Mixed", "Loading", "Show password" were written into the views
 * as literals, and a screen reader read them in English to a Korean user. They
 * are resources now (`CCStrings`, en and ko), and this holds the line: no
 * string literal a user could hear in an accessibility label, value, state or
 * default label parameter. Labels a caller passes are the caller's.
 */
describe("Views speak through CCStrings, not literals", () => {
  // A word: letters inside the quotes, not an empty default and not an
  // interpolated number (`"\(Int(fraction * 100))%"`).
  const WORD = String.raw`"(?!\\\()[^"]*[A-Za-z][^"]*"`;
  const SWIFT_SPOKEN = new RegExp(
    String.raw`\.accessibility(?:Label|Value|Hint)\((?:Text\()?${WORD}|(?:label|placeholder): String = ${WORD}`,
    "g"
  );
  const KOTLIN_SPOKEN = new RegExp(
    String.raw`(?:contentDescription|stateDescription)\s*=\s*(?:if \([^)]*\) )?${WORD}|(?:label|placeholder): String = ${WORD}`,
    "g"
  );
  const views = swift.filter((n) => kotlin.includes(n) && n !== "CCStrings");

  it.each(views)("%s", (name) => {
    const swiftSource = readFileSync(path.join(SWIFT_DIR, `${name}.swift`), "utf-8");
    const kotlinSource = readFileSync(path.join(KOTLIN_DIR, `${name}.kt`), "utf-8");
    expect(
      [...swiftSource.matchAll(SWIFT_SPOKEN)].map(([m]) => m),
      `${name} (iOS) speaks a literal`
    ).toEqual([]);
    expect(
      [...kotlinSource.matchAll(KOTLIN_SPOKEN)].map(([m]) => m),
      `${name} (Android) speaks a literal`
    ).toEqual([]);
  });
});
