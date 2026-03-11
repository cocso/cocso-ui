import Icon from "../../icon";
import type { IconProps } from "../../types";

export const PercentIcon = (props: IconProps) => {
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
        <path d="M16 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M6 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M6 18l12 -12" />
      </svg>
    </Icon>
  );
};

PercentIcon.displayName = "PercentIcon";
