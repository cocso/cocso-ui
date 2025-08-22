import { useId } from 'react';
import Icon from '../../icon';
import type { IconProps } from '../../types';

export const ArrowIOSForwardIcon = (props: IconProps) => {
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
          <rect x="0.664062" y="0.387695" width="24" height="24" fill="currentColor" />
        </mask>
        <g mask={`url(#${id})`}>
          <path
            d="M15.1392 12.3877L7.78917 5.0377C7.53917 4.7877 7.41834 4.49186 7.42667 4.1502C7.43501 3.80853 7.56417 3.5127 7.81417 3.2627C8.06417 3.0127 8.36001 2.8877 8.70167 2.8877C9.04334 2.8877 9.33917 3.0127 9.58917 3.2627L17.2642 10.9627C17.4642 11.1627 17.6142 11.3877 17.7142 11.6377C17.8142 11.8877 17.8642 12.1377 17.8642 12.3877C17.8642 12.6377 17.8142 12.8877 17.7142 13.1377C17.6142 13.3877 17.4642 13.6127 17.2642 13.8127L9.56417 21.5127C9.31417 21.7627 9.02251 21.8835 8.68917 21.8752C8.35584 21.8669 8.06417 21.7377 7.81417 21.4877C7.56417 21.2377 7.43917 20.9419 7.43917 20.6002C7.43917 20.2585 7.56417 19.9627 7.81417 19.7127L15.1392 12.3877Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </Icon>
  );
};

ArrowIOSForwardIcon.displayName = 'ArrowIOSForwardIcon';
