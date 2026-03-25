import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const CalendarMonthIcon = (props: IconProps) => {
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
        <Path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
        <Path d="M16 3v4" />
        <Path d="M8 3v4" />
        <Path d="M4 11h16" />
        <Path d="M8 14v4" />
        <Path d="M12 14v4" />
        <Path d="M16 14v4" />
      </Svg>
    </Icon>
  );
};

CalendarMonthIcon.displayName = "CalendarMonthIcon";
