import { CheckIcon } from '@cocso-ui/react-icons';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type CSSProperties,
  forwardRef,
  useId,
} from 'react';
import { Label } from '../Label';
import styles from './Checkbox.module.css';

type CheckboxSize = 'lg' | 'md' | 'sm';

export type CheckboxStatus = 'on' | 'off' | 'intermediate';

export type CheckboxProps = {
  id?: string;
  size?: CheckboxSize;
  status: CheckboxStatus;
  onChange: (status: CheckboxStatus) => void;
  label?: string;
  disabled?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'checked' | 'onCheckedChange'>;

export const Checkbox = forwardRef<ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  (
    {
      id: _id,
      size = 'md',
      status,
      onChange,
      label,
      disabled = false,
      className,
      style: _style,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = _id || generatedId;

    const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
      if (!disabled) {
        let nextStatus: CheckboxStatus;
        if (checked === true) {
          nextStatus = 'on';
        } else if (checked === 'indeterminate') {
          nextStatus = 'intermediate';
        } else {
          nextStatus = 'off';
        }
        onChange(nextStatus);
      }
    };

    const getCheckedState = (): CheckboxPrimitive.CheckedState => {
      switch (status) {
        case 'on':
          return true;
        case 'intermediate':
          return 'indeterminate';
        case 'off':
          return false;
      }
    };

    const style = {
      ..._style,
      '--cocso-checkbox-size': getSize(size),
      '--cocso-checkbox-color': 'var(--color-palette-gray-0)',
      '--cocso-checkbox-border-color': getBorderColor(status),
      '--cocso-checkbox-bg-color': getBackgroundColor(status),
    } as CSSProperties;

    return (
      <div className={styles.wrapper}>
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          className={styles.checkbox}
          style={style}
          checked={getCheckedState()}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={styles.indicator}
            style={{ opacity: status === 'on' ? 1 : 0 }}
            aria-hidden="true"
          >
            <CheckIcon size={24} />
          </CheckboxPrimitive.Indicator>

          <div
            className={styles.indicator}
            style={{ opacity: status === 'intermediate' ? 1 : 0 }}
            aria-hidden="true"
          >
            <CheckIcon size={24} />
          </div>
        </CheckboxPrimitive.Root>

        {label && (
          <Label className={styles.label} size={size} htmlFor={id} aria-disabled={disabled}>
            {label}
          </Label>
        )}
      </div>
    );
  },
);

const getSize = (size: CheckboxSize) => {
  switch (size) {
    case 'lg':
      return 'var(--number-10)';
    case 'md':
      return 'var(--number-9)';
    case 'sm':
      return 'var(--number-8)';
  }
};

const getBorderColor = (status: CheckboxStatus) => {
  switch (status) {
    case 'on':
      return 'var(--color-palette-primary-500)';
    case 'intermediate':
      return 'var(--color-palette-primary-500)';
    case 'off':
      return 'var(--color-divider-gray-light)';
  }
};

const getBackgroundColor = (status: CheckboxStatus) => {
  switch (status) {
    case 'on':
      return 'var(--color-palette-primary-500)';
    case 'intermediate':
      return 'var(--color-palette-primary-500)';
    case 'off':
      return 'var(--color-palette-gray-0)';
  }
};
