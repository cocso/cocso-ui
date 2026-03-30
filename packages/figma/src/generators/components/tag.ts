import { tagRecipe } from "@cocso-ui/recipe/recipes/tag.recipe";
import tagJSON from "../../../../codegen/generated/tag.figma.json";
import { createComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantMatrixPerSlice } from "../shared";

export function generateTagSection(container: FrameNode): void {
  const json = tagJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Tag");

  const variants = Object.keys(tagRecipe.variants.variant);
  const sizes = Object.keys(tagRecipe.variants.size);

  const matrixGrid = createVariantMatrixPerSlice(
    "Tag variants",
    { name: "variant", values: variants },
    { name: "size", values: sizes },
    undefined,
    (variantVal, sizeVal) => {
      const spec = lookupSpec(json, tagRecipe, {
        variant: variantVal,
        size: sizeVal,
      });
      return createComponentFromSpec(`${variantVal}-${sizeVal}`, spec, "Tag");
    }
  );
  section.appendChild(matrixGrid);
  container.appendChild(section);
}
