import { Ellipse, Rect, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const SeoulPharmaLogo = (props: IconProps) => {
  return (
    <Icon {...props}>
      <Svg fill="none" height="100" viewBox="0 0 100 100" width="100">
        <Ellipse cx="26.9" cy="49.9" fill="#02A149" rx="18.9" ry="18.9" />
        <Rect fill="#02A149" height="35.7" width="35.7" x="56.2998" y="32.05" />
      </Svg>
    </Icon>
  );
};

SeoulPharmaLogo.displayName = "SeoulPharmaLogo";
