import { link } from "@cocso-ui/codegen/generated/link";
import { ExternalLinkIcon } from "@cocso-ui/react-icons";
import "@cocso-ui/codegen/generated/link.css";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import type { useRender } from "../../primitives/use-render";
import type { FontWeight, LineHeight } from "../../token";
import type { TypographyProps } from "../typography";
import { Typography } from "../typography";
import styles from "./link.module.css";

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
  } as CSSProperties;

  const mergedClassName = cn(
    link({ variant }),
    styles.link,
    variant === "current" && styles.current,
    showIndicator && styles.indicator,
    className
  );

  const typographyProps = {
    className: mergedClassName,
    lineHeight,
    ref,
    render:
      renderProp ??
      ((renderProps: ComponentProps<"a">) => <a {...renderProps} />),
    size,
    style,
    type,
    weight,
    ...props,
  } as TypographyProps;

  return <Typography {...typographyProps} />;
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

/** Styled anchor/link component with inline, current, and plain variants. */
export const Link = Object.assign(LinkComponent, {
  displayName: "Link" as const,
  ExternalIcon,
});
