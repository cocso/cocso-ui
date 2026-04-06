import { Progress } from "@cocso-ui/react";

export default function ProgressVariants() {
  return (
    <div className="flex flex-col gap-3 p-4" style={{ width: 360 }}>
      <Progress value={60} variant="primary" />
      <Progress value={60} variant="secondary" />
      <Progress value={60} variant="success" />
      <Progress value={60} variant="danger" />
      <Progress value={60} variant="warning" />
      <Progress value={60} variant="info" />
    </div>
  );
}
