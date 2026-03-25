import {
  COLORS,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
} from "./shared";

function createAccordionInstance(expanded: boolean): ComponentNode {
  const component = figma.createComponent();
  component.name = `state=${expanded ? "expanded" : "collapsed"}`;
  component.resize(320, 100);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.fills = [];

  const trigger = figma.createFrame();
  trigger.name = "trigger";
  trigger.resize(320, 40);
  trigger.layoutMode = "HORIZONTAL";
  trigger.primaryAxisSizingMode = "FIXED";
  trigger.counterAxisSizingMode = "AUTO";
  trigger.primaryAxisAlignItems = "SPACE_BETWEEN";
  trigger.counterAxisAlignItems = "CENTER";
  trigger.paddingTop = 12;
  trigger.paddingBottom = 12;
  trigger.fills = [];

  const label = createTextNode("Accordion Item", 14, 500, COLORS.neutral950);
  trigger.appendChild(label);

  const chevron = createIcon(
    expanded ? ICON_SVGS.chevronUp : ICON_SVGS.chevronDown,
    16,
    rgbToHex(COLORS.neutral400)
  );
  trigger.appendChild(chevron);

  component.appendChild(trigger);

  if (expanded) {
    const content = figma.createFrame();
    content.name = "content";
    content.layoutMode = "VERTICAL";
    content.primaryAxisSizingMode = "AUTO";
    content.counterAxisSizingMode = "AUTO";
    content.paddingBottom = 12;
    content.fills = [];

    const text = createTextNode(
      "Accordion content goes here.",
      14,
      400,
      COLORS.neutral600
    );
    content.appendChild(text);
    component.appendChild(content);
  }

  return component;
}

export function generateAccordionComponents(container: FrameNode): void {
  const section = createComponentSection("Accordion");

  const row = createVariantRow("states");
  row.appendChild(createAccordionInstance(false));
  row.appendChild(createAccordionInstance(true));
  section.appendChild(row);

  container.appendChild(section);
}
