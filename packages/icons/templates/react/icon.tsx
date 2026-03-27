// biome-ignore lint/correctness/noUnusedImports: React is required for classic JSX runtime in Storybook
import React from "react";
import Child from "./child";
import type { IconProps } from "./types";

const DEFAULT_ICON_SIZE = 16;

const Icon = ({
  children,
  width,
  height,
  size = DEFAULT_ICON_SIZE,
  ...props
}: IconProps) => {
  return (
    <Child
      aria-hidden={
        props["aria-hidden"] !== undefined
          ? props["aria-hidden"]
          : !(props["aria-label"] || props["aria-labelledby"])
      }
      height={height ?? size}
      width={width ?? size}
      {...props}
    >
      {children}
    </Child>
  );
};

export default Icon;
