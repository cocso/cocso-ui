import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function createMonthPickerInstance(): ComponentNode {
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.paddingTop = 12;
  component.paddingBottom = 12;
  component.paddingLeft = 12;
  component.paddingRight = 12;
  component.cornerRadius = 8;
  component.itemSpacing = 8;
  setFill(component, COLORS.white);

  const header = figma.createFrame();
  header.name = "header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.paddingBottom = 8;
  header.fills = [];

  header.appendChild(createTextNode("\u2039", 16, 400, COLORS.neutral600));
  header.appendChild(createTextNode("2026", 14, 600, COLORS.neutral950));
  header.appendChild(createTextNode("\u203A", 16, 400, COLORS.neutral600));
  component.appendChild(header);

  for (let row = 0; row < 3; row++) {
    const monthRow = figma.createFrame();
    monthRow.name = `month-row-${row}`;
    monthRow.layoutMode = "HORIZONTAL";
    monthRow.primaryAxisSizingMode = "AUTO";
    monthRow.counterAxisSizingMode = "AUTO";
    monthRow.itemSpacing = 4;
    monthRow.fills = [];

    for (let col = 0; col < 4; col++) {
      const idx = row * 4 + col;
      const selected = idx === 2;

      const cell = figma.createFrame();
      cell.name = `month-${MONTHS[idx]}`;
      cell.layoutMode = "HORIZONTAL";
      cell.primaryAxisSizingMode = "FIXED";
      cell.counterAxisSizingMode = "FIXED";
      cell.resize(56, 40);
      cell.primaryAxisAlignItems = "CENTER";
      cell.counterAxisAlignItems = "CENTER";
      cell.cornerRadius = 8;

      if (selected) {
        setFill(cell, COLORS.primary950);
      } else {
        cell.fills = [];
      }

      const text = createTextNode(
        MONTHS[idx],
        14,
        selected ? 600 : 500,
        selected ? COLORS.white : COLORS.neutral950
      );
      cell.appendChild(text);
      monthRow.appendChild(cell);
    }
    component.appendChild(monthRow);
  }

  return component;
}

export function generateMonthPickerComponents(container: FrameNode): void {
  const section = createComponentSection("MonthPicker");

  const row = createVariantRow("default");
  row.appendChild(createMonthPickerInstance());
  section.appendChild(row);

  container.appendChild(section);
}
