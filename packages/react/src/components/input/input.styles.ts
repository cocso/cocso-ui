/**
 * Input style functions — extracted from input.tsx for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { radius } from "../../token";

export type InputSize = "large" | "medium" | "small" | "x-small";

export const getStyles = (size: InputSize) =>
  match(size)
    .with("x-small", () => ({
      "--cocso-input-height": "28px",
      "--cocso-input-padding-x": "8px",
      "--cocso-input-font-size": "12px",
      "--cocso-input-border-radius": radius.r3,
    }))
    .with("small", () => ({
      "--cocso-input-height": "32px",
      "--cocso-input-padding-x": "10px",
      "--cocso-input-font-size": "12px",
      "--cocso-input-border-radius": radius.r3,
    }))
    .with("medium", () => ({
      "--cocso-input-height": "36px",
      "--cocso-input-padding-x": "12px",
      "--cocso-input-font-size": "14px",
      "--cocso-input-border-radius": radius.r4,
    }))
    .with("large", () => ({
      "--cocso-input-height": "40px",
      "--cocso-input-padding-x": "14px",
      "--cocso-input-font-size": "14px",
      "--cocso-input-border-radius": radius.r4,
    }))
    .exhaustive();
