import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const FileSaveIcon = (props: IconProps) => {
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
        <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <Path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
        <Path d="M12 17v-6" />
        <Path d="M9.5 14.5l2.5 2.5l2.5 -2.5" />
      </Svg>
    </Icon>
  );
};

FileSaveIcon.displayName = "FileSaveIcon";
