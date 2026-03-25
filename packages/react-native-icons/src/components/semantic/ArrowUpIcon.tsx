import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const ArrowUpIcon = (props: IconProps) => {
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
        <Path d="M12 5l0 14" />
        <Path d="M18 11l-6 -6" />
        <Path d="M6 11l6 -6" />
      </Svg>
    </Icon>
  );
};

ArrowUpIcon.displayName = "ArrowUpIcon";
