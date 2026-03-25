import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const OutpatientMedIcon = (props: IconProps) => {
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
        <Path d="M14 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <Path d="M6 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <Path d="M4 8l2.1 2.8a3 3 0 0 0 2.4 1.2h11.5" />
        <Path d="M10 6h4" />
        <Path d="M12 4v4" />
        <Path d="M12 12v2l-2.5 2.5" />
        <Path d="M14.5 16.5l-2.5 -2.5" />
      </Svg>
    </Icon>
  );
};

OutpatientMedIcon.displayName = "OutpatientMedIcon";
