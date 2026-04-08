import type { SvgProps } from "react-native-svg";

export type IconProps = {
  size?: number | string;
  width?: number | string;
  height?: number | string;
} & Omit<SvgProps, "width" | "height">;
