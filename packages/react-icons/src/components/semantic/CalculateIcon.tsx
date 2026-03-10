import Icon from '../../icon';
import type { IconProps } from '../../types';

export const CalculateIcon = (props: IconProps) => {
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
        <path d="M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -14" />
        <path d="M8 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -1" />
        <path d="M8 14l0 .01" />
        <path d="M12 14l0 .01" />
        <path d="M16 14l0 .01" />
        <path d="M8 17l0 .01" />
        <path d="M12 17l0 .01" />
        <path d="M16 17l0 .01" />
      </svg>
    </Icon>
  );
};

CalculateIcon.displayName = 'CalculateIcon';
