import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const InfoIcon = (props: IconProps) => {
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
        <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
        <Path d="M12 9h.01" />
        <Path d="M11 12h1v4h1" />
      </Svg>
    </Icon>
  );
};

InfoIcon.displayName = "InfoIcon";
