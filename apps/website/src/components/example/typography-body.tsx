import { Typography } from "@cocso-ui/react";

export default function TypographyBody() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography type="body" size="large">Large body text for prominent content.</Typography>
      <Typography type="body" size="medium">Medium body text for standard content.</Typography>
      <Typography type="body" size="small">Small body text for secondary content.</Typography>
      <Typography type="body" size="x-small">X-Small body text for captions.</Typography>
    </div>
  );
}
