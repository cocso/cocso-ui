import Icon from '../../icon';
import type { IconProps } from '../../types';

export const OutpatientMedIcon = (props: IconProps) => {
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
        <path d="M14 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M6 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M4 8l2.1 2.8a3 3 0 0 0 2.4 1.2h11.5" />
        <path d="M10 6h4" />
        <path d="M12 4v4" />
        <path d="M12 12v2l-2.5 2.5" />
        <path d="M14.5 16.5l-2.5 -2.5" />
      </svg>
    </Icon>
  );
};

OutpatientMedIcon.displayName = 'OutpatientMedIcon';
