import { dialogRecipe } from "@cocso-ui/recipe/recipes/dialog.recipe";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  createVariantRow,
  SHADOW_MD,
  setFill,
} from "../shared";

export function generateDialogSection(container: FrameNode): void {
  const section = createComponentSection("Dialog");
  const combinations = getAllVariantCombinations(dialogRecipe);
  const row = createVariantRow("size");

  for (const combo of combinations) {
    const spec = resolveForFigma(dialogRecipe, combo);
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");

    const component = figma.createComponent();
    component.name = nameParts;
    const w = spec.width ?? 520;
    const h = spec.height ?? 260;
    component.resize(w, h);
    component.layoutMode = "VERTICAL";
    component.primaryAxisSizingMode = "FIXED";
    component.counterAxisSizingMode = "FIXED";
    component.primaryAxisAlignItems = "MIN";
    component.counterAxisAlignItems = "MIN";

    const radius = spec.cornerRadius ?? spec.borderRadius;
    if (radius) {
      component.cornerRadius = radius;
    }

    if (spec.paddingTop !== undefined) {
      component.paddingTop = spec.paddingTop;
    }
    if (spec.paddingBottom !== undefined) {
      component.paddingBottom = spec.paddingBottom;
    }
    if (spec.paddingLeft !== undefined) {
      component.paddingLeft = spec.paddingLeft;
    }
    if (spec.paddingRight !== undefined) {
      component.paddingRight = spec.paddingRight;
    }

    const bgColor = spec.bgColor ?? COLORS.white;
    setFill(component, bgColor);

    if (spec.strokeColor && spec.strokeWeight) {
      component.strokes = [createBoundPaint(spec.strokeColor)];
      component.strokeWeight = spec.strokeWeight;
    }

    component.effects = SHADOW_MD;

    component.itemSpacing = 12;

    const title = createTextNode("Dialog Title", 20, 700, COLORS.neutral950);
    const desc = createTextNode(
      "Dialog description goes here.",
      14,
      500,
      COLORS.neutral600
    );
    component.appendChild(title);
    component.appendChild(desc);

    row.appendChild(component);
  }

  section.appendChild(row);
  container.appendChild(section);
}
