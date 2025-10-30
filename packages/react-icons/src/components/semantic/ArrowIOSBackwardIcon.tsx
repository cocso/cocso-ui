import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const ArrowIOSBackwardIcon = (props: IconProps) => {
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
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="currentColor" />
        </mask>
        <g mask={`url(#${id})`}>
          <path
            d="M9.5502 12.0001L16.9002 19.3501C17.1502 19.6001 17.271 19.8918 17.2627 20.2251C17.2544 20.5584 17.1252 20.8501 16.8752 21.1001C16.6252 21.3501 16.3335 21.4751 16.0002 21.4751C15.6669 21.4751 15.3752 21.3501 15.1252 21.1001L7.4252 13.4251C7.2252 13.2251 7.0752 13.0001 6.9752 12.7501C6.8752 12.5001 6.8252 12.2501 6.8252 12.0001C6.8252 11.7501 6.8752 11.5001 6.9752 11.2501C7.0752 11.0001 7.2252 10.7751 7.4252 10.5751L15.1252 2.87511C15.3752 2.62511 15.671 2.50428 16.0127 2.51261C16.3544 2.52094 16.6502 2.65011 16.9002 2.90011C17.1502 3.15011 17.2752 3.44178 17.2752 3.77511C17.2752 4.10844 17.1502 4.40011 16.9002 4.65011L9.5502 12.0001Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

ArrowIOSBackwardIcon.displayName = 'ArrowIOSBackwardIcon';
