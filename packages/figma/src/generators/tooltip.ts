import { TOOLTIP_SPEC } from "./component-registry";
import {
  createSectionHeader,
  createTextNode,
  createVariantRow,
  setFill,
} from "./shared";

export function generateTooltipComponents(
  page: PageNode,
  yOffset: number
): number {
  const section = createSectionHeader("Tooltip");
  section.y = yOffset;
  page.appendChild(section);

  const currentY = yOffset + 80;

  const row = createVariantRow("default");
  row.y = currentY;
  page.appendChild(row);

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

  return currentY + 72;
}
