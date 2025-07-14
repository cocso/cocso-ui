import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { createClassName } from '../../utils/cn';
import { Label } from '../Label';

export type CheckboxStatus = 'on' | 'off' | 'intermediate';

export type CheckboxProps = {
  id?: string;
  size?: 'lg' | 'md' | 'sm';
  status: CheckboxStatus;
  onChange: (next: CheckboxStatus) => void;
  label?: string;
  disabled?: boolean;
} & Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'checked' | 'onCheckedChange'
>;

const CheckboxComponent = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ id, size = 'md', status, onChange, label, disabled = false, className, ...props }, ref) => {
  const variants = { size, disabled, status };
  const compoundVariants = [...(disabled ? [{ status, disabled }] : [])];
  const classNames = createClassName('cocso-checkbox', variants, compoundVariants, className);

  const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
    if (!disabled) {
      let newStatus: CheckboxStatus;
      if (checked === true) {
        newStatus = 'on';
      } else if (checked === 'indeterminate') {
        newStatus = 'intermediate';
      } else {
        newStatus = 'off';
      }
      onChange(newStatus);
    }
  };

  const getCheckedState = (): CheckboxPrimitive.CheckedState => {
    switch (status) {
      case 'on':
        return true;
      case 'intermediate':
        return 'indeterminate';
      case 'off':
      default:
        return false;
    }
  };

  return (
    <div className="cocso-checkbox-wrapper">
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={classNames}
        checked={getCheckedState()}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className="cocso-checkbox-indicator"
          style={{ opacity: status === 'on' ? 1 : 0 }}
        >
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
        </CheckboxPrimitive.Indicator>

        <div
          className="cocso-checkbox-indicator"
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
      </CheckboxPrimitive.Root>

      {label && (
        <Label 
          className={createClassName('cocso-checkbox-label', variants)} 
          size={size}
          htmlFor={id}
        >
          {label}
        </Label>
      )}
    </div>
  );
});

export const Checkbox = Object.assign(CheckboxComponent, {
  displayName: 'Checkbox',
});
