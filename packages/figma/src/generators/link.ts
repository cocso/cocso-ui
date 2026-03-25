import {
  LINK_SIZES,
  LINK_VARIANT_COLORS,
  LINK_VARIANTS,
} from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
} from "./shared";

export function generateLinkComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Link");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const variant of LINK_VARIANTS) {
    const row = createVariantRow(variant);
    row.y = currentY;
    page.appendChild(row);

    for (const { name, fontSize } of LINK_SIZES) {
      const component = figma.createComponent();
      component.name = `size=${name}, variant=${variant}`;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.itemSpacing = 2;
      component.counterAxisAlignItems = "CENTER";

      const text = createTextNode(
        "Link text",
        fontSize,
        400,
        LINK_VARIANT_COLORS[variant]
      );
      text.textDecoration = variant === "inline" ? "UNDERLINE" : "NONE";
      component.appendChild(text);

      row.appendChild(component);
    }

    currentY += 40;
  }

  return currentY + 24;
}
