import {
  SELECT_COLORS,
  SELECT_SIZE_SPECS,
  SELECT_SIZES,
  type SelectSize,
} from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createSelectInstance(size: SelectSize): ComponentNode {
  const spec = SELECT_SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.resize(200, spec.height);
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = spec.paddingLeft;
  component.paddingRight = spec.paddingRight;
  component.cornerRadius = spec.borderRadius;

  setFill(component, SELECT_COLORS.background);
  setStroke(component, SELECT_COLORS.borderDefault);

  const text = createTextNode(
    "Select option",
    spec.fontSize,
    400,
    SELECT_COLORS.text
  );
  text.layoutGrow = 1;
  component.appendChild(text);

  const arrow = createTextNode(
    "\u25BE",
    spec.fontSize,
    400,
    SELECT_COLORS.iconColor
  );
  component.appendChild(arrow);

  return component;
}

export function generateSelectComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Select");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;

  const row = createVariantRow("default");
  row.y = currentY;
  page.appendChild(row);

  for (const size of SELECT_SIZES) {
    const select = createSelectInstance(size);
    row.appendChild(select);
  }

  return currentY + 72;
}
