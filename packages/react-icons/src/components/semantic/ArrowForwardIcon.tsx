import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const ArrowForwardIcon = (props: IconProps) => {
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
          <rect x="0.373047" y="0.440119" width="24" height="24" fill="currentColor" />
        </mask>
        <g mask={`url(#${id})`}>
          <path
            d="M16.548 13.4401H5.37305C5.08971 13.4401 4.85221 13.3443 4.66055 13.1526C4.46888 12.961 4.37305 12.7235 4.37305 12.4401C4.37305 12.1568 4.46888 11.9193 4.66055 11.7276C4.85221 11.536 5.08971 11.4401 5.37305 11.4401H16.548L11.648 6.54012C11.448 6.34012 11.3522 6.10678 11.3605 5.84012C11.3689 5.57345 11.473 5.34012 11.673 5.14012C11.873 4.95678 12.1064 4.86095 12.373 4.85262C12.6397 4.84428 12.873 4.94012 13.073 5.14012L19.673 11.7401C19.773 11.8401 19.8439 11.9485 19.8855 12.0651C19.9272 12.1818 19.948 12.3068 19.948 12.4401C19.948 12.5735 19.9272 12.6985 19.8855 12.8151C19.8439 12.9318 19.773 13.0401 19.673 13.1401L13.073 19.7401C12.8897 19.9235 12.6605 20.0151 12.3855 20.0151C12.1105 20.0151 11.873 19.9235 11.673 19.7401C11.473 19.5401 11.373 19.3026 11.373 19.0276C11.373 18.7526 11.473 18.5151 11.673 18.3151L16.548 13.4401Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

ArrowForwardIcon.displayName = 'ArrowForwardIcon';
