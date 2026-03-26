import {
  COLORS,
  createAutoLayoutFrame,
  createComponentSection,
  createIcon,
  createTextNode,
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
  frame.cornerRadius = 4;
  setFill(frame, COLORS.white);
  setStroke(frame, COLORS.neutral200, 1);

  const placeholder = createTextNode("Placeholder", 14, 400, COLORS.neutral400);
  frame.appendChild(placeholder);

  return frame;
}

function generateFieldSection(container: FrameNode): void {
  const section = createComponentSection("Field");

  // Default variant
  const defaultRow = createVariantRow("default");
  const defaultVariant = createAutoLayoutFrame("Field/default", "VERTICAL");
  defaultVariant.itemSpacing = 8;

  const label = createTextNode("Label", 14, 500, COLORS.neutral900);
  const inputFrame = createInputPlaceholder();
  const description = createTextNode("Description", 12, 400, COLORS.neutral500);

  defaultVariant.appendChild(label);
  defaultVariant.appendChild(inputFrame);
  defaultVariant.appendChild(description);

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
  labelRow.itemSpacing = 4;
  labelRow.counterAxisAlignItems = "CENTER";
  const optLabel = createTextNode("Label", 14, 500, COLORS.neutral900);
  const optSuffix = createTextNode("(Optional)", 14, 500, COLORS.neutral400);
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
  const icon = createIcon(iconSvg, 16, rgbToHex(COLORS.neutral900));

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

function generateTooltipSection(container: FrameNode): void {
  const section = createComponentSection("Tooltip");

  const row = createVariantRow("default");
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.paddingTop = 6;
  component.paddingBottom = 6;
  component.paddingLeft = 10;
  component.paddingRight = 10;
  component.cornerRadius = 4;
  setFill(component, COLORS.neutral900);

  const text = createTextNode("Tooltip text", 12, 400, COLORS.white);
  component.appendChild(text);

  row.appendChild(component);
  section.appendChild(row);
  container.appendChild(section);
}

// ─── Popover ─────────────────────────────────────────────────────────────────

function generatePopoverSection(container: FrameNode): void {
  const section = createComponentSection("Popover");

  const row = createVariantRow("default");
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.counterAxisAlignItems = "CENTER";
  component.paddingTop = 8;
  component.paddingBottom = 8;
  component.paddingLeft = 10;
  component.paddingRight = 10;
  component.cornerRadius = 6;
  component.effects = SHADOW_SM;
  setFill(component, COLORS.white);
  setStroke(component, COLORS.neutral100, 1);

  const text = createTextNode("Popover content", 14, 400, COLORS.neutral900);
  component.appendChild(text);

  row.appendChild(component);
  section.appendChild(row);
  container.appendChild(section);
}

// ─── Dropdown ────────────────────────────────────────────────────────────────

function createDropdownItem(label: string, withHover: boolean): FrameNode {
  const item = figma.createFrame();
  item.name = "item";
  item.layoutMode = "HORIZONTAL";
  item.primaryAxisSizingMode = "AUTO";
  item.counterAxisSizingMode = "AUTO";
  item.counterAxisAlignItems = "CENTER";
  item.paddingTop = 8;
  item.paddingBottom = 8;
  item.paddingLeft = 10;
  item.paddingRight = 10;

  if (withHover) {
    setFill(item, COLORS.neutral50);
  } else {
    item.fills = [];
  }

  const text = createTextNode(label, 14, 400, COLORS.neutral900);
  item.appendChild(text);

  return item;
}

function generateDropdownSection(container: FrameNode): void {
  const section = createComponentSection("Dropdown");

  // Content variant — dropdown panel with 3 items
  const contentRow = createVariantRow("content");
  const contentComponent = figma.createComponent();
  contentComponent.name = "variant=content";
  contentComponent.layoutMode = "VERTICAL";
  contentComponent.primaryAxisSizingMode = "AUTO";
  contentComponent.counterAxisSizingMode = "FIXED";
  contentComponent.resize(160, contentComponent.height);
  contentComponent.itemSpacing = 0;
  contentComponent.paddingTop = 8;
  contentComponent.paddingBottom = 8;
  contentComponent.cornerRadius = 6;
  contentComponent.effects = SHADOW_SM;
  setFill(contentComponent, COLORS.white);
  setStroke(contentComponent, COLORS.neutral100, 1);

  contentComponent.appendChild(createDropdownItem("Menu item", false));
  contentComponent.appendChild(createDropdownItem("Menu item", false));
  contentComponent.appendChild(createDropdownItem("Menu item", false));

  contentRow.appendChild(contentComponent);
  section.appendChild(contentRow);

  // Item (hover) variant
  const itemRow = createVariantRow("item");
  const itemComponent = figma.createComponent();
  itemComponent.name = "variant=item-hover";
  itemComponent.layoutMode = "HORIZONTAL";
  itemComponent.primaryAxisSizingMode = "AUTO";
  itemComponent.counterAxisSizingMode = "AUTO";
  itemComponent.counterAxisAlignItems = "CENTER";
  itemComponent.paddingTop = 8;
  itemComponent.paddingBottom = 8;
  itemComponent.paddingLeft = 10;
  itemComponent.paddingRight = 10;
  setFill(itemComponent, COLORS.neutral50);

  const itemText = createTextNode("Menu item", 14, 400, COLORS.neutral900);
  itemComponent.appendChild(itemText);

  itemRow.appendChild(itemComponent);
  section.appendChild(itemRow);

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
  component.itemSpacing = 10;
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
