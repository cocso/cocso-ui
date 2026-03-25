import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

export function generateTooltipComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Tooltip");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;

  const row = createVariantRow("default");
  row.y = currentY;
  page.appendChild(row);

  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.paddingLeft = 12;
  component.paddingRight = 12;
  component.paddingTop = 8;
  component.paddingBottom = 8;
  component.cornerRadius = 6;
  setFill(component, COLORS.neutral900);

  const text = createTextNode("Tooltip text", 12, 400, COLORS.white);
  component.appendChild(text);

  row.appendChild(component);

  return currentY + 72;
}
