import { useId } from "react";
import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const NaverLogo = (props: IconProps) => {
  const id = useId();

  return (
    <Icon {...props}>
      <Svg fill="none" height="20" viewBox="0 0 20 20" width="20">
        <Rect fill="#03C75A" height="20" rx="4" width="20" />
        <G clipPath={`url(#${id})`}>
          <Path
            d="M11.7807 10.3517L8.07305 5H5V15H8.2193V9.6475L11.927 15H15V5H11.7807V10.3517Z"
            fill="white"
          />
        </G>
        <Defs>
          <ClipPath id={id}>
            <Rect
              fill="white"
              height="10"
              transform="translate(5 5)"
              width="10"
            />
          </ClipPath>
        </Defs>
      </Svg>
    </Icon>
  );
};

NaverLogo.displayName = "NaverLogo";
