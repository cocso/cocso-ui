import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const SystemUpdateIcon = (props: IconProps) => {
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
        <Path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
        <Path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
        <Path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
        <Path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
        <Path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
        <Path d="M12 9v6" />
        <Path d="M15 12l-3 3l-3 -3" />
      </Svg>
    </Icon>
  );
};

SystemUpdateIcon.displayName = "SystemUpdateIcon";
