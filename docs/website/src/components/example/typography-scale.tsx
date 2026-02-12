'use client';

import { Typography } from '@cocso-ui/react';

const sizes = [60, 44, 36, 32, 28, 24, 20, 18, 16, 15, 14, 13, 12, 11, 10] as const;

export default function TypographyScale() {
  return (
    <div className="flex w-full flex-col gap-4">
      {sizes.map(size => (
        <div key={size} className="flex items-baseline gap-4">
          <span className="w-10 shrink-0 text-right font-mono text-neutral-400 text-xs">
            {size}px
          </span>
          <Typography size={size} weight="medium">
            코쏘 디자인 시스템
          </Typography>
        </div>
      ))}
    </div>
  );
}
