import { Button } from "@cocso-ui/react";

export default function ButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Button disabled variant="primary">Disabled Primary</Button>
      <Button disabled variant="outline">Disabled Outline</Button>
    </div>
  );
}
