import { Select } from "@cocso-ui/react";

export default function SelectStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Select description="Choose your preferred option." label="With description">
        <option>Option A</option>
        <option>Option B</option>
      </Select>
      <Select error="Please select an option." label="With error">
        <option value="">Select...</option>
      </Select>
      <Select disabled label="Disabled">
        <option>Cannot change</option>
      </Select>
    </div>
  );
}
