import {
  COLORS,
  createAutoLayoutFrame,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantMatrix,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
  SHADOW_SM,
  setFill,
  setStroke,
} from "./shared";

// ─── Field ────────────────────────────────────────────────────────────────────

function createInputPlaceholder(): FrameNode {
  const frame = figma.createFrame();
  frame.name = "input";
  frame.resize(200, 36);
  frame.layoutMode = "HORIZONTAL";
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.counterAxisAlignItems = "CENTER";
  frame.paddingLeft = 12;
  frame.paddingRight = 12;
  frame.cornerRadius = 8;
  setFill(frame, COLORS.white);
  setStroke(frame, COLORS.neutral100, 1);

  const placeholder = createTextNode("Placeholder", 14, 400, COLORS.neutral400);
  frame.appendChild(placeholder);

  return frame;
}

function generateFieldSection(container: FrameNode): void {
  const section = createComponentSection("Field");

  // Default variant
  const defaultRow = createVariantRow("default");
  const defaultComponent = figma.createComponent();
  defaultComponent.name = "variant=default";
  defaultComponent.layoutMode = "VERTICAL";
  defaultComponent.primaryAxisSizingMode = "AUTO";
  defaultComponent.counterAxisSizingMode = "AUTO";
  defaultComponent.itemSpacing = 8;
  defaultComponent.fills = [];

  const defLabel = createTextNode("Label", 14, 500, COLORS.neutral900);
  const defInput = createInputPlaceholder();
  const defDescription = createTextNode(
    "Description",
    12,
    400,
    COLORS.neutral500
  );
  defaultComponent.appendChild(defLabel);
  defaultComponent.appendChild(defInput);
  defaultComponent.appendChild(defDescription);

  defaultRow.appendChild(defaultComponent);
  section.appendChild(defaultRow);

  // Error variant
  const errorRow = createVariantRow("error");
  const errorComponent = figma.createComponent();
  errorComponent.name = "variant=error";
  errorComponent.layoutMode = "VERTICAL";
  errorComponent.primaryAxisSizingMode = "AUTO";
  errorComponent.counterAxisSizingMode = "AUTO";
  errorComponent.itemSpacing = 8;
  errorComponent.fills = [];

  const errLabel = createTextNode("Label", 14, 500, COLORS.neutral900);
  const errInput = createInputPlaceholder();
  const errMessage = createTextNode("Error message", 12, 400, COLORS.danger500);
  errorComponent.appendChild(errLabel);
  errorComponent.appendChild(errInput);
  errorComponent.appendChild(errMessage);

  errorRow.appendChild(errorComponent);
  section.appendChild(errorRow);

  // Optional variant
  const optionalRow = createVariantRow("optional");
  const optionalComponent = figma.createComponent();
  optionalComponent.name = "variant=optional";
  optionalComponent.layoutMode = "VERTICAL";
  optionalComponent.primaryAxisSizingMode = "AUTO";
  optionalComponent.counterAxisSizingMode = "AUTO";
  optionalComponent.itemSpacing = 8;
  optionalComponent.fills = [];

  // Label row with optional suffix
  const labelRow = createAutoLayoutFrame("label-row", "HORIZONTAL");
  labelRow.itemSpacing = 6;
  labelRow.counterAxisAlignItems = "CENTER";
  const optLabel = createTextNode("Label", 14, 500, COLORS.neutral900);
  const optSuffix = createTextNode("(Optional)", 12, 400, COLORS.neutral400);
  labelRow.appendChild(optLabel);
  labelRow.appendChild(optSuffix);

  const optInput = createInputPlaceholder();
  const optDescription = createTextNode(
    "Description",
    12,
    400,
    COLORS.neutral500
  );
  optionalComponent.appendChild(labelRow);
  optionalComponent.appendChild(optInput);
  optionalComponent.appendChild(optDescription);

  optionalRow.appendChild(optionalComponent);
  section.appendChild(optionalRow);

  container.appendChild(section);
}

// ─── Accordion ───────────────────────────────────────────────────────────────

function createAccordionTrigger(iconSvg: string): FrameNode {
  const trigger = figma.createFrame();
  trigger.name = "trigger";
  trigger.resize(300, 48);
  trigger.layoutMode = "HORIZONTAL";
  trigger.primaryAxisSizingMode = "FIXED";
  trigger.counterAxisSizingMode = "FIXED";
  trigger.counterAxisAlignItems = "CENTER";
  trigger.primaryAxisAlignItems = "SPACE_BETWEEN";
  trigger.paddingLeft = 16;
  trigger.paddingRight = 16;
  setFill(trigger, COLORS.white);
  trigger.strokes = [];

  const text = createTextNode("Accordion Item", 14, 500, COLORS.neutral900);
  text.layoutGrow = 1;
  const icon = createIcon(iconSvg, 24, rgbToHex(COLORS.neutral900));

  trigger.appendChild(text);
  trigger.appendChild(icon);

  return trigger;
}

function generateAccordionSection(container: FrameNode): void {
  const section = createComponentSection("Accordion");

  // Closed variant
  const closedRow = createVariantRow("closed");
  const closedComponent = figma.createComponent();
  closedComponent.name = "variant=closed";
  closedComponent.layoutMode = "VERTICAL";
  closedComponent.primaryAxisSizingMode = "AUTO";
  closedComponent.counterAxisSizingMode = "AUTO";
  closedComponent.fills = [];

  closedComponent.appendChild(createAccordionTrigger(ICON_SVGS.chevronDown));
  closedRow.appendChild(closedComponent);
  section.appendChild(closedRow);

  // Open variant
  const openRow = createVariantRow("open");
  const openComponent = figma.createComponent();
  openComponent.name = "variant=open";
  openComponent.layoutMode = "VERTICAL";
  openComponent.primaryAxisSizingMode = "AUTO";
  openComponent.counterAxisSizingMode = "AUTO";
  openComponent.fills = [];

  openComponent.appendChild(createAccordionTrigger(ICON_SVGS.chevronUp));

  const contentPanel = figma.createFrame();
  contentPanel.name = "content";
  contentPanel.resize(300, 60);
  contentPanel.layoutMode = "HORIZONTAL";
  contentPanel.primaryAxisSizingMode = "FIXED";
  contentPanel.counterAxisSizingMode = "FIXED";
  contentPanel.counterAxisAlignItems = "CENTER";
  contentPanel.paddingTop = 16;
  contentPanel.paddingBottom = 16;
  contentPanel.paddingLeft = 16;
  contentPanel.paddingRight = 16;
  setFill(contentPanel, COLORS.neutral50);

  const contentText = createTextNode("Content", 14, 400, COLORS.neutral600);
  contentPanel.appendChild(contentText);

  openComponent.appendChild(contentPanel);
  openRow.appendChild(openComponent);
  section.appendChild(openRow);

  container.appendChild(section);
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function createTooltipBody(): ComponentNode {
  const comp = figma.createComponent();
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisSizingMode = "AUTO";
  comp.counterAxisSizingMode = "AUTO";
  comp.counterAxisAlignItems = "CENTER";
  comp.paddingTop = 4;
  comp.paddingBottom = 4;
  comp.paddingLeft = 8;
  comp.paddingRight = 8;
  comp.cornerRadius = 4;
  setFill(comp, COLORS.neutral900);

  const text = createTextNode("Tooltip text", 12, 400, COLORS.white);
  comp.appendChild(text);
  return comp;
}

function createTooltipArrow(
  placement: "top" | "right" | "bottom" | "left"
): FrameNode {
  const arrow = figma.createFrame();
  arrow.name = "arrow";
  arrow.resize(6, 6);
  arrow.rotation = 45;
  setFill(arrow, COLORS.neutral900);
  arrow.strokes = [];

  // Wrap in a container to position the arrow correctly
  const wrapper = createAutoLayoutFrame("arrow-wrapper");
  wrapper.primaryAxisAlignItems = "CENTER";
  wrapper.counterAxisAlignItems = "CENTER";

  if (placement === "top" || placement === "bottom") {
    wrapper.layoutMode = "HORIZONTAL";
    wrapper.primaryAxisAlignItems = "CENTER";
  } else {
    wrapper.layoutMode = "VERTICAL";
    wrapper.primaryAxisAlignItems = "CENTER";
  }

  wrapper.appendChild(arrow);
  return wrapper;
}

function createTooltipWithPlacement(
  placement: "top" | "right" | "bottom" | "left",
  withArrow: boolean
): ComponentNode {
  const comp = figma.createComponent();
  comp.name = `arrow=${withArrow ? "true" : "false"}, placement=${placement}`;

  // For top/bottom: stack vertically; for left/right: stack horizontally
  if (placement === "top" || placement === "bottom") {
    comp.layoutMode = "VERTICAL";
  } else {
    comp.layoutMode = "HORIZONTAL";
  }
  comp.primaryAxisSizingMode = "AUTO";
  comp.counterAxisSizingMode = "AUTO";
  comp.counterAxisAlignItems = "CENTER";
  comp.itemSpacing = 0;
  comp.fills = [];

  const body = createTooltipBody();

  if (withArrow) {
    const arrow = createTooltipArrow(placement);

    // Arrow on the opposite side of the placement direction:
    // top → arrow on bottom, bottom → arrow on top,
    // left → arrow on right, right → arrow on left
    if (placement === "top" || placement === "left") {
      comp.appendChild(body);
      comp.appendChild(arrow);
    } else {
      comp.appendChild(arrow);
      comp.appendChild(body);
    }
  } else {
    comp.appendChild(body);
  }

  return comp;
}

function generateTooltipSection(container: FrameNode): void {
  const section = createComponentSection("Tooltip");

  const matrix = createVariantMatrix(
    "Tooltip placements",
    { name: "arrow", values: ["with arrow", "no arrow"] },
    { name: "placement", values: ["top", "right", "bottom", "left"] },
    (rowValue, colValue) => {
      const withArrow = rowValue === "with arrow";
      const placement = colValue as "top" | "right" | "bottom" | "left";
      return createTooltipWithPlacement(placement, withArrow);
    }
  );

  section.appendChild(matrix);
  container.appendChild(section);
}

// ─── Popover ─────────────────────────────────────────────────────────────────

function createPopoverBody(): ComponentNode {
  const comp = figma.createComponent();
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisSizingMode = "AUTO";
  comp.counterAxisSizingMode = "AUTO";
  comp.counterAxisAlignItems = "CENTER";
  comp.paddingTop = 6;
  comp.paddingBottom = 6;
  comp.paddingLeft = 8;
  comp.paddingRight = 8;
  comp.cornerRadius = 6;
  comp.effects = SHADOW_SM;
  setFill(comp, COLORS.white);
  setStroke(comp, COLORS.neutral100, 1);

  const text = createTextNode("Popover content", 14, 400, COLORS.neutral900);
  comp.appendChild(text);
  return comp;
}

function createPopoverArrow(
  placement: "top" | "right" | "bottom" | "left"
): FrameNode {
  const arrow = figma.createFrame();
  arrow.name = "arrow";
  arrow.resize(8, 8);
  arrow.rotation = 45;
  setFill(arrow, COLORS.white);
  setStroke(arrow, COLORS.neutral100, 1);

  // Wrap in a container to position the arrow correctly
  const wrapper = createAutoLayoutFrame("arrow-wrapper");
  wrapper.primaryAxisAlignItems = "CENTER";
  wrapper.counterAxisAlignItems = "CENTER";

  if (placement === "top" || placement === "bottom") {
    wrapper.layoutMode = "HORIZONTAL";
    wrapper.primaryAxisAlignItems = "CENTER";
  } else {
    wrapper.layoutMode = "VERTICAL";
    wrapper.primaryAxisAlignItems = "CENTER";
  }

  wrapper.appendChild(arrow);
  return wrapper;
}

function createPopoverWithPlacement(
  placement: "top" | "right" | "bottom" | "left",
  withArrow: boolean
): ComponentNode {
  const comp = figma.createComponent();
  comp.name = `arrow=${withArrow ? "true" : "false"}, placement=${placement}`;

  // For top/bottom: stack vertically; for left/right: stack horizontally
  if (placement === "top" || placement === "bottom") {
    comp.layoutMode = "VERTICAL";
  } else {
    comp.layoutMode = "HORIZONTAL";
  }
  comp.primaryAxisSizingMode = "AUTO";
  comp.counterAxisSizingMode = "AUTO";
  comp.counterAxisAlignItems = "CENTER";
  comp.itemSpacing = 0;
  comp.fills = [];

  const body = createPopoverBody();

  if (withArrow) {
    const arrow = createPopoverArrow(placement);

    // Arrow on the opposite side of the placement direction:
    // top → arrow on bottom, bottom → arrow on top,
    // left → arrow on right, right → arrow on left
    if (placement === "top" || placement === "left") {
      comp.appendChild(body);
      comp.appendChild(arrow);
    } else {
      comp.appendChild(arrow);
      comp.appendChild(body);
    }
  } else {
    comp.appendChild(body);
  }

  return comp;
}

function generatePopoverSection(container: FrameNode): void {
  const section = createComponentSection("Popover");

  const matrix = createVariantMatrix(
    "Popover placements",
    { name: "arrow", values: ["with arrow", "no arrow"] },
    { name: "placement", values: ["top", "right", "bottom", "left"] },
    (rowValue, colValue) => {
      const withArrow = rowValue === "with arrow";
      const placement = colValue as "top" | "right" | "bottom" | "left";
      return createPopoverWithPlacement(placement, withArrow);
    }
  );

  section.appendChild(matrix);
  container.appendChild(section);
}

// ─── Dropdown ────────────────────────────────────────────────────────────────

function createDropdownItem(
  label: string,
  options?: {
    hover?: boolean;
    disabled?: boolean;
    iconSvg?: string;
  }
): FrameNode {
  const item = figma.createFrame();
  item.name = "item";
  item.layoutMode = "HORIZONTAL";
  item.primaryAxisSizingMode = "AUTO";
  item.counterAxisSizingMode = "AUTO";
  item.counterAxisAlignItems = "CENTER";
  item.paddingTop = 6;
  item.paddingBottom = 6;
  item.paddingLeft = 8;
  item.paddingRight = 8;
  item.cornerRadius = 6;
  item.itemSpacing = 8;

  if (options?.hover) {
    setFill(item, COLORS.neutral50);
  } else {
    item.fills = [];
  }

  if (options?.iconSvg) {
    const iconColor = options?.disabled ? COLORS.neutral400 : COLORS.neutral900;
    const icon = createIcon(options.iconSvg, 16, rgbToHex(iconColor));
    item.appendChild(icon);
  }

  const textColor = options?.disabled ? COLORS.neutral400 : COLORS.neutral900;
  const text = createTextNode(label, 14, 400, textColor);
  item.appendChild(text);

  return item;
}

function createDropdownSeparator(): FrameNode {
  const sep = figma.createFrame();
  sep.name = "separator";
  sep.resize(sep.width, 1);
  sep.layoutAlign = "STRETCH";
  setFill(sep, COLORS.neutral100);
  return sep;
}

function generateDropdownSection(container: FrameNode): void {
  const section = createComponentSection("Dropdown");

  // Content variant — full dropdown panel with 4 items:
  // normal item, item with icon prefix, separator line, disabled item
  const contentRow = createVariantRow("content");
  const contentComponent = figma.createComponent();
  contentComponent.name = "variant=content";
  contentComponent.layoutMode = "VERTICAL";
  contentComponent.primaryAxisSizingMode = "AUTO";
  contentComponent.counterAxisSizingMode = "FIXED";
  contentComponent.resize(180, contentComponent.height);
  contentComponent.itemSpacing = 0;
  contentComponent.paddingTop = 6;
  contentComponent.paddingBottom = 6;
  contentComponent.cornerRadius = 6;
  contentComponent.effects = SHADOW_SM;
  setFill(contentComponent, COLORS.white);
  setStroke(contentComponent, COLORS.neutral100, 1);

  contentComponent.appendChild(createDropdownItem("Menu item"));
  contentComponent.appendChild(
    createDropdownItem("With icon", { iconSvg: ICON_SVGS.pencil })
  );
  contentComponent.appendChild(createDropdownSeparator());
  contentComponent.appendChild(
    createDropdownItem("Disabled", { disabled: true })
  );

  contentRow.appendChild(contentComponent);
  section.appendChild(contentRow);

  // Item states — normal + hover + disabled side by side
  const statesRow = createVariantRow("item states");

  const normalItem = figma.createComponent();
  normalItem.name = "variant=item-normal";
  normalItem.layoutMode = "HORIZONTAL";
  normalItem.primaryAxisSizingMode = "AUTO";
  normalItem.counterAxisSizingMode = "AUTO";
  normalItem.counterAxisAlignItems = "CENTER";
  normalItem.paddingTop = 6;
  normalItem.paddingBottom = 6;
  normalItem.paddingLeft = 8;
  normalItem.paddingRight = 8;
  normalItem.cornerRadius = 6;
  normalItem.fills = [];
  normalItem.appendChild(createTextNode("Normal", 14, 400, COLORS.neutral900));
  statesRow.appendChild(normalItem);

  const hoverItem = figma.createComponent();
  hoverItem.name = "variant=item-hover";
  hoverItem.layoutMode = "HORIZONTAL";
  hoverItem.primaryAxisSizingMode = "AUTO";
  hoverItem.counterAxisSizingMode = "AUTO";
  hoverItem.counterAxisAlignItems = "CENTER";
  hoverItem.paddingTop = 6;
  hoverItem.paddingBottom = 6;
  hoverItem.paddingLeft = 8;
  hoverItem.paddingRight = 8;
  hoverItem.cornerRadius = 6;
  setFill(hoverItem, COLORS.neutral50);
  hoverItem.appendChild(createTextNode("Hover", 14, 400, COLORS.neutral900));
  statesRow.appendChild(hoverItem);

  const disabledItem = figma.createComponent();
  disabledItem.name = "variant=item-disabled";
  disabledItem.layoutMode = "HORIZONTAL";
  disabledItem.primaryAxisSizingMode = "AUTO";
  disabledItem.counterAxisSizingMode = "AUTO";
  disabledItem.counterAxisAlignItems = "CENTER";
  disabledItem.paddingTop = 6;
  disabledItem.paddingBottom = 6;
  disabledItem.paddingLeft = 8;
  disabledItem.paddingRight = 8;
  disabledItem.cornerRadius = 6;
  disabledItem.fills = [];
  disabledItem.appendChild(
    createTextNode("Disabled", 14, 400, COLORS.neutral400)
  );
  statesRow.appendChild(disabledItem);

  section.appendChild(statesRow);

  // With icons — items with prefix icons
  const iconsRow = createVariantRow("with icons");

  const iconItem1 = figma.createComponent();
  iconItem1.name = "variant=icon-item-1";
  iconItem1.layoutMode = "HORIZONTAL";
  iconItem1.primaryAxisSizingMode = "AUTO";
  iconItem1.counterAxisSizingMode = "AUTO";
  iconItem1.counterAxisAlignItems = "CENTER";
  iconItem1.paddingTop = 6;
  iconItem1.paddingBottom = 6;
  iconItem1.paddingLeft = 8;
  iconItem1.paddingRight = 8;
  iconItem1.cornerRadius = 6;
  iconItem1.itemSpacing = 8;
  iconItem1.fills = [];
  iconItem1.appendChild(
    createIcon(ICON_SVGS.pencil, 16, rgbToHex(COLORS.neutral900))
  );
  iconItem1.appendChild(createTextNode("Edit", 14, 400, COLORS.neutral900));
  iconsRow.appendChild(iconItem1);

  const iconItem2 = figma.createComponent();
  iconItem2.name = "variant=icon-item-2";
  iconItem2.layoutMode = "HORIZONTAL";
  iconItem2.primaryAxisSizingMode = "AUTO";
  iconItem2.counterAxisSizingMode = "AUTO";
  iconItem2.counterAxisAlignItems = "CENTER";
  iconItem2.paddingTop = 6;
  iconItem2.paddingBottom = 6;
  iconItem2.paddingLeft = 8;
  iconItem2.paddingRight = 8;
  iconItem2.cornerRadius = 6;
  iconItem2.itemSpacing = 8;
  iconItem2.fills = [];
  iconItem2.appendChild(
    createIcon(ICON_SVGS.search, 16, rgbToHex(COLORS.neutral900))
  );
  iconItem2.appendChild(createTextNode("Search", 14, 400, COLORS.neutral900));
  iconsRow.appendChild(iconItem2);

  const iconItem3 = figma.createComponent();
  iconItem3.name = "variant=icon-item-3";
  iconItem3.layoutMode = "HORIZONTAL";
  iconItem3.primaryAxisSizingMode = "AUTO";
  iconItem3.counterAxisSizingMode = "AUTO";
  iconItem3.counterAxisAlignItems = "CENTER";
  iconItem3.paddingTop = 6;
  iconItem3.paddingBottom = 6;
  iconItem3.paddingLeft = 8;
  iconItem3.paddingRight = 8;
  iconItem3.cornerRadius = 6;
  iconItem3.itemSpacing = 8;
  iconItem3.fills = [];
  iconItem3.appendChild(
    createIcon(ICON_SVGS.plus, 16, rgbToHex(COLORS.neutral900))
  );
  iconItem3.appendChild(createTextNode("Add new", 14, 400, COLORS.neutral900));
  iconsRow.appendChild(iconItem3);

  section.appendChild(iconsRow);

  container.appendChild(section);
}

// ─── One-Time-Password-Field ──────────────────────────────────────────────────

function generateOTPSection(container: FrameNode): void {
  const section = createComponentSection("One-Time-Password-Field");

  const row = createVariantRow("default");
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = 8;
  component.fills = [];

  const slotCount = 6;
  for (let i = 0; i < slotCount; i++) {
    const slot = figma.createFrame();
    slot.name = `slot-${i + 1}`;
    slot.resize(40, 48);
    slot.layoutMode = "HORIZONTAL";
    slot.primaryAxisSizingMode = "FIXED";
    slot.counterAxisSizingMode = "FIXED";
    slot.primaryAxisAlignItems = "CENTER";
    slot.counterAxisAlignItems = "CENTER";
    slot.cornerRadius = 2;
    setFill(slot, COLORS.neutral50);

    if (i === 0) {
      // First slot — filled with "A"
      const text = createTextNode("A", 16, 500, COLORS.neutral950);
      slot.appendChild(text);
    } else if (i === 1) {
      // Second slot — active (has border)
      setStroke(slot, COLORS.neutral200, 1);
    }
    // Remaining slots are empty with neutral-50 bg and no border

    component.appendChild(slot);
  }

  row.appendChild(component);
  section.appendChild(row);
  container.appendChild(section);
}

// ─── Placeholder sections ─────────────────────────────────────────────────────

function generatePlaceholderSection(
  container: FrameNode,
  name: string,
  description: string
): void {
  const section = createComponentSection(name);
  const text = createTextNode(description, 14, 400, COLORS.neutral500);
  section.appendChild(text);
  container.appendChild(section);
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generates Figma components for spec-based and placeholder components.
 * Returns the total number of component sections created (6 spec + 4 placeholders).
 */
export function generateFromSpecs(container: FrameNode): number {
  generateFieldSection(container);
  generateAccordionSection(container);
  generateTooltipSection(container);
  generatePopoverSection(container);
  generateDropdownSection(container);
  generateOTPSection(container);

  generatePlaceholderSection(
    container,
    "Tab",
    "Tab — unstyled wrapper (uses primitives directly)"
  );
  generatePlaceholderSection(
    container,
    "Toast",
    "Toast — sonner library (styling controlled externally)"
  );
  generatePlaceholderSection(
    container,
    "DayPicker",
    "DayPicker — deferred (complex third-party calendar grid)"
  );
  generatePlaceholderSection(
    container,
    "MonthPicker",
    "MonthPicker — deferred (complex third-party calendar grid)"
  );

  return 10; // 6 spec components + 4 placeholders
}
