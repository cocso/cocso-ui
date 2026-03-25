import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createDropdownItem(
  label: string,
  state: "default" | "hover" | "disabled"
): FrameNode {
  const item = figma.createFrame();
  item.name = `item-${state}`;
  item.layoutMode = "HORIZONTAL";
  item.primaryAxisSizingMode = "AUTO";
  item.counterAxisSizingMode = "AUTO";
  item.counterAxisAlignItems = "CENTER";
  item.paddingTop = 6;
  item.paddingBottom = 6;
  item.paddingLeft = 8;
  item.paddingRight = 8;
  item.cornerRadius = 6;
  item.itemSpacing = 6;

  if (state === "hover") {
    setFill(item, COLORS.neutral50);
  } else {
    item.fills = [];
  }

  const text = createTextNode(label, 14, 400, COLORS.neutral950);
  if (state === "disabled") {
    text.opacity = 0.4;
  }
  item.appendChild(text);

  return item;
}

function createDropdownInstance(): ComponentNode {
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.minWidth = 128;
  component.paddingTop = 6;
  component.paddingBottom = 6;
  component.paddingLeft = 6;
  component.paddingRight = 6;
  component.cornerRadius = 6;
  setFill(component, COLORS.white);
  setStroke(component, COLORS.neutral100);

  component.appendChild(createDropdownItem("Menu Item 1", "default"));
  component.appendChild(createDropdownItem("Menu Item 2", "hover"));
  component.appendChild(createDropdownItem("Menu Item 3", "default"));
  component.appendChild(createDropdownItem("Disabled Item", "disabled"));

  return component;
}

export function generateDropdownComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Dropdown");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;
  const row = createVariantRow("default");
  row.y = currentY;
  page.appendChild(row);
  row.appendChild(createDropdownInstance());

  return currentY + 160;
}
