import { selectRecipe } from "@cocso-ui/recipe/recipes/select.recipe";
import selectJSON from "../../../../codegen/generated/select.figma.json";
import { createSelectComponentFromSpec } from "../component-creators";
import {
  type FigmaJSONData,
  getAllVariantCombinations,
  lookupSpec,
} from "../recipe-utils";
import { addStateVariants, createComponentSection } from "../shared";

export function generateSelectSection(container: FrameNode): void {
  const json = selectJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Select");
  const combinations = getAllVariantCombinations(selectRecipe);

  // Create base (Default state) nodes
  const variantFrame = figma.createFrame();
  variantFrame.name = "Select variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = lookupSpec(json, selectRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createSelectComponentFromSpec(
      name,
      spec,
      "Select option"
    );
    variantFrame.appendChild(component);
    baseNodes.push(component);
  }

  // Add state variants (hover, focus) and combine into ComponentSetNode
  const componentSet = addStateVariants(
    baseNodes,
    selectRecipe,
    combinations,
    variantFrame,
    (name, spec) => createSelectComponentFromSpec(name, spec, "Select option"),
    json
  );
  section.appendChild(componentSet);

  container.appendChild(section);
}
