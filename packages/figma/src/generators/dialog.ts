import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
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
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(width, 1);
  component.paddingTop = 16;
  component.paddingBottom = 16;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  component.cornerRadius = 12;
  component.itemSpacing = 4;
  setFill(component, COLORS.white);

  const title = createTextNode("Dialog Title", 20, 700, COLORS.neutral950);
  component.appendChild(title);

  const desc = createTextNode(
    "This is a description for the dialog content.",
    14,
    500,
    COLORS.neutral500
  );
  component.appendChild(desc);

  return component;
}

export function generateDialogComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Dialog");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const size of ["small", "medium", "large"] as DialogSize[]) {
    const row = createVariantRow(size);
    row.y = currentY;
    page.appendChild(row);
    row.appendChild(createDialogInstance(size));
    currentY += 120;
  }

  return currentY + 24;
}
