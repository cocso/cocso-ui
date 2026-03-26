import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const PlugConnectIcon = (props: IconProps) => {
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
        <Path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
        <Path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
        <Path d="M3 21l2.5 -2.5" />
        <Path d="M18.5 5.5l2.5 -2.5" />
        <Path d="M10 11l-2 2" />
        <Path d="M13 14l-2 2" />
      </Svg>
    </Icon>
  );
};

PlugConnectIcon.displayName = "PlugConnectIcon";
