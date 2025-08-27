import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef } from 'react';
import { match } from 'ts-pattern';
import styles from './Select.module.css';

type SelectSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';

export interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  size?: SelectSize;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, style: _style, size = 'md', disabled = false, children, ...props }, ref) => {
    const style = {
      ..._style,
      ...getStyles(size),
    } as CSSProperties;

    return (
      <div className={styles.wrapper}>
        <select
          ref={ref}
          className={cx(styles.select, className)}
          style={style}
          disabled={disabled}
          {...props}
        >
          {children}
        </select>

        <span className={styles.icon}>
          <KeyboardArrowDownIcon size={20} />
        </span>
      </div>
    );
  },
);

const getStyles = (size: SelectSize) =>
  match(size)
    .with('2xs', () => ({
      '--cocso-select-min-width': 'var(--number-11)',
      '--cocso-select-height': 'var(--number-11)',
      '--cocso-select-padding-left': 'var(--number-5)',
      '--cocso-select-padding-right': 'calc(var(--number-8) + 16px)',
      '--cocso-select-font-size': '12px',
      '--cocso-select-border-radius': 'var(--number-3)',
    }))
    .with('xs', () => ({
      '--cocso-select-min-width': 'var(--number-12)',
      '--cocso-select-height': 'var(--number-12)',
      '--cocso-select-padding-left': 'var(--number-6)',
      '--cocso-select-padding-right': 'calc(var(--number-7) + 16px)',
      '--cocso-select-font-size': '14px',
      '--cocso-select-border-radius': 'var(--number-3)',
    }))
    .with('sm', () => ({
      '--cocso-select-min-width': 'var(--number-14)',
      '--cocso-select-height': 'var(--number-14)',
      '--cocso-select-padding-left': 'var(--number-7)',
      '--cocso-select-padding-right': 'calc(var(--number-7) + 16px)',
      '--cocso-select-font-size': '14px',
      '--cocso-select-border-radius': 'var(--number-3)',
    }))
    .with('md', () => ({
      '--cocso-select-min-width': 'var(--number-16)',
      '--cocso-select-height': 'var(--number-16)',
      '--cocso-select-padding-left': 'var(--number-8)',
      '--cocso-select-padding-right': 'calc(var(--number-8) + 16px)',
      '--cocso-select-font-size': '16px',
      '--cocso-select-border-radius': 'var(--number-4)',
    }))
    .with('lg', () => ({
      '--cocso-select-min-width': 'var(--number-17)',
      '--cocso-select-height': 'var(--number-17)',
      '--cocso-select-padding-left': 'var(--number-9)',
      '--cocso-select-padding-right': 'calc(var(--number-9) + 16px)',
      '--cocso-select-font-size': '18px',
      '--cocso-select-border-radius': 'var(--number-4)',
    }))
    .with('xl', () => ({
      '--cocso-select-min-width': 'var(--number-18)',
      '--cocso-select-height': 'var(--number-18)',
      '--cocso-select-padding-left': 'var(--number-10)',
      '--cocso-select-padding-right': 'calc(var(--number-10) + 16px)',
      '--cocso-select-font-size': '18px',
      '--cocso-select-border-radius': 'var(--number-4)',
    }))
    .exhaustive();
