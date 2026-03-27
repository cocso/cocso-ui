import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { createWideComponentFromSpec } from "../component-creators";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import { createComponentSection, createVariantRow } from "../shared";

export function generateInputSection(container: FrameNode): void {
  const section = createComponentSection("Input");
  const combinations = getAllVariantCombinations(inputRecipe);

  const row = createVariantRow("size");
  for (const combo of combinations) {
    const spec = resolveForFigma(inputRecipe, combo);
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createWideComponentFromSpec(
      nameParts,
      spec,
      "Placeholder"
    );
    row.appendChild(component);
  }

  section.appendChild(row);
  container.appendChild(section);
}
