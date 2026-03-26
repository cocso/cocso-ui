/**
 * RadioGroup style data — extracted from radio-group.tsx for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import type { CSSProperties } from "react";

export type RadioSize = "large" | "medium" | "small";

export const sizeVars: Record<RadioSize, CSSProperties> = {
  large: {
    "--cocso-radio-size": "18px",
    "--cocso-radio-dot-size": "8px",
  } as CSSProperties,
  medium: {
    "--cocso-radio-size": "16px",
    "--cocso-radio-dot-size": "7px",
  } as CSSProperties,
  small: {
    "--cocso-radio-size": "14px",
    "--cocso-radio-dot-size": "6px",
  } as CSSProperties,
};
