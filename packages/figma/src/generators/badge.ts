/**
 * Figma component generator for Badge.
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

type BadgeSize = "large" | "medium" | "small";
type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "outline";

interface BadgeSpec {
  borderRadius: number;
  fontSize: number;
  paddingX: number;
  paddingY: number;
}

const SIZE_SPECS: Record<BadgeSize, BadgeSpec> = {
  large: { paddingX: 10, paddingY: 5, fontSize: 14, borderRadius: 8 },
  medium: { paddingX: 8, paddingY: 4, fontSize: 12, borderRadius: 8 },
  small: { paddingX: 6, paddingY: 3, fontSize: 11, borderRadius: 6 },
};

const VARIANT_COLORS: Record<
  BadgeVariant,
  { bg: RGB; text: RGB; bgOpacity?: number; border?: RGB }
> = {
  primary: { bg: COLORS.primary950, text: COLORS.white },
  secondary: { bg: COLORS.neutral50, text: COLORS.neutral600 },
  success: { bg: COLORS.success50, text: COLORS.success600 },
  error: { bg: COLORS.danger50, text: COLORS.danger600 },
  warning: { bg: COLORS.warning50, text: COLORS.warning600 },
  info: { bg: COLORS.info50, text: COLORS.info600 },
  outline: {
    bg: { r: 0, g: 0, b: 0 },
    text: COLORS.neutral950,
    border: COLORS.neutral100,
  },
};

const SIZES: BadgeSize[] = ["large", "medium", "small"];
const VARIANTS: BadgeVariant[] = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "outline",
];

function createBadgeInstance(
  size: BadgeSize,
  variant: BadgeVariant,
  label: string
): ComponentNode {
  const spec = SIZE_SPECS[size];
  const colors = VARIANT_COLORS[variant];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = spec.paddingX;
  component.paddingRight = spec.paddingX;
  component.paddingTop = spec.paddingY;
  component.paddingBottom = spec.paddingY;
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

/** Generate the Badge component set on the given page. */
export function generateBadgeComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Badge");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const variant of VARIANTS) {
    const row = createVariantRow(variant);
    row.y = currentY;
    page.appendChild(row);

    for (const size of SIZES) {
      const badge = createBadgeInstance(size, variant, "Badge");
      row.appendChild(badge);
    }

    currentY += 48;
  }

  return currentY + 24;
}
