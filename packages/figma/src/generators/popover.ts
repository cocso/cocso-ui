import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createPopoverInstance(): ComponentNode {
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.paddingTop = 6;
  component.paddingBottom = 6;
  component.paddingLeft = 8;
  component.paddingRight = 8;
  component.cornerRadius = 6;
  setFill(component, COLORS.white);
  setStroke(component, COLORS.neutral100);

  const text = createTextNode("Popover content", 14, 400, COLORS.neutral950);
  component.appendChild(text);

  return component;
}

export function generatePopoverComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Popover");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;
  const row = createVariantRow("default");
  row.y = currentY;
  page.appendChild(row);
  row.appendChild(createPopoverInstance());

  return currentY + 72;
}
