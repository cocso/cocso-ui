import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const ArrowDropUpIcon = (props: IconProps) => {
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
          <rect x="0.745483" y="0.376953" width="24" height="24" fill="currentColor" />
        </mask>
        <g mask={`url(#${id})`}>
          <path
            d="M8.94543 14.3768C8.79543 14.3768 8.6746 14.3268 8.58293 14.2268C8.49127 14.1268 8.44543 14.0101 8.44543 13.8768C8.44543 13.8434 8.49543 13.7268 8.59543 13.5268L12.2204 9.90176C12.3038 9.81842 12.3871 9.76009 12.4704 9.72676C12.5538 9.69342 12.6454 9.67676 12.7454 9.67676C12.8454 9.67676 12.9371 9.69342 13.0204 9.72676C13.1038 9.76009 13.1871 9.81842 13.2704 9.90176L16.8954 13.5268C16.9454 13.5768 16.9829 13.6309 17.0079 13.6893C17.0329 13.7476 17.0454 13.8101 17.0454 13.8768C17.0454 14.0101 16.9996 14.1268 16.9079 14.2268C16.8163 14.3268 16.6954 14.3768 16.5454 14.3768H8.94543Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

ArrowDropUpIcon.displayName = 'ArrowDropUpIcon';
