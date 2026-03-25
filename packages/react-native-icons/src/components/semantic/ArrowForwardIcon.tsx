import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const ArrowForwardIcon = (props: IconProps) => {
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
        <Path d="M13 18l6 -6" />
        <Path d="M13 6l6 6" />
      </Svg>
    </Icon>
  );
};

ArrowForwardIcon.displayName = "ArrowForwardIcon";
