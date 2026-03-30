import { alertRecipe } from "@cocso-ui/recipe/recipes/alert.recipe";
import alertJSON from "../../../../codegen/generated/alert.figma.json";
import { createComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantMatrixPerSlice } from "../shared";

export function generateAlertSection(container: FrameNode): void {
  const json = alertJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Alert");

  const variants = Object.keys(alertRecipe.variants.variant);

  const matrixGrid = createVariantMatrixPerSlice(
    "Alert variants",
    { name: "variant", values: variants },
    undefined,
    undefined,
    (variantVal) => {
      const spec = lookupSpec(json, alertRecipe, { variant: variantVal });
      return createComponentFromSpec(`${variantVal}`, spec, "Alert");
    }
  );
  section.appendChild(matrixGrid);
  container.appendChild(section);
}
