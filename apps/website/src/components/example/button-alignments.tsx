import { Button } from "@cocso-ui/react";

export default function ButtonAlignments() {
  return (
    <div className="flex w-60 flex-col gap-2 p-4">
      <Button className="w-full">Center</Button>
      <Button align="start" className="w-full" shape="sharp" variant="neutral">
        Start
      </Button>
      <Button align="between" className="w-full" suffix="›" variant="outline">
        Between
      </Button>
    </div>
  );
}
