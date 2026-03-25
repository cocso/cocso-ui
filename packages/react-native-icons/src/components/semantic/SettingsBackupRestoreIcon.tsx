import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const SettingsBackupRestoreIcon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <Svg
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
      >
        <Path d="M3.06 13a9 9 0 1 0 .49 -4.087" />
        <Path d="M3 4.001v5h5" />
        <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </Svg>
    </Icon>
  );
};

SettingsBackupRestoreIcon.displayName = "SettingsBackupRestoreIcon";
