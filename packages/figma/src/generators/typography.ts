import { BODY_SIZES, FONT_WEIGHTS, HEADING_SIZES } from "./component-registry";
import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
} from "./shared";

export function generateTypographyComponents(container: FrameNode): void {
  const section = createComponentSection("Typography");

  const headingLabel = createTextNode("Heading", 12, 600, COLORS.neutral600);
  section.appendChild(headingLabel);

  for (const { name, fontSize } of HEADING_SIZES) {
    const row = createVariantRow(name);

    const text = createTextNode(
      `Heading ${name} (${fontSize}px)`,
      fontSize,
      700,
      COLORS.neutral950
    );
    row.appendChild(text);

    section.appendChild(row);
  }

  const bodyLabel = createTextNode("Body", 12, 600, COLORS.neutral600);
  section.appendChild(bodyLabel);

  for (const { name, fontSize } of BODY_SIZES) {
    const row = createVariantRow(name);

    for (const { name: weightName, value: weight } of FONT_WEIGHTS) {
      const text = createTextNode(
        `${weightName} (${weight})`,
        fontSize,
        weight,
        COLORS.neutral950
      );
      row.appendChild(text);
    }

    section.appendChild(row);
  }

  container.appendChild(section);
}
