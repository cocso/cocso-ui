import { typographyRecipe } from "@cocso-ui/recipe/recipes/typography.recipe";
import typographyJSON from "../../../../codegen/generated/typography.figma.json";
import type { FigmaNodeSpec } from "../recipe-resolver";
import {
  type FigmaJSONData,
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
  lookupSpec,
} from "../recipe-utils";
import {
  COLORS,
  createComponentSection,
  createTextNode,
  createVariantMatrix,
  createVariantRow,
} from "../shared";

const SIZE_VALUE_RE = /size=([^,]*)/;

function createTypographyComponent(
  name: string,
  spec: FigmaNodeSpec,
  typeVal: string,
  sizeVal: string
): ComponentNode {
  const component = figma.createComponent();
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.fills = [];

  const fontSize = spec.fontSize ?? 16;
  const fontWeight = spec.fontWeight ?? 400;
  const textColor = spec.fontColor ?? COLORS.neutral950;
  const sampleText = `${typeVal} ${sizeVal} (${fontSize}px)`;
  const text = createTextNode(
    sampleText,
    fontSize,
    fontWeight,
    textColor,
    spec._tokenRefs?.fontColor
  );
  component.appendChild(text);

  return component;
}

export function generateTypographySection(container: FrameNode): void {
  const json = typographyJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Typography");

  // Visual matrix grid (design system documentation layout)
  const types = Object.keys(typographyRecipe.variants.type);
  const sizes = Object.keys(typographyRecipe.variants.size);

  const matrixGrid = createVariantMatrix(
    "Typography variants",
    { name: "type", values: types },
    { name: "size", values: sizes },
    (typeVal, sizeVal) => {
      const spec = lookupSpec(json, typographyRecipe, {
        type: typeVal,
        size: sizeVal,
      });
      return createTypographyComponent(
        `${typeVal}-${sizeVal}`,
        spec,
        typeVal,
        sizeVal
      );
    }
  );
  section.appendChild(matrixGrid);

  const combinations = getAllVariantCombinations(typographyRecipe);
  const groups = groupVariantsByFirstDimension(
    typographyRecipe,
    combinations,
    json
  );

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      const sizeValue = name.match(SIZE_VALUE_RE)?.[1] ?? "";
      row.appendChild(
        createTypographyComponent(name, spec, groupKey, sizeValue)
      );
    }
    section.appendChild(row);
  }

  container.appendChild(section);
}
