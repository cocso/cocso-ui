import {
  CHECKBOX_COLORS,
  CHECKBOX_SIZE_SPECS,
  CHECKBOX_SIZES,
  CHECKBOX_STATUSES,
  type CheckboxSize,
  type CheckboxStatus,
} from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createCheckboxInstance(
  size: CheckboxSize,
  status: CheckboxStatus
): ComponentNode {
  const spec = CHECKBOX_SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}, status=${status}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;

  // Checkbox box: centered content via auto-layout
  const box = figma.createFrame();
  box.name = "checkbox-box";
  box.resize(spec.size, spec.size);
  box.cornerRadius = spec.borderRadius;
  box.layoutMode = "HORIZONTAL";
  box.primaryAxisSizingMode = "FIXED";
  box.counterAxisSizingMode = "FIXED";
  box.primaryAxisAlignItems = "CENTER";
  box.counterAxisAlignItems = "CENTER";

  if (status === "on" || status === "intermediate") {
    setFill(box, CHECKBOX_COLORS.bgChecked);
    setStroke(box, CHECKBOX_COLORS.borderChecked);

    // Use a simple visual indicator
    const iconSize = Math.round(spec.size * 0.65);
    const icon = createTextNode(
      status === "on" ? "\u2713" : "\u2014",
      iconSize,
      700,
      CHECKBOX_COLORS.iconColor
    );
    box.appendChild(icon);
  } else {
    setFill(box, CHECKBOX_COLORS.bgUnchecked);
    setStroke(box, CHECKBOX_COLORS.borderUnchecked);
  }

  component.appendChild(box);

  const label = createTextNode(
    "Label",
    spec.fontSize,
    400,
    CHECKBOX_COLORS.labelColor
  );
  component.appendChild(label);

  return component;
}

export function generateCheckboxComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Checkbox");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const status of CHECKBOX_STATUSES) {
    const row = createVariantRow(status);
    row.y = currentY;
    page.appendChild(row);

    for (const size of CHECKBOX_SIZES) {
      const checkbox = createCheckboxInstance(size, status);
      row.appendChild(checkbox);
    }

    currentY += 48;
  }

  return currentY + 24;
}
