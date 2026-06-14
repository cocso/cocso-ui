import { Badge } from "@cocso-ui/react";

export default function BadgeShapes() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Badge shape="square">Square</Badge>
      <Badge shape="rounded">Rounded</Badge>
      <Badge shape="circle">1</Badge>
    </div>
  );
}
