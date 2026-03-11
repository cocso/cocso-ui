import { clsx as cx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import type { FontWeight, LineHeight } from "../token";
import { Typography } from "../typography";
import styles from "./link.module.css";

export type LinkSize = "large" | "medium" | "small" | "x-small";

export interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  indicator?: boolean;
  lineHeight?: LineHeight;
  render?: ComponentPropsWithoutRef<typeof Typography>["render"];
  size?: LinkSize;
  weight?: FontWeight;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      render: renderProp,
      className,
      size,
      weight,
      lineHeight,
      indicator = true,
      ...props
    },
    ref
  ) => {
    const mergedClassName = cx(
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
        {...(props as ComponentPropsWithoutRef<"p">)}
      />
    );
  }
);
