import { Typography } from "@cocso-ui/react";

export default function TypographyCustom() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography size={24} weight="bold">Custom size 24, bold</Typography>
      <Typography size={16} weight="medium">Custom size 16, medium</Typography>
      <Typography size={12} weight="normal" lineHeight="relaxed">Custom size 12, relaxed line height</Typography>
    </div>
  );
}
