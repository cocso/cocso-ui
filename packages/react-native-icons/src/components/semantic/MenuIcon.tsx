import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const MenuIcon = (props: IconProps) => {
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
        <Path d="M4 6l16 0" />
        <Path d="M4 12l16 0" />
        <Path d="M4 18l16 0" />
      </Svg>
    </Icon>
  );
};

MenuIcon.displayName = "MenuIcon";
