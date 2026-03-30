import { dialogRecipe } from "@cocso-ui/recipe/recipes/dialog.recipe";
import dialogJSON from "../../../../codegen/generated/dialog.figma.json";
import {
  type FigmaJSONData,
  getAllVariantCombinations,
  lookupSpec,
} from "../recipe-utils";
import {
  COLORS,
  createAutoLayoutFrame,
  createBoundPaint,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  LABEL_FONT_SIZE,
  rgbToHex,
  SHADOW_MD,
  setFill,
} from "../shared";

export function generateDialogSection(container: FrameNode): void {
  const json = dialogJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Dialog");
  const combinations = getAllVariantCombinations(dialogRecipe);
  const row = createVariantRow("size");

  for (const combo of combinations) {
    const spec = lookupSpec(json, dialogRecipe, combo);
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
    setFill(component, bgColor, 1, spec._tokenRefs?.bgColor);

    if (spec.strokeColor && spec.strokeWeight) {
      component.strokes = [
        createBoundPaint(spec.strokeColor, 1, spec._tokenRefs?.strokeColor),
      ];
      component.strokeWeight = spec.strokeWeight;
    }

    component.effects = SHADOW_MD;

    component.itemSpacing = 12;

    const header = createAutoLayoutFrame("header");
    header.primaryAxisAlignItems = "SPACE_BETWEEN";
    header.counterAxisAlignItems = "CENTER";

    const title = createTextNode("Dialog Title", 20, 700, COLORS.neutral950);
    header.appendChild(title);

    const closeBtn = createAutoLayoutFrame("close-button");
    closeBtn.primaryAxisAlignItems = "CENTER";
    closeBtn.counterAxisAlignItems = "CENTER";
    closeBtn.resize(24, 24);
    closeBtn.cornerRadius = 6;
    setFill(closeBtn, COLORS.white);
    closeBtn.strokes = [createBoundPaint(COLORS.neutral200)];
    closeBtn.strokeWeight = 1;
    const closeIcon = createIcon(
      ICON_SVGS.close,
      14,
      rgbToHex(COLORS.neutral900)
    );
    closeBtn.appendChild(closeIcon);
    header.appendChild(closeBtn);

    component.appendChild(header);
    header.layoutSizingHorizontal = "FILL";

    const desc = createTextNode(
      "Dialog description goes here.",
      LABEL_FONT_SIZE,
      500,
      COLORS.neutral600
    );
    component.appendChild(desc);

    row.appendChild(component);
  }

  section.appendChild(row);
  container.appendChild(section);
}
