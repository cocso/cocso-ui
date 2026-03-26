import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const MedicationIcon = (props: IconProps) => {
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
        <Path d="M8 21h8a1 1 0 0 0 1 -1v-10a3 3 0 0 0 -3 -3h-4a3 3 0 0 0 -3 3v10a1 1 0 0 0 1 1" />
        <Path d="M10 14h4" />
        <Path d="M12 12v4" />
        <Path d="M10 7v-3a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3" />
      </Svg>
    </Icon>
  );
};

MedicationIcon.displayName = "MedicationIcon";
