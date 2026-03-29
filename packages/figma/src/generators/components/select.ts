import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import selectJSON from "../../../../codegen/generated/select.figma.json";
import { createSelectComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantRow } from "../shared";

export function generateSelectSection(container: FrameNode): void {
  const json = selectJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Select");

  const sizes = Object.keys(selectRecipe.variants.size);
  const row = createVariantRow("size");
  for (const size of sizes) {
    const spec = lookupSpec(json, selectRecipe, { size });
    row.appendChild(
      createSelectComponentFromSpec(`size=${size}`, spec, "Select")
    );
  }
  section.appendChild(row);

  container.appendChild(section);
}
