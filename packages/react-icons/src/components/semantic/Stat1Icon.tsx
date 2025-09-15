import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const Stat1Icon = (props: IconProps) => {
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
            d="M12.5343 11.6813L8.63429 15.5563C8.45096 15.7396 8.22179 15.8354 7.94679 15.8438C7.67179 15.8521 7.43429 15.7563 7.23429 15.5563C7.05096 15.3729 6.95929 15.1396 6.95929 14.8563C6.95929 14.5729 7.05096 14.3396 7.23429 14.1562L11.8343 9.55625C11.9343 9.45625 12.0426 9.38542 12.1593 9.34375C12.276 9.30208 12.401 9.28125 12.5343 9.28125C12.6676 9.28125 12.7926 9.30208 12.9093 9.34375C13.026 9.38542 13.1343 9.45625 13.2343 9.55625L17.8343 14.1562C18.0176 14.3396 18.1135 14.5687 18.1218 14.8438C18.1301 15.1188 18.0343 15.3563 17.8343 15.5563C17.651 15.7396 17.4176 15.8313 17.1343 15.8313C16.851 15.8313 16.6176 15.7396 16.4343 15.5563L12.5343 11.6813Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

Stat1Icon.displayName = 'Stat1Icon';
