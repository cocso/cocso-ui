import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { clsx as cx } from "clsx";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { match } from "ts-pattern";
import { Spinner } from "../spinner";
import type { FontWeight } from "../token";
import { colors, fontWeight } from "../token";
import styles from "./button.module.css";

export type ButtonSize = "x-large" | "large" | "medium" | "small" | "x-small";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "error"
  | "warning"
  | "neutral";

export type ButtonShape = "square" | "circle" | "rounded";

export interface ButtonProps
  extends Omit<ComponentProps<"button">, "prefix"> {
  disabled?: boolean;
  loading?: boolean;
  prefix?: ReactNode;
  render?: useRender.RenderProp;
  shape?: ButtonShape;
  size?: ButtonSize;
  suffix?: ReactNode;
  svgOnly?: boolean;
  variant?: ButtonVariant;
  weight?: FontWeight;
}

export function Button({
  render: renderProp,
  ref,
  className,
  style: _style,
  children,
  size = "medium",
  variant = "primary",
  weight = "medium",
  shape = "square",
  prefix,
  suffix,
  svgOnly = false,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  const style = {
    ..._style,
    ...getSizeStyles(size),
    "--cocso-button-font-color": getColor(variant),
    "--cocso-button-font-weight": fontWeight[weight],
    "--cocso-button-border": getBorder(variant),
    "--cocso-button-border-radius": getBorderRadius(shape, size),
    "--cocso-button-bg-color": getBackgroundColor(variant),
    "--cocso-button-bg-color-hover": getBackgroundColorHover(variant),
    "--cocso-button-bg-color-active": getBackgroundColorActive(variant),
  } as CSSProperties;

  const isDisabled = disabled || loading;
  const mergedClassName = cx(
    styles.button,
    isDisabled && styles.disabled,
    svgOnly && styles.svgOnly,
    className
  );

  const renderButtonContent = (ctx: ReactNode) => (
    <>
      {loading && (
        <span className={styles.spinnerOverlay}>
          <Spinner color="white" size="small" />
        </span>
      )}
      <span className={cx(styles.buttonInner, loading && styles.invisible)}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.content}>{ctx}</span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
    </>
  );

  return useRender({
    render: renderProp,
    ref,
    props: mergeProps<"button">(
      { className: mergedClassName, style, disabled: isDisabled, type: "button" as const },
      props,
      { children: renderButtonContent(children) }
    ),
    defaultTagName: "button",
  });
}

const getSizeStyles = (size: ButtonSize) => {
  const height = match(size)
    .with("x-large", () => 56)
    .with("large", () => 48)
    .with("medium", () => 40)
    .with("small", () => 32)
    .with("x-small", () => 28)
    .exhaustive();
  const inlinePadding = match(size)
    .with("x-large", () => 16)
    .with("large", () => 14)
    .with("medium", () => 10)
    .with("small", () => 8)
    .with("x-small", () => 6)
    .exhaustive();
  const contentPadding = match(size)
    .with("x-large", () => "0 6px")
    .with("large", () => "0 6px")
    .with("medium", () => "0 6px")
    .with("small", () => "0 2px")
    .with("x-small", () => "0")
    .exhaustive();
  const fontSize = match(size)
    .with("x-large", () => 16)
    .with("large", () => 16)
    .with("x-small", () => 12)
    .otherwise(() => 14);

  return {
    "--cocso-button-height": `${height}px`,
    "--cocso-button-padding-inline": `${inlinePadding}px`,
    "--cocso-button-content-padding": contentPadding,
    "--cocso-button-font-size": `${fontSize}px`,
  };
};

const getBorderRadius = (shape: ButtonShape, size: ButtonSize) =>
  match(shape)
    .with("square", () =>
      match(size)
        .with("x-small", () => "4px")
        .otherwise(() => "6px")
    )
    .with("circle", () => "100%")
    .with("rounded", () => "100px")
    .exhaustive();

const getColor = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", "success", "error", "neutral", () => colors.white)
    .with("secondary", "tertiary", "warning", () => colors.neutral950)
    .exhaustive();

const getBorder = (variant: ButtonVariant) =>
  match(variant)
    .with("tertiary", () => `1px solid ${colors.neutral100}`)
    .otherwise(() => "none");

const getBackgroundColor = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary500)
    .with("secondary", () => colors.white)
    .with("tertiary", () => colors.transparent)
    .with("success", () => colors.success500)
    .with("error", () => colors.danger500)
    .with("warning", () => colors.warning300)
    .with("neutral", () => colors.neutral950)
    .exhaustive();

const getBackgroundColorHover = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary600)
    .with("secondary", () => colors.neutral50)
    .with("tertiary", () => colors.neutral50)
    .with("success", () => colors.success600)
    .with("error", () => colors.danger600)
    .with("warning", () => colors.warning400)
    .with("neutral", () => colors.neutral800)
    .exhaustive();

const getBackgroundColorActive = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary700)
    .with("secondary", () => colors.neutral100)
    .with("tertiary", () => colors.neutral100)
    .with("success", () => colors.success700)
    .with("error", () => colors.danger700)
    .with("warning", () => colors.warning500)
    .with("neutral", () => colors.neutral700)
    .exhaustive();
