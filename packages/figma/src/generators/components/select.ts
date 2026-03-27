import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import { createSelectComponentFromSpec } from "../component-creators";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import { createComponentSection, createVariantRow } from "../shared";

export function generateSelectSection(container: FrameNode): void {
  const section = createComponentSection("Select");
  const combinations = getAllVariantCombinations(selectRecipe);

  const row = createVariantRow("size");
  for (const combo of combinations) {
    const spec = resolveForFigma(selectRecipe, combo);
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createSelectComponentFromSpec(
      nameParts,
      spec,
      "Select option"
    );
    row.appendChild(component);
  }

  section.appendChild(row);
  container.appendChild(section);
}
