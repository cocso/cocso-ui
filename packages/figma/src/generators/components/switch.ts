import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { resolveForFigma } from "../recipe-resolver";
import {
  getAllVariantCombinations,
  groupVariantsByFirstDimension,
} from "../recipe-utils";
import {
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  createVariantRow,
  setFill,
} from "../shared";

function createSwitchFromSpec(
  name: string,
  spec: FigmaNodeSpec,
  isChecked: boolean
): ComponentNode {
  const trackWidth = spec.width ?? 36;
  const trackHeight = spec.height ?? 20;
  const thumbSize = spec.thumbSize ?? 16;
  const thumbOffset = spec.thumbOffset ?? 2;

  const trackColor =
    isChecked && spec.checkedBgColor ? spec.checkedBgColor : COLORS.neutral100;
  const trackColorRef =
    isChecked && spec.checkedBgColor
      ? spec._tokenRefs?.checkedBgColor
      : undefined;

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
  const section = createComponentSection("Switch");
  const combinations = getAllVariantCombinations(switchRecipe);
  const groups = groupVariantsByFirstDimension(switchRecipe, combinations);

  for (const [groupKey, items] of groups) {
    const row = createVariantRow(groupKey);
    for (const { name, spec } of items) {
      row.appendChild(
        createSwitchFromSpec(`${name}, checked=true`, spec, true)
      );
      row.appendChild(
        createSwitchFromSpec(`${name}, checked=false`, spec, false)
      );
    }
    section.appendChild(row);
  }

  const labelRow = createVariantRow("with label");
  const defaultSpec = resolveForFigma(switchRecipe, {
    variant: "primary",
    size: "medium",
  });

  for (const checked of [true, false]) {
    const wrapper = figma.createFrame();
    wrapper.name = `with-label, checked=${checked}`;
    wrapper.layoutMode = "HORIZONTAL";
    wrapper.primaryAxisSizingMode = "AUTO";
    wrapper.counterAxisSizingMode = "AUTO";
    wrapper.clipsContent = false;
    wrapper.counterAxisAlignItems = "CENTER";
    wrapper.itemSpacing = 8;
    wrapper.fills = [];

    wrapper.appendChild(
      createSwitchFromSpec(checked ? "on" : "off", defaultSpec, checked)
    );
    wrapper.appendChild(createTextNode("Label", 14, 400, COLORS.neutral900));
    labelRow.appendChild(wrapper);
  }
  section.appendChild(labelRow);

  const disabledRow = createVariantRow("disabled");
  const disabledOn = createSwitchFromSpec("disabled-on", defaultSpec, true);
  disabledOn.opacity = 0.4;
  disabledRow.appendChild(disabledOn);
  const disabledOff = createSwitchFromSpec("disabled-off", defaultSpec, false);
  disabledOff.opacity = 0.4;
  disabledRow.appendChild(disabledOff);
  section.appendChild(disabledRow);

  container.appendChild(section);
}
