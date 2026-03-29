import { inputRecipe } from "@cocso-ui/recipe/recipes/input.recipe";
import { createWideComponentFromSpec } from "../component-creators";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import { addStateVariants, createComponentSection } from "../shared";

export function generateInputSection(container: FrameNode): void {
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
    const spec = resolveForFigma(inputRecipe, combo);
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
    (name, spec) => createWideComponentFromSpec(name, spec, "Placeholder")
  );
  section.appendChild(componentSet);

  container.appendChild(section);
}
