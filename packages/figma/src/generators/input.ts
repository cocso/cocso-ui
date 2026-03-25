/**
 * Figma component generator for Input.
 * Creates a ComponentSet with size variants.
 */

import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

type InputSize = "large" | "medium" | "small" | "x-small";

interface InputSpec {
  borderRadius: number;
  fontSize: number;
  height: number;
  paddingX: number;
}

const SIZE_SPECS: Record<InputSize, InputSpec> = {
  large: { height: 40, paddingX: 14, fontSize: 14, borderRadius: 8 },
  medium: { height: 36, paddingX: 12, fontSize: 14, borderRadius: 8 },
  small: { height: 32, paddingX: 10, fontSize: 12, borderRadius: 6 },
  "x-small": { height: 28, paddingX: 8, fontSize: 12, borderRadius: 6 },
};

const SIZES: InputSize[] = ["large", "medium", "small", "x-small"];

function createInputInstance(
  size: InputSize,
  state: "default" | "error"
): ComponentNode {
  const spec = SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}, state=${state}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.resize(240, spec.height);
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = spec.paddingX;
  component.paddingRight = spec.paddingX;
  component.cornerRadius = spec.borderRadius;

  setFill(component, COLORS.white);

  const borderColor = state === "error" ? COLORS.danger500 : COLORS.neutral200;
  setStroke(component, borderColor);

  const placeholder = createTextNode(
    "Placeholder",
    spec.fontSize,
    400,
    COLORS.neutral400
  );
  component.appendChild(placeholder);

  return component;
}

/** Generate the Input component set on the given page. */
export function generateInputComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Input");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const state of ["default", "error"] as const) {
    const row = createVariantRow(state);
    row.y = currentY;
    page.appendChild(row);

    for (const size of SIZES) {
      const input = createInputInstance(size, state);
      row.appendChild(input);
    }

    currentY += 56;
  }

  return currentY + 24;
}
