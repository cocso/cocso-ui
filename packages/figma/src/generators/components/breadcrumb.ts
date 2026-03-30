import { breadcrumbRecipe } from "@cocso-ui/recipe/recipes/breadcrumb.recipe";
import breadcrumbJSON from "../../../../codegen/generated/breadcrumb.figma.json";
import { createComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantMatrixPerSlice } from "../shared";

export function generateBreadcrumbSection(container: FrameNode): void {
  const json = breadcrumbJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Breadcrumb");

  const sizes = Object.keys(breadcrumbRecipe.variants.size);

  const matrixGrid = createVariantMatrixPerSlice(
    "Breadcrumb variants",
    { name: "size", values: sizes },
    undefined,
    undefined,
    (sizeVal) => {
      const spec = lookupSpec(json, breadcrumbRecipe, { size: sizeVal });
      return createComponentFromSpec(`${sizeVal}`, spec, "Breadcrumb");
    },
  );
  section.appendChild(matrixGrid);
  container.appendChild(section);
}
