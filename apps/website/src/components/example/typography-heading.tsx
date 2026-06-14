import { Typography } from "@cocso-ui/react";

export default function TypographyHeading() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography size="x-large" type="heading">
        X-Large Heading
      </Typography>
      <Typography size="large" type="heading">
        Large Heading
      </Typography>
      <Typography size="medium" type="heading">
        Medium Heading
      </Typography>
      <Typography size="small" type="heading">
        Small Heading
      </Typography>
      <Typography size="x-small" type="heading">
        X-Small Heading
      </Typography>
    </div>
  );
}
