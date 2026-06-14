import { Button } from "@cocso-ui/react";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Button size="large">Large</Button>
      <Button size="medium">Medium</Button>
      <Button size="small">Small</Button>
      <Button size="x-small">X-Small</Button>
    </div>
  );
}
