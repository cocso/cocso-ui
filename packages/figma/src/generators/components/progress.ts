import { progressRecipe } from "@cocso-ui/recipe/recipes/progress.recipe";
import progressJSON from "../../../../codegen/generated/progress.figma.json";
import { createComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantMatrixPerSlice } from "../shared";

export function generateProgressSection(container: FrameNode): void {
  const json = progressJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Progress");

  const sizes = Object.keys(progressRecipe.variants.size);

  const matrixGrid = createVariantMatrixPerSlice(
    "Progress variants",
    { name: "size", values: sizes },
    undefined,
    undefined,
    (sizeVal) => {
      const spec = lookupSpec(json, progressRecipe, { size: sizeVal });
      return createComponentFromSpec(`${sizeVal}`, spec, "Progress");
    },
  );
  section.appendChild(matrixGrid);
  container.appendChild(section);
}
