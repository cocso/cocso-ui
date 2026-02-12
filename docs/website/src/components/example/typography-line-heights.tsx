'use client';

import { Typography } from '@cocso-ui/react';

const lineHeights = [
  { key: 'none', label: 'None', value: '1' },
  { key: 'tight', label: 'Tight', value: '1.25' },
  { key: 'snug', label: 'Snug', value: '1.375' },
  { key: 'normal', label: 'Normal', value: '1.5' },
  { key: 'relaxed', label: 'Relaxed', value: '1.625' },
  { key: 'loose', label: 'Loose', value: '2' },
] as const;

export default function TypographyLineHeights() {
  return (
    <div className="flex w-full flex-col gap-6">
      {lineHeights.map(lh => (
        <div key={lh.key} className="flex gap-4">
          <span className="w-20 shrink-0 pt-0.5 text-right font-mono text-neutral-400 text-xs">
            {lh.label} ({lh.value})
          </span>
          <Typography size={14} weight="normal" lineHeight={lh.key}>
            COCSO-UI는 일관된 사용자 경험을 제공하기 위한 디자인 시스템입니다. 다양한 서비스에서
            통일된 인터페이스를 구축할 수 있도록 돕습니다.
          </Typography>
        </div>
      ))}
    </div>
  );
}
