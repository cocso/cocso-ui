import Icon from '../../icon';
import type { IconProps } from '../../types';

export const TextSelectJumpToEndIcon = (props: IconProps) => {
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
        <path d="M4 6l10 0" />
        <path d="M4 18l10 0" />
        <path d="M4 12h17l-3 -3m0 6l3 -3" />
      </svg>
    </Icon>
  );
};

TextSelectJumpToEndIcon.displayName = 'TextSelectJumpToEndIcon';
