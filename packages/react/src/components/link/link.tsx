import { ExternalLinkIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import type { useRender } from "../../primitives/use-render";
import type { FontWeight, LineHeight } from "../../token";
import { colors } from "../../token";
import { Typography } from "../typography";
import styles from "./link.module.css";

/** Size variant of the {@link Link} component. */
export type LinkSize = "large" | "medium" | "small" | "x-small";

/**
 * Visual style variant of the {@link Link} component.
 * - `"inline"`: primary-colored link intended for use within body text.
 * - `"current"`: inherits the surrounding text color.
 * - `"plain"`: primary-colored link without an underline indicator.
 */
export type LinkVariant = "inline" | "current" | "plain";

/** Props for the {@link Link} component. */
export interface LinkProps extends ComponentProps<"a"> {
  /** Whether to show the underline/external indicator. Defaults to `true` for non-plain variants. */
  indicator?: boolean;
  /** Line height applied to the typography. */
  lineHeight?: LineHeight;
  /** Custom render prop forwarded to the underlying {@link Typography} element. */
  render?: useRender.RenderProp;
  /** The size variant controlling font size. */
  size?: LinkSize;
  /** The visual style variant. Defaults to `"inline"`. */
  variant?: LinkVariant;
  /** Font weight applied to the typography. */
  weight?: FontWeight;
}

/** A styled anchor element built on {@link Typography}. Supports external-link icon via `Link.ExternalIcon`. */
export function Link({
  ref,
  render: renderProp,
  className,
  style: _style,
  size,
  weight,
  lineHeight,
  variant = "inline",
  indicator,
  ...props
}: LinkProps) {
  const showIndicator = indicator ?? variant !== "plain";

  const style = {
    ..._style,
    "--cocso-link-color": getColor(variant),
    "--cocso-link-color-hover": getColorHover(variant),
  } as CSSProperties;

  const mergedClassName = cn(
    styles.link,
    variant === "current" && styles.current,
    showIndicator && styles.indicator,
    className
  );

  return (
    <Typography
      className={mergedClassName}
      lineHeight={lineHeight}
      ref={ref}
      render={renderProp ?? ((renderProps) => <a {...renderProps} />)}
      size={size}
      style={style}
      type="body"
      weight={weight}
      {...(props as ComponentProps<"p">)}
    />
  );
}

function ExternalIcon({
  className,
  ...props
}: ComponentProps<typeof ExternalLinkIcon>) {
  return (
    <ExternalLinkIcon
      className={cn(styles.externalIcon, className)}
      {...props}
    />
  );
}

Link.ExternalIcon = ExternalIcon;

const getColor = (variant: LinkVariant) =>
  match(variant)
    .with("inline", () => colors.primary500)
    .with("current", () => "currentColor")
    .with("plain", () => colors.primary500)
    .exhaustive();

const getColorHover = (variant: LinkVariant) =>
  match(variant)
    .with("inline", () => colors.primary700)
    .with("current", () => "currentColor")
    .with("plain", () => colors.primary700)
    .exhaustive();
