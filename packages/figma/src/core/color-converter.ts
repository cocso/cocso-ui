import type { FigmaColorValue } from "../types/token-schema";

function isValidChannel(n: number): boolean {
  return typeof n === "number" && !Number.isNaN(n) && n >= 0 && n <= 1;
}

/** Validate that all RGBA channels are within the 0–1 range. */
export function isValidColor(color: FigmaColorValue): boolean {
  return (
    isValidChannel(color.r) &&
    isValidChannel(color.g) &&
    isValidChannel(color.b) &&
    isValidChannel(color.a)
  );
}

function clampChannel(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Clamp all RGBA channels to the 0–1 range. */
export function clampColor(color: FigmaColorValue): FigmaColorValue {
  return {
    r: clampChannel(color.r),
    g: clampChannel(color.g),
    b: clampChannel(color.b),
    a: clampChannel(color.a),
  };
}
