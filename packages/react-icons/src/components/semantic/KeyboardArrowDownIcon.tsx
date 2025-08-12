import Icon from '../../icon';
import type { IconProps } from '../../types';

export const KeyboardArrowDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <mask
        id="mask0_1149_31"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="25"
        height="25"
      >
        <rect x="0.333984" y="0.666626" width="24" height="24" fill="currentColor" />
      </mask>
      <g mask="url(#mask0_1149_31)">
        <path
          d="M12.3338 15.6417C12.2005 15.6417 12.0755 15.6208 11.9588 15.5792C11.8421 15.5375 11.7338 15.4667 11.6338 15.3667L7.03379 10.7667C6.85046 10.5833 6.75879 10.35 6.75879 10.0667C6.75879 9.78334 6.85046 9.55001 7.03379 9.36667C7.21712 9.18334 7.45046 9.09167 7.73379 9.09167C8.01712 9.09167 8.25046 9.18334 8.43379 9.36667L12.3338 13.2667L16.2338 9.36667C16.4171 9.18334 16.6505 9.09167 16.9338 9.09167C17.2171 9.09167 17.4505 9.18334 17.6338 9.36667C17.8171 9.55001 17.9088 9.78334 17.9088 10.0667C17.9088 10.35 17.8171 10.5833 17.6338 10.7667L13.0338 15.3667C12.9338 15.4667 12.8255 15.5375 12.7088 15.5792C12.5921 15.6208 12.4671 15.6417 12.3338 15.6417Z"
          fill="currentColor"
        />
      </g>
    </svg>
  </Icon>
);

KeyboardArrowDownIcon.displayName = 'KeyboardArrowDownIcon';
