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
  COLORS,
  createComponentSection,
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

  // Track with layoutMode so thumb can use absolute positioning
  const track = figma.createFrame();
  track.name = "track";
  track.resize(spec.width, spec.height);
  track.cornerRadius = 1000;
  track.layoutMode = "HORIZONTAL";
  track.primaryAxisSizingMode = "FIXED";
  track.counterAxisSizingMode = "FIXED";
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

  const label = createTextNode("Label", 14, 400, COLORS.neutral950);
  component.appendChild(label);

  return component;
}

export function generateSwitchComponents(container: FrameNode): void {
  const section = createComponentSection("Switch");

  for (const variant of SWITCH_VARIANTS) {
    for (const checked of [false, true]) {
      const row = createVariantRow(`${variant}/${checked ? "on" : "off"}`);

      for (const size of SWITCH_SIZES) {
        const sw = createSwitchInstance(size, variant, checked);
        row.appendChild(sw);
      }

      section.appendChild(row);
    }
  }

  container.appendChild(section);
}
