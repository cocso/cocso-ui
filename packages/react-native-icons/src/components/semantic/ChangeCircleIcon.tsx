import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const ChangeCircleIcon = (props: IconProps) => {
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
        <Path d="M20 11a8.1 8.1 0 0 0 -6.986 -6.918a8.095 8.095 0 0 0 -8.019 3.918" />
        <Path d="M4 13a8.1 8.1 0 0 0 15 3" />
        <Path d="M18 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <Path d="M4 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      </Svg>
    </Icon>
  );
};

ChangeCircleIcon.displayName = "ChangeCircleIcon";
