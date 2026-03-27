import type { FigmaNodeSpec } from "./recipe-resolver";
import {
  COLORS,
  createBoundPaint,
  createIcon,
  createTextNode,
  ICON_SVGS,
  rgbToHex,
  setFill,
} from "./shared";

export function createComponentFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  label: string
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = spec.height ? "FIXED" : "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "CENTER";

  if (spec.height) {
    component.resize(component.width, spec.height);
  }

  if (spec.paddingInline !== undefined) {
    component.paddingLeft = spec.paddingInline;
    component.paddingRight = spec.paddingInline;
  }
  if (spec.paddingLeft !== undefined) {
    component.paddingLeft = spec.paddingLeft;
  }
  if (spec.paddingRight !== undefined) {
    component.paddingRight = spec.paddingRight;
  }
  if (spec.paddingTop !== undefined) {
    component.paddingTop = spec.paddingTop;
  }
  if (spec.paddingBottom !== undefined) {
    component.paddingBottom = spec.paddingBottom;
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
  const text = createTextNode(label, fontSize, fontWeight, textColor);
  component.appendChild(text);

  return component;
}

export function createWideComponentFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  label: string,
  width = 200
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "MIN";

  const height = spec.height ?? 36;
  component.resize(width, height);

  if (spec.paddingLeft !== undefined) {
    component.paddingLeft = spec.paddingLeft;
  } else if (spec.paddingInline !== undefined) {
    component.paddingLeft = spec.paddingInline;
  }
  if (spec.paddingRight !== undefined) {
    component.paddingRight = spec.paddingRight;
  } else if (spec.paddingInline !== undefined) {
    component.paddingRight = spec.paddingInline;
  }

  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius;
  }

  setFill(component, COLORS.white);

  component.strokes = [createBoundPaint(COLORS.neutral200)];
  component.strokeWeight = 1;

  const fontSize = spec.fontSize ?? 14;
  const text = createTextNode(label, fontSize, 400, COLORS.neutral400);
  component.appendChild(text);

  return component;
}

export function createSelectComponentFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  label: string,
  width = 200
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "MIN";

  const height = spec.height ?? 36;
  component.resize(width, height);

  if (spec.paddingLeft !== undefined) {
    component.paddingLeft = spec.paddingLeft;
  } else if (spec.paddingInline !== undefined) {
    component.paddingLeft = spec.paddingInline;
  }

  component.paddingRight = spec.iconRight ?? 12;

  const radius = spec.cornerRadius ?? spec.borderRadius;
  if (radius) {
    component.cornerRadius = radius;
  }

  setFill(component, COLORS.white);
  component.strokes = [createBoundPaint(COLORS.neutral200)];
  component.strokeWeight = 1;

  const fontSize = spec.fontSize ?? 14;
  const text = createTextNode(label, fontSize, 400, COLORS.neutral400);
  text.layoutGrow = 1;
  component.appendChild(text);

  const iconSize = Math.min(16, Math.round(height * 0.44));
  const icon = createIcon(
    ICON_SVGS.selector,
    iconSize,
    rgbToHex(COLORS.neutral400)
  );
  component.appendChild(icon);

  return component;
}
