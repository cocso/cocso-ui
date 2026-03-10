import Icon from '../../icon';
import type { IconProps } from '../../types';

export const SettingsBackupRestoreIcon = (props: IconProps) => {
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
        <path d="M3.06 13a9 9 0 1 0 .49 -4.087" />
        <path d="M3 4.001v5h5" />
        <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
    </Icon>
  );
};

SettingsBackupRestoreIcon.displayName = 'SettingsBackupRestoreIcon';
