import {
  COLORS,
  createSectionHeader,
  createTextNode,
  createVariantRow,
} from "./shared";

function createAccordionInstance(expanded: boolean): ComponentNode {
  const component = figma.createComponent();
  component.name = `state=${expanded ? "expanded" : "collapsed"}`;
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.resize(320, 1);
  component.fills = [];

  const trigger = figma.createFrame();
  trigger.name = "trigger";
  trigger.layoutMode = "HORIZONTAL";
  trigger.primaryAxisSizingMode = "FIXED";
  trigger.counterAxisSizingMode = "AUTO";
  trigger.resize(320, 1);
  trigger.primaryAxisAlignItems = "SPACE_BETWEEN";
  trigger.counterAxisAlignItems = "CENTER";
  trigger.paddingTop = 12;
  trigger.paddingBottom = 12;
  trigger.fills = [];

  const label = createTextNode("Accordion Item", 14, 500, COLORS.neutral950);
  trigger.appendChild(label);

  const chevron = createTextNode(
    expanded ? "\u25B2" : "\u25BC",
    12,
    400,
    COLORS.neutral400
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

export function generateAccordionComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Accordion");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;
  const row = createVariantRow("states");
  row.y = currentY;
  page.appendChild(row);

  row.appendChild(createAccordionInstance(false));
  row.appendChild(createAccordionInstance(true));

  return currentY + 100;
}
