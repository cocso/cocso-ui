import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const SpaceDashboardIcon = (props: IconProps) => {
  const id = useId();

  return (
    <Icon {...props}>
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <mask
          id={id}
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="25"
          height="25"
        >
          <rect x="0.348145" y="0.345947" width="24" height="24" fill="currentColor" />
        </mask>
        <g mask={`url(#${id})`}>
          <path
            d="M5.34814 21.3459C4.79814 21.3459 4.32731 21.1501 3.93564 20.7584C3.54398 20.3668 3.34814 19.8959 3.34814 19.3459V5.34595C3.34814 4.79595 3.54398 4.32511 3.93564 3.93345C4.32731 3.54178 4.79814 3.34595 5.34814 3.34595H19.3481C19.8981 3.34595 20.369 3.54178 20.7606 3.93345C21.1523 4.32511 21.3481 4.79595 21.3481 5.34595V19.3459C21.3481 19.8959 21.1523 20.3668 20.7606 20.7584C20.369 21.1501 19.8981 21.3459 19.3481 21.3459H5.34814ZM5.34814 19.3459H11.3481V5.34595H5.34814V19.3459ZM13.3481 19.3459H19.3481V12.3459H13.3481V19.3459ZM13.3481 10.3459H19.3481V5.34595H13.3481V10.3459Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

SpaceDashboardIcon.displayName = 'SpaceDashboardIcon';
