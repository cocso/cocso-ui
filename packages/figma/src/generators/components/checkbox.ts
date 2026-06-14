import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import checkboxJSON from "../../../../../ecosystem/codegen/generated/checkbox.figma.json";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantMatrix,
  ICON_SVGS,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
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
    const CHECKMARK_SCALE = 0.75;
    const iconSize = Math.round(boxSize * CHECKMARK_SCALE);
    const icon = createIcon(iconSvg, iconSize, rgbToHex(COLORS.white));
    box.appendChild(icon);
  }

  const labelText = createTextNode(
    "Label",
    LABEL_FONT_SIZE,
    LABEL_FONT_WEIGHT,
    COLORS.neutral900
  );

  component.appendChild(box);
  component.appendChild(labelText);

  return component;
}

export function generateCheckboxSection(container: FrameNode): void {
  const json = checkboxJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Checkbox");

  const sizes = Object.keys(checkboxRecipe.variants.size);
  const statuses = Object.keys(checkboxRecipe.variants.status);

  const matrixGrid = createVariantMatrix(
    "Checkbox variants",
    { name: "size", values: sizes },
    { name: "status", values: statuses },
    (sizeVal, statusVal) => {
      const spec = lookupSpec(json, checkboxRecipe, {
        size: sizeVal,
        status: statusVal,
      });
      return createCheckboxFromSpec(`${sizeVal}-${statusVal}`, spec);
    }
  );
  section.appendChild(matrixGrid);

  container.appendChild(section);
}
