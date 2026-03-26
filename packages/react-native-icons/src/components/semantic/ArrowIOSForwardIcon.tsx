import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const ArrowIOSForwardIcon = (props: IconProps) => {
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
        <Path d="M9 6l6 6l-6 6" />
      </Svg>
    </Icon>
  );
};

ArrowIOSForwardIcon.displayName = "ArrowIOSForwardIcon";
