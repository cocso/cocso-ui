import type { ComponentProps, Ref } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import { mergeProps } from "../../primitives/merge-props";
import { type RenderProp, useRender } from "../../primitives/use-render";
import type {
  FontSize,
  FontWeight,
  LineHeight,
  ResponsiveFontSize,
} from "../../token";
import {
  fontSize as fontSizeToken,
  fontWeight as fontWeightToken,
  lineHeight as lineHeightToken,
} from "../../token";
import styles from "./typography.module.css";

export type BodySize = "large" | "medium" | "small" | "x-small";

export type HeadingSize = "x-large" | "large" | "medium" | "small" | "x-small";

const HEADING_SIZES = [
  "x-large",
  "large",
  "medium",
  "small",
  "x-small",
] as const;

const isHeadingSize = (value: unknown): value is HeadingSize =>
  typeof value === "string" &&
  (HEADING_SIZES as readonly string[]).includes(value);

/** Semantic heading rank rendered as `h1`–`h6`. Independent of visual `size`. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type TypographyPropsBase = {
  ref?: Ref<HTMLElement>;
  render?: RenderProp;
  weight?: FontWeight;
  lineHeight?: LineHeight;
} & Omit<ComponentProps<"p">, "ref">;

type CustomTypographyProps = TypographyPropsBase & {
  type: "custom";
  size?: ResponsiveFontSize | "current";
};

type BodyTypographyProps = TypographyPropsBase & {
  type?: "body";
  size?: BodySize;
};

type HeadingTypographyProps = TypographyPropsBase & {
  type: "heading";
  level?: HeadingLevel;
  /**
   * A named heading step, or any size from the font scale when the named steps
   * do not fit — `size={18}` is the section-heading step, which the named scale
   * does not cover (`small` is 16, the same as `body` `medium`).
   *
   * Reach for a numeric size rather than `type="custom"`: `custom` renders a
   * `<p>`, so using it for a heading removes the element from the document
   * outline.
   */
  size?: HeadingSize | ResponsiveFontSize;
};
export type TypographyProps =
  | CustomTypographyProps
  | BodyTypographyProps
  | HeadingTypographyProps;
export function Typography({
  ref,
  render: renderProp,
  className,
  style: _style,
  color,
  type = "body",
  weight = type === "heading" ? "bold" : "normal",
  lineHeight = "normal",
  ...props
}: TypographyProps) {
  const level = (props as { level?: HeadingLevel }).level;
  if (type === "heading") {
    Reflect.deleteProperty(props, "level");
  }
  const defaultTagName = getDefaultTagName(type, level);
  const rawSize = (props as { size?: unknown }).size;
  const isCurrent = rawSize === "current";

  const fontSizeStyles: Record<string, string> = {};

  if (!isCurrent) {
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

    fontSizeStyles["--cocso-typography-font-size"] = `${fontSizeToken[base]}px`;
    if (tablet !== undefined) {
      fontSizeStyles["--cocso-tablet-typography-font-size"] =
        `${fontSizeToken[tablet]}px`;
    }
    if (desktop !== undefined) {
      fontSizeStyles["--cocso-desktop-typography-font-size"] =
        `${fontSizeToken[desktop]}px`;
    }
  }

  const style = {
    ..._style,
    "--cocso-typography-font-color": color,
    ...fontSizeStyles,
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

const getDefaultTagName = (
  type: TypographyProps["type"],
  level?: HeadingLevel
) =>
  match(type)
    .with("heading", () => `h${level ?? 2}` as const)
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
    .with("custom", () => (props as CustomTypographyProps).size ?? 16)
    .with("body", () =>
      getBodyFontSize(
        ((props as BodyTypographyProps).size ?? "medium") as BodySize
      )
    )
    .with("heading", () => {
      const size = (props as HeadingTypographyProps).size ?? "medium";
      return isHeadingSize(size) ? getHeadingFontSize(size) : size;
    })
    .otherwise(() => 16);
