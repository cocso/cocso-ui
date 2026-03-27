import { Select } from "@cocso-ui/react";

export default function SelectSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Select label="Large" size="large">
        <option>Option</option>
      </Select>
      <Select label="Medium" size="medium">
        <option>Option</option>
      </Select>
      <Select label="Small" size="small">
        <option>Option</option>
      </Select>
      <Select label="X-Small" size="x-small">
        <option>Option</option>
      </Select>
    </div>
  );
}
