import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const RemoveCircleIcon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <Svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
        <Path d="M4.929 4.929a10 10 0 1 1 14.141 14.141a10 10 0 0 1 -14.14 -14.14m4.071 6.071a1 1 0 1 0 0 2h6a1 1 0 1 0 0 -2h-6z" />
      </Svg>
    </Icon>
  );
};

RemoveCircleIcon.displayName = "RemoveCircleIcon";
