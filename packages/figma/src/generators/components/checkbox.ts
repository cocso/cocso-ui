import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import checkboxJSON from "../../../../codegen/generated/checkbox.figma.json";
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
  createIcon,
  createTextNode,
  ICON_SVGS,
  rgbToHex,
  setFill,
} from "../shared";

function createCheckboxFromSpec(
  name: string,
  spec: FigmaNodeSpec
): ComponentNode {
  const boxSize = spec.size ?? 16;
  const radius = spec.radius ?? spec.borderRadius ?? 4;
  const bgColor = spec.bgColor ?? COLORS.white;
  const borderColor = spec.borderColor ?? COLORS.neutral200;

  // Determine status from the name
  let status: "on" | "off" | "intermediate" = "off";
  if (name.includes("status=on")) {
    status = "on";
  } else if (name.includes("status=intermediate")) {
    status = "intermediate";
  }

  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = 6;
  component.fills = [];

  const box = figma.createFrame();
  box.name = "box";
  box.resize(boxSize, boxSize);
  setFill(box, bgColor, 1, spec._tokenRefs?.bgColor);
  box.strokes = [
    createBoundPaint(borderColor, 1, spec._tokenRefs?.borderColor),
  ];
  box.strokeWeight = 1;
  box.cornerRadius = radius;

  if (status === "on" || status === "intermediate") {
    box.layoutMode = "HORIZONTAL";
    box.primaryAxisSizingMode = "FIXED";
    box.counterAxisSizingMode = "FIXED";
    box.primaryAxisAlignItems = "CENTER";
    box.counterAxisAlignItems = "CENTER";
    box.clipsContent = true;

    const iconSvg = status === "on" ? ICON_SVGS.check : ICON_SVGS.indeterminate;
    const iconSize = Math.round(boxSize * 0.75);
    const icon = createIcon(iconSvg, iconSize, rgbToHex(COLORS.white));
    box.appendChild(icon);
  }

  const labelText = createTextNode("Label", 14, 400, COLORS.neutral900);

  component.appendChild(box);
  component.appendChild(labelText);

  return component;
}

export function generateCheckboxSection(container: FrameNode): void {
  const json = checkboxJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Checkbox");
  const combinations = getAllVariantCombinations(checkboxRecipe);

  // Create base (Default state) nodes
  const variantFrame = figma.createFrame();
  variantFrame.name = "Checkbox variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = lookupSpec(json, checkboxRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createCheckboxFromSpec(name, spec);
    variantFrame.appendChild(component);
    baseNodes.push(component);
  }

  // Add state variants (hover) and combine into ComponentSetNode
  const componentSet = addStateVariants(
    baseNodes,
    checkboxRecipe,
    combinations,
    variantFrame,
    (name, spec) => createCheckboxFromSpec(name, spec),
    json
  );
  section.appendChild(componentSet);

  container.appendChild(section);
}
