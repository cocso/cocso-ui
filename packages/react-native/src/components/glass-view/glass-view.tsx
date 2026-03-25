import type { ComponentType, ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import {
  colors,
  GLASS_INTENSITY,
  type GlassIntensity,
  radius,
  spacing,
} from "../../theme";

const GLASS_LAYER: Record<
  GlassIntensity,
  { backgroundColor: string; borderColor: string }
> = {
  [GLASS_INTENSITY.LOW]: {
    backgroundColor: colors.whiteAlpha20,
    borderColor: colors.whiteAlpha40,
  },
  [GLASS_INTENSITY.MEDIUM]: {
    backgroundColor: colors.whiteAlpha40,
    borderColor: colors.whiteAlpha50,
  },
  [GLASS_INTENSITY.HIGH]: {
    backgroundColor: colors.whiteAlpha60,
    borderColor: colors.whiteAlpha70,
  },
};

export type GlassViewProps = ViewProps & {
  intensity?: GlassIntensity;
  BlurComponent?: ComponentType<{
    children: ReactNode;
    intensity: number;
    style?: StyleProp<ViewStyle>;
  }>;
};

export function GlassView({
  intensity = GLASS_INTENSITY.MEDIUM,
  BlurComponent,
  style,
  children,
  ...props
}: GlassViewProps) {
  const layer = GLASS_LAYER[intensity];

  if (BlurComponent) {
    let blurIntensity = 20;

    if (intensity === GLASS_INTENSITY.MEDIUM) {
      blurIntensity = 35;
    }

    if (intensity === GLASS_INTENSITY.HIGH) {
      blurIntensity = 50;
    }

    return (
      <BlurComponent
        intensity={blurIntensity}
        style={[
          styles.base,
          {
            borderColor: layer.borderColor,
          },
          style,
        ]}
      >
        {children}
      </BlurComponent>
    );
  }

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: layer.backgroundColor,
          borderColor: layer.borderColor,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.r5,
    borderWidth: 1,
    overflow: "hidden",
    padding: spacing.s8,
  } as ViewStyle,
});
