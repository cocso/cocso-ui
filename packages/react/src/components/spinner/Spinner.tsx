import { Slot } from '@radix-ui/react-slot';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { createColor } from '../../utils';
import styles from './Spinner.module.css';

type SpinnerSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'size' | 'color'> {
  asChild?: boolean;
  size?: SpinnerSize;
  color?: string;
  bg?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      asChild,
      size = 'md',
      color = 'palette.primary-500',
      bg = 'palette.gray-200',
      className,
      style: _style,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'div';
    const style = {
      ..._style,
      '--cocso-spinner-width': getSize(size),
      '--cocso-spinner-height': getSize(size),
      '--cocso-spinner-border-color': createColor(color),
      '--cocso-spinner-bg-color': createColor(bg),
    };

    return <Comp ref={ref} className={styles.spinner} style={style} {...props} />;
  },
);

const getSize = (size: SpinnerSize) => {
  switch (size) {
    case 'xl':
      return 'var(--number-12)';
    case 'lg':
      return 'var(--number-11)';
    case 'md':
      return 'var(--number-10)';
    case 'sm':
      return 'var(--number-9)';
    case 'xs':
      return 'var(--number-8)';
  }
};
