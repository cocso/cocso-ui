import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

const TOAST_COLORS: Record<ToastVariant, { bg: RGB; border: RGB; text: RGB }> =
  {
    default: {
      bg: COLORS.white,
      border: COLORS.neutral100,
      text: COLORS.neutral950,
    },
    success: {
      bg: COLORS.success50,
      border: COLORS.success500,
      text: COLORS.success600,
    },
    error: {
      bg: COLORS.danger50,
      border: COLORS.danger500,
      text: COLORS.danger600,
    },
    warning: {
      bg: COLORS.warning50,
      border: COLORS.warning500,
      text: COLORS.warning600,
    },
    info: { bg: COLORS.info50, border: COLORS.info500, text: COLORS.info600 },
  };

function createToastInstance(variant: ToastVariant): ComponentNode {
  const colors = TOAST_COLORS[variant];

  const component = figma.createComponent();
  component.name = `variant=${variant}`;
  component.resize(356, 40);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "AUTO";
  component.paddingTop = 12;
  component.paddingBottom = 12;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  component.cornerRadius = 8;
  component.counterAxisAlignItems = "CENTER";
  setFill(component, colors.bg);
  setStroke(component, colors.border);

  const text = createTextNode("Toast message content", 14, 400, colors.text);
  component.appendChild(text);

  return component;
}

export function generateToastComponents(container: FrameNode): void {
  const section = createComponentSection("Toast");

  for (const variant of [
    "default",
    "success",
    "error",
    "warning",
    "info",
  ] as ToastVariant[]) {
    const row = createVariantRow(variant);
    row.appendChild(createToastInstance(variant));
    section.appendChild(row);
  }

  container.appendChild(section);
}
