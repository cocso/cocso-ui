import tokenData from "../generated/tokens.json";
import type { FigmaColorValue, FigmaTokenData } from "../types/token-schema";

const data = tokenData as FigmaTokenData;

const rgbToTokenName = new Map<string, string>();

function rgbKey(c: RGB): string {
  return `${c.r},${c.g},${c.b}`;
}

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

export function createBoundPaint(color: RGB, opacity = 1): SolidPaint {
  const tokenName = rgbToTokenName.get(rgbKey(color));
  const paint: SolidPaint = { type: "SOLID" as const, color, opacity };
  if (tokenName && variableCache) {
    const variable = variableCache.get(tokenName);
    if (variable) {
      return figma.variables.setBoundVariableForPaint(paint, "color", variable);
    }
  }
  return paint;
}

const tokenMap = new Map(data.tokens.map((t) => [t.name, t]));

function colorToken(name: string): RGB {
  const token = tokenMap.get(name);
  if (token && typeof token.values.default === "object") {
    const c = token.values.default as FigmaColorValue;
    const rgb = { r: c.r, g: c.g, b: c.b };
    rgbToTokenName.set(rgbKey(rgb), name);
    return rgb;
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
  frame.fills = [];
  return frame;
}

export function createTextNode(
  content: string,
  fontSize: number,
  fontWeight: number,
  color: RGB
): TextNode {
  const text = figma.createText();
  text.fontName = { family: "Pretendard", style: getFontStyle(fontWeight) };
  text.characters = content;
  text.fontSize = fontSize;
  text.fills = [createBoundPaint(color)];
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

export const ICON_SVGS = {
  check:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12l5 5l10-10" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  indeterminate:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12l10 0" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6l-12 12" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6l12 12" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  selector:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 9l4-4l4 4" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 15l-4 4l-4-4" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronDown:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6l6-6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronUp:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6l6 6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronLeft:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6l6 6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronRight:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6l-6 6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowLeft:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12l14 0" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12l6 6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12l6-6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight:
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12l14 0" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 18l6-6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 6l6 6" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

export function createIcon(
  svgTemplate: string,
  size: number,
  hexColor: string
): FrameNode {
  const svg = svgTemplate.replace(/\{color\}/g, hexColor);
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
  opacity = 1
): void {
  node.fills = [createBoundPaint(color, opacity)];
}

export function setStroke(
  node: MinimalStrokesMixin & GeometryMixin,
  color: RGB,
  weight = 1
): void {
  node.strokes = [createBoundPaint(color)];
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
