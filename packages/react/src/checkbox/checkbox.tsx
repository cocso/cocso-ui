import { CheckIcon } from '@cocso-ui/react-icons';
import { Checkbox as CheckboxBase } from '@base-ui/react/checkbox';
import { clsx as cx } from 'clsx';
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type CSSProperties,
  forwardRef,
  useId,
} from 'react';
import { match } from 'ts-pattern';
import { colors, spacing } from '../token';
import { Typography } from '../typography';
import styles from './checkbox.module.css';

export type CheckboxSize = 'lg' | 'md' | 'sm';

export type CheckboxStatus = 'on' | 'off' | 'intermediate';

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof CheckboxBase.Root>, 'checked' | 'onCheckedChange' | 'onChange' | 'indeterminate'> {
  disabled?: boolean;
  id?: string;
  label?: string;
  onChange: (status: CheckboxStatus) => void;
  size?: CheckboxSize;
  status: CheckboxStatus;
}

export const Checkbox = forwardRef<ComponentRef<typeof CheckboxBase.Root>, CheckboxProps>(
  (
    { id: _id, className, style: _style, size = 'md', status, onChange, label, disabled, ...props },
    ref
  ) => {
    const generatedId = useId();
    const id = _id ?? generatedId;

    const handleCheckedChange = (checked: boolean) => {
      if (!disabled) {
        const nextStatus = checked ? 'on' as const : 'off' as const;
        onChange(nextStatus);
      }
    };

    const getCheckedState = (): { checked: boolean; indeterminate: boolean } => {
      return match(status)
        .with('on', () => ({ checked: true, indeterminate: false }))
        .with('intermediate', () => ({ checked: false, indeterminate: true }))
        .with('off', () => ({ checked: false, indeterminate: false }))
        .exhaustive();
    };

    const style = {
      ..._style,
      '--cocso-checkbox-size': getSize(size),
      '--cocso-checkbox-color': colors.white,
      '--cocso-checkbox-border-color': getBorderColor(status),
      '--cocso-checkbox-bg-color': getBackgroundColor(status),
    } as CSSProperties;

    const checkedState = getCheckedState();

    return (
      <div className={cx(styles.wrapper, className)} style={style}>
        <CheckboxBase.Root
          checked={checkedState.checked}
          indeterminate={checkedState.indeterminate}
          className={styles.checkbox}
          disabled={disabled}
          id={id}
          onCheckedChange={handleCheckedChange}
          ref={ref}
          {...props}
        >
          <CheckboxBase.Indicator
            className={styles.indicator}
            style={{ opacity: status === 'on' ? 1 : 0 }}
          >
            <CheckIcon className={styles.icon} size={24} />
          </CheckboxBase.Indicator>

          <div
            aria-hidden="true"
            className={styles.indicator}
            style={{ opacity: status === 'intermediate' ? 1 : 0 }}
          >
            <CheckIcon className={styles.icon} size={24} />
          </div>
        </CheckboxBase.Root>

        {label && (
          <Typography
            aria-disabled={disabled}
            render={<label htmlFor={id}>{label}</label>}
            className={styles.label}
            size={size}
            type="body"
          />
        )}
      </div>
    );
  }
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
