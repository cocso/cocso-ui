import { Badge } from "@cocso-ui/react";

export default function BadgeVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
