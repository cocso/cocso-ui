import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import switchJSON from "../../../../../ecosystem/codegen/generated/switch.figma.json";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { type FigmaJSONData, lookupSpec } from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  createVariantMatrixPerSlice,
  createVariantRow,
  DISABLED_OPACITY,
  LABEL_FONT_SIZE,
  LABEL_FONT_WEIGHT,
  setFill,
} from "../shared";

function createSwitchFromSpec(
  name: string,
  spec: FigmaNodeSpec
): ComponentNode {
  const trackWidth = spec.width ?? 36;
  const trackHeight = spec.height ?? 20;
  const thumbSize = spec.thumbSize ?? 16;
  const thumbOffset = spec.thumbOffset ?? 2;
  const isChecked = name.includes("checked=true");

  const trackColor = spec.switchBgColor ?? COLORS.neutral100;
  const trackColorRef = spec._tokenRefs?.switchBgColor;

  const component = figma.createComponent();
  component.name = name;
  component.resize(trackWidth, trackHeight);
  component.cornerRadius = trackHeight / 2;
  setFill(component, trackColor, 1, trackColorRef);

  const thumb = figma.createEllipse();
  thumb.name = "thumb";
  thumb.resize(thumbSize, thumbSize);
  thumb.fills = [createBoundPaint(COLORS.white)];
  thumb.y = thumbOffset;
  if (isChecked) {
    thumb.x = trackWidth - thumbSize - thumbOffset;
  } else {
    thumb.x = thumbOffset;
  }

  component.appendChild(thumb);

  return component;
}

export function generateSwitchSection(container: FrameNode): void {
  const json = switchJSON as unknown as FigmaJSONData;
  const section = createComponentSection("Switch");

  const variants = Object.keys(switchRecipe.variants.variant);
  const sizes = Object.keys(switchRecipe.variants.size);
  const checkedValues = Object.keys(switchRecipe.variants.checked);

  const matrixGrid = createVariantMatrixPerSlice(
    "Switch variants",
    { name: "size", values: sizes },
    { name: "variant", values: variants },
    { name: "checked", values: checkedValues },
    (sizeVal, variantVal, checkedVal) => {
      const spec = lookupSpec(json, switchRecipe, {
        variant: variantVal,
        size: sizeVal,
        checked: checkedVal,
      });
      return createSwitchFromSpec(
        `${variantVal}-${sizeVal}-checked=${checkedVal}`,
        spec
      );
    }
  );
  section.appendChild(matrixGrid);

  // Label + disabled rows stay as flat demos
  const labelRow = createVariantRow("with label");
  const defaultSpec = lookupSpec(json, switchRecipe, {
    variant: "primary",
    size: "medium",
    checked: "true",
  });

  for (const checked of [true, false]) {
    const spec = checked
      ? defaultSpec
      : lookupSpec(json, switchRecipe, {
          variant: "primary",
          size: "medium",
          checked: "false",
        });
    const wrapper = figma.createFrame();
    wrapper.name = `with-label, checked=${checked}`;
    wrapper.layoutMode = "HORIZONTAL";
    wrapper.primaryAxisSizingMode = "AUTO";
    wrapper.counterAxisSizingMode = "AUTO";
    wrapper.clipsContent = false;
    wrapper.counterAxisAlignItems = "CENTER";
    wrapper.itemSpacing = 8;
    wrapper.fills = [];

    wrapper.appendChild(createSwitchFromSpec(`checked=${checked}`, spec));
    wrapper.appendChild(
      createTextNode(
        "Label",
        LABEL_FONT_SIZE,
        LABEL_FONT_WEIGHT,
        COLORS.neutral900
      )
    );
    labelRow.appendChild(wrapper);
  }
  section.appendChild(labelRow);

  const disabledRow = createVariantRow("disabled");
  const disabledOn = createSwitchFromSpec(
    "disabled, checked=true",
    defaultSpec
  );
  disabledOn.opacity = DISABLED_OPACITY;
  disabledRow.appendChild(disabledOn);
  const uncheckedSpec = lookupSpec(json, switchRecipe, {
    variant: "primary",
    size: "medium",
    checked: "false",
  });
  const disabledOff = createSwitchFromSpec(
    "disabled, checked=false",
    uncheckedSpec
  );
  disabledOff.opacity = DISABLED_OPACITY;
  disabledRow.appendChild(disabledOff);
  section.appendChild(disabledRow);

  container.appendChild(section);
}
