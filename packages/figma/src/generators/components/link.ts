import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import linkJSON from "../../../../codegen/generated/link.figma.json";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import {
  COLORS,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
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
    LABEL_FONT_SIZE,
    LABEL_FONT_WEIGHT,
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
  const json = linkJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Link");

  const variants = Object.keys(linkRecipe.variants.variant);
  const variantRow = createVariantRow("variant");
  for (const variant of variants) {
    const spec = lookupSpec(json, linkRecipe, { variant });
    variantRow.appendChild(createLinkComponent(`variant=${variant}`, spec));
  }
  section.appendChild(variantRow);

  // External variant — flat component
  const externalRow = createVariantRow("external");
  const externalSpec = lookupSpec(json, linkRecipe, { variant: "inline" });
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
    LABEL_FONT_SIZE,
    LABEL_FONT_WEIGHT,
    extColor,
    externalSpec._tokenRefs?.color
  );
  extText.textDecoration = "UNDERLINE";
  extComponent.appendChild(extText);
  const extIcon = createIcon(ICON_SVGS.externalLink, LABEL_FONT_SIZE, rgbToHex(extColor));
  extComponent.appendChild(extIcon);
  externalRow.appendChild(extComponent);
  section.appendChild(externalRow);

  container.appendChild(section);
}
