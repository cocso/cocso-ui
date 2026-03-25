/**
 * Component registry: single source of truth for generator specs.
 * All values are extracted from packages/react source code and CSS modules.
 * When React components change, update this registry to keep Figma in sync.
 */

import { COLORS } from "./shared";

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

export const BUTTON_SIZES = ["large", "medium", "small", "x-small"] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "success",
  "error",
  "warning",
  "info",
] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export interface ButtonSizeSpec {
  borderRadius: number;
  contentPadding: number;
  fontSize: number;
  height: number;
  paddingInline: number;
}

export const BUTTON_SIZE_SPECS: Record<ButtonSize, ButtonSizeSpec> = {
  large: {
    height: 40,
    paddingInline: 14,
    contentPadding: 6,
    fontSize: 14,
    borderRadius: 8,
  },
  medium: {
    height: 36,
    paddingInline: 12,
    contentPadding: 6,
    fontSize: 14,
    borderRadius: 8,
  },
  small: {
    height: 32,
    paddingInline: 10,
    contentPadding: 2,
    fontSize: 14,
    borderRadius: 6,
  },
  "x-small": {
    height: 28,
    paddingInline: 8,
    contentPadding: 0,
    fontSize: 12,
    borderRadius: 6,
  },
};

export interface ButtonVariantSpec {
  bgColor: RGB;
  bgOpacity?: number;
  borderColor?: RGB;
  textColor: RGB;
}

export const BUTTON_VARIANT_SPECS: Record<ButtonVariant, ButtonVariantSpec> = {
  primary: { bgColor: COLORS.neutral950, textColor: COLORS.white },
  secondary: { bgColor: COLORS.neutral50, textColor: COLORS.neutral600 },
  outline: {
    bgColor: COLORS.white,
    bgOpacity: 0,
    textColor: COLORS.neutral950,
    borderColor: COLORS.neutral100,
  },
  ghost: { bgColor: COLORS.white, textColor: COLORS.neutral950 },
  success: { bgColor: COLORS.success500, textColor: COLORS.white },
  error: { bgColor: COLORS.danger500, textColor: COLORS.white },
  warning: { bgColor: COLORS.warning300, textColor: COLORS.neutral950 },
  info: { bgColor: COLORS.info500, textColor: COLORS.white },
};

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

export const BADGE_SIZES = ["large", "medium", "small"] as const;
export type BadgeSize = (typeof BADGE_SIZES)[number];

export const BADGE_VARIANTS = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "outline",
] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export interface BadgeSizeSpec {
  borderRadius: number;
  fontSize: number;
  paddingX: number;
  paddingY: number;
}

export const BADGE_SIZE_SPECS: Record<BadgeSize, BadgeSizeSpec> = {
  large: { paddingX: 10, paddingY: 5, fontSize: 14, borderRadius: 8 },
  medium: { paddingX: 8, paddingY: 4, fontSize: 12, borderRadius: 8 },
  small: { paddingX: 6, paddingY: 3, fontSize: 11, borderRadius: 6 },
};

export interface BadgeVariantSpec {
  bgColor: RGB;
  bgOpacity?: number;
  borderColor?: RGB;
  textColor: RGB;
}

export const BADGE_VARIANT_SPECS: Record<BadgeVariant, BadgeVariantSpec> = {
  primary: { bgColor: COLORS.primary950, textColor: COLORS.white },
  secondary: { bgColor: COLORS.neutral50, textColor: COLORS.neutral600 },
  success: { bgColor: COLORS.success50, textColor: COLORS.success600 },
  error: { bgColor: COLORS.danger50, textColor: COLORS.danger600 },
  warning: { bgColor: COLORS.warning50, textColor: COLORS.warning600 },
  info: { bgColor: COLORS.info50, textColor: COLORS.info600 },
  outline: {
    bgColor: COLORS.white,
    bgOpacity: 0,
    textColor: COLORS.neutral950,
    borderColor: COLORS.neutral100,
  },
};

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export const INPUT_SIZES = ["large", "medium", "small", "x-small"] as const;
export type InputSize = (typeof INPUT_SIZES)[number];

export interface InputSizeSpec {
  borderRadius: number;
  fontSize: number;
  height: number;
  paddingX: number;
}

export const INPUT_SIZE_SPECS: Record<InputSize, InputSizeSpec> = {
  large: { height: 40, paddingX: 14, fontSize: 14, borderRadius: 8 },
  medium: { height: 36, paddingX: 12, fontSize: 14, borderRadius: 8 },
  small: { height: 32, paddingX: 10, fontSize: 12, borderRadius: 6 },
  "x-small": { height: 28, paddingX: 8, fontSize: 12, borderRadius: 6 },
};

/** Input uses box-shadow for border, not CSS border. */
export const INPUT_COLORS = {
  background: COLORS.white,
  borderDefault: COLORS.neutral100,
  borderError: COLORS.danger500,
  placeholder: COLORS.neutral400,
  text: COLORS.neutral950,
};

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

export const CHECKBOX_SIZES = ["large", "medium", "small"] as const;
export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

export const CHECKBOX_STATUSES = ["off", "on", "intermediate"] as const;
export type CheckboxStatus = (typeof CHECKBOX_STATUSES)[number];

export interface CheckboxSizeSpec {
  borderRadius: number;
  fontSize: number;
  size: number;
}

export const CHECKBOX_SIZE_SPECS: Record<CheckboxSize, CheckboxSizeSpec> = {
  large: { size: 18, borderRadius: 6, fontSize: 14 },
  medium: { size: 16, borderRadius: 4, fontSize: 14 },
  small: { size: 14, borderRadius: 2, fontSize: 12 },
};

export const CHECKBOX_COLORS = {
  bgChecked: COLORS.primary950,
  bgUnchecked: COLORS.white,
  borderChecked: COLORS.primary950,
  borderUnchecked: COLORS.neutral100,
  iconColor: COLORS.white,
  labelColor: COLORS.neutral950,
};

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

export const SWITCH_SIZES = ["large", "medium", "small"] as const;
export type SwitchSize = (typeof SWITCH_SIZES)[number];

export const SWITCH_VARIANTS = [
  "primary",
  "success",
  "error",
  "warning",
  "info",
] as const;
export type SwitchVariant = (typeof SWITCH_VARIANTS)[number];

export interface SwitchSizeSpec {
  height: number;
  thumb: number;
  thumbOffset: number;
  width: number;
}

export const SWITCH_SIZE_SPECS: Record<SwitchSize, SwitchSizeSpec> = {
  large: { width: 40, height: 22, thumb: 18, thumbOffset: 2 },
  medium: { width: 36, height: 20, thumb: 16, thumbOffset: 2 },
  small: { width: 32, height: 18, thumb: 14, thumbOffset: 2 },
};

export const SWITCH_VARIANT_COLORS: Record<SwitchVariant, RGB> = {
  primary: COLORS.primary950,
  success: COLORS.success500,
  error: COLORS.danger500,
  warning: COLORS.warning500,
  info: COLORS.info500,
};

export const SWITCH_COLORS = {
  thumbBg: COLORS.white,
  trackUnchecked: COLORS.neutral100,
};

// ---------------------------------------------------------------------------
// Radio
// ---------------------------------------------------------------------------

export const RADIO_SIZES = ["large", "medium", "small"] as const;
export type RadioSize = (typeof RADIO_SIZES)[number];

export interface RadioSizeSpec {
  dotSize: number;
  outerSize: number;
}

export const RADIO_SIZE_SPECS: Record<RadioSize, RadioSizeSpec> = {
  large: { outerSize: 18, dotSize: 8 },
  medium: { outerSize: 16, dotSize: 7 },
  small: { outerSize: 14, dotSize: 6 },
};

/** Radio always has primary-950 border (2px) regardless of checked state. */
export const RADIO_COLORS = {
  border: COLORS.primary950,
  borderWidth: 2,
  dotColor: COLORS.primary950,
  labelColor: COLORS.neutral950,
  outerBg: COLORS.white,
};

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

export const SELECT_SIZES = ["large", "medium", "small", "x-small"] as const;
export type SelectSize = (typeof SELECT_SIZES)[number];

export interface SelectSizeSpec {
  borderRadius: number;
  fontSize: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
}

export const SELECT_SIZE_SPECS: Record<SelectSize, SelectSizeSpec> = {
  large: {
    height: 40,
    paddingLeft: 14,
    paddingRight: 42,
    fontSize: 14,
    borderRadius: 8,
  },
  medium: {
    height: 36,
    paddingLeft: 12,
    paddingRight: 38,
    fontSize: 14,
    borderRadius: 8,
  },
  small: {
    height: 32,
    paddingLeft: 10,
    paddingRight: 32,
    fontSize: 12,
    borderRadius: 6,
  },
  "x-small": {
    height: 28,
    paddingLeft: 8,
    paddingRight: 26,
    fontSize: 12,
    borderRadius: 6,
  },
};

export const SELECT_COLORS = {
  background: COLORS.white,
  borderDefault: COLORS.neutral100,
  iconColor: COLORS.neutral500,
  text: COLORS.neutral950,
};

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

export const SPINNER_SIZES = ["large", "medium", "small"] as const;
export type SpinnerSize = (typeof SPINNER_SIZES)[number];

export const SPINNER_VARIANTS = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "white",
] as const;
export type SpinnerVariant = (typeof SPINNER_VARIANTS)[number];

export const SPINNER_SIZE_SPECS: Record<SpinnerSize, number> = {
  large: 20,
  medium: 16,
  small: 12,
};

export const SPINNER_VARIANT_COLORS: Record<SpinnerVariant, RGB> = {
  primary: COLORS.primary950,
  secondary: COLORS.neutral500,
  success: COLORS.success500,
  error: COLORS.danger500,
  warning: COLORS.warning500,
  info: COLORS.info500,
  white: COLORS.white,
};

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

export const LINK_SIZES = [
  { fontSize: 18, name: "large" },
  { fontSize: 16, name: "medium" },
  { fontSize: 14, name: "small" },
  { fontSize: 12, name: "x-small" },
] as const;

export const LINK_VARIANTS = ["inline", "current", "plain"] as const;
export type LinkVariant = (typeof LINK_VARIANTS)[number];

export const LINK_VARIANT_COLORS: Record<LinkVariant, RGB> = {
  inline: COLORS.info500,
  current: COLORS.neutral950,
  plain: COLORS.info500,
};

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export const TOOLTIP_SPEC = {
  background: COLORS.neutral900,
  borderRadius: 4,
  fontSize: 12,
  lineHeight: 1.5,
  paddingBlock: 4,
  paddingInline: 8,
  textColor: COLORS.white,
};

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const HEADING_SIZES = [
  { fontSize: 28, name: "x-large" },
  { fontSize: 24, name: "large" },
  { fontSize: 20, name: "medium" },
  { fontSize: 16, name: "small" },
  { fontSize: 14, name: "x-small" },
] as const;

export const BODY_SIZES = [
  { fontSize: 18, name: "large" },
  { fontSize: 16, name: "medium" },
  { fontSize: 14, name: "small" },
  { fontSize: 12, name: "x-small" },
] as const;

export const FONT_WEIGHTS = [
  { name: "regular", value: 400 },
  { name: "medium", value: 500 },
  { name: "semibold", value: 600 },
  { name: "bold", value: 700 },
] as const;
