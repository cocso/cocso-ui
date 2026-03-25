import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

function createTabItem(label: string, active: boolean): FrameNode {
  const tab = figma.createFrame();
  tab.name = `tab-${label}`;
  tab.layoutMode = "VERTICAL";
  tab.primaryAxisSizingMode = "AUTO";
  tab.counterAxisSizingMode = "AUTO";
  tab.paddingTop = 8;
  tab.paddingBottom = 8;
  tab.paddingLeft = 12;
  tab.paddingRight = 12;
  tab.fills = [];

  const text = createTextNode(
    label,
    14,
    active ? 600 : 400,
    active ? COLORS.neutral950 : COLORS.neutral400
  );
  tab.appendChild(text);

  if (active) {
    const indicator = figma.createRectangle();
    indicator.name = "indicator";
    indicator.resize(tab.width || 40, 2);
    setFill(indicator, COLORS.neutral950);
    tab.appendChild(indicator);
  }

  return tab;
}

function createTabInstance(): ComponentNode {
  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.fills = [];

  component.appendChild(createTabItem("Tab 1", true));
  component.appendChild(createTabItem("Tab 2", false));
  component.appendChild(createTabItem("Tab 3", false));

  return component;
}

export function generateTabComponents(container: FrameNode): void {
  const section = createComponentSection("Tab");

  const row = createVariantRow("default");
  row.appendChild(createTabInstance());
  section.appendChild(row);

  container.appendChild(section);
}
