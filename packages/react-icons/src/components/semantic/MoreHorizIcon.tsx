import Icon from "../../icon";
import type { IconProps } from "../../types";

export const MoreHorizIcon = (props: IconProps) => {
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
        <path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
    </Icon>
  );
};

MoreHorizIcon.displayName = "MoreHorizIcon";
