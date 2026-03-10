import Icon from '../../icon';
import type { IconProps } from '../../types';

export const CheckIcon = (props: IconProps) => {
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
        <path d="M5 12l5 5l10 -10" />
      </svg>
    </Icon>
  );
};

CheckIcon.displayName = 'CheckIcon';
