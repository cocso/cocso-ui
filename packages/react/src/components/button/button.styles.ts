/**
 * Button style functions — extracted from button.tsx for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { colors } from "../../token";
import type { SpinnerVariant } from "../spinner";
import type { ButtonShape, ButtonSize, ButtonVariant } from "./button";

export { fontWeight as fontWeightToken } from "../../token";
export type { ButtonShape, ButtonSize, ButtonVariant } from "./button";

export const getSizeStyles = (size: ButtonSize) => {
  const height = match(size)
    .with("large", () => 40)
    .with("medium", () => 36)
    .with("small", () => 32)
    .with("x-small", () => 28)
    .exhaustive();
  const inlinePadding = match(size)
    .with("large", () => 14)
    .with("medium", () => 12)
    .with("small", () => 10)
    .with("x-small", () => 8)
    .exhaustive();
  const contentPadding = match(size)
    .with("large", () => "0 6px")
    .with("medium", () => "0 6px")
    .with("small", () => "0 2px")
    .with("x-small", () => "0")
    .exhaustive();
  const fontSize = match(size)
    .with("x-small", () => 12)
    .otherwise(() => 14);

  return {
    "--cocso-button-height": `${height}px`,
    "--cocso-button-padding-inline": `${inlinePadding}px`,
    "--cocso-button-content-padding": contentPadding,
    "--cocso-button-font-size": `${fontSize}px`,
  };
};

export const getBorderRadius = (shape: ButtonShape, size: ButtonSize) =>
  match(shape)
    .with("square", () =>
      match(size)
        .with("x-small", () => "var(--cocso-radius-3)")
        .otherwise(() => "var(--cocso-radius-4)")
    )
    .with("circle", () => "100%")
    .with("rounded", () => "var(--cocso-radius-full)")
    .exhaustive();

export const getColor = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", "success", "error", "info", () => colors.white)
    .with("secondary", () => colors.neutral600)
    .with("outline", "ghost", "warning", () => colors.neutral950)
    .exhaustive();

export const getBorder = (variant: ButtonVariant) =>
  match(variant)
    .with("outline", () => `1px solid ${colors.neutral100}`)
    .otherwise(() => "none");

export const getBackgroundColor = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary950)
    .with("secondary", () => colors.neutral50)
    .with("outline", () => colors.transparent)
    .with("ghost", () => colors.white)
    .with("success", () => colors.success500)
    .with("error", () => colors.danger500)
    .with("warning", () => colors.warning300)
    .with("info", () => colors.info500)
    .exhaustive();

export const getBackgroundColorHover = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary800)
    .with("secondary", () => colors.neutral100)
    .with("outline", "ghost", () => colors.neutral50)
    .with("success", () => colors.success600)
    .with("error", () => colors.danger600)
    .with("warning", () => colors.warning400)
    .with("info", () => colors.info600)
    .exhaustive();

export const getSpinnerVariant = (variant: ButtonVariant): SpinnerVariant =>
  match(variant)
    .with("primary", "success", "error", "info", () => "white" as const)
    .with(
      "secondary",
      "outline",
      "ghost",
      "warning",
      () => "secondary" as const
    )
    .exhaustive();

export const getBackgroundColorActive = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary700)
    .with("secondary", () => colors.neutral200)
    .with("outline", "ghost", () => colors.neutral100)
    .with("success", () => colors.success700)
    .with("error", () => colors.danger700)
    .with("warning", () => colors.warning500)
    .with("info", () => colors.info700)
    .exhaustive();
