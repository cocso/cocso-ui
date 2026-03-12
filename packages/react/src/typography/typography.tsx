import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { ComponentProps, Ref } from "react";
import { match } from "ts-pattern";
import { cn } from "../cn";
import type {
  FontSize,
  FontWeight,
  LineHeight,
  ResponsiveFontSize,
} from "../token";
import {
  fontSize as fontSizeToken,
  fontWeight as fontWeightToken,
  lineHeight as lineHeightToken,
} from "../token";
import styles from "./typography.module.css";

/** Available size variants for body text. */
export type BodySize = "large" | "medium" | "small" | "x-small";

/** Available size variants for heading text. */
export type HeadingSize = "x-large" | "large" | "medium" | "small" | "x-small";

type TypographyPropsBase = {
  ref?: Ref<HTMLElement>;
  render?: useRender.RenderProp;
  weight?: FontWeight;
  lineHeight?: LineHeight;
} & Omit<ComponentProps<"p">, "ref">;

type CustomTypographyProps = TypographyPropsBase & {
  type?: "custom";
  size?: ResponsiveFontSize;
};

type BodyTypographyProps = TypographyPropsBase & {
  type: "body";
  size?: BodySize;
};

type HeadingTypographyProps = TypographyPropsBase & {
  type: "heading";
  size?: HeadingSize;
};

/** Union of all valid prop shapes for the Typography component. */
export type TypographyProps =
  | CustomTypographyProps
  | BodyTypographyProps
  | HeadingTypographyProps;

/**
 * A polymorphic text component supporting body, heading, and custom type variants
 * with responsive font size, weight, and line-height control via CSS variables.
 */
export function Typography({
  ref,
  render: renderProp,
  className,
  style: _style,
  color,
  type = "custom",
  weight = type === "heading" ? "bold" : "normal",
  lineHeight = "normal",
  ...props
}: TypographyProps) {
  const defaultTagName = getDefaultTagName(type);
  const fontSize = getFontSize(type, props as TypographyProps);

  let base: FontSize;
  let tablet: FontSize | undefined;
  let desktop: FontSize | undefined;

  if (Array.isArray(fontSize)) {
    [base, tablet, desktop] = fontSize;
  } else if (typeof fontSize === "object") {
    ({ base, tablet, desktop } = fontSize);
  } else {
    base = fontSize as FontSize;
  }

  const style = {
    ..._style,
    "--cocso-typography-font-color": color,
    "--cocso-typography-font-size": `${fontSizeToken[base]}px`,
    ...(tablet !== undefined && {
      "--cocso-tablet-typography-font-size": `${fontSizeToken[tablet]}px`,
    }),
    ...(desktop !== undefined && {
      "--cocso-desktop-typography-font-size": `${fontSizeToken[desktop]}px`,
    }),
    "--cocso-typography-font-weight": fontWeightToken[weight],
    "--cocso-typography-line-height": lineHeightToken[lineHeight],
  };

  const mergedClassName = cn(styles.typography, className);

  return useRender({
    render: renderProp,
    ref,
    props: mergeProps<"p">({ className: mergedClassName, style }, props),
    defaultTagName,
  });
}

const getDefaultTagName = (type: TypographyProps["type"]) =>
  match(type)
    .with("heading", () => "h2" as const)
    .otherwise(() => "p" as const);

const getBodyFontSize = (size: BodySize) =>
  match(size)
    .with("large", () => 18 as FontSize)
    .with("medium", () => 16 as FontSize)
    .with("small", () => 14 as FontSize)
    .with("x-small", () => 12 as FontSize)
    .exhaustive();

const getHeadingFontSize = (size: HeadingSize) =>
  match(size)
    .with("x-large", () => ({ base: 28 as FontSize, tablet: 36 as FontSize }))
    .with("large", () => ({ base: 24 as FontSize, tablet: 32 as FontSize }))
    .with("medium", () => ({ base: 20 as FontSize, tablet: 28 as FontSize }))
    .with("small", () => 16 as FontSize)
    .with("x-small", () => 14 as FontSize)
    .exhaustive();

const getFontSize = (type: TypographyProps["type"], props: TypographyProps) =>
  match(type)
    .with("custom", () => (props as CustomTypographyProps).size ?? 15)
    .with("body", () =>
      getBodyFontSize((props as BodyTypographyProps).size ?? "medium")
    )
    .with("heading", () =>
      getHeadingFontSize((props as HeadingTypographyProps).size ?? "medium")
    )
    .otherwise(() => 16);
