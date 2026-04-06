import { Progress } from "@cocso-ui/react";

export default function ProgressSizes() {
  return (
    <div className="flex flex-col gap-4 p-4" style={{ width: 360 }}>
      <Progress size="sm" value={60} />
      <Progress size="md" value={60} />
      <Progress size="lg" value={60} />
    </div>
  );
}
