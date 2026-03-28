import { stockQuantityStatusRecipe } from "@cocso-ui/recipe/recipes/stock-quantity-status.recipe";
import {
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
} from "../recipe-utils";
import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "../shared";

export function generateStockQuantityStatusSection(container: FrameNode): void {
  const section = createComponentSection("StockQuantityStatus");
  const combinations = getAllVariantCombinations(stockQuantityStatusRecipe);
  const groups = groupVariantsByFirstDimension(
    stockQuantityStatusRecipe,
    combinations
  );

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const component = figma.createComponent();
      component.name = name;
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.counterAxisAlignItems = "CENTER";
      component.itemSpacing = 2;
      component.fills = [];

      const textColor = spec.color ?? COLORS.neutral900;

      const indicatorFrame = figma.createFrame();
      indicatorFrame.name = "indicator";
      indicatorFrame.resize(20, 16);
      indicatorFrame.layoutMode = "HORIZONTAL";
      indicatorFrame.primaryAxisSizingMode = "FIXED";
      indicatorFrame.counterAxisSizingMode = "FIXED";
      indicatorFrame.primaryAxisAlignItems = "CENTER";
      indicatorFrame.counterAxisAlignItems = "CENTER";
      indicatorFrame.fills = [];

      const indicator = figma.createEllipse();
      indicator.name = "dot";
      indicator.resize(12, 12);
      setFill(indicator, textColor, 1, spec._tokenRefs?.color);
      indicatorFrame.appendChild(indicator);
      component.appendChild(indicatorFrame);

      const text = createTextNode(
        groupKey,
        14,
        400,
        textColor,
        spec._tokenRefs?.color
      );
      component.appendChild(text);
      row.appendChild(component);
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}
