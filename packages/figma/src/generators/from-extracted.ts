/**
 * from-extracted.ts
 *
 * Creates Figma components from the JSON specs extracted by the
 * extract-components script. This replaces hand-coded generators with
 * an approach that reproduces the exact computed styles from React.
 */
import {
  createBoundPaint,
  createComponentSection,
  createVariantRow,
} from "./shared";

// ---------------------------------------------------------------------------
// Types matching the extraction output
// ---------------------------------------------------------------------------

interface ColorValue {
  a: number;
  b: number;
  g: number;
  r: number;
}

interface FillSpec {
  color: ColorValue;
  type: "SOLID";
}

interface StrokeSpec {
  color: ColorValue;
  weight: number;
}

interface EffectSpec {
  color: ColorValue;
  offset: { x: number; y: number };
  radius: number;
  spread: number;
  type: "DROP_SHADOW" | "INNER_SHADOW";
}

interface PaddingSpec {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

interface CornerRadii {
  bottomLeft: number;
  bottomRight: number;
  topLeft: number;
  topRight: number;
}

interface NodeSpec {
  // Children
  children?: NodeSpec[];
  cornerRadii?: CornerRadii;
  cornerRadius?: number;
  counterAxisAlignItems?: string;
  effects?: EffectSpec[];
  fills?: FillSpec[];
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  height: number;
  itemSpacing?: number;
  layoutMode?: "HORIZONTAL" | "VERTICAL";
  lineHeight?: number;
  opacity?: number;
  padding?: PaddingSpec;
  primaryAxisAlignItems?: string;
  strokes?: StrokeSpec;
  tag?: string;
  // Text-specific
  text?: string;
  textColor?: ColorValue;
  textDecoration?: "UNDERLINE";
  type: "FRAME" | "TEXT";
  width: number;
  x?: number;
  y?: number;
}

interface VariantEntry {
  spec: NodeSpec;
  variantKey: string;
}

export type ComponentSpecs = Record<string, VariantEntry[]>;

// ---------------------------------------------------------------------------
// Figma node construction from spec
// ---------------------------------------------------------------------------

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
    return "SemiBold";
  }
  if (weight <= 700) {
    return "Bold";
  }
  return "ExtraBold";
}

function applyFills(node: MinimalFillsMixin, fills?: FillSpec[]): void {
  if (!fills || fills.length === 0) {
    node.fills = [];
    return;
  }
  node.fills = fills.map((f) =>
    createBoundPaint({ r: f.color.r, g: f.color.g, b: f.color.b }, f.color.a)
  );
}

function applyStrokes(
  node: MinimalStrokesMixin & GeometryMixin,
  strokes?: StrokeSpec
): void {
  if (!strokes) {
    return;
  }
  node.strokes = [
    createBoundPaint(
      { r: strokes.color.r, g: strokes.color.g, b: strokes.color.b },
      strokes.color.a
    ),
  ];
  node.strokeWeight = strokes.weight;
}

function applyEffects(node: BlendMixin, effects?: EffectSpec[]): void {
  if (!effects || effects.length === 0) {
    return;
  }
  node.effects = effects.map((e) => ({
    type: e.type as "DROP_SHADOW" | "INNER_SHADOW",
    color: { r: e.color.r, g: e.color.g, b: e.color.b, a: e.color.a },
    offset: e.offset,
    radius: e.radius,
    spread: e.spread,
    visible: true,
    blendMode: "NORMAL" as const,
  }));
}

function applyCornerRadius(
  node: CornerMixin & RectangleCornerMixin,
  spec: NodeSpec
): void {
  if (spec.cornerRadius !== undefined) {
    node.cornerRadius = spec.cornerRadius;
  } else if (spec.cornerRadii) {
    node.topLeftRadius = spec.cornerRadii.topLeft;
    node.topRightRadius = spec.cornerRadii.topRight;
    node.bottomRightRadius = spec.cornerRadii.bottomRight;
    node.bottomLeftRadius = spec.cornerRadii.bottomLeft;
  }
}

function createFigmaNode(spec: NodeSpec): SceneNode {
  if (spec.type === "TEXT") {
    return createTextFromSpec(spec);
  }
  return createFrameFromSpec(spec);
}

/** Always use Inter in Figma — browser may resolve to system fonts like Arial. */
const FIGMA_FONT_FAMILY = "Pretendard";

function createTextFromSpec(spec: NodeSpec): TextNode {
  const text = figma.createText();
  const weight = spec.fontWeight ?? 400;
  text.fontName = {
    family: FIGMA_FONT_FAMILY,
    style: getFontStyle(weight),
  };
  text.characters = spec.text ?? "";
  text.fontSize = spec.fontSize ?? 14;
  if (spec.textColor) {
    text.fills = [
      createBoundPaint(
        {
          r: spec.textColor.r,
          g: spec.textColor.g,
          b: spec.textColor.b,
        },
        spec.textColor.a
      ),
    ];
  }
  if (spec.lineHeight && spec.lineHeight > 0) {
    text.lineHeight = { value: spec.lineHeight, unit: "PIXELS" };
  }
  if (spec.textDecoration === "UNDERLINE") {
    text.textDecoration = "UNDERLINE";
  }
  if (spec.opacity !== undefined) {
    text.opacity = spec.opacity;
  }
  return text;
}

function createFrameFromSpec(spec: NodeSpec): FrameNode {
  const frame = figma.createFrame();
  frame.resize(
    Math.max(1, Math.round(spec.width)),
    Math.max(1, Math.round(spec.height))
  );

  applyFills(frame, spec.fills);
  applyStrokes(frame, spec.strokes);
  applyEffects(frame, spec.effects);
  applyCornerRadius(frame, spec);

  if (spec.opacity !== undefined) {
    frame.opacity = spec.opacity;
  }

  // Layout
  if (spec.layoutMode) {
    frame.layoutMode = spec.layoutMode;
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    if (spec.itemSpacing) {
      frame.itemSpacing = spec.itemSpacing;
    }
    if (spec.primaryAxisAlignItems) {
      frame.primaryAxisAlignItems = spec.primaryAxisAlignItems as
        | "MIN"
        | "CENTER"
        | "MAX"
        | "SPACE_BETWEEN";
    }
    if (spec.counterAxisAlignItems) {
      frame.counterAxisAlignItems = spec.counterAxisAlignItems as
        | "MIN"
        | "CENTER"
        | "MAX";
    }
  }

  // Padding
  if (spec.padding) {
    frame.paddingTop = spec.padding.top;
    frame.paddingRight = spec.padding.right;
    frame.paddingBottom = spec.padding.bottom;
    frame.paddingLeft = spec.padding.left;
  }

  // Children
  if (spec.children) {
    for (const childSpec of spec.children) {
      const childNode = createFigmaNode(childSpec);
      if (childSpec.x !== undefined) {
        childNode.x = childSpec.x;
      }
      if (childSpec.y !== undefined) {
        childNode.y = childSpec.y;
      }
      frame.appendChild(childNode);
    }
  }

  return frame;
}

// ---------------------------------------------------------------------------
// Public API: generate all components from extracted specs
// ---------------------------------------------------------------------------

/** Create a Figma ComponentNode from an extracted spec. */
function createComponentFromSpec(
  variantKey: string,
  spec: NodeSpec
): ComponentNode {
  const component = figma.createComponent();
  component.name = variantKey;
  component.resize(
    Math.max(1, Math.round(spec.width)),
    Math.max(1, Math.round(spec.height))
  );

  const inner = createFigmaNode(spec);

  if (inner.type !== "FRAME") {
    component.appendChild(inner);
    return component;
  }

  // Move children from inner frame to component
  while (inner.children.length > 0) {
    component.appendChild(inner.children[0]);
  }
  // Copy visual properties
  component.fills = inner.fills;
  component.strokes = inner.strokes;
  component.strokeWeight = inner.strokeWeight;
  component.effects = inner.effects;
  component.cornerRadius = inner.cornerRadius;
  component.topLeftRadius = inner.topLeftRadius;
  component.topRightRadius = inner.topRightRadius;
  component.bottomRightRadius = inner.bottomRightRadius;
  component.bottomLeftRadius = inner.bottomLeftRadius;
  component.opacity = inner.opacity;
  component.layoutMode = inner.layoutMode;
  if (inner.layoutMode !== "NONE") {
    component.primaryAxisSizingMode = inner.primaryAxisSizingMode;
    component.counterAxisSizingMode = inner.counterAxisSizingMode;
    component.itemSpacing = inner.itemSpacing;
    component.primaryAxisAlignItems = inner.primaryAxisAlignItems;
    component.counterAxisAlignItems = inner.counterAxisAlignItems;
  }
  component.paddingTop = inner.paddingTop;
  component.paddingRight = inner.paddingRight;
  component.paddingBottom = inner.paddingBottom;
  component.paddingLeft = inner.paddingLeft;
  inner.remove();

  return component;
}

export function generateFromExtractedSpecs(
  container: FrameNode,
  specs: ComponentSpecs
): void {
  for (const [componentName, variants] of Object.entries(specs)) {
    const section = createComponentSection(componentName);
    const groups = groupVariants(variants);

    for (const [groupLabel, items] of Object.entries(groups)) {
      const row = createVariantRow(groupLabel);

      for (const { variantKey, spec } of items) {
        if (!spec) {
          continue;
        }
        row.appendChild(createComponentFromSpec(variantKey, spec));
      }

      section.appendChild(row);
    }

    container.appendChild(section);
  }
}

/**
 * Group variants by their primary key for row display.
 * e.g., "variant=primary,size=large" groups by "primary"
 */
function groupVariants(
  variants: VariantEntry[]
): Record<string, VariantEntry[]> {
  const groups: Record<string, VariantEntry[]> = {};

  for (const v of variants) {
    // Parse the first key=value pair as the group label
    const firstPair = v.variantKey.split(",")[0] ?? "default";
    const label = firstPair.includes("=") ? firstPair.split("=")[1] : firstPair;

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(v);
  }

  return groups;
}
