import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ReactElement, cloneElement, forwardRef, isValidElement } from 'react';
import { match } from 'ts-pattern';
import { colors } from '../token';
import styles from './spinner.module.css';

export type SpinnerSize = 'xl' | 'lg' | 'md' | 'sm';

export type SpinnerColor = 'primary' | 'neutral' | 'white';

export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'size' | 'color'> {
  color?: SpinnerColor;
  render?: ReactElement;
  size?: SpinnerSize;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ render: renderProp, className, style: _style, size = 'md', color = 'primary', ...props }, ref) => {
    const style = {
      ..._style,
      '--cocso-spinner-size': getSize(size),
      '--cocso-spinner-border-width': getBorderWidth(size),
      '--cocso-spinner-border-color': getBorderColor(color),
      '--cocso-spinner-bg-color': getBackgroundColor(color),
    };

    const mergedClassName = cx(styles.spinner, className);

    if (renderProp && isValidElement(renderProp)) {
      return cloneElement(renderProp, {
        ref,
        className: cx(mergedClassName, (renderProp.props as Record<string, unknown>).className as string | undefined),
        style: { ...style, ...((renderProp.props as Record<string, unknown>).style as Record<string, unknown> | undefined) },
        ...props,
      });
    }

    return <div className={mergedClassName} ref={ref} style={style} {...props} />;
  }
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
