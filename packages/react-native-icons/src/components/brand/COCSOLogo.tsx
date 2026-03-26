import { Path, Svg } from "react-native-svg";
import { Icon } from "../../icon";
import type { IconProps } from "../../types";

export const COCSOLogo = (props: IconProps) => {
  return (
    <Icon {...props}>
      <Svg fill="none" height="280" viewBox="0 0 280 280" width="280">
        <Path
          clipRule="evenodd"
          d="M118.182 256C52.9113 256 -0.000713231 204.065 -0.000374605 139.999C-4.98512e-05 75.9346 52.9117 24 118.182 24L174.545 24L174.545 95.3846L118.182 95.3846C93.0778 95.3846 72.7271 115.359 72.727 140C72.7269 164.64 93.0776 184.615 118.182 184.615L174.545 184.615L174.545 256L118.182 256Z"
          fill="currentColor"
          fillRule="evenodd"
        />
        <Path
          d="M174.545 184.619L174.545 95.3884L220 95.3884C245.103 95.3884 265.454 115.363 265.454 140.004V140.004C265.454 164.644 245.103 184.619 220 184.619L174.545 184.619Z"
          fill="currentColor"
        />
      </Svg>
    </Icon>
  );
};

COCSOLogo.displayName = "COCSOLogo";
