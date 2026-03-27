import { Button } from "@cocso-ui/react";
import { PlusIcon } from "@cocso-ui/react-icons";

export default function ButtonShapes() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Button shape="square">Square</Button>
      <Button shape="rounded">Rounded</Button>
      <Button shape="circle" svgOnly>
        <PlusIcon size={18} />
      </Button>
    </div>
  );
}
