import {
  INPUT_COLORS,
  INPUT_SIZE_SPECS,
  INPUT_SIZES,
  type InputSize,
} from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createInputInstance(
  size: InputSize,
  state: "default" | "error"
): ComponentNode {
  const spec = INPUT_SIZE_SPECS[size];

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

  setFill(component, INPUT_COLORS.background);

  const borderColor =
    state === "error" ? INPUT_COLORS.borderError : INPUT_COLORS.borderDefault;
  setStroke(component, borderColor);

  const placeholder = createTextNode(
    "Placeholder",
    spec.fontSize,
    400,
    INPUT_COLORS.placeholder
  );
  component.appendChild(placeholder);

  return component;
}

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

    for (const size of INPUT_SIZES) {
      const input = createInputInstance(size, state);
      row.appendChild(input);
    }

    currentY += 56;
  }

  return currentY + 24;
}
