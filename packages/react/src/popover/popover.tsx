import { Popover as PopoverBase } from '@base-ui/react/popover';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './popover.module.css';

const PopoverContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof PopoverBase.Popup>>(
  ({ className, ...props }, ref) => {
    return (
      <PopoverBase.Portal>
        <PopoverBase.Positioner>
          <PopoverBase.Popup className={cx(styles.content, className)} ref={ref} {...props} />
        </PopoverBase.Positioner>
      </PopoverBase.Portal>
    );
  }
);

export const Popover = Object.assign(PopoverBase.Root, {
  Trigger: PopoverBase.Trigger,
  Content: PopoverContent,
});
