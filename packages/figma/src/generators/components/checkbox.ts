import { checkboxRecipe } from "@cocso-ui/recipe/recipes/checkbox.recipe";
import type { FigmaNodeSpec } from "../recipe-resolver";
import {
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
} from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
  setFill,
} from "../shared";

function createCheckboxFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  status: "on" | "off" | "intermediate"
): ComponentNode {
  const boxSize = spec.size ?? 16;
  const radius = spec.radius ?? spec.borderRadius ?? 4;
  const bgColor = spec.bgColor ?? COLORS.white;
  const borderColor = spec.borderColor ?? COLORS.neutral200;

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
  setFill(box, bgColor);
  box.strokes = [createBoundPaint(borderColor)];
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
  const section = createComponentSection("Checkbox");
  const combinations = getAllVariantCombinations(checkboxRecipe);
  const groups = groupVariantsByFirstDimension(checkboxRecipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      let status: "on" | "off" | "intermediate" = "off";
      if (name.includes("status=on")) {
        status = "on";
      } else if (name.includes("status=intermediate")) {
        status = "intermediate";
      }
      const component = createCheckboxFromSpec(name, spec, status);
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}
