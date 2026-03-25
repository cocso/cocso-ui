import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

type SwitchSize = "large" | "medium" | "small";
type SwitchVariant = "primary" | "success" | "error" | "warning" | "info";

const SIZE_SPECS: Record<
  SwitchSize,
  { width: number; height: number; thumb: number }
> = {
  large: { width: 40, height: 22, thumb: 18 },
  medium: { width: 36, height: 20, thumb: 16 },
  small: { width: 32, height: 18, thumb: 14 },
};

const VARIANT_COLORS: Record<SwitchVariant, RGB> = {
  primary: COLORS.primary950,
  success: COLORS.success500,
  error: COLORS.danger500,
  warning: COLORS.warning500,
  info: COLORS.info500,
};

const SIZES: SwitchSize[] = ["large", "medium", "small"];
const VARIANTS: SwitchVariant[] = [
  "primary",
  "success",
  "error",
  "warning",
  "info",
];

function createSwitchInstance(
  size: SwitchSize,
  variant: SwitchVariant,
  checked: boolean
): ComponentNode {
  const spec = SIZE_SPECS[size];

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
  track.cornerRadius = spec.height / 2;
  setFill(track, checked ? VARIANT_COLORS[variant] : COLORS.neutral100);

  const thumb = figma.createEllipse();
  thumb.name = "thumb";
  thumb.resize(spec.thumb, spec.thumb);
  setFill(thumb, COLORS.white);
  thumb.x = checked ? spec.width - spec.thumb - 2 : 2;
  thumb.y = (spec.height - spec.thumb) / 2;

  track.appendChild(thumb);
  component.appendChild(track);

  const label = createTextNode("Label", 14, 400, COLORS.neutral950);
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

  for (const variant of VARIANTS) {
    for (const checked of [false, true]) {
      const row = createVariantRow(`${variant}/${checked ? "on" : "off"}`);
      row.y = currentY;
      page.appendChild(row);

      for (const size of SIZES) {
        const sw = createSwitchInstance(size, variant, checked);
        row.appendChild(sw);
      }

      currentY += 44;
    }
  }

  return currentY + 24;
}
