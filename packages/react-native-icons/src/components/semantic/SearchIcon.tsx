import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const SearchIcon = (props: IconProps) => {
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
        <Path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <Path d="M21 21l-6 -6" />
      </Svg>
    </Icon>
  );
};

SearchIcon.displayName = "SearchIcon";
