import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const ExternalLinkIcon = (props: IconProps) => {
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
        <Path d="M0 0h24v24H0z" fill="none" stroke="none" />
        <Path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
        <Path d="M11 13l9 -9" />
        <Path d="M15 4h5v5" />
      </Svg>
    </Icon>
  );
};

ExternalLinkIcon.displayName = "ExternalLinkIcon";
