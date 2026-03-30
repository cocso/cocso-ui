import { avatarRecipe } from "@cocso-ui/recipe/recipes/avatar.recipe";
import avatarJSON from "../../../../codegen/generated/avatar.figma.json";
import { createComponentFromSpec } from "../component-creators";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import { createComponentSection, createVariantMatrixPerSlice } from "../shared";

export function generateAvatarSection(container: FrameNode): void {
  const json = avatarJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Avatar");

  const sizes = Object.keys(avatarRecipe.variants.size);
  const shapes = Object.keys(avatarRecipe.variants.shape);

  const matrixGrid = createVariantMatrixPerSlice(
    "Avatar variants",
    { name: "shape", values: shapes },
    { name: "size", values: sizes },
    undefined,
    (shapeVal, sizeVal) => {
      const spec = lookupSpec(json, avatarRecipe, {
        size: sizeVal,
        shape: shapeVal,
      });
      return createComponentFromSpec(
        `${shapeVal}-${sizeVal}`,
        spec,
        "Avatar",
      );
    },
  );
  section.appendChild(matrixGrid);

  container.appendChild(section);
}
