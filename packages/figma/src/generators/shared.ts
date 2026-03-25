/**
 * Shared utilities for Figma component generators.
 * Color values are derived from the pre-built tokens.json to stay
 * in sync with the baseframe YAML source of truth.
 */

import tokenData from "../generated/tokens.json";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";

const data = tokenData as FigmaTokenData;

/**
 * Look up a color token by its Figma variable name (e.g. "color/white").
 * Falls back to opaque black if the token is not found.
 */
function colorToken(name: string): RGB {
  const token = data.tokens.find((t) => t.name === name);
  if (token && typeof token.values.default === "object") {
    const c = token.values.default as FigmaColorValue;
    return { r: c.r, g: c.g, b: c.b };
  }
  console.warn(
    `[cocso-ui] Color token not found: ${name}, falling back to black`
  );
  return { r: 0, g: 0, b: 0 };
}

/** cocso-ui color palette resolved from tokens.json at bundle time. */
export const COLORS = {
  white: colorToken("color/white"),
  neutral50: colorToken("color/neutral-50"),
  neutral100: colorToken("color/neutral-100"),
  neutral200: colorToken("color/neutral-200"),
  neutral400: colorToken("color/neutral-400"),
  neutral500: colorToken("color/neutral-500"),
  neutral600: colorToken("color/neutral-600"),
  neutral800: colorToken("color/neutral-800"),
  neutral900: colorToken("color/neutral-900"),
  neutral950: colorToken("color/neutral-950"),
  primary950: colorToken("color/primary-950"),
  danger50: colorToken("color/danger-50"),
  danger500: colorToken("color/danger-500"),
  danger600: colorToken("color/danger-600"),
  success50: colorToken("color/success-50"),
  success500: colorToken("color/success-500"),
  success600: colorToken("color/success-600"),
  warning50: colorToken("color/warning-50"),
  warning300: colorToken("color/warning-300"),
  warning400: colorToken("color/warning-400"),
  warning500: colorToken("color/warning-500"),
  warning600: colorToken("color/warning-600"),
  info50: colorToken("color/info-50"),
  info500: colorToken("color/info-500"),
  info600: colorToken("color/info-600"),
};

/** Create an Auto Layout frame with common defaults. */
export function createAutoLayoutFrame(
  name: string,
  direction: "HORIZONTAL" | "VERTICAL" = "HORIZONTAL"
): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [];
  return frame;
}

/** Create a text node with specified properties. */
export function createTextNode(
  content: string,
  fontSize: number,
  fontWeight: number,
  color: RGB
): TextNode {
  const text = figma.createText();
  text.fontName = { family: "Inter", style: getFontStyle(fontWeight) };
  text.characters = content;
  text.fontSize = fontSize;
  text.fills = [{ type: "SOLID", color }];
  return text;
}

function getFontStyle(weight: number): string {
  if (weight <= 300) {
    return "Light";
  }
  if (weight <= 400) {
    return "Regular";
  }
  if (weight <= 500) {
    return "Medium";
  }
  if (weight <= 600) {
    return "Semi Bold";
  }
  if (weight <= 700) {
    return "Bold";
  }
  return "Extra Bold";
}

/** Set solid fill color on a node. */
export function setFill(
  node: MinimalFillsMixin,
  color: RGB,
  opacity = 1
): void {
  node.fills = [{ type: "SOLID", color, opacity }];
}

/** Set stroke on a node. */
export function setStroke(
  node: MinimalStrokesMixin & GeometryMixin,
  color: RGB,
  weight = 1
): void {
  node.strokes = [{ type: "SOLID", color }];
  node.strokeWeight = weight;
}

/**
 * Create a component section card with white background.
 * All variant rows should be appended to the returned frame.
 */
export function createComponentSection(title: string): FrameNode {
  const section = figma.createFrame();
  section.name = title;
  section.layoutMode = "VERTICAL";
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "AUTO";
  section.paddingTop = 24;
  section.paddingBottom = 24;
  section.paddingLeft = 32;
  section.paddingRight = 32;
  section.itemSpacing = 16;
  section.cornerRadius = 12;
  section.fills = [{ type: "SOLID", color: COLORS.white }];
  section.strokes = [{ type: "SOLID", color: COLORS.neutral100 }];
  section.strokeWeight = 1;

  const header = createTextNode(title, 18, 600, COLORS.neutral950);
  section.appendChild(header);

  return section;
}

/** Create a labeled row for variant display. */
export function createVariantRow(label: string): FrameNode {
  const row = createAutoLayoutFrame(`Row: ${label}`);
  row.itemSpacing = 12;
  row.counterAxisAlignItems = "CENTER";

  const labelNode = createTextNode(label, 12, 500, COLORS.neutral600);
  labelNode.resize(80, labelNode.height);
  labelNode.textAlignHorizontal = "LEFT";
  row.appendChild(labelNode);

  return row;
}

/** Set up the component page with a gray background and vertical auto-layout. */
export function setupPageLayout(page: PageNode): FrameNode {
  const container = figma.createFrame();
  container.name = "cocso-ui Components";
  container.layoutMode = "VERTICAL";
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";
  container.paddingTop = 48;
  container.paddingBottom = 48;
  container.paddingLeft = 48;
  container.paddingRight = 48;
  container.itemSpacing = 32;
  container.fills = [{ type: "SOLID", color: COLORS.neutral50 }];
  page.appendChild(container);

  const title = createTextNode(
    "cocso-ui Design System",
    28,
    700,
    COLORS.neutral950
  );
  container.appendChild(title);

  const subtitle = createTextNode(
    "Auto-generated component library from @cocso-ui/react",
    14,
    400,
    COLORS.neutral600
  );
  container.appendChild(subtitle);

  return container;
}
