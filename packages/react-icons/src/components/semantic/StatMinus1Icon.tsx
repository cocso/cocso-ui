import Icon from "../../icon";
import type { IconProps } from "../../types";

export const StatMinus1Icon = (props: IconProps) => {
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
        <path d="M6 9l6 6l6 -6" />
      </svg>
    </Icon>
  );
};

StatMinus1Icon.displayName = "StatMinus1Icon";
