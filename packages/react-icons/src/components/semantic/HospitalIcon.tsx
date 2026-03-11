import Icon from "../../icon";
import type { IconProps } from "../../types";

export const HospitalIcon = (props: IconProps) => {
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
        <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
        <path d="M10 16v-8" />
        <path d="M14 16v-8" />
        <path d="M10 12h4" />
      </svg>
    </Icon>
  );
};

HospitalIcon.displayName = "HospitalIcon";
