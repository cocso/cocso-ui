import {
  SELECT_COLORS,
  SELECT_SIZE_SPECS,
  SELECT_SIZES,
  type SelectSize,
} from "./component-registry";
import {
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
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

  const arrow = createIcon(
    ICON_SVGS.selector,
    14,
    rgbToHex(SELECT_COLORS.iconColor)
  );
  component.appendChild(arrow);

  return component;
}

export function generateSelectComponents(container: FrameNode): void {
  const section = createComponentSection("Select");

  const row = createVariantRow("default");

  for (const size of SELECT_SIZES) {
    const select = createSelectInstance(size);
    row.appendChild(select);
  }

  section.appendChild(row);
  container.appendChild(section);
}
