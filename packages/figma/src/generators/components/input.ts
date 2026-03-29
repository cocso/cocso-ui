import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import inputJSON from "../../../../codegen/generated/input.figma.json";
import { createWideComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantRow } from "../shared";

export function generateInputSection(container: FrameNode): void {
  const json = inputJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Input");

  const sizes = Object.keys(inputRecipe.variants.size);
  const row = createVariantRow("size");
  for (const size of sizes) {
    const spec = lookupSpec(json, inputRecipe, { size });
    row.appendChild(
      createWideComponentFromSpec(`size=${size}`, spec, "Placeholder")
    );
  }
  section.appendChild(row);

  container.appendChild(section);
}
