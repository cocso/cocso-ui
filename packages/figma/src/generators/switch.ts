import {
  SWITCH_COLORS,
  SWITCH_SIZE_SPECS,
  SWITCH_SIZES,
  SWITCH_VARIANT_COLORS,
  SWITCH_VARIANTS,
  type SwitchSize,
  type SwitchVariant,
} from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

function createSwitchInstance(
  size: SwitchSize,
  variant: SwitchVariant,
  checked: boolean
): ComponentNode {
  const spec = SWITCH_SIZE_SPECS[size];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}, checked=${checked}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;

  const track = figma.createFrame();
  track.name = "track";
  track.resize(spec.width, spec.height);
  track.cornerRadius = 1000;
  setFill(
    track,
    checked ? SWITCH_VARIANT_COLORS[variant] : SWITCH_COLORS.trackUnchecked
  );

  const thumb = figma.createEllipse();
  thumb.name = "thumb";
  thumb.resize(spec.thumb, spec.thumb);
  setFill(thumb, SWITCH_COLORS.thumbBg);
  track.appendChild(thumb);
  thumb.layoutPositioning = "ABSOLUTE";
  thumb.x = checked
    ? spec.width - spec.thumb - spec.thumbOffset
    : spec.thumbOffset;
  thumb.y = (spec.height - spec.thumb) / 2;

  component.appendChild(track);

  const label = createTextNode("Label", 14, 400, SWITCH_COLORS.thumbBg);
  label.fills = [{ type: "SOLID", color: { r: 0.075, g: 0.078, b: 0.086 } }];
  component.appendChild(label);

  return component;
}

export function generateSwitchComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Switch");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const variant of SWITCH_VARIANTS) {
    for (const checked of [false, true]) {
      const row = createVariantRow(`${variant}/${checked ? "on" : "off"}`);
      row.y = currentY;
      page.appendChild(row);

      for (const size of SWITCH_SIZES) {
        const sw = createSwitchInstance(size, variant, checked);
        row.appendChild(sw);
      }

      currentY += 44;
    }
  }

  return currentY + 24;
}
