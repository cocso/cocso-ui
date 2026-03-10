import Icon from '../../icon';
import type { IconProps } from '../../types';

export const CheckIndeterminateSmallIcon = (props: IconProps) => {
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
        <path d="M7 12l10 0" />
      </svg>
    </Icon>
  );
};

CheckIndeterminateSmallIcon.displayName = 'CheckIndeterminateSmallIcon';
