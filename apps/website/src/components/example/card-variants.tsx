import { Card } from "@cocso-ui/react";

export default function CardVariants() {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      <Card style={{ width: 200 }} variant="elevated">
        <p className="font-medium">Elevated</p>
        <p className="mt-1 text-neutral-500 text-sm">Raised shadow</p>
      </Card>
      <Card style={{ width: 200 }} variant="outlined">
        <p className="font-medium">Outlined</p>
        <p className="mt-1 text-neutral-500 text-sm">Border only</p>
      </Card>
      <Card style={{ width: 200 }} variant="filled">
        <p className="font-medium">Filled</p>
        <p className="mt-1 text-neutral-500 text-sm">Filled background</p>
      </Card>
    </div>
  );
}
