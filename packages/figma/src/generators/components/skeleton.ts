import { skeletonRecipe } from "@cocso-ui/recipe/recipes/skeleton.recipe";
import skeletonJSON from "../../../../codegen/generated/skeleton.figma.json";
import { createComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantMatrixPerSlice } from "../shared";

export function generateSkeletonSection(container: FrameNode): void {
  const json = skeletonJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Skeleton");

  const variants = Object.keys(skeletonRecipe.variants.variant);
  const animations = Object.keys(skeletonRecipe.variants.animation);

  const matrixGrid = createVariantMatrixPerSlice(
    "Skeleton variants",
    { name: "variant", values: variants },
    { name: "animation", values: animations },
    undefined,
    (variantVal, animationVal) => {
      const spec = lookupSpec(json, skeletonRecipe, {
        variant: variantVal,
        animation: animationVal,
      });
      return createComponentFromSpec(
        `${variantVal}-${animationVal}`,
        spec,
        "Skeleton",
      );
    },
  );
  section.appendChild(matrixGrid);
  container.appendChild(section);
}
