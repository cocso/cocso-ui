import Icon from '../../icon';
import type { IconProps } from '../../types';

export const PlusIcon = (props: IconProps) => {
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
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </svg>
    </Icon>
  );
};

PlusIcon.displayName = 'PlusIcon';
