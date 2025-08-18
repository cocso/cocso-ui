import * as SwitchPrimitive from '@radix-ui/react-switch';
import { clsx as cn } from 'clsx';
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type CSSProperties,
  forwardRef,
  useId,
} from 'react';
import { Body } from '../body';
import styles from './Switch.module.css';

type SwitchSize = 'lg' | 'md';

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
      size = 'md',
      disabled = false,
      label,
      position = 'right',
      className,
      children,
      style: _style,
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
      '--cocso-switch-bg-color': 'var(--color-palette-secondary-200)',
    } as CSSProperties;

    return (
      <div className={cn(styles.wrapper, className)} aria-disabled={disabled} style={style}>
        {position === 'left' && (
          <Body size={size} asChild>
            <label htmlFor={id}>{label}</label>
          </Body>
        )}
        <SwitchPrimitive.Root ref={ref} className={styles.switch} disabled={disabled} {...props}>
          <SwitchPrimitive.Thumb className={styles.thumb} />
        </SwitchPrimitive.Root>
        {position === 'right' && (
          <Body size={size} aria-disabled={disabled} asChild>
            <label htmlFor={id}>{label}</label>
          </Body>
        )}
      </div>
    );
  },
);

const getSwitchWidth = (size: SwitchSize) => {
  switch (size) {
    case 'lg':
      return 'var(--number-14)';
    case 'md':
      return 'var(--number-12)';
  }
};

const getSwitchHeight = (size: SwitchSize) => {
  switch (size) {
    case 'lg':
      return 'var(--number-10)';
    case 'md':
      return 'var(--number-9)';
  }
};

const getThumbSize = (size: SwitchSize) => {
  switch (size) {
    case 'lg':
      return 'var(--number-9)';
    case 'md':
      return 'var(--number-8)';
  }
};
