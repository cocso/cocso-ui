import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const MoreHorizIcon = (props: IconProps) => {
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
        <Path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <Path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </Svg>
    </Icon>
  );
};

MoreHorizIcon.displayName = "MoreHorizIcon";
