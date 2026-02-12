import Icon from '../../icon';
import type { IconProps } from '../../types';

export const Stat1Icon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M6 15l6 -6l6 6" />
      </svg>
    </Icon>
  );
};

Stat1Icon.displayName = 'Stat1Icon';
