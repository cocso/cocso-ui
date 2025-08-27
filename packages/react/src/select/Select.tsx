import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef } from 'react';
import { match } from 'ts-pattern';
import { spacing } from '../token';
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
      '--cocso-select-min-width': spacing.s11,
      '--cocso-select-height': spacing.s11,
      '--cocso-select-padding-left': spacing.s5,
      '--cocso-select-padding-right': `calc(${spacing.s8} + 16px)`,
      '--cocso-select-font-size': '12px',
      '--cocso-select-border-radius': spacing.s3,
    }))
    .with('xs', () => ({
      '--cocso-select-min-width': spacing.s12,
      '--cocso-select-height': spacing.s12,
      '--cocso-select-padding-left': spacing.s6,
      '--cocso-select-padding-right': `calc(${spacing.s7} + 16px)`,
      '--cocso-select-font-size': '14px',
      '--cocso-select-border-radius': spacing.s3,
    }))
    .with('sm', () => ({
      '--cocso-select-min-width': spacing.s14,
      '--cocso-select-height': spacing.s14,
      '--cocso-select-padding-left': spacing.s7,
      '--cocso-select-padding-right': `calc(${spacing.s7} + 16px)`,
      '--cocso-select-font-size': '14px',
      '--cocso-select-border-radius': spacing.s3,
    }))
    .with('md', () => ({
      '--cocso-select-min-width': spacing.s16,
      '--cocso-select-height': spacing.s16,
      '--cocso-select-padding-left': spacing.s8,
      '--cocso-select-padding-right': `calc(${spacing.s8} + 16px)`,
      '--cocso-select-font-size': '16px',
      '--cocso-select-border-radius': spacing.s4,
    }))
    .with('lg', () => ({
      '--cocso-select-min-width': spacing.s17,
      '--cocso-select-height': spacing.s17,
      '--cocso-select-padding-left': spacing.s9,
      '--cocso-select-padding-right': `calc(${spacing.s9} + 16px)`,
      '--cocso-select-font-size': '18px',
      '--cocso-select-border-radius': spacing.s4,
    }))
    .with('xl', () => ({
      '--cocso-select-min-width': spacing.s18,
      '--cocso-select-height': spacing.s18,
      '--cocso-select-padding-left': spacing.s10,
      '--cocso-select-padding-right': `calc(${spacing.s10} + 16px)`,
      '--cocso-select-font-size': '18px',
      '--cocso-select-border-radius': spacing.s4,
    }))
    .exhaustive();
