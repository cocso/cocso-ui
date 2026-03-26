import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const PersonEditIcon = (props: IconProps) => {
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
        <Path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
        <Path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
        <Path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39" />
      </Svg>
    </Icon>
  );
};

PersonEditIcon.displayName = "PersonEditIcon";
