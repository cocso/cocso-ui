import {
  SPINNER_SIZE_SPECS,
  SPINNER_SIZES,
  SPINNER_VARIANT_COLORS,
  SPINNER_VARIANTS,
  type SpinnerSize,
  type SpinnerVariant,
} from "./component-registry";
import { createSectionHeader, createVariantRow } from "./shared";

function createSpinnerInstance(
  size: SpinnerSize,
  variant: SpinnerVariant
): ComponentNode {
  const containerSize = SPINNER_SIZE_SPECS[size];
  const color = SPINNER_VARIANT_COLORS[variant];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}`;
  component.resize(containerSize, containerSize);
  component.fills = [];

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

  for (const variant of SPINNER_VARIANTS) {
    const row = createVariantRow(variant);
    row.y = currentY;
    page.appendChild(row);

    for (const size of SPINNER_SIZES) {
      const spinner = createSpinnerInstance(size, variant);
      row.appendChild(spinner);
    }

    currentY += 40;
  }

  return currentY + 24;
}
