import { badgeRecipe } from "@cocso-ui/recipe/recipes/badge.recipe";
import badgeJSON from "../../../../codegen/generated/badge.figma.json";
import { createComponentFromSpec } from "../component-creators";
import {
  type FigmaJSONData,
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
  lookupSpec,
} from "../recipe-utils";
import {
  createComponentSection,
  createVariantMatrixPerSlice,
  createVariantRow,
} from "../shared";

export function generateBadgeSection(container: FrameNode): void {
  const json = badgeJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Badge");

  // Visual matrix grid (design system documentation layout)
  const variants = Object.keys(badgeRecipe.variants.variant);
  const sizes = Object.keys(badgeRecipe.variants.size);
  const shapes = Object.keys(badgeRecipe.variants.shape);

  const matrixGrid = createVariantMatrixPerSlice(
    "Badge variants",
    { name: "size", values: sizes },
    { name: "variant", values: variants },
    { name: "shape", values: shapes },
    (sizeVal, variantVal, shapeVal) => {
      const spec = lookupSpec(json, badgeRecipe, {
        variant: variantVal,
        size: sizeVal,
        shape: shapeVal,
      });
      return createComponentFromSpec(
        `${variantVal}-${sizeVal}-${shapeVal}`,
        spec,
        "Badge"
      );
    }
  );
  section.appendChild(matrixGrid);

  const combinations = getAllVariantCombinations(badgeRecipe);
  const groups = groupVariantsByFirstDimension(badgeRecipe, combinations, json);

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
