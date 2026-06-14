import { COLORS } from "./shared";

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
