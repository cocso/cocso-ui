import Icon from '../../icon';
import type { IconProps } from '../../types';

export const MoreHorizIcon = (props: IconProps) => {
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
        <path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
    </Icon>
  );
};

MoreHorizIcon.displayName = 'MoreHorizIcon';
