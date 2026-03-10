import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const NaverOutlineLogo = (props: IconProps) => {
  const id = useId();

  return (
    <Icon {...props}>
      <svg
        aria-hidden="true"
        fill="none"
        height="20"
        viewBox="0 0 20 20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath={`url(#${id})`}>
          <path
            d="M13.5614 10.7033L6.14609 0H0V20H6.43861V9.295L13.8539 20H20V0H13.5614V10.7033Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id={id}>
            <rect fill="currentColor" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </Icon>
  );
};

NaverOutlineLogo.displayName = 'NaverOutlineLogo';
