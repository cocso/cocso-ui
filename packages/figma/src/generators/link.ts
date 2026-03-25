import {
  LINK_SIZES,
  LINK_VARIANT_COLORS,
  LINK_VARIANTS,
} from "./component-registry";
import {
  createComponentSection,
  createTextNode,
  createVariantRow,
} from "./shared";

export function generateLinkComponents(container: FrameNode): void {
  const section = createComponentSection("Link");

  for (const variant of LINK_VARIANTS) {
    const row = createVariantRow(variant);

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

    section.appendChild(row);
  }

  container.appendChild(section);
}
