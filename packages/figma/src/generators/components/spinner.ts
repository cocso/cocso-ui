import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import type { FigmaNodeSpec } from "../recipe-resolver";
import {
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
} from "../recipe-utils";
import {
  COLORS,
  createComponentSection,
  createVariantRow,
  rgbToHex,
} from "../shared";

function createSpinnerFromSpec(
  name: string,
  spec: FigmaNodeSpec
): ComponentNode {
  const bladeCount = spec.blades ?? 8;
  const bw = spec.bladeWidth ?? 2;
  const bh = spec.bladeHeight ?? 5;
  const br = spec.bladeRadius ?? 1;
  const containerSize = spec.output ?? 16;
  const bladeColor = spec.bladeColor ?? COLORS.neutral900;
  const hexColor = rgbToHex(bladeColor);

  const cx = containerSize / 2;
  const cy = containerSize / 2;
  const bx = (containerSize - bw) / 2;
  const by = containerSize - bh;

  let rects = "";
  for (let i = 0; i < bladeCount; i++) {
    const angleDeg = (i * 360) / bladeCount;
    const opacity = 1 - (i / bladeCount) * 0.85;
    rects += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${br}" fill="${hexColor}" opacity="${opacity.toFixed(3)}" transform="rotate(${angleDeg} ${cx} ${cy})"/>`;
  }

  const svg = `<svg viewBox="0 0 ${containerSize} ${containerSize}" width="${containerSize}" height="${containerSize}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
  const svgNode = figma.createNodeFromSvg(svg);

  const component = figma.createComponent();
  component.name = name;
  component.resize(containerSize, containerSize);
  component.fills = [];
  component.clipsContent = true;

  while (svgNode.children.length > 0) {
    component.appendChild(svgNode.children[0]);
  }
  svgNode.remove();

  component.resize(containerSize, containerSize);

  return component;
}

export function generateSpinnerSection(container: FrameNode): void {
  const section = createComponentSection("Spinner");
  const combinations = getAllVariantCombinations(spinnerRecipe);
  const groups = groupVariantsByFirstDimension(spinnerRecipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      row.appendChild(createSpinnerFromSpec(name, spec));
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}
