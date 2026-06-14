import { Input } from "@cocso-ui/react";

export default function InputSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Input label="Large" placeholder="Large input" size="large" />
      <Input label="Medium" placeholder="Medium input" size="medium" />
      <Input label="Small" placeholder="Small input" size="small" />
      <Input label="X-Small" placeholder="X-Small input" size="x-small" />
    </div>
  );
}
