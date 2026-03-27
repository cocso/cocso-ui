import type { RecipeDefinition, SlotStyles } from "@cocso-ui/recipe";
import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import { dialogRecipe } from "@cocso-ui/recipe/recipes/dialog.recipe";
import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { paginationRecipe } from "@cocso-ui/recipe/recipes/pagination.recipe";
import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import { typographyRecipe } from "@cocso-ui/recipe/recipes/typography.recipe";
import { type FigmaNodeSpec, resolveForFigma } from "./recipe-resolver";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
  SHADOW_MD,
  setFill,
} from "./shared";

function createComponentFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  label: string
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = spec.height ? "FIXED" : "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "CENTER";

  if (spec.height) {
    component.resize(component.width, spec.height);
  }

  if (spec.paddingInline) {
    component.paddingLeft = spec.paddingInline;
    component.paddingRight = spec.paddingInline;
  }
  if (spec.paddingLeft) {
    component.paddingLeft = spec.paddingLeft;
  }
  if (spec.paddingRight) {
    component.paddingRight = spec.paddingRight;
  }
  if (spec.paddingTop) {
    component.paddingTop = spec.paddingTop;
  }
  if (spec.paddingBottom) {
    component.paddingBottom = spec.paddingBottom;
  }

  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius;
  }

  const bgColor = spec.bgColor ?? spec.fills;
  if (bgColor) {
    setFill(component, bgColor);
  } else {
    component.fills = [];
  }

  if (spec.strokeColor && spec.strokeWeight) {
    component.strokes = [createBoundPaint(spec.strokeColor)];
    component.strokeWeight = spec.strokeWeight;
  }

  const textColor = spec.fontColor ?? COLORS.neutral900;
  const fontSize = spec.fontSize ?? 14;
  const fontWeight = spec.fontWeight ?? 500;
  const text = createTextNode(label, fontSize, fontWeight, textColor);
  component.appendChild(text);

  return component;
}

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
  component.resize(width, height);

  if (spec.paddingLeft) {
    component.paddingLeft = spec.paddingLeft;
  } else if (spec.paddingInline) {
    component.paddingLeft = spec.paddingInline;
  }
  if (spec.paddingRight) {
    component.paddingRight = spec.paddingRight;
  } else if (spec.paddingInline) {
    component.paddingRight = spec.paddingInline;
  }

  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius;
  }

  setFill(component, COLORS.white);

  component.strokes = [createBoundPaint(COLORS.neutral200)];
  component.strokeWeight = 1;

  const fontSize = spec.fontSize ?? 14;
  const text = createTextNode(label, fontSize, 400, COLORS.neutral400);
  component.appendChild(text);

  return component;
}

function createSelectComponentFromSpec(
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
  component.resize(width, height);

  if (spec.paddingLeft) {
    component.paddingLeft = spec.paddingLeft;
  } else if (spec.paddingInline) {
    component.paddingLeft = spec.paddingInline;
  }

  component.paddingRight = spec.iconRight ?? 12;

  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius;
  }

  setFill(component, COLORS.white);
  component.strokes = [createBoundPaint(COLORS.neutral200)];
  component.strokeWeight = 1;

  const fontSize = spec.fontSize ?? 14;
  const text = createTextNode(label, fontSize, 400, COLORS.neutral400);
  text.layoutGrow = 1;
  component.appendChild(text);

  const iconSize = Math.min(16, Math.round(height * 0.44));
  const icon = createIcon(
    ICON_SVGS.selector,
    iconSize,
    rgbToHex(COLORS.neutral400)
  );
  component.appendChild(icon);

  return component;
}

function createSpinnerFromSpec(
  name: string,
  spec: FigmaNodeSpec
): ComponentNode {
  const bladeCount = spec.blades ?? 8;
  const bw = spec.bladeWidth ?? 2;
  const bh = spec.bladeHeight ?? 5;
  const br = spec.bladeRadius ?? 1;
  const containerSize = spec.output ?? 16;
  const bladeColor = spec.bladeColor ?? COLORS.neutral900;
  const hexColor = rgbToHex(bladeColor);

  const cx = containerSize / 2;
  const cy = containerSize / 2;
  const bx = (containerSize - bw) / 2;
  const by = containerSize - bh;

  let rects = "";
  for (let i = 0; i < bladeCount; i++) {
    const angleDeg = (i * 360) / bladeCount;
    const opacity = 1 - (i / bladeCount) * 0.85;
    rects += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${br}" fill="${hexColor}" opacity="${opacity.toFixed(3)}" transform="rotate(${angleDeg} ${cx} ${cy})"/>`;
  }

  const svg = `<svg viewBox="0 0 ${containerSize} ${containerSize}" width="${containerSize}" height="${containerSize}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
  const svgNode = figma.createNodeFromSvg(svg);

  const component = figma.createComponent();
  component.name = name;
  component.resize(containerSize, containerSize);
  component.fills = [];
  component.clipsContent = true;

  while (svgNode.children.length > 0) {
    component.appendChild(svgNode.children[0]);
  }
  svgNode.remove();

  component.resize(containerSize, containerSize);

  return component;
}

function createCheckboxFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  status: "on" | "off" | "intermediate"
): ComponentNode {
  const boxSize = spec.size ?? 16;
  const radius = spec.radius ?? spec.borderRadius ?? 4;
  const bgColor = spec.bgColor ?? COLORS.white;
  const borderColor = spec.borderColor ?? COLORS.neutral200;

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
  box.cornerRadius = radius;

  if (status === "on" || status === "intermediate") {
    box.layoutMode = "HORIZONTAL";
    box.primaryAxisSizingMode = "FIXED";
    box.counterAxisSizingMode = "FIXED";
    box.primaryAxisAlignItems = "CENTER";
    box.counterAxisAlignItems = "CENTER";
    box.clipsContent = true;

    const iconSvg = status === "on" ? ICON_SVGS.check : ICON_SVGS.indeterminate;
    const iconSize = Math.round(boxSize * 0.75);
    const icon = createIcon(iconSvg, iconSize, rgbToHex(COLORS.white));
    box.appendChild(icon);
  }

  const labelText = createTextNode("Label", 14, 400, COLORS.neutral900);

  component.appendChild(box);
  component.appendChild(labelText);

  return component;
}

function createSwitchFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  isChecked: boolean
): ComponentNode {
  const trackWidth = spec.width ?? 36;
  const trackHeight = spec.height ?? 20;
  const thumbSize = spec.thumbSize ?? 16;
  const thumbOffset = spec.thumbOffset ?? 2;

  const trackColor =
    isChecked && spec.checkedBgColor ? spec.checkedBgColor : COLORS.neutral100;

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

function createRadioFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  isSelected: boolean
): ComponentNode {
  const outerSize = spec.size ?? 16;
  const dotSize = spec.dotSize ?? 7;

  const component = figma.createComponent();
  component.name = name;
  component.resize(outerSize, outerSize);

  if (isSelected) {
    setFill(component, COLORS.primary950);
  } else {
    setFill(component, COLORS.white);
    component.strokes = [createBoundPaint(COLORS.neutral950)];
    component.strokeWeight = 2;
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

function groupVariantsByFirstDimension<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  recipe: RecipeDefinition<V, S>,
  combinations: Record<string, string>[]
): Map<string, Array<{ name: string; spec: FigmaNodeSpec }>> {
  const dimensions = Object.keys(recipe.variants);
  const firstDim = dimensions[0];
  const groups = new Map<
    string,
    Array<{ name: string; spec: FigmaNodeSpec }>
  >();

  for (const combo of combinations) {
    const groupKey = combo[firstDim] ?? "default";
    const spec = resolveForFigma(recipe, combo as Record<string, string>);
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push({ name: nameParts, spec });
  }

  return groups;
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
  const combinations = getAllVariantCombinations(recipe);
  const groups = groupVariantsByFirstDimension(recipe, combinations);

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

function generateSelectSection<
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
    const component = createSelectComponentFromSpec(nameParts, spec, textLabel);
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

    const linkColor = spec.color ?? COLORS.info500;
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
  const combinations = getAllVariantCombinations(recipe);
  const groups = groupVariantsByFirstDimension(recipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = figma.createComponent();
      component.name = name;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.counterAxisAlignItems = "CENTER";
      component.itemSpacing = 2;
      component.fills = [];

      const textColor = spec.color ?? COLORS.neutral900;

      const indicatorFrame = figma.createFrame();
      indicatorFrame.name = "indicator";
      indicatorFrame.resize(20, 16);
      indicatorFrame.layoutMode = "HORIZONTAL";
      indicatorFrame.primaryAxisSizingMode = "FIXED";
      indicatorFrame.counterAxisSizingMode = "FIXED";
      indicatorFrame.primaryAxisAlignItems = "CENTER";
      indicatorFrame.counterAxisAlignItems = "CENTER";
      indicatorFrame.fills = [];

      const indicator = figma.createEllipse();
      indicator.name = "dot";
      indicator.resize(12, 12);
      setFill(indicator, textColor);
      indicatorFrame.appendChild(indicator);
      component.appendChild(indicatorFrame);

      const text = createTextNode(groupKey, 14, 400, textColor);
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
  const combinations = getAllVariantCombinations(recipe);
  const groups = groupVariantsByFirstDimension(recipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      let status: "on" | "off" | "intermediate" = "off";
      if (name.includes("status=on")) {
        status = "on";
      } else if (name.includes("status=intermediate")) {
        status = "intermediate";
      }
      const component = createCheckboxFromSpec(name, spec, status);
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
  const combinations = getAllVariantCombinations(recipe);
  const groups = groupVariantsByFirstDimension(recipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = createSwitchFromSpec(
        `${name}, checked=true`,
        spec,
        true
      );
      row.appendChild(component);
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
  const combinations = getAllVariantCombinations(recipe);
  const groups = groupVariantsByFirstDimension(recipe, combinations);

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

function generateDialogSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("Dialog");
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

    const component = figma.createComponent();
    component.name = nameParts;
    const w = spec.width ?? 520;
    const h = spec.height ?? 260;
    component.resize(w, h);
    component.layoutMode = "VERTICAL";
    component.primaryAxisSizingMode = "FIXED";
    component.counterAxisSizingMode = "FIXED";
    component.primaryAxisAlignItems = "MIN";
    component.counterAxisAlignItems = "MIN";

    const radius = spec.cornerRadius ?? spec.borderRadius;
    if (radius) {
      component.cornerRadius = radius;
    }

    if (spec.paddingTop) {
      component.paddingTop = spec.paddingTop;
    }
    if (spec.paddingBottom) {
      component.paddingBottom = spec.paddingBottom;
    }
    if (spec.paddingLeft) {
      component.paddingLeft = spec.paddingLeft;
    }
    if (spec.paddingRight) {
      component.paddingRight = spec.paddingRight;
    }

    const bgColor = spec.bgColor ?? COLORS.white;
    setFill(component, bgColor);

    if (spec.strokeColor && spec.strokeWeight) {
      component.strokes = [createBoundPaint(spec.strokeColor)];
      component.strokeWeight = spec.strokeWeight;
    }

    component.effects = SHADOW_MD;

    component.itemSpacing = 12;

    const title = createTextNode("Dialog Title", 20, 700, COLORS.neutral950);
    const desc = createTextNode(
      "Dialog description goes here.",
      14,
      400,
      COLORS.neutral600
    );
    component.appendChild(title);
    component.appendChild(desc);

    row.appendChild(component);
  }

  section.appendChild(row);
  container.appendChild(section);
}

function generateTypographySection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("Typography");
  const combinations = getAllVariantCombinations(recipe);
  const groups = groupVariantsByFirstDimension(recipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = figma.createComponent();
      component.name = name;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.fills = [];

      const fontSize = spec.fontSize ?? 16;
      const fontWeight = spec.fontWeight ?? 400;
      const textColor = spec.fontColor ?? COLORS.neutral950;
      const sampleText = `${groupKey} ${name.split("size=")[1] ?? ""} (${fontSize}px)`;
      const text = createTextNode(sampleText, fontSize, fontWeight, textColor);
      component.appendChild(text);

      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}

function createPaginationItem(
  name: string,
  size: number,
  radius: number,
  label: string,
  textColor: RGB,
  bgColor: RGB | null,
  fontSize: number,
  fontWeight: number
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.resize(size, size);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.cornerRadius = radius;

  if (bgColor) {
    setFill(component, bgColor);
  } else {
    component.fills = [];
  }

  const text = createTextNode(label, fontSize, fontWeight, textColor);
  component.appendChild(text);

  return component;
}

function createPaginationArrow(
  name: string,
  size: number,
  radius: number,
  iconSvg: string,
  isDisabled: boolean
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.resize(size, size);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.cornerRadius = radius;
  component.fills = [];

  const icon = createIcon(iconSvg, 16, rgbToHex(COLORS.neutral900));
  component.appendChild(icon);

  if (isDisabled) {
    component.opacity = 0.4;
  }

  return component;
}

function generatePaginationSection<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(container: FrameNode, recipe: RecipeDefinition<V, S>): void {
  const section = createComponentSection("Pagination");
  const combinations = getAllVariantCombinations(recipe);

  const itemSize = 32;
  const radius = 8;
  const fontSize = 14;

  // State variants row
  const stateRow = createVariantRow("state");
  for (const combo of combinations) {
    const spec = resolveForFigma(
      recipe,
      combo as { [K in keyof V]?: keyof V[K] }
    );
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");

    const stateValue = combo.state ?? "inactive";
    const textColor = spec.fontColor ?? COLORS.neutral900;
    const fontW = spec.fontWeight ?? 400;
    const bgColor = spec.bgColor ?? null;

    let label = "2";
    if (stateValue === "active") {
      label = "1";
    } else if (stateValue === "disabled") {
      label = "...";
    }

    const item = createPaginationItem(
      nameParts,
      itemSize,
      radius,
      label,
      textColor,
      bgColor,
      fontSize,
      fontW
    );

    if (stateValue === "disabled") {
      item.opacity = 0.4;
    }

    stateRow.appendChild(item);
  }
  section.appendChild(stateRow);

  // Arrow variants row
  const arrowRow = createVariantRow("arrow");
  arrowRow.appendChild(
    createPaginationArrow(
      "arrow=prev",
      itemSize,
      radius,
      ICON_SVGS.chevronLeft,
      false
    )
  );
  arrowRow.appendChild(
    createPaginationArrow(
      "arrow=next",
      itemSize,
      radius,
      ICON_SVGS.chevronRight,
      false
    )
  );
  arrowRow.appendChild(
    createPaginationArrow(
      "arrow=prev-disabled",
      itemSize,
      radius,
      ICON_SVGS.chevronLeft,
      true
    )
  );
  section.appendChild(arrowRow);

  // Truncation row
  const truncRow = createVariantRow("truncation");
  const truncSize = 36;
  const truncComponent = figma.createComponent();
  truncComponent.name = "truncation";
  truncComponent.resize(truncSize, truncSize);
  truncComponent.layoutMode = "HORIZONTAL";
  truncComponent.primaryAxisSizingMode = "FIXED";
  truncComponent.counterAxisSizingMode = "FIXED";
  truncComponent.primaryAxisAlignItems = "CENTER";
  truncComponent.counterAxisAlignItems = "CENTER";
  truncComponent.fills = [];
  const truncText = createTextNode("\u2026", 16, 400, COLORS.neutral900);
  truncComponent.appendChild(truncText);
  truncRow.appendChild(truncComponent);
  section.appendChild(truncRow);

  // Composed example row
  const composedRow = createVariantRow("composed");
  const composedFrame = figma.createFrame();
  composedFrame.name = "pagination-composed";
  composedFrame.layoutMode = "HORIZONTAL";
  composedFrame.primaryAxisSizingMode = "AUTO";
  composedFrame.counterAxisSizingMode = "AUTO";
  composedFrame.primaryAxisAlignItems = "CENTER";
  composedFrame.counterAxisAlignItems = "CENTER";
  composedFrame.clipsContent = false;
  composedFrame.itemSpacing = 2;
  composedFrame.fills = [];

  // prev arrow (disabled)
  const prevArrow = createPaginationArrow(
    "prev",
    itemSize,
    radius,
    ICON_SVGS.chevronLeft,
    true
  );
  composedFrame.appendChild(prevArrow);

  // page 1 (active)
  composedFrame.appendChild(
    createPaginationItem(
      "page-1",
      itemSize,
      radius,
      "1",
      COLORS.white,
      COLORS.primary950,
      fontSize,
      600
    )
  );

  // pages 2, 3
  for (const n of [2, 3]) {
    composedFrame.appendChild(
      createPaginationItem(
        `page-${n}`,
        itemSize,
        radius,
        String(n),
        COLORS.neutral900,
        null,
        fontSize,
        400
      )
    );
  }

  // truncation
  const truncInComposed = figma.createFrame();
  truncInComposed.name = "trunc";
  truncInComposed.resize(truncSize, truncSize);
  truncInComposed.layoutMode = "HORIZONTAL";
  truncInComposed.primaryAxisSizingMode = "FIXED";
  truncInComposed.counterAxisSizingMode = "FIXED";
  truncInComposed.primaryAxisAlignItems = "CENTER";
  truncInComposed.counterAxisAlignItems = "CENTER";
  truncInComposed.fills = [];
  truncInComposed.appendChild(
    createTextNode("\u2026", 16, 400, COLORS.neutral900)
  );
  composedFrame.appendChild(truncInComposed);

  // page 10
  composedFrame.appendChild(
    createPaginationItem(
      "page-10",
      itemSize,
      radius,
      "10",
      COLORS.neutral900,
      null,
      fontSize,
      400
    )
  );

  // next arrow
  composedFrame.appendChild(
    createPaginationArrow(
      "next",
      itemSize,
      radius,
      ICON_SVGS.chevronRight,
      false
    )
  );

  composedRow.appendChild(composedFrame);
  section.appendChild(composedRow);

  container.appendChild(section);
}

export function generateFromRecipes(container: FrameNode): number {
  const sections = [
    () => generateGenericSection(container, buttonRecipe, "Button", "Button"),
    () => generateGenericSection(container, badgeRecipe, "Badge", "Badge"),
    () => generateInputSection(container, inputRecipe, "Input", "Placeholder"),
    () =>
      generateSelectSection(container, selectRecipe, "Select", "Select option"),
    () => generateLinkSection(container, linkRecipe),
    () =>
      generateStockQuantityStatusSection(container, stockQuantityStatusRecipe),
    () => generateCheckboxSection(container, checkboxRecipe),
    () => generateSwitchSection(container, switchRecipe),
    () => generateRadioSection(container, radioGroupRecipe),
    () => generateSpinnerSection(container, spinnerRecipe),
    () => generateDialogSection(container, dialogRecipe),
    () => generateTypographySection(container, typographyRecipe),
    () => generatePaginationSection(container, paginationRecipe),
  ];

  for (const generate of sections) {
    generate();
  }

  return sections.length;
}
