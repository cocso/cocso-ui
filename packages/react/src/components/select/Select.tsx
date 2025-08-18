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
      '--cocso-select-min-width': getMinWidth(size),
      '--cocso-select-height': getHeight(size),
      '--cocso-select-padding-left': getPaddingLeft(size),
      '--cocso-select-padding-right': getPaddingRight(size),
      '--cocso-select-font-size': `${getFontSize(size)}px`,
      '--cocso-select-border-radius': getBorderRadius(size),
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
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
    );
  },
);

const getMinWidth = (size: SelectSize) => {
  switch (size) {
    case '2xs':
      return 'var(--number-11)';
    case 'xs':
      return 'var(--number-12)';
    case 'sm':
      return 'var(--number-14)';
    case 'md':
      return 'var(--number-16)';
    case 'lg':
      return 'var(--number-17)';
    case 'xl':
      return 'var(--number-18)';
  }
};

const getHeight = (size: SelectSize) => {
  switch (size) {
    case '2xs':
      return 'var(--number-11)';
    case 'xs':
      return 'var(--number-12)';
    case 'sm':
      return 'var(--number-14)';
    case 'md':
      return 'var(--number-16)';
    case 'lg':
      return 'var(--number-17)';
    case 'xl':
      return 'var(--number-18)';
  }
};

const getPaddingLeft = (size: SelectSize) => {
  switch (size) {
    case '2xs':
      return 'var(--number-5)';
    case 'xs':
      return 'var(--number-6)';
    case 'sm':
      return 'var(--number-7)';
    case 'md':
      return 'var(--number-8)';
    case 'lg':
      return 'var(--number-9)';
    case 'xl':
      return 'var(--number-10)';
  }
};

const getPaddingRight = (size: SelectSize) => {
  switch (size) {
    case '2xs':
      return 'calc(var(--number-7) + 16px)';
    case 'xs':
      return 'calc(var(--number-7) + 16px)';
    case 'sm':
      return 'calc(var(--number-7) + 16px)';
    case 'md':
      return 'calc(var(--number-8) + 16px)';
    case 'lg':
      return 'calc(var(--number-9) + 16px)';
    case 'xl':
      return 'calc(var(--number-10) + 16px)';
  }
};

const getFontSize = (size: SelectSize) => {
  switch (size) {
    case '2xs':
      return 12;
    case 'xs':
      return 14;
    case 'sm':
      return 14;
    case 'md':
      return 16;
    case 'lg':
      return 18;
    case 'xl':
      return 18;
  }
};

const getBorderRadius = (size: SelectSize) => {
  switch (size) {
    case '2xs':
      return 'var(--number-3)';
    case 'xs':
      return 'var(--number-3)';
    case 'sm':
      return 'var(--number-3)';
    case 'md':
      return 'var(--number-4)';
    case 'lg':
      return 'var(--number-4)';
    case 'xl':
      return 'var(--number-4)';
  }
};
