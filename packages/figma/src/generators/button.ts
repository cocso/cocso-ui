/**
 * Figma component generator for Button.
 * Creates a ComponentSet with size x variant matrix.
 */

import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

type ButtonSize = "large" | "medium" | "small" | "x-small";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "error"
  | "warning"
  | "info";

interface ButtonSpec {
  borderRadius: number;
  fontSize: number;
  height: number;
  paddingX: number;
}

const SIZE_SPECS: Record<ButtonSize, ButtonSpec> = {
  large: { height: 40, paddingX: 14, fontSize: 14, borderRadius: 8 },
  medium: { height: 36, paddingX: 12, fontSize: 14, borderRadius: 8 },
  small: { height: 32, paddingX: 10, fontSize: 12, borderRadius: 6 },
  "x-small": { height: 28, paddingX: 8, fontSize: 12, borderRadius: 6 },
};

const VARIANT_COLORS: Record<
  ButtonVariant,
  { bg: RGB; text: RGB; border?: RGB }
> = {
  primary: { bg: COLORS.primary950, text: COLORS.white },
  secondary: { bg: COLORS.neutral50, text: COLORS.neutral600 },
  outline: {
    bg: { r: 0, g: 0, b: 0 },
    text: COLORS.neutral950,
    border: COLORS.neutral100,
  },
  ghost: { bg: COLORS.white, text: COLORS.neutral950 },
  success: { bg: COLORS.success500, text: COLORS.white },
  error: { bg: COLORS.danger500, text: COLORS.white },
  warning: { bg: COLORS.warning300, text: COLORS.neutral950 },
  info: { bg: COLORS.info500, text: COLORS.white },
};

const SIZES: ButtonSize[] = ["large", "medium", "small", "x-small"];
const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "success",
  "error",
  "warning",
  "info",
];

function createButtonInstance(
  size: ButtonSize,
  variant: ButtonVariant,
  label: string
): ComponentNode {
  const spec = SIZE_SPECS[size];
  const colors = VARIANT_COLORS[variant];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(component.width, spec.height);
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "CENTER";
  component.paddingLeft = spec.paddingX;
  component.paddingRight = spec.paddingX;
  component.cornerRadius = spec.borderRadius;

  if (variant === "outline") {
    component.fills = [];
    setStroke(component, colors.border ?? COLORS.neutral100);
  } else {
    setFill(component, colors.bg);
  }

  const text = createTextNode(label, spec.fontSize, 500, colors.text);
  component.appendChild(text);

  return component;
}

/** Generate the Button component set on the given page. */
export function generateButtonComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Button");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const variant of VARIANTS) {
    const row = createVariantRow(variant);
    row.y = currentY;
    page.appendChild(row);

    for (const size of SIZES) {
      const btn = createButtonInstance(size, variant, "Button");
      row.appendChild(btn);
    }

    currentY += 56;
  }

  return currentY + 24;
}
