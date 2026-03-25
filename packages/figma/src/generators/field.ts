import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
  setStroke,
} from "./shared";

function createFieldInstance(
  state: "default" | "error" | "optional"
): ComponentNode {
  const component = figma.createComponent();
  component.name = `state=${state}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(280, 1);
  component.itemSpacing = 8;
  component.fills = [];

  const labelRow = figma.createFrame();
  labelRow.name = "label-row";
  labelRow.layoutMode = "HORIZONTAL";
  labelRow.primaryAxisSizingMode = "AUTO";
  labelRow.counterAxisSizingMode = "AUTO";
  labelRow.itemSpacing = 6;
  labelRow.fills = [];

  const label = createTextNode("Label", 14, 500, COLORS.neutral900);
  labelRow.appendChild(label);

  if (state === "optional") {
    const optional = createTextNode(
      "(\uC120\uD0DD)",
      12,
      400,
      COLORS.neutral400
    );
    labelRow.appendChild(optional);
  }

  component.appendChild(labelRow);

  const input = figma.createFrame();
  input.name = "input-placeholder";
  input.layoutMode = "HORIZONTAL";
  input.primaryAxisSizingMode = "FIXED";
  input.counterAxisSizingMode = "FIXED";
  input.resize(280, 36);
  input.paddingLeft = 12;
  input.paddingRight = 12;
  input.counterAxisAlignItems = "CENTER";
  input.cornerRadius = 8;
  setFill(input, COLORS.white);
  setStroke(input, state === "error" ? COLORS.danger500 : COLORS.neutral100);

  const placeholder = createTextNode("Placeholder", 14, 400, COLORS.neutral400);
  input.appendChild(placeholder);
  component.appendChild(input);

  if (state === "error") {
    const errorText = createTextNode(
      "Error message",
      12,
      400,
      COLORS.danger500
    );
    component.appendChild(errorText);
  } else {
    const desc = createTextNode("Helper text", 12, 400, COLORS.neutral500);
    component.appendChild(desc);
  }

  return component;
}

export function generateFieldComponents(container: FrameNode): void {
  const section = createComponentSection("Field");

  for (const state of ["default", "error", "optional"] as const) {
    const row = createVariantRow(state);
    row.appendChild(createFieldInstance(state));
    section.appendChild(row);
  }

  container.appendChild(section);
}
