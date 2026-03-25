import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
} from "./shared";

const BODY_SIZES = [
  { name: "large", fontSize: 18 },
  { name: "medium", fontSize: 16 },
  { name: "small", fontSize: 14 },
  { name: "x-small", fontSize: 12 },
] as const;

const HEADING_SIZES = [
  { name: "x-large", fontSize: 28 },
  { name: "large", fontSize: 24 },
  { name: "medium", fontSize: 20 },
  { name: "small", fontSize: 16 },
  { name: "x-small", fontSize: 14 },
] as const;

const FONT_WEIGHTS = [
  { name: "regular", weight: 400 },
  { name: "medium", weight: 500 },
  { name: "semibold", weight: 600 },
  { name: "bold", weight: 700 },
] as const;

export function generateTypographyComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Typography");
  section.y = yOffset;
  page.appendChild(section);

  let currentY = yOffset + 80;

  // Heading scale
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

  // Body scale
  const bodyLabel = createTextNode("Body", 12, 600, COLORS.neutral600);
  bodyLabel.y = currentY;
  page.appendChild(bodyLabel);
  currentY += 24;

  for (const { name, fontSize } of BODY_SIZES) {
    const row = createVariantRow(name);
    row.y = currentY;
    page.appendChild(row);

    for (const { name: weightName, weight } of FONT_WEIGHTS) {
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
