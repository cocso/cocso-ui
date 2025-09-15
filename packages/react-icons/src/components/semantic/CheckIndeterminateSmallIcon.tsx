import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const CheckIndeterminateSmallIcon = (props: IconProps) => {
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
          <rect x="0.534302" y="0.881226" width="24" height="24" fill="currentColor" />
        </mask>
        <g mask={`url(#${id})`}>
          <path
            d="M7.5343 13.8812C7.25097 13.8812 7.01347 13.7854 6.8218 13.5937C6.63014 13.4021 6.5343 13.1646 6.5343 12.8812C6.5343 12.5979 6.63014 12.3604 6.8218 12.1687C7.01347 11.9771 7.25097 11.8812 7.5343 11.8812H17.5343C17.8176 11.8812 18.0551 11.9771 18.2468 12.1687C18.4385 12.3604 18.5343 12.5979 18.5343 12.8812C18.5343 13.1646 18.4385 13.4021 18.2468 13.5937C18.0551 13.7854 17.8176 13.8812 17.5343 13.8812H7.5343Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

CheckIndeterminateSmallIcon.displayName = 'CheckIndeterminateSmallIcon';
