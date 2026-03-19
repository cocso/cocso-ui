import { ExternalLinkIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties } from "react";
import { match } from "ts-pattern";
import { cn } from "../../cn";
import type { useRender } from "../../primitives/use-render";
import type { FontWeight, LineHeight } from "../../token";
import { colors } from "../../token";
import { Typography } from "../typography";
import styles from "./link.module.css";
export type LinkSize = "large" | "medium" | "small" | "x-small";
export type LinkVariant = "inline" | "current" | "plain";
export interface LinkProps extends ComponentProps<"a"> {
  indicator?: boolean;
  lineHeight?: LineHeight;
  render?: useRender.RenderProp;
  size?: LinkSize;
  variant?: LinkVariant;
  weight?: FontWeight;
}
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
