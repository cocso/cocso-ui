import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { clsx as cx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { match } from "ts-pattern";
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

export type BodySize = "large" | "medium" | "small" | "x-small";
export type DisplaySize = "large" | "medium" | "small";
export type HeadingSize = "x-large" | "large" | "medium" | "small" | "x-small";

type TypographyPropsBase = {
  render?: useRender.RenderProp;
  weight?: FontWeight;
  lineHeight?: LineHeight;
} & ComponentPropsWithoutRef<"p">;

type CustomTypographyProps = TypographyPropsBase & {
  type?: "custom";
  size?: ResponsiveFontSize;
};

type BodyTypographyProps = TypographyPropsBase & {
  type: "body";
  size?: BodySize;
};

type DisplayTypographyProps = TypographyPropsBase & {
  type: "display";
  size?: DisplaySize;
};

type HeadingTypographyProps = TypographyPropsBase & {
  type: "heading";
  size?: HeadingSize;
};

export type TypographyProps =
  | CustomTypographyProps
  | BodyTypographyProps
  | DisplayTypographyProps
  | HeadingTypographyProps;

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      render: renderProp,
      className,
      style: _style,
      color,
      type = "custom",
      weight = type === "heading" ? "bold" : "normal",
      lineHeight = "normal",
      ...props
    },
    ref
  ) => {
    const defaultTagName = match(type)
      .with("display", () => "h1" as const)
      .with("heading", () => "h2" as const)
      .otherwise(() => "p" as const);

    const fontSize = match(type)
      .with("custom", () => (props as CustomTypographyProps).size ?? 16)
      .with("body", () =>
        match((props as BodyTypographyProps).size ?? "medium")
          .with("large", () => 18 as FontSize)
          .with("medium", () => 16 as FontSize)
          .with("small", () => 14 as FontSize)
          .with("x-small", () => 12 as FontSize)
          .exhaustive()
      )
      .with("display", () =>
        match((props as DisplayTypographyProps).size ?? "medium")
          .with("large", () => ({
            base: 44 as FontSize,
            tablet: 60 as FontSize,
          }))
          .with("medium", () => ({
            base: 32 as FontSize,
            tablet: 44 as FontSize,
          }))
          .with("small", () => ({
            base: 28 as FontSize,
            tablet: 36 as FontSize,
          }))
          .exhaustive()
      )
      .with("heading", () =>
        match((props as HeadingTypographyProps).size ?? "medium")
          .with("x-large", () => ({
            base: 28 as FontSize,
            tablet: 36 as FontSize,
          }))
          .with("large", () => ({
            base: 24 as FontSize,
            tablet: 32 as FontSize,
          }))
          .with("medium", () => ({
            base: 20 as FontSize,
            tablet: 24 as FontSize,
          }))
          .with("small", () => 18 as FontSize)
          .with("x-small", () => 16 as FontSize)
          .exhaustive()
      )
      .otherwise(() => 16);

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

    const mergedClassName = cx(styles.typography, className);

    return useRender({
      render: renderProp,
      ref,
      props: mergeProps<"p">({ className: mergedClassName, style }, props),
      defaultTagName,
    });
  }
);
