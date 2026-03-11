import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { clsx as cx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { match } from "ts-pattern";
import { colors } from "../token";
import styles from "./spinner.module.css";

export type SpinnerSize = "x-large" | "large" | "medium" | "small";

export type SpinnerColor = "primary" | "neutral" | "white";

export interface SpinnerProps
  extends Omit<ComponentPropsWithoutRef<"div">, "size" | "color"> {
  color?: SpinnerColor;
  render?: useRender.RenderProp;
  size?: SpinnerSize;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      render: renderProp,
      className,
      style: _style,
      size = "medium",
      color = "primary",
      ...props
    },
    ref
  ) => {
    const style = {
      ..._style,
      "--cocso-spinner-size": getSize(size),
      "--cocso-spinner-border-width": getBorderWidth(size),
      "--cocso-spinner-border-color": getBorderColor(color),
      "--cocso-spinner-bg-color": getBackgroundColor(color),
    };

    const mergedClassName = cx(styles.spinner, className);

    return useRender({
      render: renderProp,
      ref,
      props: mergeProps<"div">({ className: mergedClassName, style }, props),
      defaultTagName: "div",
    });
  }
);

const getSize = (size: SpinnerSize) =>
  match(size)
    .with("x-large", () => "40px")
    .with("large", () => "32px")
    .with("medium", () => "24px")
    .with("small", () => "16px")
    .exhaustive();

const getBorderWidth = (size: SpinnerSize) =>
  match(size)
    .with("x-large", () => "5px")
    .with("large", () => "4px")
    .with("medium", () => "3px")
    .with("small", () => "2px")
    .exhaustive();

const getBorderColor = (color: SpinnerColor) =>
  match(color)
    .with("primary", () => colors.primary500)
    .with("neutral", () => colors.neutral600)
    .with("white", () => colors.white)
    .exhaustive();

const getBackgroundColor = (color: SpinnerColor) =>
  match(color)
    .with("primary", () => colors.primary100)
    .with("neutral", () => colors.neutral100)
    .with("white", () => colors.whiteAlpha20)
    .exhaustive();
