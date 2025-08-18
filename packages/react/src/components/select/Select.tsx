import { KeyboardArrowDownIcon } from '@cocso-ui/react-icons';
import { clsx as cn } from 'clsx';
import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef } from 'react';
import styles from './Select.module.css';

type SelectSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';

export interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  size?: SelectSize;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', disabled = false, className, style: _style, children, ...props }, ref) => {
    const style = {
      ..._style,
      '--cocso-select-min-width': variables[size].minWidth,
      '--cocso-select-height': variables[size].height,
      '--cocso-select-padding-left': variables[size].paddingLeft,
      '--cocso-select-padding-right': variables[size].paddingRight,
      '--cocso-select-font-size': `${variables[size].fontSize}px`,
      '--cocso-select-border-radius': variables[size].borderRadius,
    } as CSSProperties;

    return (
      <div className={styles.wrapper}>
        <select
          ref={ref}
          className={cn(styles.select, className)}
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

const variables = {
  '2xs': {
    minWidth: 'var(--number-11)',
    height: 'var(--number-11)',
    paddingLeft: 'var(--number-5)',
    paddingRight: 'calc(var(--number-8) + 16px)',
    fontSize: 12,
    borderRadius: 'var(--number-3)',
  },
  xs: {
    minWidth: 'var(--number-12)',
    height: 'var(--number-12)',
    paddingLeft: 'var(--number-6)',
    paddingRight: 'calc(var(--number-7) + 16px)',
    fontSize: 14,
    borderRadius: 'var(--number-3)',
  },
  sm: {
    minWidth: 'var(--number-14)',
    height: 'var(--number-14)',
    paddingLeft: 'var(--number-7)',
    paddingRight: 'calc(var(--number-7) + 16px)',
    fontSize: 14,
    borderRadius: 'var(--number-3)',
  },
  md: {
    minWidth: 'var(--number-16)',
    height: 'var(--number-16)',
    paddingLeft: 'var(--number-8)',
    paddingRight: 'calc(var(--number-8) + 16px)',
    fontSize: 16,
    borderRadius: 'var(--number-4)',
  },
  lg: {
    minWidth: 'var(--number-17)',
    height: 'var(--number-17)',
    paddingLeft: 'var(--number-9)',
    paddingRight: 'calc(var(--number-9) + 16px)',
    fontSize: 18,
    borderRadius: 'var(--number-4)',
  },
  xl: {
    minWidth: 'var(--number-18)',
    height: 'var(--number-18)',
    paddingLeft: 'var(--number-10)',
    paddingRight: 'calc(var(--number-10) + 16px)',
    fontSize: 18,
    borderRadius: 'var(--number-4)',
  },
} as const;
