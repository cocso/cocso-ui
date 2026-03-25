import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const TextSelectJumpToEndIcon = (props: IconProps) => {
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
        <Path d="M4 6l10 0" />
        <Path d="M4 18l10 0" />
        <Path d="M4 12h17l-3 -3m0 6l3 -3" />
      </Svg>
    </Icon>
  );
};

TextSelectJumpToEndIcon.displayName = "TextSelectJumpToEndIcon";
