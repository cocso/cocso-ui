import { forwardRef } from "react";
import type {
  Text as RNTextInstance,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";
import { Text as RNText } from "react-native";
import {
  type ColorToken,
  colors,
  type FontSizeToken,
  type FontWeightToken,
  fontSize,
  fontWeight,
  type LineHeightToken,
  lineHeight,
} from "../../theme";

export type TextProps = RNTextProps & {
  color?: ColorToken;
  size?: FontSizeToken;
  weight?: FontWeightToken;
  lineHeightToken?: LineHeightToken;
};

export const Text = forwardRef<RNTextInstance, TextProps>(function Text(
  {
    style,
    color = "textPrimary",
    size = 14,
    weight = "normal",
    lineHeightToken = "normal",
    ...props
  }: TextProps,
  ref
) {
  const composedStyle: TextStyle = {
    color: colors[color],
    fontSize: fontSize[size],
    fontWeight: String(fontWeight[weight]) as TextStyle["fontWeight"],
    lineHeight: fontSize[size] * lineHeight[lineHeightToken],
  };

  return <RNText ref={ref} style={[composedStyle, style]} {...props} />;
});
