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

/** Files the generators own. The views are everything else. */
const GENERATED = new Set(["CocsoTokens", "CocsoStyles"]);

function componentNames(dir: string, extension: string): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(extension))
    .map((f) => f.slice(0, -extension.length))
    .filter((name) => !GENERATED.has(name))
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
 * view is: `CCTouchTarget` is a shared primitive holding a WCAG minimum, with
 * no recipe behind it and so nothing to resolve.
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
