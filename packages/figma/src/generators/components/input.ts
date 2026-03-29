import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import inputJSON from "../../../../codegen/generated/input.figma.json";
import { createWideComponentFromSpec } from "../component-creators";
import {
  type FigmaJSONData,
  getAllVariantCombinations,
  lookupSpec,
} from "../recipe-utils";
import { addStateVariants, createComponentSection } from "../shared";

export function generateInputSection(container: FrameNode): void {
  const json = inputJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Input");
  const combinations = getAllVariantCombinations(inputRecipe);

  // Create base (Default state) nodes
  const variantFrame = figma.createFrame();
  variantFrame.name = "Input variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = lookupSpec(json, inputRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createWideComponentFromSpec(name, spec, "Placeholder");
    variantFrame.appendChild(component);
    baseNodes.push(component);
  }

  // Add state variants (hover, focus) and combine into ComponentSetNode
  const componentSet = addStateVariants(
    baseNodes,
    inputRecipe,
    combinations,
    variantFrame,
    (name, spec) => createWideComponentFromSpec(name, spec, "Placeholder"),
    json
  );
  section.appendChild(componentSet);

  container.appendChild(section);
}
