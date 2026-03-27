import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "../shared";

function createRadioFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  isSelected: boolean
): ComponentNode {
  const outerSize = spec.size ?? 16;
  const dotSize = spec.dotSize ?? 7;

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
    setFill(circle, COLORS.primary950);

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
    setFill(circle, COLORS.white);
    circle.strokes = [createBoundPaint(COLORS.neutral950)];
    circle.strokeWeight = 2;
  }

  component.appendChild(circle);

  const labelText = createTextNode("Label", 14, 400, COLORS.neutral900);
  component.appendChild(labelText);

  return component;
}

export function generateRadioSection(container: FrameNode): void {
  const section = createComponentSection("RadioGroup");
  const combinations = getAllVariantCombinations(radioGroupRecipe);

  const row = createVariantRow("size");
  for (const combo of combinations) {
    const spec = resolveForFigma(radioGroupRecipe, combo);
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    row.appendChild(
      createRadioFromSpec(`${nameParts}, selected=true`, spec, true)
    );
    row.appendChild(
      createRadioFromSpec(`${nameParts}, selected=false`, spec, false)
    );
  }

  section.appendChild(row);
  container.appendChild(section);
}
