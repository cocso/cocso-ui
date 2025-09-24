import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const ArrowDropDownIcon = (props: IconProps) => {
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
            d="M12.2204 14.852L8.59543 11.227C8.54543 11.177 8.50793 11.1228 8.48293 11.0645C8.45793 11.0061 8.44543 10.9436 8.44543 10.877C8.44543 10.7436 8.49127 10.627 8.58293 10.527C8.6746 10.427 8.79543 10.377 8.94543 10.377H16.5454C16.6954 10.377 16.8163 10.427 16.9079 10.527C16.9996 10.627 17.0454 10.7436 17.0454 10.877C17.0454 10.9103 16.9954 11.027 16.8954 11.227L13.2704 14.852C13.1871 14.9353 13.1038 14.9936 13.0204 15.027C12.9371 15.0603 12.8454 15.077 12.7454 15.077C12.6454 15.077 12.5538 15.0603 12.4704 15.027C12.3871 14.9936 12.3038 14.9353 12.2204 14.852Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

ArrowDropDownIcon.displayName = 'ArrowDropDownIcon';
