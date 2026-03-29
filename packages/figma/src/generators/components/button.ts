import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import buttonJSON from "../../../../codegen/generated/button.figma.json";
import { createComponentFromSpec } from "../component-creators";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantMatrix,
  createVariantMatrixPerSlice,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
  setFill,
} from "../shared";

type IconMode = "text" | "prefix" | "suffix" | "prefixSuffix" | "svgOnly";

function appendButtonContent(
  component: ComponentNode,
  spec: FigmaNodeSpec,
  label: string,
  mode: IconMode
): void {
  const textColor = spec.fontColor ?? COLORS.neutral900;
  const fontSize = spec.fontSize ?? 14;
  const fontWeight = spec.fontWeight ?? 500;
  const iconSize = Math.round(fontSize * 1.15);
  const hexColor = rgbToHex(textColor);

  const makeText = () =>
    createTextNode(
      label,
      fontSize,
      fontWeight,
      textColor,
      spec._tokenRefs?.fontColor
    );
  const iconLeft = () => createIcon(ICON_SVGS.arrowLeft, iconSize, hexColor);
  const iconRight = () => createIcon(ICON_SVGS.arrowRight, iconSize, hexColor);

  switch (mode) {
    case "svgOnly":
      component.appendChild(iconRight());
      break;
    case "prefix":
      component.appendChild(iconLeft());
      component.appendChild(makeText());
      break;
    case "suffix":
      component.appendChild(makeText());
      component.appendChild(iconRight());
      break;
    case "prefixSuffix":
      component.appendChild(iconLeft());
      component.appendChild(makeText());
      component.appendChild(iconRight());
      break;
    default:
      component.appendChild(makeText());
  }
}

function createButtonWithIcon(
  name: string,
  spec: FigmaNodeSpec,
  label: string,
  mode: IconMode
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
    setFill(
      component,
      bgColor,
      1,
      spec._tokenRefs?.bgColor ?? spec._tokenRefs?.fills
    );
  } else {
    component.fills = [];
  }

  if (spec.strokeColor && spec.strokeWeight) {
    component.strokes = [
      createBoundPaint(spec.strokeColor, 1, spec._tokenRefs?.strokeColor),
    ];
    component.strokeWeight = spec.strokeWeight;
  }

  appendButtonContent(component, spec, label, mode);

  return component;
}

export function generateButtonSection(container: FrameNode): void {
  const json = buttonJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Button");

  const variants = Object.keys(buttonRecipe.variants.variant);
  const sizes = Object.keys(buttonRecipe.variants.size);
  const shapes = Object.keys(buttonRecipe.variants.shape);
  const iconModes: IconMode[] = [
    "text",
    "prefix",
    "suffix",
    "prefixSuffix",
    "svgOnly",
  ];

  // Main variant matrix — one grid per shape
  const matrixGrid = createVariantMatrixPerSlice(
    "Button variants",
    { name: "size", values: sizes },
    { name: "variant", values: variants },
    { name: "shape", values: shapes },
    (sizeVal, variantVal, shapeVal) => {
      const spec = lookupSpec(json, buttonRecipe, {
        variant: variantVal,
        size: sizeVal,
        shape: shapeVal,
      });
      return createComponentFromSpec(
        `${variantVal}-${sizeVal}-${shapeVal}`,
        spec,
        "Button"
      );
    }
  );
  section.appendChild(matrixGrid);

  // Icon type matrix — rows=iconMode, columns=variant (medium square only)
  const iconMatrix = createVariantMatrix(
    "Button icon types",
    { name: "type", values: iconModes },
    { name: "variant", values: variants },
    (iconMode, variantVal) => {
      const spec = lookupSpec(json, buttonRecipe, {
        variant: variantVal,
        size: "medium",
        shape: "square",
      });
      return createButtonWithIcon(
        `${iconMode}-${variantVal}`,
        spec,
        "Button",
        iconMode as IconMode
      );
    }
  );
  section.appendChild(iconMatrix);

  // Disabled row
  const disabledRow = createVariantRow("disabled");
  for (const v of variants) {
    const spec = lookupSpec(json, buttonRecipe, {
      variant: v,
      size: "medium",
      shape: "square",
    });
    const comp = createComponentFromSpec(`disabled-${v}`, spec, "Button");
    comp.opacity = 0.4;
    disabledRow.appendChild(comp);
  }
  section.appendChild(disabledRow);

  container.appendChild(section);
}
