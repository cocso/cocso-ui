import { TOOLTIP_SPEC } from "./component-registry";
import {
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

export function generateTooltipComponents(container: FrameNode): void {
  const section = createComponentSection("Tooltip");

  const row = createVariantRow("default");

  const component = figma.createComponent();
  component.name = "variant=default";
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.paddingLeft = TOOLTIP_SPEC.paddingInline;
  component.paddingRight = TOOLTIP_SPEC.paddingInline;
  component.paddingTop = TOOLTIP_SPEC.paddingBlock;
  component.paddingBottom = TOOLTIP_SPEC.paddingBlock;
  component.cornerRadius = TOOLTIP_SPEC.borderRadius;
  setFill(component, TOOLTIP_SPEC.background);

  const text = createTextNode(
    "Tooltip text",
    TOOLTIP_SPEC.fontSize,
    400,
    TOOLTIP_SPEC.textColor
  );
  component.appendChild(text);

  row.appendChild(component);
  section.appendChild(row);

  container.appendChild(section);
}
