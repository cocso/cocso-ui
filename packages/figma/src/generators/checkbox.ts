import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

type CheckboxSize = "large" | "medium" | "small";
type CheckboxStatus = "on" | "off" | "intermediate";

const SIZE_SPECS: Record<
  CheckboxSize,
  { box: number; radius: number; fontSize: number }
> = {
  large: { box: 18, radius: 6, fontSize: 14 },
  medium: { box: 16, radius: 4, fontSize: 14 },
  small: { box: 14, radius: 2, fontSize: 12 },
};

const SIZES: CheckboxSize[] = ["large", "medium", "small"];
const STATUSES: CheckboxStatus[] = ["off", "on", "intermediate"];

function createCheckboxInstance(
  size: CheckboxSize,
  status: CheckboxStatus
): ComponentNode {
  const spec = SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}, status=${status}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;

  const box = figma.createFrame();
  box.name = "checkbox-box";
  box.resize(spec.box, spec.box);
  box.cornerRadius = spec.radius;

  if (status === "on" || status === "intermediate") {
    setFill(box, COLORS.primary950);
    const icon = createTextNode(
      status === "on" ? "\u2713" : "\u2014",
      10,
      700,
      COLORS.white
    );
    box.layoutMode = "HORIZONTAL";
    box.primaryAxisAlignItems = "CENTER";
    box.counterAxisAlignItems = "CENTER";
    box.appendChild(icon);
  } else {
    setFill(box, COLORS.white);
    setStroke(box, COLORS.neutral100);
  }

  component.appendChild(box);

  const label = createTextNode("Label", spec.fontSize, 400, COLORS.neutral950);
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

  for (const status of STATUSES) {
    const row = createVariantRow(status);
    row.y = currentY;
    page.appendChild(row);

    for (const size of SIZES) {
      const checkbox = createCheckboxInstance(size, status);
      row.appendChild(checkbox);
    }

    currentY += 48;
  }

  return currentY + 24;
}
