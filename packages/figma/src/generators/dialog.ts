import {
  COLORS,
  createAutoLayoutFrame,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
  setFill,
} from "./shared";

type DialogSize = "small" | "medium" | "large";

const SIZE_WIDTHS: Record<DialogSize, number> = {
  small: 380,
  medium: 520,
  large: 680,
};

function createDialogInstance(size: DialogSize): ComponentNode {
  const width = SIZE_WIDTHS[size];

  const component = figma.createComponent();
  component.name = `size=${size}`;
  component.resize(width, 100);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.paddingTop = 16;
  component.paddingBottom = 16;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  component.cornerRadius = 12;
  component.itemSpacing = 4;
  setFill(component, COLORS.white);

  const titleRow = createAutoLayoutFrame("title-row");
  titleRow.resize(width - 32, 24);
  titleRow.primaryAxisSizingMode = "FIXED";
  titleRow.counterAxisSizingMode = "AUTO";
  titleRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  titleRow.counterAxisAlignItems = "CENTER";
  titleRow.fills = [];

  const title = createTextNode("Dialog Title", 20, 700, COLORS.neutral950);
  titleRow.appendChild(title);

  const closeBtn = createIcon(ICON_SVGS.close, 14, rgbToHex(COLORS.neutral600));
  titleRow.appendChild(closeBtn);

  component.appendChild(titleRow);

  const desc = createTextNode(
    "This is a description for the dialog content.",
    14,
    500,
    COLORS.neutral500
  );
  component.appendChild(desc);

  return component;
}

export function generateDialogComponents(container: FrameNode): void {
  const section = createComponentSection("Dialog");

  for (const size of ["small", "medium", "large"] as DialogSize[]) {
    const row = createVariantRow(size);
    row.appendChild(createDialogInstance(size));
    section.appendChild(row);
  }

  container.appendChild(section);
}
