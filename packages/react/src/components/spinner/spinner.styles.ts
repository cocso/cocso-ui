/**
 * Spinner style functions — extracted for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { colors } from "../../token";

export type SpinnerSize = "large" | "medium" | "small";

export type SpinnerVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "white";

export interface SizeConfig {
  blades: number;
  height: number;
  output: number;
  radius: number;
  width: number;
}

export const getSizeConfig = (size: SpinnerSize): SizeConfig =>
  match(size)
    .with("large", () => ({
      blades: 10,
      width: 2,
      height: 6,
      radius: 1,
      output: 20,
    }))
    .with("medium", () => ({
      blades: 8,
      width: 2,
      height: 5,
      radius: 1,
      output: 16,
    }))
    .with("small", () => ({
      blades: 6,
      width: 1.5,
      height: 4,
      radius: 0.75,
      output: 12,
    }))
    .exhaustive();

export const getBladeColor = (variant: SpinnerVariant): string =>
  match(variant)
    .with("primary", () => colors.primary950)
    .with("secondary", () => colors.neutral500)
    .with("success", () => colors.success500)
    .with("error", () => colors.danger500)
    .with("warning", () => colors.warning500)
    .with("info", () => colors.info500)
    .with("white", () => colors.white)
    .exhaustive();
