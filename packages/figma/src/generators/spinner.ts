import {
  SPINNER_SIZE_SPECS,
  SPINNER_SIZES,
  SPINNER_VARIANT_COLORS,
  SPINNER_VARIANTS,
  type SpinnerSize,
  type SpinnerVariant,
} from "./component-registry";
import { createSectionHeader, createVariantRow } from "./shared";

/**
 * Blade specs matching the React Spinner sizeConfig:
 * - small: 6 blades, 1.5x4px, radius 0.75
 * - medium: 8 blades, 2x5px, radius 1
 * - large: 10 blades, 2x6px, radius 1
 */
const BLADE_SPECS: Record<
  SpinnerSize,
  {
    bladeCount: number;
    bladeHeight: number;
    bladeRadius: number;
    bladeWidth: number;
  }
> = {
  small: { bladeCount: 6, bladeWidth: 1.5, bladeHeight: 4, bladeRadius: 0.75 },
  medium: { bladeCount: 8, bladeWidth: 2, bladeHeight: 5, bladeRadius: 1 },
  large: { bladeCount: 10, bladeWidth: 2, bladeHeight: 6, bladeRadius: 1 },
};

function createSpinnerInstance(
  size: SpinnerSize,
  variant: SpinnerVariant
): ComponentNode {
  const containerSize = SPINNER_SIZE_SPECS[size];
  const color = SPINNER_VARIANT_COLORS[variant];
  const blade = BLADE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}`;
  component.resize(containerSize, containerSize);
  component.fills = [];

  const step = 360 / blade.bladeCount;
  const cx = containerSize / 2;

  for (let i = 0; i < blade.bladeCount; i++) {
    const angle = i * step;
    const opacity = 1 - (i / blade.bladeCount) * 0.85;

    const rect = figma.createRectangle();
    rect.name = `blade-${i}`;
    rect.resize(blade.bladeWidth, blade.bladeHeight);
    rect.cornerRadius = blade.bladeRadius;
    rect.fills = [{ type: "SOLID", color, opacity }];

    rect.x = cx - blade.bladeWidth / 2;
    rect.y = 0;
    rect.rotation = -angle;

    component.appendChild(rect);
  }

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
