import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const SelectorIcon = (props: IconProps) => {
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
        <Path d="M0 0h24v24H0z" fill="none" stroke="none" />
        <Path d="M8 9l4 -4l4 4" />
        <Path d="M16 15l-4 4l-4 -4" />
      </Svg>
    </Icon>
  );
};

SelectorIcon.displayName = "SelectorIcon";
