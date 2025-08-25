import { Slot } from '@radix-ui/react-slot';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { match } from 'ts-pattern';
import { colors } from '../token';
import styles from './Spinner.module.css';

type SpinnerSize = 'xlarge' | 'large' | 'medium' | 'small';

type SpinnerColor = 'primary' | 'neutral' | 'white';

export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'size' | 'color'> {
  asChild?: boolean;
  size?: SpinnerSize;
  color?: SpinnerColor;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ asChild, size = 'medium', color = 'primary', className, style: _style, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    const style = {
      ..._style,
      '--cocso-spinner-size': `${getSize(size)}px`,
      '--cocso-spinner-border-width': `${getBorderWidth(size)}px`,
      '--cocso-spinner-border-color': getBorderColor(color),
      '--cocso-spinner-bg-color': getBackgroundColor(color),
    };

    return <Comp ref={ref} className={styles.spinner} style={style} {...props} />;
  },
);

const getSize = (size: SpinnerSize) =>
  match(size)
    .with('xlarge', () => 40)
    .with('large', () => 32)
    .with('medium', () => 24)
    .with('small', () => 20)
    .exhaustive();

const getBorderWidth = (size: SpinnerSize) =>
  match(size)
    .with('xlarge', () => 5)
    .with('large', () => 4)
    .with('medium', () => 3)
    .with('small', () => 3)
    .exhaustive();

const getBorderColor = (color: SpinnerColor) =>
  match(color)
    .with('primary', () => colors.primary500)
    .with('neutral', () => colors.neutral600)
    .with('white', () => colors.white)
    .exhaustive();

const getBackgroundColor = (color: SpinnerColor) =>
  match(color)
    .with('primary', () => colors.primary200)
    .with('neutral', () => colors.neutral200)
    .with('white', () => colors.whiteAlpha30)
    .exhaustive();
