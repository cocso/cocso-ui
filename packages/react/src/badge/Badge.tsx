import { clsx } from 'clsx';
import { type ComponentProps, type CSSProperties, forwardRef } from 'react';
import { match } from 'ts-pattern';
import { colors, type ResponsiveFontSize } from '../token';
import { Typography } from '../typography';
import styles from './Badge.module.css';

type BadgeSize = 'sm' | 'md' | 'lg';

type BadgeVariant = 'default' | 'danger' | 'primary' | 'success' | 'warning';

export interface BadgeProps extends ComponentProps<'div'> {
  size?: BadgeSize;
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, children, size = 'md', variant = 'default', style: _style, ...props }, ref) => {
    const style = {
      ..._style,
      '--cocso-badge-padding': getPadding(size),
      '--cocso-badge-border': undefined,
      '--cocso-badge-border-radius': '6px',
      '--cocso-badge-bg-color': getBackgroundColor(variant),
    } as CSSProperties;

    const fontColor = getFontColor(variant);
    const fontSize = getFontSize(size);

    return (
      <div ref={ref} className={clsx(styles.badge, className)} style={style} {...props}>
        <Typography
          color={fontColor}
          size={fontSize as ResponsiveFontSize}
          weight="medium"
          lineHeight="tight"
          asChild
        >
          <span>{children}</span>
        </Typography>
      </div>
    );
  },
);

const getPadding = (size: BadgeSize) =>
  match(size)
    .with('sm', () => '4px 8px')
    .with('md', () => '6px 12px')
    .with('lg', () => '8px 16px')
    .exhaustive();

const getFontSize = (size: BadgeSize) =>
  match(size)
    .with('sm', () => 12)
    .with('md', () => 14)
    .with('lg', () => 16)
    .exhaustive();

const getFontColor = (variant: BadgeVariant) =>
  match(variant)
    .with('default', () => colors.neutral600)
    .with('danger', () => colors.danger600)
    .with('primary', () => colors.primary600)
    .with('success', () => colors.success600)
    .with('warning', () => colors.warning600)
    .exhaustive();

const getBackgroundColor = (variant: BadgeVariant) =>
  match(variant)
    .with('default', () => colors.neutral50)
    .with('danger', () => colors.danger50)
    .with('primary', () => colors.primary50)
    .with('success', () => colors.success50)
    .with('warning', () => colors.warning50)
    .exhaustive();
