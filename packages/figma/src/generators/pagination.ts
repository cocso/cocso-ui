import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

function createPageButton(
  label: string,
  active: boolean,
  disabled: boolean
): FrameNode {
  const btn = figma.createFrame();
  btn.name = `page-${label}`;
  btn.layoutMode = "HORIZONTAL";
  btn.primaryAxisSizingMode = "FIXED";
  btn.counterAxisSizingMode = "FIXED";
  btn.resize(32, 32);
  btn.primaryAxisAlignItems = "CENTER";
  btn.counterAxisAlignItems = "CENTER";
  btn.cornerRadius = 8;

  if (active) {
    setFill(btn, COLORS.primary950);
  } else {
    btn.fills = [];
  }

  const text = createTextNode(
    label,
    14,
    active ? 600 : 400,
    active ? COLORS.white : COLORS.neutral950
  );
  if (disabled) {
    text.opacity = 0.4;
  }
  btn.appendChild(text);

  return btn;
}

function createPaginationInstance(): ComponentNode {
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "CENTER";
  component.itemSpacing = 2;
  component.fills = [];

  component.appendChild(createPageButton("\u2039", false, true));
  component.appendChild(createPageButton("1", false, false));
  component.appendChild(createPageButton("\u2026", false, false));
  component.appendChild(createPageButton("4", false, false));
  component.appendChild(createPageButton("5", true, false));
  component.appendChild(createPageButton("6", false, false));
  component.appendChild(createPageButton("\u2026", false, false));
  component.appendChild(createPageButton("10", false, false));
  component.appendChild(createPageButton("\u203A", false, false));

  return component;
}

export function generatePaginationComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Pagination");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;
  const row = createVariantRow("default");
  row.y = currentY;
  page.appendChild(row);
  row.appendChild(createPaginationInstance());

  return currentY + 72;
}
