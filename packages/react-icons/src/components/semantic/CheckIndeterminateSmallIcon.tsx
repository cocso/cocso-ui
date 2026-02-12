import Icon from '../../icon';
import type { IconProps } from '../../types';

export const CheckIndeterminateSmallIcon = (props: IconProps) => {
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
        <path d="M7 12l10 0" />
      </svg>
    </Icon>
  );
};

CheckIndeterminateSmallIcon.displayName = 'CheckIndeterminateSmallIcon';
