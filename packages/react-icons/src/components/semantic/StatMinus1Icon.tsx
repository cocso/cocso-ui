import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const StatMinus1Icon = (props: IconProps) => {
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
            d="M12.5343 15.8312C12.401 15.8312 12.276 15.8104 12.1593 15.7687C12.0426 15.727 11.9343 15.6562 11.8343 15.5562L7.23429 10.9562C7.05096 10.7729 6.95512 10.5437 6.94679 10.2687C6.93846 9.99369 7.03429 9.75619 7.23429 9.55619C7.41762 9.37286 7.65096 9.28119 7.93429 9.28119C8.21762 9.28119 8.45096 9.37286 8.63429 9.55619L12.5343 13.4312L16.4343 9.55619C16.6176 9.37286 16.8468 9.27702 17.1218 9.26869C17.3968 9.26036 17.6343 9.35619 17.8343 9.55619C18.0176 9.73952 18.1093 9.97286 18.1093 10.2562C18.1093 10.5395 18.0176 10.7729 17.8343 10.9562L13.2343 15.5562C13.1343 15.6562 13.026 15.727 12.9093 15.7687C12.7926 15.8104 12.6676 15.8312 12.5343 15.8312Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

StatMinus1Icon.displayName = 'StatMinus1Icon';
