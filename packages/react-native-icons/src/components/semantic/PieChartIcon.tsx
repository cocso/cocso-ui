import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const PieChartIcon = (props: IconProps) => {
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
        <Path d="M12 12l-6.5 5.5" />
        <Path d="M12 3v9h9" />
        <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <Path d="M12 12l5 7.5" />
      </Svg>
    </Icon>
  );
};

PieChartIcon.displayName = "PieChartIcon";
