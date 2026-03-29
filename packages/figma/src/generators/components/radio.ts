import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import radioJSON from "../../../../codegen/generated/radio.figma.json";
import type { FigmaNodeSpec } from "../recipe-resolver";
import {
  type FigmaJSONData,
  getAllVariantCombinations,
  lookupSpec,
} from "../recipe-utils";
import {
  addStateVariants,
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  setFill,
} from "../shared";

function createRadioFromSpec(name: string, spec: FigmaNodeSpec): ComponentNode {
  const outerSize = spec.size ?? 16;
  const dotSize = spec.dotSize ?? 7;
  const bgColor = spec.bgColor ?? COLORS.white;
  const borderColor = spec.borderColor ?? COLORS.neutral200;
  const isSelected = name.includes("selected=true");

  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 8;
  component.fills = [];

  const circle = figma.createFrame();
  circle.name = "radio";
  circle.resize(outerSize, outerSize);
  circle.cornerRadius = outerSize / 2;

  if (isSelected) {
    setFill(circle, bgColor, 1, spec._tokenRefs?.bgColor);

    circle.layoutMode = "HORIZONTAL";
    circle.primaryAxisSizingMode = "FIXED";
    circle.counterAxisSizingMode = "FIXED";
    circle.primaryAxisAlignItems = "CENTER";
    circle.counterAxisAlignItems = "CENTER";

    const dot = figma.createEllipse();
    dot.name = "dot";
    dot.resize(dotSize, dotSize);
    dot.fills = [createBoundPaint(COLORS.white)];
    circle.appendChild(dot);
  } else {
    setFill(circle, bgColor, 1, spec._tokenRefs?.bgColor);
    circle.strokes = [
      createBoundPaint(borderColor, 1, spec._tokenRefs?.borderColor),
    ];
    circle.strokeWeight = 2;
  }

  component.appendChild(circle);

  const labelText = createTextNode("Label", 14, 400, COLORS.neutral900);
  component.appendChild(labelText);

  return component;
}

export function generateRadioSection(container: FrameNode): void {
  const json = radioJSON as unknown as FigmaJSONData;
  const section = createComponentSection("RadioGroup");
  const combinations = getAllVariantCombinations(radioGroupRecipe);

  const variantFrame = figma.createFrame();
  variantFrame.name = "Radio variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = lookupSpec(json, radioGroupRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createRadioFromSpec(name, spec);
    variantFrame.appendChild(component);
    baseNodes.push(component);
  }

  const componentSet = addStateVariants(
    baseNodes,
    radioGroupRecipe,
    combinations,
    variantFrame,
    (name, spec) => createRadioFromSpec(name, spec),
    json
  );
  section.appendChild(componentSet);

  container.appendChild(section);
}
