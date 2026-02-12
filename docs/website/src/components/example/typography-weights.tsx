'use client';

import { Typography } from '@cocso-ui/react';

const weights = [
  { key: 'thin', label: 'Thin', value: 100 },
  { key: 'extralight', label: 'Extra Light', value: 200 },
  { key: 'light', label: 'Light', value: 300 },
  { key: 'normal', label: 'Normal', value: 400 },
  { key: 'medium', label: 'Medium', value: 500 },
  { key: 'semibold', label: 'Semibold', value: 600 },
  { key: 'bold', label: 'Bold', value: 700 },
  { key: 'extrabold', label: 'Extra Bold', value: 800 },
  { key: 'black', label: 'Black', value: 900 },
] as const;

export default function TypographyWeights() {
  return (
    <div className="flex w-full flex-col gap-3">
      {weights.map(w => (
        <div key={w.key} className="flex items-baseline gap-4">
          <span className="w-24 shrink-0 text-right font-mono text-neutral-400 text-xs">
            {w.label} ({w.value})
          </span>
          <Typography size={18} weight={w.key}>
            코쏘 디자인 시스템
          </Typography>
        </div>
      ))}
    </div>
  );
}
