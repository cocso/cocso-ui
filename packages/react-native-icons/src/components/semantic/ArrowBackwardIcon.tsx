import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const ArrowBackwardIcon = (props: IconProps) => {
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
        <Path d="M5 12l14 0" />
        <Path d="M5 12l6 6" />
        <Path d="M5 12l6 -6" />
      </Svg>
    </Icon>
  );
};

ArrowBackwardIcon.displayName = "ArrowBackwardIcon";
