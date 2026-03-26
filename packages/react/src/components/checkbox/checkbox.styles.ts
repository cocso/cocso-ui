/**
 * Checkbox style functions — extracted from checkbox.tsx for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { colors } from "../../token";
import type { CheckboxSize, CheckboxStatus } from "./checkbox";

export type { CheckboxSize, CheckboxStatus } from "./checkbox";

export const getSize = (size: CheckboxSize): string =>
  match(size)
    .with("large", () => "18px")
    .with("medium", () => "16px")
    .with("small", () => "14px")
    .exhaustive();

export const getRadius = (size: CheckboxSize): string =>
  match(size)
    .with("large", () => "var(--cocso-radius-3)")
    .with("medium", () => "var(--cocso-radius-2)")
    .with("small", () => "var(--cocso-radius-1)")
    .exhaustive();

export const getBorderColor = (status: CheckboxStatus): string =>
  match(status)
    .with("on", () => colors.primary950)
    .with("intermediate", () => colors.primary950)
    .with("off", () => colors.neutral100)
    .exhaustive();

export const getBackgroundColor = (status: CheckboxStatus): string =>
  match(status)
    .with("on", () => colors.primary950)
    .with("intermediate", () => colors.primary950)
    .with("off", () => colors.white)
    .exhaustive();
