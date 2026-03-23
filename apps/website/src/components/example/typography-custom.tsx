import { Typography } from "@cocso-ui/react";

export default function TypographyCustom() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography type="custom" size={24} weight="bold">Custom size 24, bold</Typography>
      <Typography type="custom" size={16} weight="medium">Custom size 16, medium</Typography>
      <Typography type="custom" size={12} weight="normal" lineHeight="relaxed">Custom size 12, relaxed line height</Typography>
    </div>
  );
}
