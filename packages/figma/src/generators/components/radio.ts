import { radioGroupRecipe } from "@cocso-ui/recipe/recipes/radio-group.recipe";
import radioJSON from "../../../../../ecosystem/codegen/generated/radio.figma.json";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  createVariantMatrix,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
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

  const labelText = createTextNode(
    "Label",
    LABEL_FONT_SIZE,
    LABEL_FONT_WEIGHT,
    COLORS.neutral900
  );
  component.appendChild(labelText);

  return component;
}

export function generateRadioSection(container: FrameNode): void {
  const json = radioJSON as unknown as FigmaJSONData;
  const section = createComponentSection("RadioGroup");

  const sizes = Object.keys(radioGroupRecipe.variants.size);
  const selectedValues = Object.keys(radioGroupRecipe.variants.selected);

  const matrixGrid = createVariantMatrix(
    "Radio variants",
    { name: "size", values: sizes },
    { name: "selected", values: selectedValues },
    (sizeVal, selectedVal) => {
      const spec = lookupSpec(json, radioGroupRecipe, {
        size: sizeVal,
        selected: selectedVal,
      });
      return createRadioFromSpec(`${sizeVal}-selected=${selectedVal}`, spec);
    }
  );
  section.appendChild(matrixGrid);

  container.appendChild(section);
}
