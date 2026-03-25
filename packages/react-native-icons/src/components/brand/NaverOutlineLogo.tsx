import { useId } from "react";
import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const NaverOutlineLogo = (props: IconProps) => {
  const id = useId();

  return (
    <Icon {...props}>
      <Svg fill="none" height="20" viewBox="0 0 20 20" width="20">
        <G clipPath={`url(#${id})`}>
          <Path
            d="M13.5614 10.7033L6.14609 0H0V20H6.43861V9.295L13.8539 20H20V0H13.5614V10.7033Z"
            fill="currentColor"
          />
        </G>
        <Defs>
          <ClipPath id={id}>
            <Rect fill="currentColor" height="20" width="20" />
          </ClipPath>
        </Defs>
      </Svg>
    </Icon>
  );
};

NaverOutlineLogo.displayName = "NaverOutlineLogo";
