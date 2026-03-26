/**
 * recipe-generator.ts
 *
 * Generates Figma ComponentNodes from recipe definitions.
 * Each recipe section groups variants by the first dimension (e.g. "variant")
 * and creates a row per group, with one ComponentNode per variant combination.
 */

import type { RecipeDefinition, SlotStyles } from "@cocso-ui/recipe";
import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { type FigmaNodeSpec, resolveForFigma } from "./recipe-resolver";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

// ---------------------------------------------------------------------------
// Generic component builder
// ---------------------------------------------------------------------------

function createComponentFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  label: string
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "CENTER";

  // Height
  if (spec.height) {
    component.resize(component.width, spec.height);
  }

  // Padding
  if (spec.paddingInline) {
    component.paddingLeft = spec.paddingInline as number;
    component.paddingRight = spec.paddingInline as number;
  }
  if (spec.paddingLeft) {
    component.paddingLeft = spec.paddingLeft as number;
  }
  if (spec.paddingRight) {
    component.paddingRight = spec.paddingRight as number;
  }

  // Corner radius
  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius as number;
  }

  // Fill
  const bgColor = spec.bgColor ?? spec.fills;
  if (bgColor && typeof bgColor === "object") {
    setFill(component, bgColor as RGB);
  } else {
    component.fills = [];
  }

  // Stroke
  if (spec.strokeColor && spec.strokeWeight) {
    component.strokes = [createBoundPaint(spec.strokeColor as RGB)];
    component.strokeWeight = spec.strokeWeight as number;
  }

  // Text label
  const textColor =
    spec.fontColor && typeof spec.fontColor === "object"
      ? (spec.fontColor as RGB)
      : COLORS.neutral900;
  const fontSize = typeof spec.fontSize === "number" ? spec.fontSize : 14;
  const fontWeight =
    typeof spec.fontWeight === "number" ? spec.fontWeight : 500;
  const text = createTextNode(label, fontSize, fontWeight, textColor);
  component.appendChild(text);

  return component;
}

// ---------------------------------------------------------------------------
// Wide component builder (Input / Select need fixed width)
// ---------------------------------------------------------------------------

function createWideComponentFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  label: string,
  width = 200
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "MIN";

  const height = spec.height ?? 36;
  component.resize(width, height as number);

  // Padding
  if (spec.paddingLeft) {
    component.paddingLeft = spec.paddingLeft as number;
  } else if (spec.paddingInline) {
    component.paddingLeft = spec.paddingInline as number;
  }
  if (spec.paddingRight) {
    component.paddingRight = spec.paddingRight as number;
  } else if (spec.paddingInline) {
    component.paddingRight = spec.paddingInline as number;
  }

  // Corner radius
  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius as number;
  }

  // Fill
  setFill(component, COLORS.white);

  // Border via stroke
  component.strokes = [createBoundPaint(COLORS.neutral200)];
  component.strokeWeight = 1;

  // Text
  const fontSize = typeof spec.fontSize === "number" ? spec.fontSize : 14;
  const text = createTextNode(label, fontSize, 400, COLORS.neutral400);
  component.appendChild(text);

  return component;
}

// ---------------------------------------------------------------------------
// Spinner blade renderer (geometry from recipe)
// ---------------------------------------------------------------------------

function createSpinnerFromSpec(
  name: string,
  spec: FigmaNodeSpec
): ComponentNode {
  const bladeCount = typeof spec.blades === "number" ? spec.blades : 8;
  const bladeWidth = typeof spec.bladeWidth === "number" ? spec.bladeWidth : 2;
  const bladeHeight =
    typeof spec.bladeHeight === "number" ? spec.bladeHeight : 5;
  const bladeRadius =
    typeof spec.bladeRadius === "number" ? spec.bladeRadius : 1;
  const containerSize = typeof spec.output === "number" ? spec.output : 16;
  const bladeColor =
    spec.bladeColor && typeof spec.bladeColor === "object"
      ? (spec.bladeColor as RGB)
      : COLORS.neutral900;

  const component = figma.createComponent();
  component.name = name;
  component.resize(containerSize, containerSize);
  component.fills = [];

  for (let i = 0; i < bladeCount; i++) {
    const angleDeg = (i * 360) / bladeCount;
    const opacity = 1 - (i / bladeCount) * 0.85;

    const wrapper = figma.createFrame();
    wrapper.name = `blade-${i}`;
    wrapper.resize(containerSize, containerSize);
    wrapper.fills = [];

    const rect = figma.createRectangle();
    rect.name = "blade";
    rect.resize(bladeWidth, bladeHeight);
    rect.cornerRadius = bladeRadius;
    rect.fills = [createBoundPaint(bladeColor, opacity)];

    rect.x = (containerSize - bladeWidth) / 2;
    rect.y = containerSize - bladeHeight;

    wrapper.appendChild(rect);
    wrapper.rotation = -angleDeg;
    component.appendChild(wrapper);
  }

  return component;
}

// ---------------------------------------------------------------------------
// Checkbox renderer
// ---------------------------------------------------------------------------

function createCheckboxFromSpec(
  name: string,
  spec: FigmaNodeSpec
): ComponentNode {
  const boxSize = typeof spec.size === "number" ? spec.size : 16;
  let radius = 4;
  if (spec.radius !== undefined) {
    radius = spec.radius as number;
  } else if (spec.borderRadius !== undefined) {
    radius = spec.borderRadius as number;
  }
  const bgColor =
    spec.bgColor && typeof spec.bgColor === "object"
      ? (spec.bgColor as RGB)
      : COLORS.white;
  const borderColor =
    spec.borderColor && typeof spec.borderColor === "object"
      ? (spec.borderColor as RGB)
      : COLORS.neutral200;

  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 6;
  component.fills = [];

  const box = figma.createFrame();
  box.name = "box";
  box.resize(boxSize, boxSize);
  setFill(box, bgColor);
  box.strokes = [createBoundPaint(borderColor)];
  box.strokeWeight = 1;
  box.cornerRadius = radius as number;

  const labelText = createTextNode("Label", 14, 400, COLORS.neutral900);

  component.appendChild(box);
  component.appendChild(labelText);

  return component;
}

// ---------------------------------------------------------------------------
// Switch renderer
// ---------------------------------------------------------------------------

function createSwitchFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  isChecked: boolean
): ComponentNode {
  const trackWidth = typeof spec.width === "number" ? spec.width : 36;
  const trackHeight = typeof spec.height === "number" ? spec.height : 20;
  const thumbSize = typeof spec.thumbSize === "number" ? spec.thumbSize : 16;
  const thumbOffset =
    typeof spec.thumbOffset === "number" ? spec.thumbOffset : 2;

  const trackColor =
    isChecked && spec.checkedBgColor && typeof spec.checkedBgColor === "object"
      ? (spec.checkedBgColor as RGB)
      : COLORS.neutral200;

  const component = figma.createComponent();
  component.name = name;
  component.resize(trackWidth, trackHeight);
  component.cornerRadius = trackHeight / 2;
  setFill(component, trackColor);

  const thumb = figma.createEllipse();
  thumb.name = "thumb";
  thumb.resize(thumbSize, thumbSize);
  thumb.fills = [createBoundPaint(COLORS.white)];
  thumb.y = thumbOffset;
  if (isChecked) {
    thumb.x = trackWidth - thumbSize - thumbOffset;
  } else {
    thumb.x = thumbOffset;
  }

  component.appendChild(thumb);

  return component;
}

// ---------------------------------------------------------------------------
// Radio renderer
// ---------------------------------------------------------------------------

function createRadioFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  isSelected: boolean
): ComponentNode {
  const outerSize = typeof spec.size === "number" ? spec.size : 16;
  const dotSize = typeof spec.dotSize === "number" ? spec.dotSize : 7;

  const component = figma.createComponent();
  component.name = name;
  component.resize(outerSize, outerSize);

  if (isSelected) {
    setFill(component, COLORS.primary950);
  } else {
    setFill(component, COLORS.white);
    component.strokes = [createBoundPaint(COLORS.neutral200)];
    component.strokeWeight = 1;
  }
  component.cornerRadius = outerSize / 2;

  if (isSelected) {
    const dot = figma.createEllipse();
    dot.name = "dot";
    dot.resize(dotSize, dotSize);
    dot.fills = [createBoundPaint(COLORS.white)];
    dot.x = (outerSize - dotSize) / 2;
    dot.y = (outerSize - dotSize) / 2;
    component.appendChild(dot);
  }

  return component;
}

// ---------------------------------------------------------------------------
// Generic recipe section generator
// ---------------------------------------------------------------------------

/**
 * Get all variant combinations for a recipe as an array of variant maps.
 * Iterates cartesian product of all variant dimension values.
 */
function getAllVariantCombinations<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(recipe: RecipeDefinition<V, S>): Record<string, string>[] {
  const dimensions = Object.keys(recipe.variants) as (keyof V & string)[];
  if (dimensions.length === 0) {
    return [{}];
  }

  const entries = dimensions.map((dim) => ({
    dim,
    values: Object.keys(recipe.variants[dim]),
  }));

  let combinations: Record<string, string>[] = [{}];
  for (const { dim, values } of entries) {
    const next: Record<string, string>[] = [];
    for (const combo of combinations) {
      for (const val of values) {
        next.push({ ...combo, [dim]: val });
      }
    }
    combinations = next;
  }
  return combinations;
}

function generateGenericSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  container: FrameNode,
  recipe: RecipeDefinition<V, S>,
  sectionLabel: string,
  textLabel: string
): void {
  const section = createComponentSection(sectionLabel);
  const dimensions = Object.keys(recipe.variants) as string[];
  const firstDim = dimensions[0] ?? "default";
  const combinations = getAllVariantCombinations(recipe);

  // Group by first dimension value
  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec }>
  >();
  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push({ name: nameParts, spec });
  }

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = createComponentFromSpec(name, spec, textLabel);
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}

// ---------------------------------------------------------------------------
// Specialized section generators
// ---------------------------------------------------------------------------

function generateInputSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  container: FrameNode,
  recipe: RecipeDefinition<V, S>,
  sectionLabel: string,
  textLabel: string
): void {
  const section = createComponentSection(sectionLabel);
  const combinations = getAllVariantCombinations(recipe);

  const row = createVariantRow("size");
  for (const combo of combinations) {
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createWideComponentFromSpec(nameParts, spec, textLabel);
    row.appendChild(component);
  }

  section.appendChild(row);
  container.appendChild(section);
}

function generateLinkSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("Link");
  const combinations = getAllVariantCombinations(recipe);
  const row = createVariantRow("variant");

  for (const combo of combinations) {
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const variantValue = combo.variant ?? "inline";

    const component = figma.createComponent();
    component.name = nameParts;
    component.layoutMode = "HORIZONTAL";
    component.primaryAxisSizingMode = "AUTO";
    component.counterAxisSizingMode = "AUTO";
    component.fills = [];

    // Link color from "color" key (not fontColor/bgColor)
    const linkColor =
      spec.color && typeof spec.color === "object"
        ? (spec.color as RGB)
        : COLORS.info500;
    const text = createTextNode("Link text", 14, 400, linkColor);
    if (variantValue === "inline") {
      text.textDecoration = "UNDERLINE";
    }
    component.appendChild(text);
    row.appendChild(component);
  }

  section.appendChild(row);
  container.appendChild(section);
}

function generateStockQuantityStatusSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("StockQuantityStatus");
  const dimensions = Object.keys(recipe.variants) as string[];
  const firstDim = dimensions[0] ?? "quantity";
  const combinations = getAllVariantCombinations(recipe);

  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec }>
  >();
  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push({ name: nameParts, spec });
  }

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = figma.createComponent();
      component.name = name;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.fills = [];

      // Stock status uses "color" key (not bgColor/fontColor)
      const textColor =
        spec.color && typeof spec.color === "object"
          ? (spec.color as RGB)
          : COLORS.neutral900;
      const text = createTextNode(groupKey, 14, 500, textColor);
      component.appendChild(text);
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}

function generateCheckboxSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("Checkbox");
  const dimensions = Object.keys(recipe.variants) as string[];
  const firstDim = dimensions[0] ?? "size";
  const combinations = getAllVariantCombinations(recipe);

  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec }>
  >();
  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push({ name: nameParts, spec });
  }

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = createCheckboxFromSpec(name, spec);
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}

function generateSwitchSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("Switch");
  const dimensions = Object.keys(recipe.variants) as string[];
  const firstDim = dimensions[0] ?? "variant";
  const combinations = getAllVariantCombinations(recipe);

  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec; combo: Record<string, string> }>
  >();
  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push({ name: nameParts, spec, combo });
  }

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      // Show checked state
      const component = createSwitchFromSpec(
        `${name}, checked=true`,
        spec,
        true
      );
      row.appendChild(component);
      // Show unchecked state
      const componentOff = createSwitchFromSpec(
        `${name}, checked=false`,
        spec,
        false
      );
      row.appendChild(componentOff);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}

function generateRadioSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("RadioGroup");
  const combinations = getAllVariantCombinations(recipe);

  const row = createVariantRow("size");
  for (const combo of combinations) {
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const selected = createRadioFromSpec(
      `${nameParts}, selected=true`,
      spec,
      true
    );
    const unselected = createRadioFromSpec(
      `${nameParts}, selected=false`,
      spec,
      false
    );
    row.appendChild(selected);
    row.appendChild(unselected);
  }

  section.appendChild(row);
  container.appendChild(section);
}

function generateSpinnerSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("Spinner");
  const dimensions = Object.keys(recipe.variants) as string[];
  const firstDim = dimensions[0] ?? "variant";
  const combinations = getAllVariantCombinations(recipe);

  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec }>
  >();
  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push({ name: nameParts, spec });
  }

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = createSpinnerFromSpec(name, spec);
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate all recipe-based component sections into the given container frame.
 * Returns the number of component sets generated.
 */
export function generateFromRecipes(container: FrameNode): number {
  const sections = [
    () => generateGenericSection(container, buttonRecipe, "Button", "Button"),
    () => generateGenericSection(container, badgeRecipe, "Badge", "Badge"),
    () => generateInputSection(container, inputRecipe, "Input", "Placeholder"),
    () =>
      generateInputSection(container, selectRecipe, "Select", "Select option"),
    () => generateLinkSection(container, linkRecipe),
    () =>
      generateStockQuantityStatusSection(container, stockQuantityStatusRecipe),
    () => generateCheckboxSection(container, checkboxRecipe),
    () => generateSwitchSection(container, switchRecipe),
    () => generateRadioSection(container, radioGroupRecipe),
    () => generateSpinnerSection(container, spinnerRecipe),
  ];

  for (const generate of sections) {
    generate();
  }

  return sections.length;
}
