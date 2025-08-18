import { CheckIcon } from '@cocso-ui/react-icons';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type CSSProperties,
  forwardRef,
  useId,
} from 'react';
import { match } from 'ts-pattern';
import { Body } from '../body';
import styles from './Checkbox.module.css';

type CheckboxSize = 'lg' | 'md' | 'sm';

export type CheckboxStatus = 'on' | 'off' | 'intermediate';

export interface CheckboxProps
  extends Omit<
    ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    'checked' | 'onCheckedChange' | 'onChange'
  > {
  id?: string;
  size?: CheckboxSize;
  status: CheckboxStatus;
  onChange: (status: CheckboxStatus) => void;
  label?: string;
  disabled?: boolean;
}

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
    const id = _id ?? generatedId;

    const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
      if (!disabled) {
        const nextStatus = match(checked)
          .with(true, () => 'on' as const)
          .with('indeterminate', () => 'intermediate' as const)
          .with(false, () => 'off' as const)
          .exhaustive();
        onChange(nextStatus);
      }
    };

    const getCheckedState = (): CheckboxPrimitive.CheckedState => {
      return match(status)
        .with('on', () => true)
        .with('intermediate', () => 'indeterminate' as const)
        .with('off', () => false)
        .exhaustive();
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
          <Body className={styles.label} size={size} aria-disabled={disabled} asChild>
            <label htmlFor={id}>{label}</label>
          </Body>
        )}
      </div>
    );
  },
);

const getSize = (size: CheckboxSize) => {
  return match(size)
    .with('lg', () => 'var(--number-10)')
    .with('md', () => 'var(--number-9)')
    .with('sm', () => 'var(--number-8)')
    .exhaustive();
};

const getBorderColor = (status: CheckboxStatus) => {
  return match(status)
    .with('on', () => 'var(--color-palette-primary-500)')
    .with('intermediate', () => 'var(--color-palette-primary-500)')
    .with('off', () => 'var(--color-divider-gray-light)')
    .exhaustive();
};

const getBackgroundColor = (status: CheckboxStatus) => {
  return match(status)
    .with('on', () => 'var(--color-palette-primary-500)')
    .with('intermediate', () => 'var(--color-palette-primary-500)')
    .with('off', () => 'var(--color-palette-gray-0)')
    .exhaustive();
};
