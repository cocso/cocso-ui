import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

function getWeekend(col: number): "sun" | "sat" | undefined {
  if (col === 0) {
    return "sun";
  }
  if (col === 6) {
    return "sat";
  }
  return undefined;
}
const CELL_SIZE = 32;

function createDayCell(
  day: number,
  options: {
    selected?: boolean;
    today?: boolean;
    outside?: boolean;
    weekend?: "sun" | "sat";
  }
): FrameNode {
  const cell = figma.createFrame();
  cell.name = `day-${day}`;
  cell.layoutMode = "HORIZONTAL";
  cell.primaryAxisSizingMode = "FIXED";
  cell.counterAxisSizingMode = "FIXED";
  cell.resize(CELL_SIZE, CELL_SIZE);
  cell.primaryAxisAlignItems = "CENTER";
  cell.counterAxisAlignItems = "CENTER";
  cell.cornerRadius = 8;

  if (options.selected) {
    setFill(cell, COLORS.primary950);
  } else {
    cell.fills = [];
  }

  let textColor = COLORS.neutral950;
  if (options.selected) {
    textColor = COLORS.white;
  } else if (options.weekend === "sun") {
    textColor = COLORS.danger600;
  } else if (options.weekend === "sat") {
    textColor = COLORS.info600;
  }

  const text = createTextNode(
    String(day),
    12,
    options.selected ? 600 : 400,
    textColor
  );
  if (options.outside) {
    text.opacity = 0.4;
  }
  cell.appendChild(text);

  return cell;
}

function createCalendarHeader(): FrameNode {
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
  header.appendChild(createTextNode("March 2026", 14, 600, COLORS.neutral950));
  header.appendChild(createTextNode("\u203A", 16, 400, COLORS.neutral600));

  return header;
}

function getDayNameColor(col: number): RGB {
  if (col === 0) {
    return COLORS.danger600;
  }
  if (col === 6) {
    return COLORS.info600;
  }
  return COLORS.neutral400;
}

function createDayNameRow(): FrameNode {
  const row = figma.createFrame();
  row.name = "day-names";
  row.layoutMode = "HORIZONTAL";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];

  for (let i = 0; i < 7; i++) {
    const cell = figma.createFrame();
    cell.layoutMode = "HORIZONTAL";
    cell.primaryAxisSizingMode = "FIXED";
    cell.counterAxisSizingMode = "FIXED";
    cell.resize(CELL_SIZE, CELL_SIZE);
    cell.primaryAxisAlignItems = "CENTER";
    cell.counterAxisAlignItems = "CENTER";
    cell.fills = [];

    cell.appendChild(createTextNode(DAY_NAMES[i], 12, 500, getDayNameColor(i)));
    row.appendChild(cell);
  }

  return row;
}

function createCalendarInstance(): ComponentNode {
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
  component.itemSpacing = 4;
  setFill(component, COLORS.white);

  component.appendChild(createCalendarHeader());
  component.appendChild(createDayNameRow());

  const days = [
    [0, 0, 0, 0, 0, 0, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
  ];

  for (const week of days) {
    const weekRow = figma.createFrame();
    weekRow.name = "week";
    weekRow.layoutMode = "HORIZONTAL";
    weekRow.primaryAxisSizingMode = "AUTO";
    weekRow.counterAxisSizingMode = "AUTO";
    weekRow.fills = [];

    for (let col = 0; col < 7; col++) {
      const day = week[col];
      if (day === 0) {
        const empty = figma.createFrame();
        empty.resize(CELL_SIZE, CELL_SIZE);
        empty.fills = [];
        weekRow.appendChild(empty);
      } else {
        weekRow.appendChild(
          createDayCell(day, {
            selected: day === 25,
            weekend: getWeekend(col),
          })
        );
      }
    }
    component.appendChild(weekRow);
  }

  return component;
}

export function generateDayPickerComponents(container: FrameNode): void {
  const section = createComponentSection("DayPicker");

  const row = createVariantRow("default");
  row.appendChild(createCalendarInstance());
  section.appendChild(row);

  container.appendChild(section);
}
