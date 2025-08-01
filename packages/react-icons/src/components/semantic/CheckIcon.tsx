import Icon from '../../icon';
import { IconProps } from '../../types';

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_231_37"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="25"
        height="25"
      >
        <rect x="0.486938" y="0.379517" width="24" height="24" fill="currentColor" />
      </mask>
      <g mask="url(#mask0_231_37)">
        <path
          d="M10.0369 15.5295L18.5119 7.05452C18.7119 6.85452 18.9452 6.75452 19.2119 6.75452C19.4786 6.75452 19.7119 6.85452 19.9119 7.05452C20.1119 7.25452 20.2119 7.49202 20.2119 7.76702C20.2119 8.04202 20.1119 8.27952 19.9119 8.47952L10.7369 17.6795C10.5369 17.8795 10.3036 17.9795 10.0369 17.9795C9.77023 17.9795 9.5369 17.8795 9.3369 17.6795L5.0369 13.3795C4.8369 13.1795 4.74107 12.942 4.7494 12.667C4.75773 12.392 4.8619 12.1545 5.0619 11.9545C5.2619 11.7545 5.4994 11.6545 5.7744 11.6545C6.0494 11.6545 6.2869 11.7545 6.4869 11.9545L10.0369 15.5295Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Icon>
);

CheckIcon.displayName = 'CheckIcon';
