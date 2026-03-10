import { Primitive } from '@radix-ui/react-primitive';
import { Root, Thumb } from '@radix-ui/react-switch';
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
import styles from './switch.module.css';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends ComponentPropsWithoutRef<typeof Root> {
  disabled?: boolean;
  id?: string;
  label?: string;
  position?: 'left' | 'right';
  size?: SwitchSize;
}

export const Switch = forwardRef<ComponentRef<typeof Root>, SwitchProps>(
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
    ref
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
        aria-disabled={disabled}
        className={cx(styles.wrapper, className)}
        style={style}
      >
        {position === 'left' && (
          <Typography asChild size={size} type="body">
            <label htmlFor={id}>{label}</label>
          </Typography>
        )}
        <Root className={styles.switch} disabled={disabled} ref={ref} {...props}>
          <Thumb className={styles.thumb} />
        </Root>
        {position === 'right' && (
          <Typography aria-disabled={disabled} asChild size={size} type="body">
            <label htmlFor={id}>{label}</label>
          </Typography>
        )}
      </Primitive.div>
    );
  }
);

const getSwitchWidth = (size: SwitchSize) =>
  match(size)
    .with('md', () => spacing.s14)
    .with('sm', () => spacing.s12)
    .exhaustive();

const getSwitchHeight = (size: SwitchSize) =>
  match(size)
    .with('md', () => spacing.s10)
    .with('sm', () => spacing.s9)
    .exhaustive();

const getThumbSize = (size: SwitchSize) =>
  match(size)
    .with('md', () => spacing.s9)
    .with('sm', () => spacing.s8)
    .exhaustive();
