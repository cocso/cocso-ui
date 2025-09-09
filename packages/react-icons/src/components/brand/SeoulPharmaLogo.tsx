import Icon from '../../icon';
import type { IconProps } from '../../types';

export const SeoulPharmaLogo = (props: IconProps) => {
  return (
    <Icon {...props}>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="26.9" cy="49.9" rx="18.9" ry="18.9" fill="#02A149" />
        <rect x="56.2998" y="32.05" width="35.7" height="35.7" fill="#02A149" />
      </svg>
    </Icon>
  );
};

SeoulPharmaLogo.displayName = 'SeoulPharmaLogo';
