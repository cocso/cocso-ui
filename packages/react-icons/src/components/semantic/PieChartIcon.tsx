import Icon from '../../icon';
import type { IconProps } from '../../types';

export const PieChartIcon = (props: IconProps) => {
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
        <path d="M12 12l-6.5 5.5" />
        <path d="M12 3v9h9" />
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 12l5 7.5" />
      </svg>
    </Icon>
  );
};

PieChartIcon.displayName = 'PieChartIcon';
