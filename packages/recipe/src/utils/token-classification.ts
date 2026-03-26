import type { ComponentRef, CompoundBorder, FontWeightRef } from "../types";

export const COLOR_PREFIXES = new Set([
  "neutral",
  "primary",
  "danger",
  "warning",
  "success",
  "info",
  "white",
  "black",
  "text",
]);

export const CSS_LITERALS = new Set([
  "none",
  "currentColor",
  "100%",
  "inherit",
  // "transparent" is NOT here — it resolves as a color token
  // via var(--cocso-color-transparent) to match React's colors.transparent
]);

export const FONT_WEIGHT_MAP: Record<FontWeightRef, number> = {
  black: 900,
  bold: 700,
  extrabold: 800,
  extralight: 200,
  light: 300,
  medium: 500,
  normal: 400,
  semibold: 600,
  thin: 100,
};

export function isColorToken(value: string): boolean {
  if (value === "white" || value === "black" || value === "transparent") {
    return true;
  }
  const prefix = value.split("-")[0];
  return COLOR_PREFIXES.has(prefix);
}

export function isCompoundBorder(value: unknown): value is CompoundBorder {
  return (
    typeof value === "object" &&
    value !== null &&
    "_type" in value &&
    (value as CompoundBorder)._type === "border"
  );
}

export function isComponentRef(value: unknown): value is ComponentRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "component" in value &&
    "variant" in value
  );
}
