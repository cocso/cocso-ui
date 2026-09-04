/**
 * Recipe → SwiftUI and Compose style resolvers.
 *
 * A recipe is already platform-neutral: it names variants and the tokens each
 * one takes, and says nothing about CSS. `@cocso-ui/codegen` turns that into
 * CSS custom properties and `@cocso-ui/figma` turns it into Figma component
 * specs. This is the third reader.
 *
 * Consistency across web, iOS and Android is the point, and generating from
 * one source is the only version of it that holds. A hand-mirrored component
 * agrees on the day it is written; this one cannot disagree, because the day a
 * variant is added to `button.recipe.ts` it appears in all three.
 *
 * What is emitted is the style layer, not the view — the same split the web
 * has, where the recipe carries values and the `.tsx` carries structure and
 * behaviour. A resolver takes the variant selections and returns the merged
 * values, applying base, then per-dimension variants, then compound variants,
 * in that order. That precedence is the cascade the CSS relies on and
 * `cascade-order.test.ts` pins; here it is a function, because neither platform
 * has a cascade to rely on.
 */

export interface RecipeLike {
  base?: Record<string, Record<string, unknown>>;
  compoundVariants?: {
    conditions: Record<string, string | string[]>;
    styles: Record<string, Record<string, unknown>>;
  }[];
  defaultVariants?: Record<string, string>;
  name: string;
  slots: readonly string[];
  variants: Record<string, Record<string, Record<string, unknown>>>;
}

export interface RecipeMobileOutput {
  kotlin: string;
  swift: string;
  /** Properties not carried across, with the reason. */
  skipped: { property: string; recipe: string; reason: string }[];
}

const PASCAL_BOUNDARY = /(^|[-_])([a-z0-9])/g;
const LEADING_DIGIT = /^\d/;
const NAME_SEPARATORS = /[-_]/;
/** A CSS length this maps to a number: `12px`, `-2px`, or a unitless `0`. */
const PX_LENGTH = /^(?:(-?\d+(?:\.\d+)?)px|(0))$/;

function pascal(value: string): string {
  const out = value.replace(PASCAL_BOUNDARY, (_, __, c: string) =>
    c.toUpperCase()
  );
  return LEADING_DIGIT.test(out) ? `X${out}` : out;
}

function camel(value: string): string {
  const p = pascal(value);
  return p[0].toLowerCase() + p.slice(1);
}

/**
 * Variant values come from the recipe verbatim, and some of them are keywords:
 * `switch` and `checkbox` carry `checked: "true" | "false"`. Both languages
 * take a backticked identifier, which keeps the name matching the web rather
 * than inventing a mobile-only spelling.
 */
const RESERVED = new Set([
  "as",
  "break",
  "case",
  "class",
  "continue",
  "default",
  "do",
  "else",
  "enum",
  "false",
  "for",
  "fun",
  "func",
  "if",
  "in",
  "is",
  "nil",
  "null",
  "object",
  "return",
  "super",
  "this",
  "throw",
  "true",
  "try",
  "typealias",
  "val",
  "var",
  "when",
  "while",
]);

function caseName(value: string): string {
  const name = camel(value);
  return RESERVED.has(name) ? `\`${name}\`` : name;
}

/**
 * The same rule the token emitter applies, and it has to be: these identifiers
 * are references into the file that one writes.
 *
 * `interactive-primary` → `interactivePrimary`, `radius-4` → `r4`,
 * `radius-full` → `full`. The scale letter is a prefix only when the name would
 * otherwise start with a digit — an earlier version prefixed radius names
 * unconditionally and emitted `rFull` against a token called `full`, which is
 * the kind of disagreement generating from one source is meant to remove.
 */
function tokenIdentifier(value: string, scale: "color" | "radius"): string {
  const parts = value.split(NAME_SEPARATORS).filter(Boolean);
  const rest = scale === "radius" ? parts.slice(1) : parts;
  if (rest.length === 0) {
    return "";
  }
  const ident =
    rest[0] + rest.slice(1).map((p) => p[0].toUpperCase() + p.slice(1)).join("");
  return LEADING_DIGIT.test(ident) ? `${scale[0]}${ident}` : ident;
}

type Emitted =
  | { kind: "color"; token: string; themed: boolean }
  | { kind: "length"; value: number }
  | { kind: "radius"; token: string }
  | { kind: "weight"; value: string }
  | { kind: "flag"; value: boolean }
  | { kind: "count"; value: number };

const COLOR_PROPERTIES = new Set([
  "bgColor",
  "bladeColor",
  "borderColor",
  "checkedBgColor",
  "checkedColor",
  "checkedThumbColor",
  "color",
  "fillColor",
  "focusRingColor",
  "fontColor",
  "switchBgColor",
]);

const RADIUS_PROPERTIES = new Set(["borderRadius", "bladeRadius", "radius"]);

/**
 * Numbers that count something rather than measure it. Everything else numeric
 * in a recipe is a length, so these are named rather than guessed — emitting
 * `blades` as a `Dp` made both views convert a density-scaled length back to
 * an integer to get a number the recipe had written as one.
 */
const COUNT_PROPERTIES = new Set(["blades"]);

function pxLength(value: string): number | null {
  const match = value.trim().match(PX_LENGTH);
  return match ? Number(match[1] ?? match[2]) : null;
}

/**
 * CSS padding shorthand, reduced to the vertical and horizontal insets both
 * platforms take separately.
 *
 * One value sets all four sides and two set `vertical horizontal`, which this
 * carries. Three and four values give the top and bottom different insets,
 * which an x/y pair cannot express — those are refused rather than half-read.
 *
 * A unitless `0` is a length in CSS and is one here too. Reading it as
 * anything else is how `0 6px` was silently dropped from the button.
 */
function splitPadding(value: string): { x: number; y: number } | null {
  const parts = value.trim().split(/\s+/).map(pxLength);
  if (parts.some((part) => part === null)) {
    return null;
  }
  const lengths = parts as number[];
  if (lengths.length === 1) {
    return { x: lengths[0], y: lengths[0] };
  }
  if (lengths.length === 2) {
    return { y: lengths[0], x: lengths[1] };
  }
  return null;
}

const FONT_WEIGHTS: Record<string, string> = {
  "400": "regular",
  "500": "medium",
  "600": "semibold",
  "700": "bold",
  bold: "bold",
  medium: "medium",
  regular: "regular",
  semibold: "semibold",
};

function classifyProperty(
  key: string,
  value: unknown,
  themedColors: Set<string>
): Record<string, Emitted> | string {
  if (COLOR_PROPERTIES.has(key)) {
    if (typeof value !== "string") {
      return `${key} is not a token name`;
    }
    if (value === "transparent" || value === "currentColor") {
      return `${key} is \`${value}\`, which the platform expresses itself`;
    }
    const token = tokenIdentifier(value, "color");
    return { [key]: { kind: "color", themed: themedColors.has(token), token } };
  }
  if (COUNT_PROPERTIES.has(key)) {
    return typeof value === "number"
      ? { [key]: { kind: "count", value } }
      : `${key} is not a number`;
  }
  if (RADIUS_PROPERTIES.has(key)) {
    if (typeof value === "number") {
      return { [key]: { kind: "length", value } };
    }
    if (typeof value !== "string") {
      return `${key} is neither a token name nor a length`;
    }
    // `100%` and `0` are literals the recipe writes directly, not tokens.
    //
    // A percentage radius is a capsule. Neither platform has a length that
    // means that, so it travels as a flag the view reads — which is the point:
    // dropping it left the view to notice the shape from the variant name, and
    // `CCButton(shape: .circle)` and `CCSkeleton(variant: .circular)` both
    // rendered a square because neither did.
    if (/^\d+(?:\.\d+)?%$/.test(value)) {
      return { [`${key}Full`]: { kind: "flag", value: true } };
    }
    if (!value.startsWith("radius-")) {
      const length = pxLength(value);
      if (length === null) {
        return `${key} is \`${value}\`, neither a radius token nor a length`;
      }
      return { [key]: { kind: "length", value: length } };
    }
    return { [key]: { kind: "radius", token: tokenIdentifier(value, "radius") } };
  }
  if (key === "fontWeight") {
    const weight = FONT_WEIGHTS[String(value)];
    return weight
      ? { [key]: { kind: "weight", value: weight } }
      : `fontWeight ${value} has no platform equivalent`;
  }
  if (key === "padding" || key === "contentPadding") {
    if (typeof value !== "string") {
      return `${key} is not a shorthand string`;
    }
    const split = splitPadding(value);
    if (!split) {
      return `${key} shorthand \`${value}\` is not two lengths`;
    }
    const prefix = key === "padding" ? "padding" : "contentPadding";
    return {
      [`${prefix}X`]: { kind: "length", value: split.x },
      [`${prefix}Y`]: { kind: "length", value: split.y },
    };
  }
  if (typeof value === "number") {
    return { [key]: { kind: "length", value } };
  }
  return `${key} carries \`${String(value)}\`, which has no single-value equivalent`;
}

interface Layer {
  /** `undefined` for the base layer. */
  conditions?: Record<string, string>;
  properties: Record<string, Emitted>;
}

interface Prepared {
  dimensions: { name: string; values: string[] }[];
  layers: Layer[];
  name: string;
  properties: Map<string, Emitted["kind"]>;
  typeName: string;
}

function prepare(
  recipe: RecipeLike,
  themed: Set<string>,
  skipped: RecipeMobileOutput["skipped"]
): Prepared {
  const layers: Layer[] = [];
  const properties = new Map<string, Emitted["kind"]>();

  const take = (
    slotStyles: Record<string, Record<string, unknown>> | undefined,
    conditions?: Record<string, string>
  ) => {
    const root = slotStyles?.root;
    if (!root) {
      return;
    }
    const collected: Record<string, Emitted> = {};
    for (const [key, value] of Object.entries(root)) {
      const result = classifyProperty(key, value, themed);
      if (typeof result === "string") {
        skipped.push({ property: key, recipe: recipe.name, reason: result });
        continue;
      }
      for (const [name, emitted] of Object.entries(result)) {
        collected[name] = emitted;
        properties.set(name, emitted.kind);
      }
    }
    if (Object.keys(collected).length > 0) {
      layers.push({ conditions, properties: collected });
    }
  };

  take(recipe.base);
  const dimensions = Object.entries(recipe.variants).map(([name, values]) => {
    for (const [value, slots] of Object.entries(values)) {
      take(slots, { [name]: value });
    }
    return { name, values: Object.keys(values) };
  });
  for (const compound of recipe.compoundVariants ?? []) {
    const conditions: Record<string, string> = {};
    let expandable = true;
    for (const [dim, value] of Object.entries(compound.conditions)) {
      if (Array.isArray(value)) {
        // Emitted once per value below.
        expandable = false;
        break;
      }
      conditions[dim] = value;
    }
    if (expandable) {
      take(compound.styles, conditions);
      continue;
    }
    const entries = Object.entries(compound.conditions);
    const expand = (index: number, acc: Record<string, string>) => {
      if (index === entries.length) {
        take(compound.styles, { ...acc });
        return;
      }
      const [dim, value] = entries[index];
      for (const v of Array.isArray(value) ? value : [value]) {
        expand(index + 1, { ...acc, [dim]: v });
      }
    };
    expand(0, {});
  }

  return {
    dimensions,
    layers,
    name: recipe.name,
    properties,
    typeName: `CC${pascal(recipe.name)}`,
  };
}

function swiftType(kind: Emitted["kind"]): string {
  switch (kind) {
    case "color":
      return "SwiftUI.Color";
    case "weight":
      return "Font.Weight";
    case "flag":
      return "Bool";
    case "count":
      return "Int";
    default:
      return "CGFloat";
  }
}

function swiftValue(value: Emitted): string {
  switch (value.kind) {
    case "color":
      return value.themed
        ? `CocsoTokens.Color.${value.token}(scheme)`
        : `CocsoTokens.Color.${value.token}`;
    case "radius":
      return `CocsoTokens.Radius.${value.token}`;
    case "weight":
      return `.${value.value}`;
    case "flag":
    case "count":
      return `${value.value}`;
    default:
      return `${value.value}`;
  }
}

function kotlinType(kind: Emitted["kind"]): string {
  switch (kind) {
    case "color":
      return "ComposeColor";
    case "weight":
      return "FontWeight";
    case "flag":
      return "Boolean";
    case "count":
      return "Int";
    default:
      return "Dp";
  }
}

function kotlinValue(value: Emitted): string {
  switch (value.kind) {
    case "color":
      return value.themed
        ? `CocsoTokens.Color.${value.token}()`
        : `CocsoTokens.Color.${value.token}`;
    case "radius":
      return `CocsoTokens.Radius.${value.token}`;
    case "weight": {
      // Compose spells it `SemiBold`, not `Semibold`.
      const names: Record<string, string> = {
        bold: "Bold",
        medium: "Medium",
        regular: "Normal",
        semibold: "SemiBold",
      };
      return `FontWeight.${names[value.value] ?? pascal(value.value)}`;
    }
    case "flag":
    case "count":
      return `${value.value}`;
    default:
      return `${value.value}.dp`;
  }
}

function conditionSwift(conditions: Record<string, string>, p: Prepared): string {
  return Object.entries(conditions)
    .map(([dim, value]) => `${camel(dim)} == .${caseName(value)}`)
    .join(" && ");
}

function conditionKotlin(
  conditions: Record<string, string>,
  typeName: string
): string {
  return Object.entries(conditions)
    .map(
      ([dim, value]) =>
        `${camel(dim)} == ${typeName}${pascal(dim)}.${caseName(value)}`
    )
    .join(" && ");
}

export function generateRecipeSwift(prepared: Prepared[]): string {
  const lines: string[] = [];
  for (const p of prepared) {
    for (const dim of p.dimensions) {
      lines.push(
        `public enum ${p.typeName}${pascal(dim.name)}: String, CaseIterable, Sendable {`,
        ...dim.values.map((v) => `    case ${caseName(v)}`),
        "}",
        ""
      );
    }

    lines.push(`public struct ${p.typeName}Style: Equatable, Sendable {`);
    for (const [name, kind] of p.properties) {
      lines.push(`    public var ${name}: ${swiftType(kind)}?`);
    }
    lines.push("");
    lines.push("    /// Base, then each variant dimension, then compound");
    lines.push("    /// variants — the order the CSS cascade encodes.");
    const params = [
      ...p.dimensions.map(
        (d) => `${camel(d.name)}: ${p.typeName}${pascal(d.name)}`
      ),
      "scheme: ColorScheme",
    ].join(",\n        ");
    lines.push(`    public static func resolve(`, `        ${params}`, `    ) -> ${p.typeName}Style {`);
    lines.push(`        var style = ${p.typeName}Style()`);
    for (const layer of p.layers) {
      const assignments = Object.entries(layer.properties).map(
        ([name, value]) => `            style.${name} = ${swiftValue(value)}`
      );
      if (layer.conditions) {
        lines.push(
          `        if ${conditionSwift(layer.conditions, p)} {`,
          ...assignments,
          "        }"
        );
      } else {
        lines.push(...assignments.map((a) => a.replace(/^ {4}/, "")));
      }
    }
    lines.push("        return style", "    }", "}", "");
  }
  return lines.join("\n");
}

export function generateRecipeKotlin(prepared: Prepared[]): string {
  const lines: string[] = [];
  for (const p of prepared) {
    for (const dim of p.dimensions) {
      // Prefixed with the component, the way Swift's are: Kotlin enums are
      // top-level, and nineteen recipes with a `Size` dimension cannot each
      // declare `Size`.
      lines.push(
        `enum class ${p.typeName}${pascal(dim.name)} {`,
        ...dim.values.map((v) => `    ${caseName(v)},`),
        "}",
        ""
      );
    }
    lines.push(`data class ${p.typeName}Style(`);
    for (const [name, kind] of p.properties) {
      lines.push(`    val ${name}: ${kotlinType(kind)}? = null,`);
    }
    lines.push(")", "");

    const params = p.dimensions
      .map(
        (d) => `    ${camel(d.name)}: ${p.typeName}${pascal(d.name)},`
      )
      .join("\n");
    lines.push(
      "@Composable",
      "@ReadOnlyComposable",
      `fun ${camel(p.typeName)}Style(`,
      params,
      `): ${p.typeName}Style {`,
      `    var style = ${p.typeName}Style()`
    );
    for (const layer of p.layers) {
      const assignments = Object.entries(layer.properties).map(
        ([name, value]) => `        style = style.copy(${name} = ${kotlinValue(value)})`
      );
      if (layer.conditions) {
        lines.push(
          `    if (${conditionKotlin(layer.conditions, p.typeName)}) {`,
          ...assignments,
          "    }"
        );
      } else {
        lines.push(...assignments.map((a) => a.replace(/^ {4}/, "")));
      }
    }
    lines.push("    return style", "}", "");
  }
  return lines.join("\n");
}

/**
 * @param themed Colour token identifiers the token layer emits as a function of
 * the colour scheme, rather than as constants. Passed in rather than derived so
 * this does not need the token AST — the caller already knows, from
 * `theme-dark.css` or from the generator.
 */
export function generateRecipeStyles(
  recipes: RecipeLike[],
  themed: Set<string>
): RecipeMobileOutput {
  const skipped: RecipeMobileOutput["skipped"] = [];
  const prepared = recipes.map((r) => prepare(r, themed, skipped));
  return {
    kotlin: generateRecipeKotlin(prepared),
    skipped,
    swift: generateRecipeSwift(prepared),
  };
}

export const mobileRecipes = {
  generateRecipeStyles,
} as const;
