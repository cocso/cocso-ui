import { Button } from "@cocso-ui/react";
import { ArrowForwardIcon, PlusIcon } from "@cocso-ui/react-icons";

export default function ButtonPrefixSuffix() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <Button prefix={<PlusIcon size={16} />}>Add item</Button>
      <Button suffix={<ArrowForwardIcon size={16} />}>Continue</Button>
      <Button
        prefix={<PlusIcon size={16} />}
        suffix={<ArrowForwardIcon size={16} />}
      >
        Both
      </Button>
    </div>
  );
}
