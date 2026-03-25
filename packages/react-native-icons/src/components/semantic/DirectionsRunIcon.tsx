import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const DirectionsRunIcon = (props: IconProps) => {
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
        <Path d="M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <Path d="M4 17l5 1l.75 -1.5" />
        <Path d="M15 21l0 -4l-4 -3l1 -6" />
        <Path d="M7 12l0 -3l5 -1l3 3l3 1" />
      </Svg>
    </Icon>
  );
};

DirectionsRunIcon.displayName = "DirectionsRunIcon";
