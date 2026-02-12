import { Typography } from '@cocso-ui/react';

export default function TypographyType() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography type="heading" size="md" weight="bold">Heading 텍스트</Typography>
      <Typography type="body" size="md">Body 텍스트입니다. 일반적인 본문 내용에 사용합니다.</Typography>
    </div>
  );
}
