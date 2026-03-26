/**
 * Select style functions — extracted from select.tsx for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { radius } from "../../token";

export type SelectSize = "large" | "medium" | "small" | "x-small";

export const getIconSize = (size: SelectSize) =>
  match(size)
    .with("x-small", () => 10)
    .with("small", () => 12)
    .with("medium", () => 14)
    .with("large", () => 14)
    .exhaustive();

export const getStyles = (size: SelectSize) =>
  match(size)
    .with("x-small", () => ({
      "--cocso-select-min-width": "28px",
      "--cocso-select-height": "28px",
      "--cocso-select-padding-left": "8px",
      "--cocso-select-padding-right": "26px",
      "--cocso-select-icon-right": "8px",
      "--cocso-select-font-size": "12px",
      "--cocso-select-border-radius": radius.r3,
    }))
    .with("small", () => ({
      "--cocso-select-min-width": "32px",
      "--cocso-select-height": "32px",
      "--cocso-select-padding-left": "10px",
      "--cocso-select-padding-right": "32px",
      "--cocso-select-icon-right": "10px",
      "--cocso-select-font-size": "12px",
      "--cocso-select-border-radius": radius.r3,
    }))
    .with("medium", () => ({
      "--cocso-select-min-width": "36px",
      "--cocso-select-height": "36px",
      "--cocso-select-padding-left": "12px",
      "--cocso-select-padding-right": "38px",
      "--cocso-select-icon-right": "12px",
      "--cocso-select-font-size": "14px",
      "--cocso-select-border-radius": radius.r4,
    }))
    .with("large", () => ({
      "--cocso-select-min-width": "40px",
      "--cocso-select-height": "40px",
      "--cocso-select-padding-left": "14px",
      "--cocso-select-padding-right": "42px",
      "--cocso-select-icon-right": "14px",
      "--cocso-select-font-size": "14px",
      "--cocso-select-border-radius": radius.r4,
    }))
    .exhaustive();
