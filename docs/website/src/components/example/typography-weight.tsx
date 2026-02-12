import { Typography } from '@cocso-ui/react';

export default function TypographyWeight() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography size={16} weight="light">
        Light (300)
      </Typography>
      <Typography size={16} weight="normal">
        Normal (400)
      </Typography>
      <Typography size={16} weight="medium">
        Medium (500)
      </Typography>
      <Typography size={16} weight="semibold">
        Semibold (600)
      </Typography>
      <Typography size={16} weight="bold">
        Bold (700)
      </Typography>
    </div>
  );
}
