import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, type ReactElement, cloneElement, forwardRef, isValidElement } from 'react';
import type { FontWeight, LineHeight } from '../token';
import { Typography } from '../typography';
import styles from './link.module.css';

export type LinkSize = 'lg' | 'md' | 'sm' | 'xs';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  indicator?: boolean;
  lineHeight?: LineHeight;
  render?: ReactElement;
  size?: LinkSize;
  weight?: FontWeight;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ render: renderProp, className, size, weight, lineHeight, indicator = true, ...props }, ref) => {
    const mergedClassName = cx(styles.link, indicator && styles.indicator, className);

    if (renderProp && isValidElement(renderProp)) {
      return (
        <Typography
          render={
            cloneElement(renderProp, {
              ref,
              className: cx(mergedClassName, (renderProp.props as Record<string, unknown>).className as string | undefined),
              ...props,
            })
          }
          lineHeight={lineHeight}
          size={size}
          type="body"
          weight={weight}
        />
      );
    }

    return (
      <Typography
        render={
          <a
            className={mergedClassName}
            ref={ref}
            {...props}
          />
        }
        lineHeight={lineHeight}
        size={size}
        type="body"
        weight={weight}
      />
    );
  }
);
