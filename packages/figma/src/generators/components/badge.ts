import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import { createComponentFromSpec } from "../component-creators";
import {
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
} from "../recipe-utils";
import { createComponentSection, createVariantRow } from "../shared";

export function generateBadgeSection(container: FrameNode): void {
  const section = createComponentSection("Badge");
  const combinations = getAllVariantCombinations(badgeRecipe);
  const groups = groupVariantsByFirstDimension(badgeRecipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = createComponentFromSpec(name, spec, "Badge");
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}
