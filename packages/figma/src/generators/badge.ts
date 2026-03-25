import {
  BADGE_SIZE_SPECS,
  BADGE_SIZES,
  BADGE_VARIANT_SPECS,
  BADGE_VARIANTS,
  type BadgeSize,
  type BadgeVariant,
} from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createBadgeInstance(
  size: BadgeSize,
  variant: BadgeVariant,
  label: string
): ComponentNode {
  const spec = BADGE_SIZE_SPECS[size];
  const colors = BADGE_VARIANT_SPECS[variant];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = spec.paddingX;
  component.paddingRight = spec.paddingX;
  component.paddingTop = spec.paddingY;
  component.paddingBottom = spec.paddingY;
  component.cornerRadius = spec.borderRadius;
  component.itemSpacing = 2;

  if (colors.borderColor) {
    setFill(component, colors.bgColor, colors.bgOpacity ?? 1);
    setStroke(component, colors.borderColor);
  } else {
    setFill(component, colors.bgColor);
  }

  const text = createTextNode(label, spec.fontSize, 500, colors.textColor);
  component.appendChild(text);

  return component;
}

export function generateBadgeComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Badge");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const variant of BADGE_VARIANTS) {
    const row = createVariantRow(variant);
    row.y = currentY;
    page.appendChild(row);

    for (const size of BADGE_SIZES) {
      const badge = createBadgeInstance(size, variant, "Badge");
      row.appendChild(badge);
    }

    currentY += 48;
  }

  return currentY + 24;
}
