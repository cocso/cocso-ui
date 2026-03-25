import {
  RADIO_COLORS,
  RADIO_SIZE_SPECS,
  RADIO_SIZES,
  type RadioSize,
} from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createRadioInstance(
  size: RadioSize,
  selected: boolean
): ComponentNode {
  const spec = RADIO_SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}, selected=${selected}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;

  // Use a frame with auto-layout to center the dot inside the outer ring
  const wrapper = figma.createFrame();
  wrapper.name = "radio-wrapper";
  wrapper.resize(spec.outerSize, spec.outerSize);
  wrapper.fills = [];
  wrapper.layoutMode = "HORIZONTAL";
  wrapper.primaryAxisSizingMode = "FIXED";
  wrapper.counterAxisSizingMode = "FIXED";
  wrapper.primaryAxisAlignItems = "CENTER";
  wrapper.counterAxisAlignItems = "CENTER";

  // Outer ring is absolute-positioned to fill the wrapper
  const outer = figma.createEllipse();
  outer.name = "outer";
  outer.resize(spec.outerSize, spec.outerSize);
  setFill(outer, RADIO_COLORS.outerBg);
  setStroke(outer, RADIO_COLORS.border);
  outer.strokeWeight = RADIO_COLORS.borderWidth;
  wrapper.appendChild(outer);
  outer.layoutPositioning = "ABSOLUTE";
  outer.x = 0;
  outer.y = 0;

  // Dot is auto-layout centered (only visible when selected)
  if (selected) {
    const dot = figma.createEllipse();
    dot.name = "dot";
    dot.resize(spec.dotSize, spec.dotSize);
    setFill(dot, RADIO_COLORS.dotColor);
    wrapper.appendChild(dot);
  }

  component.appendChild(wrapper);

  const label = createTextNode("Option", 14, 400, RADIO_COLORS.labelColor);
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

    for (const size of RADIO_SIZES) {
      const radio = createRadioInstance(size, selected);
      row.appendChild(radio);
    }

    currentY += 48;
  }

  return currentY + 24;
}
