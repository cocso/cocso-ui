import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const PercentIcon = (props: IconProps) => {
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
        <Path d="M16 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <Path d="M6 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <Path d="M6 18l12 -12" />
      </Svg>
    </Icon>
  );
};

PercentIcon.displayName = "PercentIcon";
