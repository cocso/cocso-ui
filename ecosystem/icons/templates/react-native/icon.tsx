import React, {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";
import type { IconProps } from "./types";

const DEFAULT_ICON_SIZE = 16;

const Icon = ({
  children,
  width,
  height,
  size = DEFAULT_ICON_SIZE,
  ...props
}: IconProps & { children: ReactNode }) => {
  const child = Children.only(children);

  return isValidElement(child)
    ? cloneElement(child, {
        width: width ?? size,
        height: height ?? size,
        ...props,
      } as Record<string, unknown>)
    : null;
};

export default Icon;
