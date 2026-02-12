import Icon from '../../icon';
import type { IconProps } from '../../types';

export const PercentIcon = (props: IconProps) => {
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
        <path d="M16 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M6 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M6 18l12 -12" />
      </svg>
    </Icon>
  );
};

PercentIcon.displayName = 'PercentIcon';
