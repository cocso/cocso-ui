import { linkRecipe } from "@cocso-ui/recipe/recipes/link.recipe";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import {
  COLORS,
  createComponentSection,
  createIcon,
  createTextNode,
  createVariantRow,
  ICON_SVGS,
  rgbToHex,
} from "../shared";

export function generateLinkSection(container: FrameNode): void {
  const section = createComponentSection("Link");
  const combinations = getAllVariantCombinations(linkRecipe);
  const row = createVariantRow("variant");

  for (const combo of combinations) {
    const spec = resolveForFigma(linkRecipe, combo);
    const nameParts = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const variantValue = combo.variant ?? "inline";

    const component = figma.createComponent();
    component.name = nameParts;
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
    if (variantValue === "inline") {
      text.textDecoration = "UNDERLINE";
    }
    component.appendChild(text);
    row.appendChild(component);
  }

  section.appendChild(row);

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
