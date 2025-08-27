import { CheckIcon } from '@cocso-ui/react-icons';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { clsx as cx } from 'clsx';
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type CSSProperties,
  forwardRef,
  useId,
} from 'react';
import { match } from 'ts-pattern';
import { Body } from '../body';
import { colors, spacing } from '../token';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'lg' | 'md' | 'sm';

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
    { id: _id, className, style: _style, size = 'md', status, onChange, label, disabled, ...props },
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
      '--cocso-checkbox-color': colors.white,
      '--cocso-checkbox-border-color': getBorderColor(status),
      '--cocso-checkbox-bg-color': getBackgroundColor(status),
    } as CSSProperties;

    return (
      <div className={cx(styles.wrapper, className)} style={style}>
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          className={styles.checkbox}
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
    .with('lg', () => spacing.s10)
    .with('md', () => spacing.s9)
    .with('sm', () => spacing.s8)
    .exhaustive();
};

const getBorderColor = (status: CheckboxStatus) => {
  return match(status)
    .with('on', () => colors.primary500)
    .with('intermediate', () => colors.primary500)
    .with('off', () => colors.neutral100)
    .exhaustive();
};

const getBackgroundColor = (status: CheckboxStatus) => {
  return match(status)
    .with('on', () => colors.primary500)
    .with('intermediate', () => colors.primary500)
    .with('off', () => colors.white)
    .exhaustive();
};
