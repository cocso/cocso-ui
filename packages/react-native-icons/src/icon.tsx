import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { SvgProps } from "react-native-svg";
import type { IconProps } from "./types";

const DEFAULT_ICON_SIZE = 16;

type IconRootProps = IconProps & {
  children: ReactNode;
};

export function Icon({
  children,
  width,
  height,
  size = DEFAULT_ICON_SIZE,
  ...props
}: IconRootProps) {
  const child = Children.only(children);

  if (!isValidElement(child)) {
    return null;
  }

  return cloneElement(child as ReactElement<SvgProps>, {
    ...props,
    height: height ?? size,
    width: width ?? size,
  });
}
