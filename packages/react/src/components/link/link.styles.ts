/**
 * Link style functions — extracted from link.tsx for conformance testing.
 * NOT exported via the package barrel (index.ts). Internal only.
 */
import { match } from "ts-pattern";
import { colors } from "../../token";
import type { LinkVariant } from "./link";

export type { LinkVariant } from "./link";

export const getColor = (variant: LinkVariant) =>
  match(variant)
    .with("inline", () => colors.info500)
    .with("current", () => "currentColor")
    .with("plain", () => colors.info500)
    .exhaustive();

export const getColorHover = (variant: LinkVariant) =>
  match(variant)
    .with("inline", () => colors.info700)
    .with("current", () => "currentColor")
    .with("plain", () => colors.info700)
    .exhaustive();
