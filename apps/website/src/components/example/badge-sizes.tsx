import { Badge } from "@cocso-ui/react";

export default function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Badge size="large">Large</Badge>
      <Badge size="medium">Medium</Badge>
      <Badge size="small">Small</Badge>
    </div>
  );
}
