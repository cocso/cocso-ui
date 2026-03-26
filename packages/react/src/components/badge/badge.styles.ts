/**
 * Badge style functions — extracted for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { colors } from "../../token";

export type BadgeSize = "large" | "medium" | "small";
export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "outline";
export type BadgeShape = "square" | "circle" | "rounded";

export const getPaddingY = (size: BadgeSize) =>
  match(size)
    .with("small", () => "3px")
    .with("medium", () => "4px")
    .with("large", () => "5px")
    .exhaustive();

export const getBorderRadius = (shape: BadgeShape, size: BadgeSize) =>
  match(shape)
    .with("square", () =>
      size === "small" ? "var(--cocso-radius-3)" : "var(--cocso-radius-4)"
    )
    .with("circle", () => "100%")
    .with("rounded", () => "var(--cocso-radius-full)")
    .exhaustive();

export const getPadding = (size: BadgeSize) =>
  match(size)
    .with("small", () => "3px 6px")
    .with("medium", () => "4px 8px")
    .with("large", () => "5px 10px")
    .exhaustive();

export const getFontSize = (size: BadgeSize) =>
  match(size)
    .with("small", () => 11)
    .with("medium", () => 12)
    .with("large", () => 14)
    .exhaustive();

export const getFontColor = (variant: BadgeVariant) =>
  match(variant)
    .with("secondary", () => colors.neutral600)
    .with("error", () => colors.danger600)
    .with("primary", () => colors.white)
    .with("success", () => colors.success600)
    .with("warning", () => colors.warning600)
    .with("info", () => colors.info600)
    .with("outline", () => colors.neutral950)
    .exhaustive();

export const getBackgroundColor = (variant: BadgeVariant) =>
  match(variant)
    .with("secondary", () => colors.neutral50)
    .with("error", () => colors.danger50)
    .with("primary", () => colors.primary950)
    .with("success", () => colors.success50)
    .with("warning", () => colors.warning50)
    .with("info", () => colors.info50)
    .with("outline", () => colors.transparent)
    .exhaustive();

export const getBorder = (variant: BadgeVariant) =>
  match(variant)
    .with("outline", () => `1px solid ${colors.neutral100}`)
    .otherwise(() => "none");
