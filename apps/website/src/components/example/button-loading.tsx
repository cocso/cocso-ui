import { Button } from "@cocso-ui/react";

export default function ButtonLoading() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Button loading variant="primary">
        Loading
      </Button>
      <Button loading variant="secondary">
        Loading
      </Button>
      <Button loading variant="outline">
        Loading
      </Button>
    </div>
  );
}
