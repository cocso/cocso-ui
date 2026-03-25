import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const CalculateIcon = (props: IconProps) => {
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
        <Path d="M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -14" />
        <Path d="M8 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -1" />
        <Path d="M8 14l0 .01" />
        <Path d="M12 14l0 .01" />
        <Path d="M16 14l0 .01" />
        <Path d="M8 17l0 .01" />
        <Path d="M12 17l0 .01" />
        <Path d="M16 17l0 .01" />
      </Svg>
    </Icon>
  );
};

CalculateIcon.displayName = "CalculateIcon";
