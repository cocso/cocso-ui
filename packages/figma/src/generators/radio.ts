import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

type RadioSize = "large" | "medium" | "small";

const SIZE_SPECS: Record<RadioSize, { outer: number; dot: number }> = {
  large: { outer: 18, dot: 8 },
  medium: { outer: 16, dot: 7 },
  small: { outer: 14, dot: 6 },
};

const SIZES: RadioSize[] = ["large", "medium", "small"];

function createRadioInstance(
  size: RadioSize,
  selected: boolean
): ComponentNode {
  const spec = SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}, selected=${selected}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;

  const outer = figma.createEllipse();
  outer.name = "outer";
  outer.resize(spec.outer, spec.outer);
  setFill(outer, COLORS.white);
  setStroke(outer, selected ? COLORS.primary950 : COLORS.neutral200);
  if (selected) {
    outer.strokeWeight = 2;
  }

  const wrapper = figma.createFrame();
  wrapper.name = "radio-wrapper";
  wrapper.resize(spec.outer, spec.outer);
  wrapper.fills = [];
  wrapper.layoutMode = "HORIZONTAL";
  wrapper.primaryAxisAlignItems = "CENTER";
  wrapper.counterAxisAlignItems = "CENTER";
  wrapper.appendChild(outer);

  if (selected) {
    const dot = figma.createEllipse();
    dot.name = "dot";
    dot.resize(spec.dot, spec.dot);
    setFill(dot, COLORS.primary950);
    wrapper.appendChild(dot);
    dot.layoutPositioning = "ABSOLUTE";
    dot.x = (spec.outer - spec.dot) / 2;
    dot.y = (spec.outer - spec.dot) / 2;
  }

  component.appendChild(wrapper);

  const label = createTextNode("Option", 14, 400, COLORS.neutral950);
  component.appendChild(label);

  return component;
}

export function generateRadioComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Radio");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const selected of [false, true]) {
    const row = createVariantRow(selected ? "selected" : "unselected");
    row.y = currentY;
    page.appendChild(row);

    for (const size of SIZES) {
      const radio = createRadioInstance(size, selected);
      row.appendChild(radio);
    }

    currentY += 48;
  }

  return currentY + 24;
}
