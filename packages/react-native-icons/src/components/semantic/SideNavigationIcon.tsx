import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const SideNavigationIcon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <Svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
        <Path d="M6 21a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3zm12 -16h-8v14h8a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1" />
      </Svg>
    </Icon>
  );
};

SideNavigationIcon.displayName = "SideNavigationIcon";
