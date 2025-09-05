import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { match } from 'ts-pattern';
import { colors } from '../token';
import styles from './Spinner.module.css';

export type SpinnerSize = 'xl' | 'lg' | 'md' | 'sm';

export type SpinnerColor = 'primary' | 'neutral' | 'white';

export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'size' | 'color'> {
  asChild?: boolean;
  size?: SpinnerSize;
  color?: SpinnerColor;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ asChild, className, style: _style, size = 'md', color = 'primary', ...props }, ref) => {
    const Comp = asChild ? Slot : Primitive.div;
    const style = {
      ..._style,
      '--cocso-spinner-size': getSize(size),
      '--cocso-spinner-border-width': getBorderWidth(size),
      '--cocso-spinner-border-color': getBorderColor(color),
      '--cocso-spinner-bg-color': getBackgroundColor(color),
    };

    return <Comp ref={ref} className={cx(styles.spinner, className)} style={style} {...props} />;
  },
);

const getSize = (size: SpinnerSize) =>
  match(size)
    .with('xl', () => '40px')
    .with('lg', () => '32px')
    .with('md', () => '24px')
    .with('sm', () => '16px')
    .exhaustive();

const getBorderWidth = (size: SpinnerSize) =>
  match(size)
    .with('xl', () => '5px')
    .with('lg', () => '4px')
    .with('md', () => '3px')
    .with('sm', () => '2px')
    .exhaustive();

const getBorderColor = (color: SpinnerColor) =>
  match(color)
    .with('primary', () => colors.primary500)
    .with('neutral', () => colors.neutral600)
    .with('white', () => colors.white)
    .exhaustive();

const getBackgroundColor = (color: SpinnerColor) =>
  match(color)
    .with('primary', () => colors.primary100)
    .with('neutral', () => colors.neutral100)
    .with('white', () => colors.whiteAlpha20)
    .exhaustive();
