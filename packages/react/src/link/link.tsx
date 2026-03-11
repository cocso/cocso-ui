import { useRender } from "@base-ui/react/use-render";
import { cn } from "../cn";
import type { ComponentProps } from "react";
import type { FontWeight, LineHeight } from "../token";
import { Typography } from "../typography";
import styles from "./link.module.css";

export type LinkSize = "large" | "medium" | "small" | "x-small";

export interface LinkProps extends ComponentProps<"a"> {
  indicator?: boolean;
  lineHeight?: LineHeight;
  render?: useRender.RenderProp;
  size?: LinkSize;
  weight?: FontWeight;
}

export function Link({
  ref,
  render: renderProp,
  className,
  size,
  weight,
  lineHeight,
  indicator = true,
  ...props
}: LinkProps) {
  const mergedClassName = cn(
    styles.link,
    indicator && styles.indicator,
    className
  );

  return (
    <Typography
      className={mergedClassName}
      lineHeight={lineHeight}
      ref={ref}
      render={renderProp ?? ((renderProps) => <a {...renderProps} />)}
      size={size}
      type="body"
      weight={weight}
      {...(props as ComponentProps<"p">)}
    />
  );
}
