import { buttonRecipe } from "@cocso-ui/recipe/recipes/button.recipe";
import { resolveStyleMap } from "@cocso-ui/recipe/resolvers/react-styles";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "../../cn";
import { mergeProps } from "../../primitives/merge-props";
import { useRender } from "../../primitives/use-render";
import { type FontWeight, fontWeight as fontWeightToken } from "../../token";
import type { SpinnerVariant } from "../spinner";
import { Spinner } from "../spinner";
import styles from "./button.module.css";

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

function getButtonSpinnerVariant(variant: ButtonVariant): SpinnerVariant {
  return ["primary", "success", "error", "info"].includes(variant)
    ? "white"
    : "secondary";
}

/** Polymorphic button component with variant, color, and size options. */
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
  const resolved = resolveStyleMap(
    buttonRecipe,
    { variant, size, shape },
    { states: ["hover", "active"] }
  );
  const style = {
    ..._style,
    "--cocso-button-border": "none",
    ...resolved,
    "--cocso-button-font-weight": fontWeightToken[weight],
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
            variant={spinnerVariant ?? getButtonSpinnerVariant(variant)}
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
