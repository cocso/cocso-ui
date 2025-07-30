import Icon from '../../icon';
import { IconProps } from '../../types';

export const KakaoLogo = (props: IconProps) => (
  <Icon {...props}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="20" rx="4" fill="#FEE500" />
      <g clipPath="url(#clip0_1198_3584)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 4.40002C6.68613 4.40002 4 6.47533 4 9.03488C4 10.6267 5.03894 12.03 6.62103 12.8647L5.95536 15.2964C5.89655 15.5112 6.14228 15.6825 6.33099 15.558L9.24892 13.6322C9.49516 13.6559 9.74541 13.6698 10 13.6698C13.3137 13.6698 16 11.5946 16 9.03488C16 6.47533 13.3137 4.40002 10 4.40002"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_1198_3584">
          <rect width="12" height="12" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  </Icon>
);

KakaoLogo.displayName = 'KakaoLogo';
