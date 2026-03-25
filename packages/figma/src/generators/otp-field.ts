import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

function createOtpSlot(content: string, active: boolean): FrameNode {
  const slot = figma.createFrame();
  slot.name = "otp-slot";
  slot.layoutMode = "HORIZONTAL";
  slot.primaryAxisSizingMode = "FIXED";
  slot.counterAxisSizingMode = "FIXED";
  slot.resize(40, 48);
  slot.primaryAxisAlignItems = "CENTER";
  slot.counterAxisAlignItems = "CENTER";
  slot.cornerRadius = 2;
  setFill(slot, COLORS.neutral50);

  if (active) {
    slot.strokes = [{ type: "SOLID", color: COLORS.neutral200 }];
    slot.strokeWeight = 1;
  }

  if (content) {
    const text = createTextNode(content, 16, 500, COLORS.neutral950);
    slot.appendChild(text);
  }

  return slot;
}

function createOtpInstance(filled: number): ComponentNode {
  const component = figma.createComponent();
  component.name = `filled=${filled}`;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = 8;
  component.counterAxisAlignItems = "CENTER";
  component.fills = [];

  const digits = ["1", "2", "3", "4", "5", "6"];
  for (let i = 0; i < 6; i++) {
    const content = i < filled ? digits[i] : "";
    const active = i === filled;
    component.appendChild(createOtpSlot(content, active));
  }

  return component;
}

export function generateOtpFieldComponents(container: FrameNode): void {
  const section = createComponentSection("OTP Field");

  for (const filled of [0, 3, 6]) {
    let label = "partial";
    if (filled === 0) {
      label = "empty";
    } else if (filled === 6) {
      label = "filled";
    }
    const row = createVariantRow(label);
    row.appendChild(createOtpInstance(filled));
    section.appendChild(row);
  }

  container.appendChild(section);
}
