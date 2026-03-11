import Icon from "../../icon";
import type { IconProps } from "../../types";

export const PieChartIcon = (props: IconProps) => {
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
        <path d="M12 12l-6.5 5.5" />
        <path d="M12 3v9h9" />
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 12l5 7.5" />
      </svg>
    </Icon>
  );
};

PieChartIcon.displayName = "PieChartIcon";
