import { Typography } from "@cocso-ui/react";

export default function TypographyBody() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography size="large" type="body">
        Large body text for prominent content.
      </Typography>
      <Typography size="medium" type="body">
        Medium body text for standard content.
      </Typography>
      <Typography size="small" type="body">
        Small body text for secondary content.
      </Typography>
      <Typography size="x-small" type="body">
        X-Small body text for captions.
      </Typography>
    </div>
  );
}
