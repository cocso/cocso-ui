import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import { mergeProps } from "../../primitives/merge-props";
import { useRender } from "../../primitives/use-render";
import type { FontWeight } from "../../token";
import { colors, fontWeight } from "../../token";
import type { SpinnerVariant } from "../spinner";
import { Spinner } from "../spinner";
import styles from "./button.module.css";

export type ButtonSize = "large" | "medium" | "small" | "x-small";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "error"
  | "warning";

export type ButtonShape = "square" | "circle" | "rounded";

export interface ButtonProps extends Omit<ComponentProps<"button">, "prefix"> {
  disabled?: boolean;
  loading?: boolean;
  prefix?: ReactNode;
  render?: useRender.RenderProp;
  shape?: ButtonShape;
  size?: ButtonSize;
  spinnerVariant?: SpinnerVariant;
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
  spinnerVariant,
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
  const mergedClassName = cn(
    styles.button,
    isDisabled && styles.disabled,
    svgOnly && styles.svgOnly,
    className
  );

  const renderButtonContent = (ctx: ReactNode) => (
    <>
      {loading && (
        <span className={styles.spinnerOverlay}>
          <Spinner
            size="medium"
            variant={spinnerVariant ?? getSpinnerVariant(variant)}
          />
        </span>
      )}
      <span className={cn(styles.buttonInner, loading && styles.invisible)}>
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
      {
        className: mergedClassName,
        style,
        disabled: isDisabled,
        type: "button" as const,
      },
      props,
      { children: renderButtonContent(children) }
    ),
    defaultTagName: "button",
  });
}

const getSizeStyles = (size: ButtonSize) => {
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

const getBorderRadius = (shape: ButtonShape, size: ButtonSize) =>
  match(shape)
    .with("square", () =>
      match(size)
        .with("x-small", () => "var(--cocso-radius-3)")
        .otherwise(() => "var(--cocso-radius-4)")
    )
    .with("circle", () => "100%")
    .with("rounded", () => "var(--cocso-radius-full)")
    .exhaustive();

const getColor = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", "success", "error", () => colors.white)
    .with("secondary", "ghost", "warning", () => colors.neutral950)
    .exhaustive();

const getBorder = (variant: ButtonVariant) =>
  match(variant)
    .with("secondary", () => `1px solid ${colors.neutral100}`)
    .otherwise(() => "none");

const getBackgroundColor = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary500)
    .with("secondary", () => colors.transparent)
    .with("ghost", () => colors.white)
    .with("success", () => colors.success500)
    .with("error", () => colors.danger500)
    .with("warning", () => colors.warning300)
    .exhaustive();

const getBackgroundColorHover = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary600)
    .with("secondary", "ghost", () => colors.neutral50)
    .with("success", () => colors.success600)
    .with("error", () => colors.danger600)
    .with("warning", () => colors.warning400)
    .exhaustive();

const getSpinnerVariant = (variant: ButtonVariant): SpinnerVariant =>
  match(variant)
    .with("primary", "success", "error", () => "white" as const)
    .with("secondary", "ghost", "warning", () => "secondary" as const)
    .exhaustive();

const getBackgroundColorActive = (variant: ButtonVariant) =>
  match(variant)
    .with("primary", () => colors.primary700)
    .with("secondary", "ghost", () => colors.neutral100)
    .with("success", () => colors.success700)
    .with("error", () => colors.danger700)
    .with("warning", () => colors.warning500)
    .exhaustive();
