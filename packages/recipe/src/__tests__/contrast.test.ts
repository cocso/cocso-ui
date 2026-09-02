/**
 * Contrast Test — every recipe pairing of a fill and a foreground
 *
 * Recipes name colors semantically, and the semantic layer is redefined by the
 * dark theme. A pairing that reads well in one theme can therefore fail in the
 * other without either file looking wrong on its own: `text-on-primary` flips
 * to a dark value in the dark theme because `interactive-primary` flips to a
 * light one, but `interactive-warning` keeps its hue in both themes, so the
 * same foreground landed near-white on bright amber at 1.67:1.
 *
 * This resolves each pairing through both themes and asserts WCAG AA.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { alertRecipe } from "../recipes/alert.recipe";
import { avatarRecipe } from "../recipes/avatar.recipe";
import { badgeRecipe } from "../recipes/badge.recipe";
import { breadcrumbRecipe } from "../recipes/breadcrumb.recipe";
import { buttonRecipe } from "../recipes/button.recipe";
import { cardRecipe } from "../recipes/card.recipe";
import { checkboxRecipe } from "../recipes/checkbox.recipe";
import { dialogRecipe } from "../recipes/dialog.recipe";
import { inputRecipe } from "../recipes/input.recipe";
import { linkRecipe } from "../recipes/link.recipe";
import { paginationRecipe } from "../recipes/pagination.recipe";
import { progressRecipe } from "../recipes/progress.recipe";
import { radioGroupRecipe } from "../recipes/radio-group.recipe";
import { selectRecipe } from "../recipes/select.recipe";
import { skeletonRecipe } from "../recipes/skeleton.recipe";
import { spinnerRecipe } from "../recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "../recipes/stock-quantity-status.recipe";
import { switchRecipe } from "../recipes/switch.recipe";
import { typographyRecipe } from "../recipes/typography.recipe";
import type { RecipeDefinition, SlotStyles } from "../types";

/** Any recipe, regardless of its variant and slot type parameters. */
type AnyRecipe = RecipeDefinition<
  Record<string, Record<string, Partial<Record<string, SlotStyles>>>>,
  string
>;

const CSS_DIR = join(import.meta.dirname, "..", "..", "..", "css");

/** WCAG 2.2 SC 1.4.3, normal text. */
const AA_NORMAL_TEXT = 4.5;

function parseTokens(file: string) {
  const css = readFileSync(join(CSS_DIR, file), "utf-8");
  const primitives = new Map<string, string>();
  const aliases = new Map<string, string>();
  for (const [, name, value] of css.matchAll(
    /--cocso-color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g
  )) {
    primitives.set(name, value);
  }
  for (const [, name, target] of css.matchAll(
    /--cocso-color-([a-z0-9-]+):\s*var\(--cocso-color-([a-z0-9-]+)\);/g
  )) {
    aliases.set(name, target);
  }
  return { primitives, aliases };
}

const lightTokens = parseTokens("token.css");
const darkTokens = parseTokens("theme-dark.css");

const PRIMITIVES = new Map(lightTokens.primitives);
PRIMITIVES.set("white", "#ffffff");
PRIMITIVES.set("black", "#000000");

const LIGHT_ALIASES = lightTokens.aliases;
const DARK_ALIASES = new Map([...lightTokens.aliases, ...darkTokens.aliases]);

function resolve(
  token: string,
  aliases: Map<string, string>,
  depth = 0
): string | null {
  if (depth > 8) {
    return null;
  }
  const primitive = PRIMITIVES.get(token);
  if (primitive) {
    return primitive;
  }
  const alias = aliases.get(token);
  return alias ? resolve(alias, aliases, depth + 1) : null;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255
  );
  const [r, g, b] = channels.map((c) =>
    c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  );
  return (hi + 0.05) / (lo + 0.05);
}

interface Pairing {
  bgColor: string;
  fontColor: string;
  label: string;
}

function slotColors(styles: SlotStyles | undefined) {
  const bgColor = styles?.bgColor as string | undefined;
  const fontColor = styles?.fontColor as string | undefined;
  return { bgColor, fontColor };
}

/** Variant pairings that set both a fill and a foreground. */
function variantPairings(recipe: AnyRecipe): Pairing[] {
  const pairings: Pairing[] = [];
  for (const [dimension, values] of Object.entries(recipe.variants)) {
    for (const [value, slots] of Object.entries(
      values as Record<string, Record<string, SlotStyles>>
    )) {
      const { bgColor, fontColor } = slotColors(slots.root);
      if (bgColor && fontColor) {
        pairings.push({
          label: `${recipe.name} ${dimension}=${value}`,
          bgColor,
          fontColor,
        });
      }
    }
  }
  const base = slotColors(recipe.base?.root as SlotStyles | undefined);
  if (base.bgColor && base.fontColor) {
    pairings.push({
      label: `${recipe.name} base`,
      bgColor: base.bgColor,
      fontColor: base.fontColor,
    });
  }
  return pairings;
}

/**
 * Interactive state pairings. A state usually overrides only the fill, so the
 * foreground falls back to the one the variant declares — which is exactly how
 * a state can drift below AA while the variant itself passes.
 */
function statePairings(recipe: AnyRecipe): Pairing[] {
  const pairings: Pairing[] = [];
  const variantForegrounds = new Map<string, string>();
  for (const [value, slots] of Object.entries(
    (recipe.variants.variant ?? {}) as Record<
      string,
      Record<string, SlotStyles>
    >
  )) {
    const { fontColor } = slotColors(slots.root);
    if (fontColor) {
      variantForegrounds.set(value, fontColor);
    }
  }

  for (const [state, dimensions] of Object.entries(recipe.states ?? {})) {
    const variants = (dimensions as Record<string, unknown>).variant as
      | Record<string, Record<string, SlotStyles>>
      | undefined;
    for (const [value, slots] of Object.entries(variants ?? {})) {
      const { bgColor, fontColor } = slotColors(slots.root);
      const foreground = fontColor ?? variantForegrounds.get(value);
      if (bgColor && foreground) {
        pairings.push({
          label: `${recipe.name} variant=${value}:${state}`,
          bgColor,
          fontColor: foreground,
        });
      }
    }
  }
  return pairings;
}

/**
 * Every recipe, not a hand-picked few. The list used to hold six of nineteen,
 * and `link` was one of the thirteen it left out: it paints text with
 * `interactive-info`, a fill token the dark theme deliberately does not flip,
 * so a link was 4.05:1 on the dark surface and its hover state — `info-700`,
 * meant for a pressed fill — was 1.74:1. Hovering a link nearly erased it, and
 * the check that exists to catch exactly that was not looking.
 */
const RECIPES = [
  alertRecipe,
  avatarRecipe,
  badgeRecipe,
  breadcrumbRecipe,
  buttonRecipe,
  cardRecipe,
  checkboxRecipe,
  dialogRecipe,
  inputRecipe,
  linkRecipe,
  paginationRecipe,
  progressRecipe,
  radioGroupRecipe,
  selectRecipe,
  skeletonRecipe,
  spinnerRecipe,
  stockQuantityStatusRecipe,
  switchRecipe,
  typographyRecipe,
] as AnyRecipe[];

const PAIRINGS = RECIPES.flatMap((recipe) => [
  ...variantPairings(recipe),
  ...statePairings(recipe),
]);

/**
 * Surfaces that host bordered content — the page and the cards on it.
 * `surface-neutral` is a component fill (avatar, switch track), not a container
 * that dividers are drawn on, so a border sharing its value is not a defect.
 */
const SURFACE_TOKENS = ["surface-primary", "surface-secondary"] as const;

/**
 * Surfaces text actually lands on. `surface-primary` and `surface-secondary`
 * are the page and the cards; the rest are tints a component paints and then
 * writes on — an Alert's panel, a Badge's pill, a subtle button's fill.
 *
 * The list used to hold the first two, which is what let the light theme's
 * floor go unmeasured: `interactive-primary-subtle` is `neutral-100` and worse
 * than a card, so the 500-level accents were 3.70:1 there, not the 4.17:1 the
 * page-and-card view reported.
 */
const SURFACES = [
  "surface-primary",
  "surface-secondary",
  "interactive-primary-subtle",
  "feedback-danger-subtle",
  "feedback-success-subtle",
  "feedback-warning-subtle",
  "feedback-info-subtle",
] as const;

const BORDER_TOKENS = [
  "border-primary",
  "border-secondary",
  "border-strong",
] as const;

describe("Borders are distinguishable from the surfaces they sit on", () => {
  describe.each([
    ["light", LIGHT_ALIASES],
    ["dark", DARK_ALIASES],
  ])("%s theme", (_theme, aliases) => {
    const pairs = BORDER_TOKENS.flatMap((border) =>
      SURFACE_TOKENS.map((surface) => ({ border, surface }))
    );

    // Not a contrast threshold — dividers are allowed to be subtle, and the
    // light theme's own are around 1.13:1. The defect this catches is a border
    // resolving to the exact value of a surface, which the dark theme did:
    // `border-secondary` and `surface-secondary` were both `neutral-900`, so
    // every divider drawn on a card disappeared.
    it.each(pairs)("$border differs from $surface", ({ border, surface }) => {
      expect(resolve(border, aliases)).not.toEqual(resolve(surface, aliases));
    });
  });
});

/**
 * Colors painted straight onto a surface, with no fill of their own. The
 * pairing scan above never sees these — it only collects variants that declare
 * a fill — so `StockQuantityStatus` and `Link` were structurally invisible to
 * it. Between them they have produced three defects: the `feedback-*` bases had
 * no dark value at all, `Link` painted text with a fixed-hue fill token whose
 * hover state was 1.74:1 on a dark surface, and the 500 level sat below AA on
 * every light surface except white.
 *
 * They are checked against every surface, not just the page. That distinction
 * is what was missing: `interactive-primary-subtle` is `neutral-100` and worse
 * than a card, so the 500-level accents measured 3.70:1 there while the
 * page-and-card view reported 4.17:1.
 *
 * `feedback-*` bases are deliberately absent. They are fills — the Progress
 * bar and the Spinner blade — and WCAG 1.4.11 asks 3:1 of a non-text graphic,
 * which they clear on every surface in both themes. No component paints text
 * with them any more.
 */
const BARE_TEXT_TOKENS = [
  "feedback-danger-text",
  "feedback-info-text",
  "feedback-warning-text",
  "feedback-success-text",
  "interactive-info-text",
  "interactive-info-text-hover",
] as const;

describe("Colors used as bare text clear AA on every surface", () => {
  describe.each([
    ["light", LIGHT_ALIASES],
    ["dark", DARK_ALIASES],
  ])("%s theme", (_theme, aliases) => {
    const cases = BARE_TEXT_TOKENS.flatMap((token) =>
      SURFACES.map((surface) => ({ surface, token }))
    );

    it.each(cases)("$token on $surface", ({ token, surface }) => {
      const foreground = resolve(token, aliases);
      const background = resolve(surface, aliases);
      expect(foreground).not.toBeNull();
      expect(background).not.toBeNull();
      expect(
        contrast(background as string, foreground as string)
      ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    });
  });
});

/**
 * What this check covers, asserted rather than assumed.
 *
 * `RECIPES` is written out by hand, and a hand-written list is the thing that
 * silently narrows. It held six of nineteen for as long as it existed, and
 * `link` — which paints text with a fixed-hue fill token, 1.74:1 on hover in
 * the dark theme — was one of the thirteen it left out. Nothing failed, because
 * the only thing asserted about the list's size was a floor.
 *
 * A floor catches a check that stops covering things. It does not catch a new
 * recipe the check has never heard of, which is the direction this actually
 * broke in.
 */
/**
 * Recipes whose file name differs from the `name` they declare. `radio-group`
 * declares `radio`, which is what the generated class and CSS file are called.
 */
const FILE_NAME_ALIASES: Readonly<Record<string, string>> = {
  "radio-group": "radio",
};

describe("The contrast check covers every recipe", () => {
  it("has no recipe on disk missing from RECIPES", () => {
    const onDisk = readdirSync(join(import.meta.dirname, "..", "recipes"))
      .filter((file) => file.endsWith(".recipe.ts"))
      .map((file) => file.replace(".recipe.ts", ""))
      .map((name) => FILE_NAME_ALIASES[name] ?? name)
      .sort();
    const checked = RECIPES.map((recipe) => recipe.name).sort();

    expect(
      onDisk.filter((name) => !checked.includes(name)),
      "a recipe exists that the contrast check never resolves — add it to RECIPES"
    ).toEqual([]);
    expect(
      checked.filter((name) => !onDisk.includes(name)),
      "RECIPES names a recipe that no longer exists"
    ).toEqual([]);
  });
});

describe("Contrast — recipe fills against their foregrounds", () => {
  it("finds pairings to check", () => {
    expect(PAIRINGS.length).toBeGreaterThan(20);
  });

  describe.each([
    ["light", LIGHT_ALIASES],
    ["dark", DARK_ALIASES],
  ])("%s theme", (_theme, aliases) => {
    it.each(PAIRINGS)("$label clears WCAG AA", ({ bgColor, fontColor }) => {
      const background = resolve(bgColor, aliases);
      const foreground = resolve(fontColor, aliases);

      // `transparent` has no resolvable colour; the surface underneath decides.
      if (!(background && foreground)) {
        return;
      }

      expect(contrast(background, foreground)).toBeGreaterThanOrEqual(
        AA_NORMAL_TEXT
      );
    });
  });
});
