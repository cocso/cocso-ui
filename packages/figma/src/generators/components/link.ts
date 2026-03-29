import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import type { FigmaNodeSpec } from "../recipe-resolver";
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
} from "../shared";

function createLinkComponent(name: string, spec: FigmaNodeSpec): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.fills = [];

  const linkColor = spec.color ?? COLORS.info500;
  const text = createTextNode(
    "Link text",
    14,
    400,
    linkColor,
    spec._tokenRefs?.color
  );
  const variantValue = name.includes("variant=inline") ? "inline" : "";
  if (variantValue === "inline") {
    text.textDecoration = "UNDERLINE";
  }
  component.appendChild(text);
  return component;
}

export function generateLinkSection(container: FrameNode): void {
  const section = createComponentSection("Link");
  const combinations = getAllVariantCombinations(linkRecipe);

  // Create base (Default state) nodes
  const variantFrame = figma.createFrame();
  variantFrame.name = "Link variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = resolveForFigma(linkRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createLinkComponent(name, spec);
    variantFrame.appendChild(component);
    baseNodes.push(component);
  }

  // Add state variants (hover) and combine into ComponentSetNode
  const componentSet = addStateVariants(
    baseNodes,
    linkRecipe,
    combinations,
    variantFrame,
    (name, spec) => createLinkComponent(name, spec)
  );
  section.appendChild(componentSet);

  // External variant stays as flat component (no state variants)
  const externalRow = createVariantRow("external");
  const externalSpec = resolveForFigma(linkRecipe, { variant: "inline" });
  const extColor = externalSpec.color ?? COLORS.info500;

  const extComponent = figma.createComponent();
  extComponent.name = "variant=inline, external=true";
  extComponent.layoutMode = "HORIZONTAL";
  extComponent.primaryAxisSizingMode = "AUTO";
  extComponent.counterAxisSizingMode = "AUTO";
  extComponent.counterAxisAlignItems = "CENTER";
  extComponent.itemSpacing = 2;
  extComponent.fills = [];

  const extText = createTextNode(
    "External link",
    14,
    400,
    extColor,
    externalSpec._tokenRefs?.color
  );
  extText.textDecoration = "UNDERLINE";
  extComponent.appendChild(extText);
  const extIcon = createIcon(ICON_SVGS.externalLink, 14, rgbToHex(extColor));
  extComponent.appendChild(extIcon);
  externalRow.appendChild(extComponent);
  section.appendChild(externalRow);

  container.appendChild(section);
}
