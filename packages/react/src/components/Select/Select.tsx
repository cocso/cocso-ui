import * as React from 'react';
import { createClassName } from '../../utils/cn';

export type SelectProps = {
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'select'>, 'size'>;

const SelectComponent = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', disabled = false, className, style, children, ...props }, ref) => {
    const classNames = createClassName('cocso-select', { size, disabled }, [], className);

    return (
      <div className="cocso-select-wrapper">
        <select ref={ref} className={classNames} disabled={disabled} {...props}>
          {children}
        </select>

        <i className="cocso-select-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </i>
      </div>
    );
  },
);

export const Select = Object.assign(SelectComponent, {
  displayName: 'Select',
});
