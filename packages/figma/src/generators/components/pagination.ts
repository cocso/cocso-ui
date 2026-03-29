import { paginationRecipe } from "@cocso-ui/recipe/recipes/pagination.recipe";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import {
  addStateVariants,
  COLORS,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
  setFill,
} from "../shared";

function createPaginationItem(
  name: string,
  size: number,
  radius: number,
  label: string,
  textColor: RGB,
  bgColor: RGB | null,
  fontSize: number,
  fontWeight: number,
  tokenRefs?: { fontColor?: string; bgColor?: string }
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.resize(size, size);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.cornerRadius = radius;

  if (bgColor) {
    setFill(component, bgColor, 1, tokenRefs?.bgColor);
  } else {
    component.fills = [];
  }

  const text = createTextNode(
    label,
    fontSize,
    fontWeight,
    textColor,
    tokenRefs?.fontColor
  );
  component.appendChild(text);

  return component;
}

function createPaginationArrow(
  name: string,
  size: number,
  radius: number,
  iconSvg: string,
  isDisabled: boolean
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.resize(size, size);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.cornerRadius = radius;
  component.fills = [];

  const icon = createIcon(iconSvg, 16, rgbToHex(COLORS.neutral900));
  component.appendChild(icon);

  if (isDisabled) {
    component.opacity = 0.4;
  }

  return component;
}

function createPaginationItemFromSpec(
  name: string,
  spec: FigmaNodeSpec
): ComponentNode {
  const itemSize = spec.height ?? 32;
  const radius = spec.borderRadius ?? 8;
  const fontSize = spec.fontSize ?? 14;
  const textColor = spec.fontColor ?? COLORS.neutral900;
  const fontW = spec.fontWeight ?? 400;
  const bgColor = spec.bgColor ?? null;

  let pageState = "inactive";
  if (name.includes("pageState=active")) {
    pageState = "active";
  } else if (name.includes("pageState=disabled")) {
    pageState = "disabled";
  }

  let label = "2";
  if (pageState === "active") {
    label = "1";
  } else if (pageState === "disabled") {
    label = "...";
  }

  const item = createPaginationItem(
    name,
    itemSize,
    radius,
    label,
    textColor,
    bgColor,
    fontSize,
    fontW,
    {
      fontColor: spec._tokenRefs?.fontColor,
      bgColor: spec._tokenRefs?.bgColor,
    }
  );

  if (pageState === "disabled") {
    item.opacity = 0.4;
  }

  return item;
}

export function generatePaginationSection(container: FrameNode): void {
  const section = createComponentSection("Pagination");
  const combinations = getAllVariantCombinations(paginationRecipe);

  const itemSize = 32;
  const radius = 8;
  const fontSize = 14;

  // Create base (Default state) nodes for ComponentSetNode
  const variantFrame = figma.createFrame();
  variantFrame.name = "Pagination variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = resolveForFigma(paginationRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const item = createPaginationItemFromSpec(name, spec);
    variantFrame.appendChild(item);
    baseNodes.push(item);
  }

  const componentSet = addStateVariants(
    baseNodes,
    paginationRecipe,
    combinations,
    variantFrame,
    (name, spec) => createPaginationItemFromSpec(name, spec)
  );
  section.appendChild(componentSet);

  const arrowRow = createVariantRow("arrow");
  arrowRow.appendChild(
    createPaginationArrow(
      "arrow=prev",
      itemSize,
      radius,
      ICON_SVGS.chevronLeft,
      false
    )
  );
  arrowRow.appendChild(
    createPaginationArrow(
      "arrow=next",
      itemSize,
      radius,
      ICON_SVGS.chevronRight,
      false
    )
  );
  arrowRow.appendChild(
    createPaginationArrow(
      "arrow=prev-disabled",
      itemSize,
      radius,
      ICON_SVGS.chevronLeft,
      true
    )
  );
  section.appendChild(arrowRow);

  const truncRow = createVariantRow("truncation");
  // Wider than page items (32) to give the ellipsis visual breathing room
  const truncSize = 36;
  const truncComponent = figma.createComponent();
  truncComponent.name = "truncation";
  truncComponent.resize(truncSize, truncSize);
  truncComponent.layoutMode = "HORIZONTAL";
  truncComponent.primaryAxisSizingMode = "FIXED";
  truncComponent.counterAxisSizingMode = "FIXED";
  truncComponent.primaryAxisAlignItems = "CENTER";
  truncComponent.counterAxisAlignItems = "CENTER";
  truncComponent.fills = [];
  const truncIcon = createIcon(
    ICON_SVGS.moreHoriz,
    16,
    rgbToHex(COLORS.neutral900)
  );
  truncComponent.appendChild(truncIcon);
  truncRow.appendChild(truncComponent);
  section.appendChild(truncRow);

  const composedRow = createVariantRow("composed");
  const composedFrame = figma.createFrame();
  composedFrame.name = "pagination-composed";
  composedFrame.layoutMode = "HORIZONTAL";
  composedFrame.primaryAxisSizingMode = "AUTO";
  composedFrame.counterAxisSizingMode = "AUTO";
  composedFrame.primaryAxisAlignItems = "CENTER";
  composedFrame.counterAxisAlignItems = "CENTER";
  composedFrame.clipsContent = false;
  composedFrame.itemSpacing = 2;
  composedFrame.fills = [];

  composedFrame.appendChild(
    createPaginationArrow("prev", itemSize, radius, ICON_SVGS.chevronLeft, true)
  );
  composedFrame.appendChild(
    createPaginationItem(
      "page-1",
      itemSize,
      radius,
      "1",
      COLORS.white,
      COLORS.primary950,
      fontSize,
      600
    )
  );
  for (const n of [2, 3]) {
    composedFrame.appendChild(
      createPaginationItem(
        `page-${n}`,
        itemSize,
        radius,
        String(n),
        COLORS.neutral900,
        null,
        fontSize,
        400
      )
    );
  }

  const truncInComposed = figma.createFrame();
  truncInComposed.name = "trunc";
  truncInComposed.resize(truncSize, truncSize);
  truncInComposed.layoutMode = "HORIZONTAL";
  truncInComposed.primaryAxisSizingMode = "FIXED";
  truncInComposed.counterAxisSizingMode = "FIXED";
  truncInComposed.primaryAxisAlignItems = "CENTER";
  truncInComposed.counterAxisAlignItems = "CENTER";
  truncInComposed.fills = [];
  truncInComposed.appendChild(
    createIcon(ICON_SVGS.moreHoriz, 16, rgbToHex(COLORS.neutral900))
  );
  composedFrame.appendChild(truncInComposed);

  composedFrame.appendChild(
    createPaginationItem(
      "page-10",
      itemSize,
      radius,
      "10",
      COLORS.neutral900,
      null,
      fontSize,
      400
    )
  );
  composedFrame.appendChild(
    createPaginationArrow(
      "next",
      itemSize,
      radius,
      ICON_SVGS.chevronRight,
      false
    )
  );

  composedRow.appendChild(composedFrame);
  section.appendChild(composedRow);

  container.appendChild(section);
}
