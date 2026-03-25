import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
} from "./shared";

type StockStatus = "plenty" | "normal" | "short";

function getFillLevel(status: StockStatus): number {
  if (status === "plenty") {
    return 1;
  }
  if (status === "normal") {
    return 0.5;
  }
  return 0.25;
}

const STATUS_SPECS: Record<StockStatus, { color: RGB; label: string }> = {
  plenty: { color: COLORS.info500, label: "\uC5EC\uC720" },
  normal: { color: COLORS.success500, label: "\uBCF4\uD1B5" },
  short: { color: COLORS.danger500, label: "\uBD80\uC871" },
};

function createStockIcon(color: RGB, fillLevel: number): FrameNode {
  const icon = figma.createFrame();
  icon.name = "stock-icon";
  icon.resize(16, 16);
  icon.fills = [];

  const bg = figma.createRectangle();
  bg.name = "bg";
  bg.resize(16, 16);
  bg.cornerRadius = 2;
  bg.fills = [
    { type: "SOLID", color: { r: 0.851, g: 0.851, b: 0.851 }, opacity: 0.85 },
  ];
  icon.appendChild(bg);

  const fill = figma.createRectangle();
  fill.name = "fill";
  const fillHeight = Math.round(16 * fillLevel);
  fill.resize(16, fillHeight);
  fill.fills = [{ type: "SOLID", color }];
  fill.y = 16 - fillHeight;
  icon.appendChild(fill);

  return icon;
}

function createStatusInstance(status: StockStatus): ComponentNode {
  const spec = STATUS_SPECS[status];

  const component = figma.createComponent();
  component.name = `status=${status}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 2;
  component.fills = [];

  component.appendChild(createStockIcon(spec.color, getFillLevel(status)));

  const text = createTextNode(spec.label, 14, 400, spec.color);
  component.appendChild(text);

  return component;
}

export function generateStockQuantityStatusComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("StockQuantityStatus");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;
  const row = createVariantRow("variants");
  row.y = currentY;
  page.appendChild(row);

  for (const status of ["plenty", "normal", "short"] as StockStatus[]) {
    row.appendChild(createStatusInstance(status));
  }

  return currentY + 56;
}
