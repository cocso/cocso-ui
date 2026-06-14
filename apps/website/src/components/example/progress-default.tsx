import { Progress } from "@cocso-ui/react";

export default function ProgressDefault() {
  return (
    <div className="flex flex-col gap-3 p-4" style={{ width: 360 }}>
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  );
}
