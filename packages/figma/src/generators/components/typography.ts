import { typographyRecipe } from "@cocso-ui/recipe/recipes/typography.recipe";
import {
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
} from "../recipe-utils";
import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
} from "../shared";

export function generateTypographySection(container: FrameNode): void {
  const section = createComponentSection("Typography");
  const combinations = getAllVariantCombinations(typographyRecipe);
  const groups = groupVariantsByFirstDimension(typographyRecipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = figma.createComponent();
      component.name = name;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.fills = [];

      const fontSize = spec.fontSize ?? 16;
      const fontWeight = spec.fontWeight ?? 400;
      const textColor = spec.fontColor ?? COLORS.neutral950;
      const sizeValue = name.match(/size=([^,]*)/)?.[1] ?? "";
      const sampleText = `${groupKey} ${sizeValue} (${fontSize}px)`;
      const text = createTextNode(sampleText, fontSize, fontWeight, textColor);
      component.appendChild(text);

      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}
