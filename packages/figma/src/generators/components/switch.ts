import { switchRecipe } from "@cocso-ui/recipe/recipes/switch.recipe";
import type { FigmaNodeSpec } from "../recipe-resolver";
import { resolveForFigma } from "../recipe-resolver";
import { getAllVariantCombinations } from "../recipe-utils";
import {
  addStateVariants,
  COLORS,
  createBoundPaint,
  createComponentSection,
  createTextNode,
  createVariantRow,
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
  const section = createComponentSection("Switch");
  const combinations = getAllVariantCombinations(switchRecipe);

  const variantFrame = figma.createFrame();
  variantFrame.name = "Switch variants";
  variantFrame.layoutMode = "VERTICAL";
  variantFrame.primaryAxisSizingMode = "AUTO";
  variantFrame.counterAxisSizingMode = "AUTO";
  variantFrame.fills = [];

  const baseNodes: ComponentNode[] = [];
  for (const combo of combinations) {
    const spec = resolveForFigma(switchRecipe, combo);
    const name = Object.entries(combo)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");
    const component = createSwitchFromSpec(name, spec);
    variantFrame.appendChild(component);
    baseNodes.push(component);
  }

  const componentSet = addStateVariants(
    baseNodes,
    switchRecipe,
    combinations,
    variantFrame,
    (name, spec) => createSwitchFromSpec(name, spec)
  );
  section.appendChild(componentSet);

  // Label + disabled rows stay as flat demos
  const labelRow = createVariantRow("with label");
  const defaultSpec = resolveForFigma(switchRecipe, {
    variant: "primary",
    size: "medium",
    checked: "true",
  });

  for (const checked of [true, false]) {
    const spec = checked
      ? defaultSpec
      : resolveForFigma(switchRecipe, {
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
    wrapper.appendChild(createTextNode("Label", 14, 400, COLORS.neutral900));
    labelRow.appendChild(wrapper);
  }
  section.appendChild(labelRow);

  const disabledRow = createVariantRow("disabled");
  const disabledOn = createSwitchFromSpec(
    "disabled, checked=true",
    defaultSpec
  );
  disabledOn.opacity = 0.4;
  disabledRow.appendChild(disabledOn);
  const uncheckedSpec = resolveForFigma(switchRecipe, {
    variant: "primary",
    size: "medium",
    checked: "false",
  });
  const disabledOff = createSwitchFromSpec(
    "disabled, checked=false",
    uncheckedSpec
  );
  disabledOff.opacity = 0.4;
  disabledRow.appendChild(disabledOff);
  section.appendChild(disabledRow);

  container.appendChild(section);
}
