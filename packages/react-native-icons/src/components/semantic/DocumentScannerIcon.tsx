import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const DocumentScannerIcon = (props: IconProps) => {
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
        <Path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
        <Path d="M4 16v2a2 2 0 0 0 2 2h2" />
        <Path d="M16 4h2a2 2 0 0 1 2 2v2" />
        <Path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
        <Path d="M8 12h8" />
        <Path d="M8 9h6" />
        <Path d="M8 15h4" />
      </Svg>
    </Icon>
  );
};

DocumentScannerIcon.displayName = "DocumentScannerIcon";
