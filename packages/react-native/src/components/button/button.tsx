import type { ReactNode } from "react";
import type {
  GestureResponderEvent,
  PressableProps,
  PressableStateCallbackType,
  ViewStyle,
} from "react-native";
import { Pressable, StyleSheet } from "react-native";
import {
  BUTTON_VARIANT,
  type ButtonVariant,
  type ColorToken,
  colors,
  radius,
  spacing,
} from "../../theme";
import { Text } from "../text";

const variantTokens: Record<
  ButtonVariant,
  {
    background: ColorToken;
    foreground: ColorToken;
    border?: ColorToken;
  }
> = {
  [BUTTON_VARIANT.PRIMARY]: {
    background: "primary950",
    foreground: "white",
  },
  [BUTTON_VARIANT.SECONDARY]: {
    background: "neutral100",
    foreground: "neutral950",
    border: "neutral200",
  },
  [BUTTON_VARIANT.GHOST]: {
    background: "transparent",
    foreground: "neutral900",
  },
};

export type ButtonProps = Omit<PressableProps, "style"> & {
  children?: ReactNode;
  label?: string;
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
};

export function Button({
  children,
  label,
  variant = BUTTON_VARIANT.PRIMARY,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  const token = variantTokens[variant];

  const resolveOpacity = (pressed: boolean): number => {
    if (disabled) {
      return 0.5;
    }

    if (pressed) {
      return 0.85;
    }

    return 1;
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }: PressableStateCallbackType): ViewStyle => ({
        ...styles.base,
        backgroundColor: colors[token.background],
        borderColor: token.border ? colors[token.border] : "transparent",
        borderWidth: token.border ? 1 : 0,
        opacity: resolveOpacity(pressed),
      })}
      {...props}
    >
      {children ? (
        children
      ) : (
        <Text color={token.foreground} size={14} weight="semibold">
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.r4,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: spacing.s10,
    paddingVertical: spacing.s5,
  },
});
