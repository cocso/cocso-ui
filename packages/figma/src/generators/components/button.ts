import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { createComponentFromSpec } from "../component-creators";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { resolveForFigma } from "../recipe-resolver";
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

function createButtonWithIcon(
  name: string,
  spec: FigmaNodeSpec,
  label: string,
  mode: "prefix" | "suffix" | "svgOnly"
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = spec.height ? "FIXED" : "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "CENTER";
  component.itemSpacing = 4;

  if (spec.height) {
    component.resize(component.width, spec.height);
  }

  if (mode === "svgOnly" && spec.height) {
    component.resize(spec.height, spec.height);
    component.itemSpacing = 0;
  } else if (spec.paddingInline !== undefined) {
    component.paddingLeft = spec.paddingInline;
    component.paddingRight = spec.paddingInline;
  }

  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius;
  }

  const bgColor = spec.bgColor ?? spec.fills;
  if (bgColor) {
    setFill(component, bgColor);
  } else {
    component.fills = [];
  }

  if (spec.strokeColor && spec.strokeWeight) {
    component.strokes = [createBoundPaint(spec.strokeColor)];
    component.strokeWeight = spec.strokeWeight;
  }

  const textColor = spec.fontColor ?? COLORS.neutral900;
  const fontSize = spec.fontSize ?? 14;
  const fontWeight = spec.fontWeight ?? 500;
  const iconSize = Math.round(fontSize * 1.15);
  const hexColor = rgbToHex(textColor);

  if (mode === "svgOnly") {
    const icon = createIcon(ICON_SVGS.arrowRight, iconSize, hexColor);
    component.appendChild(icon);
  } else if (mode === "prefix") {
    const icon = createIcon(ICON_SVGS.arrowLeft, iconSize, hexColor);
    component.appendChild(icon);
    component.appendChild(
      createTextNode(label, fontSize, fontWeight, textColor)
    );
  } else {
    component.appendChild(
      createTextNode(label, fontSize, fontWeight, textColor)
    );
    const icon = createIcon(ICON_SVGS.arrowRight, iconSize, hexColor);
    component.appendChild(icon);
  }

  return component;
}

export function generateButtonSection(container: FrameNode): void {
  const section = createComponentSection("Button");
  const combinations = getAllVariantCombinations(buttonRecipe);
  const groups = groupVariantsByFirstDimension(buttonRecipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = createComponentFromSpec(name, spec, "Button");
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  const prefixRow = createVariantRow("prefix icon");
  const prefixSpec = resolveForFigma(buttonRecipe, {
    variant: "primary",
    size: "medium",
    shape: "square",
  });
  prefixRow.appendChild(
    createButtonWithIcon(
      "prefix, variant=primary",
      prefixSpec,
      "Button",
      "prefix"
    )
  );
  const outlinePrefixSpec = resolveForFigma(buttonRecipe, {
    variant: "outline",
    size: "medium",
    shape: "square",
  });
  prefixRow.appendChild(
    createButtonWithIcon(
      "prefix, variant=outline",
      outlinePrefixSpec,
      "Button",
      "prefix"
    )
  );
  section.appendChild(prefixRow);

  const suffixRow = createVariantRow("suffix icon");
  suffixRow.appendChild(
    createButtonWithIcon(
      "suffix, variant=primary",
      prefixSpec,
      "Button",
      "suffix"
    )
  );
  suffixRow.appendChild(
    createButtonWithIcon(
      "suffix, variant=outline",
      outlinePrefixSpec,
      "Button",
      "suffix"
    )
  );
  section.appendChild(suffixRow);

  const svgOnlyRow = createVariantRow("svgOnly");
  for (const sz of ["large", "medium", "small", "x-small"] as const) {
    const spec = resolveForFigma(buttonRecipe, {
      variant: "primary",
      size: sz,
      shape: "square",
    });
    svgOnlyRow.appendChild(
      createButtonWithIcon(`svgOnly, size=${sz}`, spec, "", "svgOnly")
    );
  }
  const svgOnlyOutline = resolveForFigma(buttonRecipe, {
    variant: "outline",
    size: "medium",
    shape: "square",
  });
  svgOnlyRow.appendChild(
    createButtonWithIcon(
      "svgOnly, variant=outline",
      svgOnlyOutline,
      "",
      "svgOnly"
    )
  );
  section.appendChild(svgOnlyRow);

  const disabledRow = createVariantRow("disabled");
  for (const v of ["primary", "secondary", "outline"] as const) {
    const spec = resolveForFigma(buttonRecipe, {
      variant: v,
      size: "medium",
      shape: "square",
    });
    const comp = createComponentFromSpec(
      `disabled, variant=${v}`,
      spec,
      "Button"
    );
    comp.opacity = 0.4;
    disabledRow.appendChild(comp);
  }
  section.appendChild(disabledRow);

  container.appendChild(section);
}
