import { spinnerRecipe } from "@cocso-ui/recipe/recipes/spinner.recipe";
import spinnerJSON from "../../../../../ecosystem/codegen/generated/spinner.figma.json";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import {
  COLORS,
  createComponentSection,
  createVariantMatrix,
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
  // Position blade at bottom edge; each blade is rotated around center
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
  const json = spinnerJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Spinner");

  const variants = Object.keys(spinnerRecipe.variants.variant);
  const sizes = Object.keys(spinnerRecipe.variants.size);

  const matrixGrid = createVariantMatrix(
    "Spinner variants",
    { name: "variant", values: variants },
    { name: "size", values: sizes },
    (variantVal, sizeVal) => {
      const spec = lookupSpec(json, spinnerRecipe, {
        variant: variantVal,
        size: sizeVal,
      });
      return createSpinnerFromSpec(`${variantVal}-${sizeVal}`, spec);
    }
  );
  section.appendChild(matrixGrid);

  container.appendChild(section);
}
