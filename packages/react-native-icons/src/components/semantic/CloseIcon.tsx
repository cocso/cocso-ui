import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const CloseIcon = (props: IconProps) => {
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
        <Path d="M18 6l-12 12" />
        <Path d="M6 6l12 12" />
      </Svg>
    </Icon>
  );
};

CloseIcon.displayName = "CloseIcon";
