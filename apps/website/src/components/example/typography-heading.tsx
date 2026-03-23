import { Typography } from "@cocso-ui/react";

export default function TypographyHeading() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography type="heading" size="x-large">X-Large Heading</Typography>
      <Typography type="heading" size="large">Large Heading</Typography>
      <Typography type="heading" size="medium">Medium Heading</Typography>
      <Typography type="heading" size="small">Small Heading</Typography>
      <Typography type="heading" size="x-small">X-Small Heading</Typography>
    </div>
  );
}
