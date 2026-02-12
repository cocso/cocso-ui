import Icon from '../../icon';
import type { IconProps } from '../../types';

export const HospitalIcon = (props: IconProps) => {
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
        <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
        <path d="M10 16v-8" />
        <path d="M14 16v-8" />
        <path d="M10 12h4" />
      </svg>
    </Icon>
  );
};

HospitalIcon.displayName = 'HospitalIcon';
