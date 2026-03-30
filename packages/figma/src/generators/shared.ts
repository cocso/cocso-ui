import type { RecipeDefinition, SlotStyles } from "@cocso-ui/recipe";
import tokenData from "../generated/tokens.json";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";
import type { FigmaNodeSpec } from "./recipe-resolver";
import { type FigmaJSONData, lookupSpec } from "./recipe-utils";

const data = tokenData as FigmaTokenData;

let variableCache: Map<string, Variable> | null = null;

export async function loadColorVariables(): Promise<void> {
  try {
    const vars = await figma.variables.getLocalVariablesAsync("COLOR");
    variableCache = new Map<string, Variable>();
    for (const v of vars) {
      variableCache.set(v.name, v);
    }
  } catch {
    // Variables API not available or no variables synced yet — skip binding
    variableCache = null;
  }
}

export function createBoundPaint(
  color: RGB,
  opacity = 1,
  tokenRef?: string
): SolidPaint {
  const paint: SolidPaint = { type: "SOLID" as const, color, opacity };

  if (tokenRef && variableCache) {
    const fullName = tokenRef.startsWith("color/")
      ? tokenRef
      : `color/${tokenRef}`;
    const variable = variableCache.get(fullName);
    if (variable) {
      return figma.variables.setBoundVariableForPaint(paint, "color", variable);
    }
    console.warn(
      `[cocso-ui] Variable not found for tokenRef: ${tokenRef} (${fullName})`
    );
  }

  return paint;
}

const tokenMap = new Map(data.tokens.map((t) => [t.name, t]));

function colorToken(name: string): RGB {
  const token = tokenMap.get(name);
  if (token && typeof token.values.default === "object") {
    const c = token.values.default as FigmaColorValue;
    return { r: c.r, g: c.g, b: c.b };
  }
  console.warn(
    `[cocso-ui] Color token not found: ${name}, falling back to black`
  );
  return { r: 0, g: 0, b: 0 };
}

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
  success400: colorToken("color/success-400"),
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

export function createAutoLayoutFrame(
  name: string,
  direction: "HORIZONTAL" | "VERTICAL" = "HORIZONTAL"
): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.clipsContent = false;
  frame.fills = [];
  return frame;
}

export function createTextNode(
  content: string,
  fontSize: number,
  fontWeight: number,
  color: RGB,
  tokenRef?: string
): TextNode {
  const text = figma.createText();
  text.fontName = { family: "Pretendard", style: getFontStyle(fontWeight) };
  text.characters = content;
  text.fontSize = fontSize;
  text.fills = [createBoundPaint(color, 1, tokenRef)];
  return text;
}

export function getFontStyle(weight: number): string {
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
    return "SemiBold";
  }
  if (weight <= 700) {
    return "Bold";
  }
  return "ExtraBold";
}

export { ICON_SVGS } from "@cocso-ui/icons/figma";

const SVG_TAG_RE = /^<svg /;

export function createIcon(
  svgTemplate: string,
  size: number,
  hexColor: string
): FrameNode {
  // Inject width/height so Figma scales strokes proportionally via viewBox
  // transform instead of just resizing the frame container.
  const sized = svgTemplate.replace(
    SVG_TAG_RE,
    `<svg width="${size}" height="${size}" `
  );
  const svg = sized.replace(/\{color\}/g, hexColor);
  const node = figma.createNodeFromSvg(svg);
  node.resize(size, size);
  node.name = "icon";
  return node;
}

export function rgbToHex(color: RGB): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const SHADOW_ALPHA_1: RGBA = { r: 0, g: 0, b: 0, a: 0.04 };
const SHADOW_ALPHA_2: RGBA = { r: 0, g: 0, b: 0, a: 0.08 };
const SHADOW_ALPHA_3: RGBA = { r: 0, g: 0, b: 0, a: 0.12 };

export const SHADOW_XS: Effect[] = [
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_1,
    offset: { x: 0, y: 1 },
    radius: 2,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_1,
    offset: { x: 0, y: 0 },
    radius: 2,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
];

export const SHADOW_SM: Effect[] = [
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_1,
    offset: { x: 0, y: 0 },
    radius: 2,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_2,
    offset: { x: 0, y: 4 },
    radius: 8,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
];

export const SHADOW_MD: Effect[] = [
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_2,
    offset: { x: 0, y: 0 },
    radius: 2,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_3,
    offset: { x: 0, y: 8 },
    radius: 16,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
];

export const SHADOW_LG: Effect[] = [
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_2,
    offset: { x: 0, y: 0 },
    radius: 2,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
  {
    type: "DROP_SHADOW",
    color: SHADOW_ALPHA_3,
    offset: { x: 0, y: 16 },
    radius: 24,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
];

/**
 * Create a border-like shadow effect (box-shadow: 0 0 0 1px color).
 * Used by Input/Select which use box-shadow instead of CSS border.
 */
export function createBorderShadow(color: RGB): Effect {
  return {
    type: "DROP_SHADOW",
    color: { r: color.r, g: color.g, b: color.b, a: 1 },
    offset: { x: 0, y: 0 },
    radius: 0,
    spread: 1,
    visible: true,
    blendMode: "NORMAL",
  };
}

export function applyInputEffects(
  node: SceneNode & BlendMixin,
  borderColor: RGB
): void {
  node.effects = [createBorderShadow(borderColor), ...SHADOW_XS];
}

export function setFill(
  node: MinimalFillsMixin,
  color: RGB,
  opacity = 1,
  tokenRef?: string
): void {
  node.fills = [createBoundPaint(color, opacity, tokenRef)];
}

export function setStroke(
  node: MinimalStrokesMixin & GeometryMixin,
  color: RGB,
  weight = 1,
  tokenRef?: string
): void {
  node.strokes = [createBoundPaint(color, 1, tokenRef)];
  node.strokeWeight = weight;
}

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
  section.fills = [createBoundPaint(COLORS.white)];
  section.strokes = [createBoundPaint(COLORS.neutral100)];
  section.strokeWeight = 1;

  section.clipsContent = false;

  const header = createTextNode(title, 18, 600, COLORS.neutral950);
  section.appendChild(header);

  return section;
}

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
  container.fills = [createBoundPaint(COLORS.neutral50)];
  page.appendChild(container);

  const title = createTextNode("@cocso-ui/figma", 28, 700, COLORS.neutral950);
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

/**
 * Creates state variant copies of base ComponentNodes and combines them into a
 * ComponentSetNode via figma.combineAsVariants. Base nodes get State=Default
 * appended to their name; additional state nodes are created from resolveForFigma.
 *
 * If the recipe has no states, returns the parent frame unchanged (no-op).
 */
export function addStateVariants<
  V extends Record<string, Record<string, Partial<Record<S, SlotStyles>>>>,
  S extends string,
>(
  baseNodes: ComponentNode[],
  recipe: RecipeDefinition<V, S>,
  variantCombinations: Record<string, string>[],
  parent: FrameNode,
  createNode: (name: string, spec: FigmaNodeSpec) => ComponentNode,
  json?: FigmaJSONData
): ComponentSetNode | FrameNode {
  const states = recipe.states as Record<string, unknown> | undefined;
  if (!states || Object.keys(states).length === 0) {
    return parent;
  }

  const stateNames = Object.keys(states);
  const allNodes: ComponentNode[] = [];

  for (const node of baseNodes) {
    node.name = `${node.name}, State=Default`;
    allNodes.push(node);
  }

  for (const [, combo] of variantCombinations.entries()) {
    for (const stateName of stateNames) {
      const spec = lookupSpec(json, recipe, combo, { state: stateName });
      const comboStr = Object.entries(combo)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      const stateLabel = stateName.charAt(0).toUpperCase() + stateName.slice(1);
      const name = `${comboStr}, State=${stateLabel}`;
      const node = createNode(name, spec);
      parent.appendChild(node);
      allNodes.push(node);
    }
  }

  return figma.combineAsVariants(allNodes, parent);
}

// ─── Component Content Defaults ────────────────────────────
// Shared fallback values for component label text used by checkbox, radio,
// switch, link, stock-quantity-status, and dialog generators.

export const LABEL_FONT_SIZE = 14;
export const LABEL_FONT_WEIGHT = 400;
export const DISABLED_OPACITY = 0.4;

// ─── Matrix Grid Layout ─────────────────────────────────

export interface VariantDimension {
  name: string;
  values: string[];
}

const MATRIX_CELL_PADDING = 12;
const MATRIX_LABEL_WIDTH = 80;
const MATRIX_HEADER_HEIGHT = 28;

/**
 * Create a 2D grid of component variants. Rows and columns correspond to
 * two variant dimensions (e.g., rows=size, columns=variant).
 *
 * Header row shows column labels; each body row has a row label + component cells.
 * Cells are uniformly sized (max component dimensions + padding).
 */
export function createVariantMatrix(
  title: string,
  rowDimension: VariantDimension,
  columnDimension: VariantDimension,
  getComponent: (rowValue: string, colValue: string) => ComponentNode
): FrameNode {
  // Phase 1: create all components and measure max cell size
  const cells: ComponentNode[][] = [];
  let maxW = 0;
  let maxH = 0;

  for (const rowVal of rowDimension.values) {
    const row: ComponentNode[] = [];
    for (const colVal of columnDimension.values) {
      const comp = getComponent(rowVal, colVal);
      maxW = Math.max(maxW, comp.width);
      maxH = Math.max(maxH, comp.height);
      row.push(comp);
    }
    cells.push(row);
  }

  const cellW = maxW + MATRIX_CELL_PADDING * 2;
  const cellH = maxH + MATRIX_CELL_PADDING * 2;

  // Phase 2: build outer container
  const grid = createAutoLayoutFrame(title, "VERTICAL");
  grid.itemSpacing = 0;

  // Phase 3: header row
  const headerRow = createAutoLayoutFrame("Header", "HORIZONTAL");
  headerRow.itemSpacing = 0;
  headerRow.counterAxisAlignItems = "CENTER";

  const corner = figma.createFrame();
  corner.name = "corner";
  corner.resize(MATRIX_LABEL_WIDTH, MATRIX_HEADER_HEIGHT);
  corner.fills = [];
  headerRow.appendChild(corner);

  for (const colVal of columnDimension.values) {
    const headerCell = figma.createFrame();
    headerCell.name = `header-${colVal}`;
    headerCell.resize(cellW, MATRIX_HEADER_HEIGHT);
    headerCell.layoutMode = "HORIZONTAL";
    headerCell.primaryAxisSizingMode = "FIXED";
    headerCell.counterAxisSizingMode = "FIXED";
    headerCell.primaryAxisAlignItems = "CENTER";
    headerCell.counterAxisAlignItems = "CENTER";
    headerCell.fills = [];
    headerCell.clipsContent = false;

    const label = createTextNode(colVal, 11, 600, COLORS.neutral500);
    headerCell.appendChild(label);
    headerRow.appendChild(headerCell);
  }
  grid.appendChild(headerRow);

  // Phase 4: separator
  const totalW = MATRIX_LABEL_WIDTH + cellW * columnDimension.values.length;
  const sep = figma.createFrame();
  sep.name = "header-sep";
  sep.resize(totalW, 1);
  setFill(sep, COLORS.neutral100);
  grid.appendChild(sep);

  // Phase 5: body rows
  for (let r = 0; r < rowDimension.values.length; r++) {
    const rowVal = rowDimension.values[r];
    const bodyRow = createAutoLayoutFrame(`Row: ${rowVal}`, "HORIZONTAL");
    bodyRow.itemSpacing = 0;
    bodyRow.counterAxisAlignItems = "CENTER";

    // row label
    const labelCell = figma.createFrame();
    labelCell.name = `label-${rowVal}`;
    labelCell.resize(MATRIX_LABEL_WIDTH, cellH);
    labelCell.layoutMode = "HORIZONTAL";
    labelCell.primaryAxisSizingMode = "FIXED";
    labelCell.counterAxisSizingMode = "FIXED";
    labelCell.primaryAxisAlignItems = "MIN";
    labelCell.counterAxisAlignItems = "CENTER";
    labelCell.paddingLeft = 4;
    labelCell.fills = [];
    labelCell.clipsContent = false;

    const rowLabel = createTextNode(rowVal, 11, 500, COLORS.neutral500);
    labelCell.appendChild(rowLabel);
    bodyRow.appendChild(labelCell);

    // component cells
    for (let c = 0; c < columnDimension.values.length; c++) {
      const cell = figma.createFrame();
      cell.name = `cell-${rowVal}-${columnDimension.values[c]}`;
      cell.resize(cellW, cellH);
      cell.layoutMode = "HORIZONTAL";
      cell.primaryAxisSizingMode = "FIXED";
      cell.counterAxisSizingMode = "FIXED";
      cell.primaryAxisAlignItems = "CENTER";
      cell.counterAxisAlignItems = "CENTER";
      cell.fills = [];
      cell.clipsContent = false;

      cell.appendChild(cells[r][c]);
      bodyRow.appendChild(cell);
    }

    grid.appendChild(bodyRow);
  }

  return grid;
}

/**
 * Create multiple variant matrices, one per value of a third "slice" dimension.
 * E.g., button has variant × size × shape — creates one grid per shape value.
 */
export function createVariantMatrixPerSlice(
  title: string,
  rowDimension: VariantDimension,
  columnDimension: VariantDimension,
  sliceDimension: VariantDimension,
  getComponent: (
    rowValue: string,
    colValue: string,
    sliceValue: string
  ) => ComponentNode
): FrameNode {
  const container = createAutoLayoutFrame(title, "VERTICAL");
  container.itemSpacing = 24;

  for (const sliceVal of sliceDimension.values) {
    const sliceLabel = createTextNode(
      `${sliceDimension.name}=${sliceVal}`,
      12,
      600,
      COLORS.neutral600
    );
    container.appendChild(sliceLabel);

    const matrix = createVariantMatrix(
      `${title} (${sliceDimension.name}=${sliceVal})`,
      rowDimension,
      columnDimension,
      (rowVal, colVal) => getComponent(rowVal, colVal, sliceVal)
    );
    container.appendChild(matrix);
  }

  return container;
}
