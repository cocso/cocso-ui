/**
 * @deprecated Legacy hand-coded spinner generator. The canonical recipe-based
 * implementation lives in `recipe-generator.ts` (`createSpinnerFromSpec`).
 * This file is kept for backward compatibility but should not be used for
 * new work.
 */

import {
  SPINNER_SIZE_SPECS,
  SPINNER_SIZES,
  SPINNER_VARIANT_COLORS,
  SPINNER_VARIANTS,
  type SpinnerSize,
  type SpinnerVariant,
} from "./component-registry";
import {
  createBoundPaint,
  createComponentSection,
  createVariantRow,
} from "./shared";

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

  for (let i = 0; i < blade.bladeCount; i++) {
    const angleDeg = (i * 360) / blade.bladeCount;
    const opacity = 1 - (i / blade.bladeCount) * 0.85;

    // Wrap each blade in a container-sized frame so that Figma's rotation
    // (which pivots around the node center) rotates around the spinner center,
    // matching React's transformOrigin behavior.
    const wrapper = figma.createFrame();
    wrapper.name = `blade-${i}`;
    wrapper.resize(containerSize, containerSize);
    wrapper.fills = [];

    const rect = figma.createRectangle();
    rect.name = "blade";
    rect.resize(blade.bladeWidth, blade.bladeHeight);
    rect.cornerRadius = blade.bladeRadius;
    rect.fills = [createBoundPaint(color, opacity)];

    rect.x = (containerSize - blade.bladeWidth) / 2;
    rect.y = containerSize - blade.bladeHeight;

    wrapper.appendChild(rect);
    wrapper.rotation = -angleDeg;
    component.appendChild(wrapper);
  }

  return component;
}

export function generateSpinnerComponents(container: FrameNode): void {
  const section = createComponentSection("Spinner");

  for (const variant of SPINNER_VARIANTS) {
    const row = createVariantRow(variant);

    for (const size of SPINNER_SIZES) {
      const spinner = createSpinnerInstance(size, variant);
      row.appendChild(spinner);
    }

    section.appendChild(row);
  }

  container.appendChild(section);
}
