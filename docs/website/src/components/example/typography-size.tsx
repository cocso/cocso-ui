import { Typography } from '@cocso-ui/react';

export default function TypographySize() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography size={12}>12px 텍스트</Typography>
      <Typography size={14}>14px 텍스트</Typography>
      <Typography size={16}>16px 텍스트</Typography>
      <Typography size={20}>20px 텍스트</Typography>
      <Typography size={24}>24px 텍스트</Typography>
      <Typography size={32}>32px 텍스트</Typography>
    </div>
  );
}
