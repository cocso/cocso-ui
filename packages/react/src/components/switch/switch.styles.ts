import { match } from "ts-pattern";
import { colors } from "../../token";

export type SwitchSize = "large" | "medium" | "small";

export type SwitchVariant =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info";

export const UNCHECKED_BG = colors.neutral100;

export const getSwitchWidth = (size: SwitchSize) =>
  match(size)
    .with("large", () => "40px")
    .with("medium", () => "36px")
    .with("small", () => "32px")
    .exhaustive();

export const getSwitchHeight = (size: SwitchSize) =>
  match(size)
    .with("large", () => "22px")
    .with("medium", () => "20px")
    .with("small", () => "18px")
    .exhaustive();

export const getThumbSize = (size: SwitchSize) =>
  match(size)
    .with("large", () => "18px")
    .with("medium", () => "16px")
    .with("small", () => "14px")
    .exhaustive();

export const getThumbOffset = (_size: SwitchSize) => "2px";

export const getCheckedColor = (variant: SwitchVariant) =>
  match(variant)
    .with("primary", () => colors.primary950)
    .with("success", () => colors.success500)
    .with("error", () => colors.danger500)
    .with("warning", () => colors.warning500)
    .with("info", () => colors.info500)
    .exhaustive();
