/**
 * Shared utilities for Figma component generators.
 * Provides helpers for creating Auto Layout frames, text nodes, and binding variables.
 */

/** cocso-ui color palette resolved values for direct use in generators. */
export const COLORS = {
  white: { r: 1, g: 1, b: 1 },
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  neutral50: { r: 0.957, g: 0.961, b: 0.965 },
  neutral100: { r: 0.902, g: 0.91, b: 0.918 },
  neutral200: { r: 0.804, g: 0.82, b: 0.835 },
  neutral400: { r: 0.541, g: 0.58, b: 0.62 },
  neutral600: { r: 0.345, g: 0.38, b: 0.416 },
  neutral800: { r: 0.2, g: 0.212, b: 0.239 },
  neutral900: { r: 0.118, g: 0.129, b: 0.141 },
  neutral950: { r: 0.075, g: 0.078, b: 0.086 },
  primary950: { r: 0.075, g: 0.078, b: 0.086 },
  danger50: { r: 0.992, g: 0.937, b: 0.925 },
  danger500: { r: 0.871, g: 0.204, b: 0.071 },
  danger600: { r: 0.741, g: 0.173, b: 0.059 },
  success50: { r: 0.918, g: 0.965, b: 0.925 },
  success500: { r: 0.133, g: 0.529, b: 0.22 },
  success600: { r: 0.149, g: 0.451, b: 0.216 },
  warning50: { r: 1, g: 0.953, b: 0.859 },
  warning300: { r: 1, g: 0.694, b: 0.078 },
  warning600: { r: 0.541, g: 0.361, b: 0 },
  info50: { r: 0.925, g: 0.949, b: 0.996 },
  info500: { r: 0.145, g: 0.431, b: 0.957 },
  info600: { r: 0.043, g: 0.314, b: 0.816 },
} as const;

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
  text.characters = content;
  text.fontSize = fontSize;
  text.fontName = { family: "Inter", style: getFontStyle(fontWeight) };
  text.fills = [{ type: "SOLID", color }];
  return text;
}

/** Map numeric font weight to Inter font style name. */
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

/** Create a section header for the component page. */
export function createSectionHeader(title: string): FrameNode {
  const frame = createAutoLayoutFrame(`Section: ${title}`, "VERTICAL");
  frame.itemSpacing = 16;
  frame.paddingTop = 32;
  frame.paddingBottom = 16;

  const text = createTextNode(title, 20, 600, COLORS.neutral950);
  frame.appendChild(text);

  return frame;
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
