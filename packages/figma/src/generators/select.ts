import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

type SelectSize = "large" | "medium" | "small" | "x-small";

const SIZE_SPECS: Record<
  SelectSize,
  { height: number; paddingX: number; fontSize: number; radius: number }
> = {
  large: { height: 40, paddingX: 14, fontSize: 14, radius: 8 },
  medium: { height: 36, paddingX: 12, fontSize: 14, radius: 8 },
  small: { height: 32, paddingX: 10, fontSize: 12, radius: 6 },
  "x-small": { height: 28, paddingX: 8, fontSize: 12, radius: 6 },
};

const SIZES: SelectSize[] = ["large", "medium", "small", "x-small"];

function createSelectInstance(size: SelectSize): ComponentNode {
  const spec = SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.resize(200, spec.height);
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "SPACE_BETWEEN";
  component.paddingLeft = spec.paddingX;
  component.paddingRight = spec.paddingX;
  component.cornerRadius = spec.radius;

  setFill(component, COLORS.white);
  setStroke(component, COLORS.neutral200);

  const text = createTextNode(
    "Select option",
    spec.fontSize,
    400,
    COLORS.neutral950
  );
  component.appendChild(text);

  const arrow = createTextNode("\u25BE", spec.fontSize, 400, COLORS.neutral400);
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

  for (const size of SIZES) {
    const select = createSelectInstance(size);
    row.appendChild(select);
  }

  return currentY + 72;
}
