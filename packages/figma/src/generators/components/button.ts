import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { createComponentFromSpec } from "../component-creators";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import {
  addStateVariants,
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
    const bgRef = spec._tokenRefs?.bgColor ?? spec._tokenRefs?.fills;
    setFill(component, bgColor, 1, bgRef);
  } else {
    component.fills = [];
  }

  if (spec.strokeColor && spec.strokeWeight) {
    component.strokes = [
      createBoundPaint(spec.strokeColor, 1, spec._tokenRefs?.strokeColor),
    ];
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
      createTextNode(
        label,
        fontSize,
        fontWeight,
        textColor,
        spec._tokenRefs?.fontColor
      )
    );
  } else {
    component.appendChild(
      createTextNode(
        label,
        fontSize,
        fontWeight,
        textColor,
        spec._tokenRefs?.fontColor
      )
    );
    const icon = createIcon(ICON_SVGS.arrowRight, iconSize, hexColor);
    component.appendChild(icon);
  }

  return component;
}

export function generateButtonSection(container: FrameNode): void {
  const section = createComponentSection("Button");
  const combinations = getAllVariantCombinations(buttonRecipe);

  // Create base (Default state) nodes for all variant combinations
  const variantFrame = figma.createFrame();
  variantFrame.name = "Button variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = resolveForFigma(buttonRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createComponentFromSpec(name, spec, "Button");
    variantFrame.appendChild(component);
    baseNodes.push(component);
  }

  // Add state variants (hover, active) and combine into ComponentSetNode
  const componentSet = addStateVariants(
    baseNodes,
    buttonRecipe,
    combinations,
    variantFrame,
    (name, spec) => createComponentFromSpec(name, spec, "Button")
  );
  section.appendChild(componentSet);

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
