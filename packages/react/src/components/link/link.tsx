import { ExternalLinkIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import type { useRender } from "../../primitives/use-render";
import type { FontWeight, LineHeight } from "../../token";
import type { TypographyProps } from "../typography";
import { Typography } from "../typography";
import styles from "./link.module.css";
import { getColor, getColorHover } from "./link.styles";

export type LinkSize = "large" | "medium" | "small" | "x-small";

export type LinkVariant = "inline" | "current" | "plain";
export interface LinkProps extends ComponentProps<"a"> {
  indicator?: boolean;
  lineHeight?: LineHeight;
  render?: useRender.RenderProp;
  size?: TypographyProps["size"];
  type?: TypographyProps["type"];
  variant?: LinkVariant;
  weight?: FontWeight;
}

function LinkComponent({
  ref,
  render: renderProp,
  className,
  style: _style,
  size,
  type = "body",
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
      size={size as never}
      style={style}
      type={type}
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

export const Link = Object.assign(LinkComponent, { ExternalIcon });
Link.displayName = "Link";
