import { cardRecipe } from "@cocso-ui/recipe/recipes/card.recipe";
import cardJSON from "../../../../../ecosystem/codegen/generated/card.figma.json";
import { createComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantMatrixPerSlice } from "../shared";

export function generateCardSection(container: FrameNode): void {
  const json = cardJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Card");

  const variants = Object.keys(cardRecipe.variants.variant);
  const paddings = Object.keys(cardRecipe.variants.padding);

  const matrixGrid = createVariantMatrixPerSlice(
    "Card variants",
    { name: "variant", values: variants },
    { name: "padding", values: paddings },
    undefined,
    (variantVal, paddingVal) => {
      const spec = lookupSpec(json, cardRecipe, {
        variant: variantVal,
        padding: paddingVal,
      });
      return createComponentFromSpec(
        `${variantVal}-${paddingVal}`,
        spec,
        "Card"
      );
    }
  );
  section.appendChild(matrixGrid);
  container.appendChild(section);
}
