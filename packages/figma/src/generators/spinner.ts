import { COLORS, createSectionHeader, createVariantRow } from "./shared";

type SpinnerSize = "large" | "medium" | "small";
type SpinnerVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";

const SIZE_SPECS: Record<SpinnerSize, number> = {
  large: 20,
  medium: 16,
  small: 12,
};

const VARIANT_COLORS: Record<SpinnerVariant, RGB> = {
  primary: COLORS.primary950,
  secondary: COLORS.neutral400,
  success: COLORS.success500,
  error: COLORS.danger500,
  warning: COLORS.warning300,
  info: COLORS.info500,
};

const SIZES: SpinnerSize[] = ["large", "medium", "small"];
const VARIANTS: SpinnerVariant[] = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
];

function createSpinnerInstance(
  size: SpinnerSize,
  variant: SpinnerVariant
): ComponentNode {
  const containerSize = SIZE_SPECS[size];
  const color = VARIANT_COLORS[variant];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}`;
  component.resize(containerSize, containerSize);
  component.fills = [];

  // Simplified spinner representation: circle with a gap
  const circle = figma.createEllipse();
  circle.name = "spinner-track";
  circle.resize(containerSize, containerSize);
  circle.fills = [];
  circle.strokes = [{ type: "SOLID", color }];
  circle.strokeWeight = size === "small" ? 1.5 : 2;
  circle.arcData = {
    startingAngle: 0,
    endingAngle: (270 * Math.PI) / 180,
    innerRadius: 0.7,
  };

  component.appendChild(circle);

  return component;
}

export function generateSpinnerComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Spinner");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const variant of VARIANTS) {
    const row = createVariantRow(variant);
    row.y = currentY;
    page.appendChild(row);

    for (const size of SIZES) {
      const spinner = createSpinnerInstance(size, variant);
      row.appendChild(spinner);
    }

    currentY += 40;
  }

  return currentY + 24;
}
