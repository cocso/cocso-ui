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

import { readFileSync } from "node:fs";
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
 * Feedback colors painted straight onto a page surface, with no fill of their
 * own. `StockQuantityStatus` sets `color: feedback-danger` (and friends) on
 * body-size text, so these are foregrounds — but the pairing scan above never
 * sees them, because it only collects variants that declare a fill. The dark
 * theme left these four on the light theme's 500 level, tuned against white,
 * and they landed at 3.96–4.05 on the dark surface.
 *
 * `feedback-success-muted` is deliberately absent: it resolves to `success-400`
 * in both themes and is 3.09:1 on white. `StockQuantityStatus` used to paint
 * its "normal" state with it and now uses `feedback-success` instead, so no
 * component paints text with the muted step any more. The token stays exported
 * — removing a published token is breaking — but it is not a text color.
 */
const BARE_FEEDBACK_TEXT_TOKENS = [
  "feedback-danger",
  "feedback-info",
  "feedback-warning",
  "feedback-success",
] as const;

describe("Feedback colors used as bare text clear AA on the page surface", () => {
  describe.each([
    ["light", LIGHT_ALIASES],
    ["dark", DARK_ALIASES],
  ])("%s theme", (_theme, aliases) => {
    it.each(
      BARE_FEEDBACK_TEXT_TOKENS
    )("%s clears WCAG AA on surface-primary", (token) => {
      const foreground = resolve(token, aliases);
      const background = resolve("surface-primary", aliases);
      expect(foreground).not.toBeNull();
      expect(background).not.toBeNull();
      expect(
        contrast(background as string, foreground as string)
      ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    });
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
