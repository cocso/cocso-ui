import { StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../../theme";
import { Text } from "../text";

export const BADGE_VARIANT = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
} as const;

export type BadgeVariant = (typeof BADGE_VARIANT)[keyof typeof BADGE_VARIANT];

const variantMap = {
  [BADGE_VARIANT.INFO]: {
    backgroundColor: colors.info100,
    textColor: colors.info700,
  },
  [BADGE_VARIANT.SUCCESS]: {
    backgroundColor: colors.success100,
    textColor: colors.success700,
  },
  [BADGE_VARIANT.WARNING]: {
    backgroundColor: colors.warning100,
    textColor: colors.warning700,
  },
  [BADGE_VARIANT.DANGER]: {
    backgroundColor: colors.danger100,
    textColor: colors.danger700,
  },
} as const;

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = BADGE_VARIANT.INFO }: BadgeProps) {
  const palette = variantMap[variant];

  return (
    <View style={[styles.base, { backgroundColor: palette.backgroundColor }]}>
      <Text
        color="textPrimary"
        size={12}
        style={{ color: palette.textColor }}
        weight="semibold"
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.r3,
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s2,
  },
});
