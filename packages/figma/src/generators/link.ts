import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
} from "./shared";

type LinkVariant = "inline" | "plain";

const VARIANT_COLORS: Record<LinkVariant, RGB> = {
  inline: COLORS.info500,
  plain: COLORS.info500,
};

const SIZES = [
  { name: "large", fontSize: 18 },
  { name: "medium", fontSize: 16 },
  { name: "small", fontSize: 14 },
  { name: "x-small", fontSize: 12 },
] as const;

const VARIANTS: LinkVariant[] = ["inline", "plain"];

export function generateLinkComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Link");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  for (const variant of VARIANTS) {
    const row = createVariantRow(variant);
    row.y = currentY;
    page.appendChild(row);

    for (const { name, fontSize } of SIZES) {
      const component = figma.createComponent();
      component.name = `size=${name}, variant=${variant}`;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";

      const text = createTextNode(
        "Link text",
        fontSize,
        400,
        VARIANT_COLORS[variant]
      );
      text.textDecoration = variant === "inline" ? "UNDERLINE" : "NONE";
      component.appendChild(text);

      row.appendChild(component);
    }

    currentY += 40;
  }

  return currentY + 24;
}
