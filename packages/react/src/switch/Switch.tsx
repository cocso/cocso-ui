import { Primitive } from '@radix-ui/react-primitive';
import * as SwitchPrimitive from '@radix-ui/react-switch';
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
import styles from './Switch.module.css';

export type SwitchSize = 'lg' | 'md';

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  id?: string;
  size?: SwitchSize;
  disabled?: boolean;
  label?: string;
  position?: 'left' | 'right';
}

export const Switch = forwardRef<ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  (
    {
      id: _id,
      className,
      style: _style,
      size = 'md',
      position = 'right',
      disabled,
      label,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = _id ?? generatedId;

    const style = {
      ..._style,
      '--cocso-switch-width': getSwitchWidth(size),
      '--cocso-switch-height': getSwitchHeight(size),
      '--cocso-switch-thumb-width': getThumbSize(size),
      '--cocso-switch-thumb-height': getThumbSize(size),
      '--cocso-switch-bg-color': colors.neutral100,
    } as CSSProperties;

    return (
      <Primitive.div
        className={cx(styles.wrapper, className)}
        aria-disabled={disabled}
        style={style}
      >
        {position === 'left' && (
          <Typography type="body" size={size} asChild>
            <label htmlFor={id}>{label}</label>
          </Typography>
        )}
        <SwitchPrimitive.Root ref={ref} className={styles.switch} disabled={disabled} {...props}>
          <SwitchPrimitive.Thumb className={styles.thumb} />
        </SwitchPrimitive.Root>
        {position === 'right' && (
          <Typography type="body" size={size} aria-disabled={disabled} asChild>
            <label htmlFor={id}>{label}</label>
          </Typography>
        )}
      </Primitive.div>
    );
  },
);

const getSwitchWidth = (size: SwitchSize) =>
  match(size)
    .with('lg', () => spacing.s14)
    .with('md', () => spacing.s12)
    .exhaustive();

const getSwitchHeight = (size: SwitchSize) =>
  match(size)
    .with('lg', () => spacing.s10)
    .with('md', () => spacing.s9)
    .exhaustive();

const getThumbSize = (size: SwitchSize) =>
  match(size)
    .with('lg', () => spacing.s9)
    .with('md', () => spacing.s8)
    .exhaustive();
