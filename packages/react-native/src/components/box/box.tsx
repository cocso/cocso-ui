import { forwardRef } from "react";
import type { View, ViewProps, ViewStyle } from "react-native";
import { View as RNView } from "react-native";
import {
  type ColorToken,
  colors,
  type SpacingToken,
  spacing,
} from "../../theme";

const resolveSpacing = (
  value: SpacingToken | number | undefined
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? value : spacing[value];
};

export type BoxProps = ViewProps & {
  padding?: SpacingToken | number;
  paddingX?: SpacingToken | number;
  paddingY?: SpacingToken | number;
  backgroundColor?: ColorToken;
};

export const Box = forwardRef<View, BoxProps>(function Box(
  { style, padding, paddingX, paddingY, backgroundColor, ...props }: BoxProps,
  ref
) {
  const composedStyle: ViewStyle = {
    padding: resolveSpacing(padding),
    paddingHorizontal: resolveSpacing(paddingX),
    paddingVertical: resolveSpacing(paddingY),
    backgroundColor: backgroundColor ? colors[backgroundColor] : undefined,
  };

  return <RNView ref={ref} style={[composedStyle, style]} {...props} />;
});
