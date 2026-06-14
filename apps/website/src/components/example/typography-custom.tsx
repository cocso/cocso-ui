import { Typography } from "@cocso-ui/react";

export default function TypographyCustom() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography size={24} type="custom" weight="bold">
        Custom size 24, bold
      </Typography>
      <Typography size={16} type="custom" weight="medium">
        Custom size 16, medium
      </Typography>
      <Typography lineHeight="relaxed" size={12} type="custom" weight="normal">
        Custom size 12, relaxed line height
      </Typography>
    </div>
  );
}
