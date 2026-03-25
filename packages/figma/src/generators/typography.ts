import { BODY_SIZES, FONT_WEIGHTS, HEADING_SIZES } from "./component-registry";
import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
} from "./shared";

export function generateTypographyComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Typography");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  const headingLabel = createTextNode("Heading", 12, 600, COLORS.neutral600);
  headingLabel.y = currentY;
  page.appendChild(headingLabel);
  currentY += 24;

  for (const { name, fontSize } of HEADING_SIZES) {
    const row = createVariantRow(name);
    row.y = currentY;
    page.appendChild(row);

    const text = createTextNode(
      `Heading ${name} (${fontSize}px)`,
      fontSize,
      700,
      COLORS.neutral950
    );
    row.appendChild(text);

    currentY += Math.max(fontSize + 16, 40);
  }

  currentY += 16;

  const bodyLabel = createTextNode("Body", 12, 600, COLORS.neutral600);
  bodyLabel.y = currentY;
  page.appendChild(bodyLabel);
  currentY += 24;

  for (const { name, fontSize } of BODY_SIZES) {
    const row = createVariantRow(name);
    row.y = currentY;
    page.appendChild(row);

    for (const { name: weightName, value: weight } of FONT_WEIGHTS) {
      const text = createTextNode(
        `${weightName} (${weight})`,
        fontSize,
        weight,
        COLORS.neutral950
      );
      row.appendChild(text);
    }

    currentY += Math.max(fontSize + 16, 36);
  }

  return currentY + 24;
}
