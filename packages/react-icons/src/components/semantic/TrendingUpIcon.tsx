import Icon from '../../icon';
import type { IconProps } from '../../types';

export const TrendingUpIcon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 17l6 -6l4 4l8 -8" />
        <path d="M14 7l7 0l0 7" />
      </svg>
    </Icon>
  );
};

TrendingUpIcon.displayName = 'TrendingUpIcon';
