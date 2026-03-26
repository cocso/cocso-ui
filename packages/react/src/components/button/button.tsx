import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "../../cn";
import { mergeProps } from "../../primitives/merge-props";
import { useRender } from "../../primitives/use-render";
import type { FontWeight } from "../../token";
import { Spinner } from "../spinner";
import styles from "./button.module.css";
import {
  fontWeightToken,
  getBackgroundColor,
  getBackgroundColorActive,
  getBackgroundColorHover,
  getBorder,
  getBorderRadius,
  getColor,
  getSizeStyles,
  getSpinnerVariant,
} from "./button.styles";

export type ButtonSize = "large" | "medium" | "small" | "x-small";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "error"
  | "warning"
  | "info";

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
    "--cocso-button-font-weight": fontWeightToken[weight],
    "--cocso-button-border": getBorder(variant),
    "--cocso-button-border-radius": getBorderRadius(shape, size),
    "--cocso-button-bg-color": getBackgroundColor(variant),
    "--cocso-button-bg-color-hover": getBackgroundColorHover(variant),
    "--cocso-button-bg-color-active": getBackgroundColorActive(variant),
  } as CSSProperties;

  const isDisabled = disabled || loading;
  const mergedClassName = cn(
    styles.button,
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
        "aria-busy": loading || undefined,
        type: "button" as const,
      },
      props,
      { children: renderButtonContent(children) }
    ),
    defaultTagName: "button",
  });
}

// Style functions are in ./button.styles.ts (internal, not in public barrel)
