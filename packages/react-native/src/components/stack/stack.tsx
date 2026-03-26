import { forwardRef } from "react";
import type { View, ViewProps, ViewStyle } from "react-native";
import { View as RNView } from "react-native";
import { type SpacingToken, spacing } from "../../theme";

export const STACK_DIRECTION = {
  ROW: "row",
  COLUMN: "column",
} as const;

export type StackDirection =
  (typeof STACK_DIRECTION)[keyof typeof STACK_DIRECTION];

const resolveGap = (
  gap: SpacingToken | number | undefined
): number | undefined => {
  if (gap === undefined) {
    return undefined;
  }

  return typeof gap === "number" ? gap : spacing[gap];
};

export type StackProps = ViewProps & {
  direction?: StackDirection;
  gap?: SpacingToken | number;
};

export const Stack = forwardRef<View, StackProps>(function Stack(
  { style, direction = STACK_DIRECTION.COLUMN, gap, ...props }: StackProps,
  ref
) {
  const composedStyle: ViewStyle = {
    flexDirection: direction,
    gap: resolveGap(gap),
  };

  return <RNView ref={ref} style={[composedStyle, style]} {...props} />;
});
