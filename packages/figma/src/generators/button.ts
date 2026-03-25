import {
  BUTTON_SIZE_SPECS,
  BUTTON_SIZES,
  BUTTON_VARIANT_SPECS,
  BUTTON_VARIANTS,
  type ButtonSize,
  type ButtonVariant,
} from "./component-registry";
import {
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createButtonInstance(
  size: ButtonSize,
  variant: ButtonVariant,
  label: string
): ComponentNode {
  const spec = BUTTON_SIZE_SPECS[size];
  const colors = BUTTON_VARIANT_SPECS[variant];

  const component = figma.createComponent();
  component.name = `size=${size}, variant=${variant}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(component.width, spec.height);
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisAlignItems = "CENTER";
  component.paddingLeft = spec.paddingInline;
  component.paddingRight = spec.paddingInline;
  component.cornerRadius = spec.borderRadius;

  if (colors.borderColor) {
    setFill(component, colors.bgColor, colors.bgOpacity ?? 1);
    setStroke(component, colors.borderColor);
  } else {
    setFill(component, colors.bgColor);
  }

  const text = createTextNode(label, spec.fontSize, 500, colors.textColor);
  component.appendChild(text);

  return component;
}

export function generateButtonComponents(container: FrameNode): void {
  const section = createComponentSection("Button");

  for (const variant of BUTTON_VARIANTS) {
    const row = createVariantRow(variant);

    for (const size of BUTTON_SIZES) {
      const btn = createButtonInstance(size, variant, "Button");
      row.appendChild(btn);
    }

    section.appendChild(row);
  }

  container.appendChild(section);
}
