import Icon from '../../icon';
import { IconProps } from '../../types';

export const NaverLogo = (props: IconProps) => (
  <Icon {...props}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" rx="4" fill="#03C75A" />
      <g clipPath="url(#clip0_1198_3588)">
        <path
          d="M11.7807 10.3517L8.07305 5H5V15H8.2193V9.6475L11.927 15H15V5H11.7807V10.3517Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1198_3588">
          <rect width="10" height="10" fill="white" transform="translate(5 5)" />
        </clipPath>
      </defs>
    </svg>
  </Icon>
);

NaverLogo.displayName = 'NaverLogo';
