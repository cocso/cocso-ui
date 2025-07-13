import * as React from 'react';
import { createClassName } from '../../utils/cn';
import { Label } from '../Label';

export type CheckboxStatus = 'on' | 'off' | 'intermediate';

export type CheckboxProps = {
  id: string;
  size?: 'lg' | 'md' | 'sm';
  status: CheckboxStatus;
  onChange: (next: CheckboxStatus) => void;
  label?: string;
  disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'id'>;

const CheckboxComponent = React.forwardRef(
  (
    {
      id,
      size = 'md',
      status,
      onChange,
      label,
      disabled = false,
      className,
      ...props
    }: CheckboxProps,
    ref?: React.ComponentPropsWithRef<'div'>['ref'],
  ) => {
    const variants = { size, disabled, status };
    const compoundVariants = [...(disabled ? [{ status, disabled }] : [])];
    const innerClassName = createClassName(
      'cocso-checkbox-inner',
      variants,
      compoundVariants,
      className,
    );

    const handleChange = () => {
      if (!disabled) {
        const newStatus: CheckboxStatus = status === 'on' ? 'off' : 'on';
        onChange(newStatus);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleChange();
      }
    };

    return (
      <div
        ref={ref}
        className="cocso-checkbox"
        tabIndex={disabled ? -1 : 0}
        role="checkbox"
        aria-checked={status === 'on' ? 'true' : status === 'intermediate' ? 'mixed' : 'false'}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div className={innerClassName} onClick={handleChange}>
          <div className="cocso-checkbox-icon" style={{ opacity: status === 'on' ? 1 : 0 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div
            className="cocso-checkbox-icon"
            style={{ opacity: status === 'intermediate' ? 1 : 0 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
            </svg>
          </div>
          <input
            type="checkbox"
            id={id}
            checked={status === 'on'}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>

        {label && (
          <Label
            className={createClassName('cocso-checkbox-label', variants)}
            htmlFor={id}
            size={size}
          >
            {label}
          </Label>
        )}
      </div>
    );
  },
);

export const Checkbox = Object.assign(CheckboxComponent, {
  displayName: 'Checkbox',
});
