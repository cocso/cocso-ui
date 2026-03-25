import { forwardRef } from "react";
import type {
  TextInput as RNTextInputInstance,
  TextInputProps,
} from "react-native";
import { TextInput as RNTextInput, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../theme";

export const INPUT_SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

export type InputSize = (typeof INPUT_SIZE)[keyof typeof INPUT_SIZE];

const inputSizeStyle = {
  [INPUT_SIZE.SMALL]: {
    minHeight: 36,
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s3,
  },
  [INPUT_SIZE.MEDIUM]: {
    minHeight: 44,
    paddingHorizontal: spacing.s7,
    paddingVertical: spacing.s4,
  },
  [INPUT_SIZE.LARGE]: {
    minHeight: 52,
    paddingHorizontal: spacing.s8,
    paddingVertical: spacing.s5,
  },
} as const;

export type InputProps = TextInputProps & {
  size?: InputSize;
};

export const Input = forwardRef<RNTextInputInstance, InputProps>(function Input(
  { size = INPUT_SIZE.MEDIUM, style, ...props }: InputProps,
  ref
) {
  return (
    <RNTextInput
      placeholderTextColor={colors.textTertiary}
      ref={ref}
      style={[styles.base, inputSizeStyle[size], style]}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderColor: colors.neutral200,
    borderRadius: radius.r4,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 14,
  },
});
