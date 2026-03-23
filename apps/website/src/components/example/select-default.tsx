import { Select } from "@cocso-ui/react";

export default function SelectDefault() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Select label="Country">
        <option value="">Select a country</option>
        <option value="kr">South Korea</option>
        <option value="us">United States</option>
        <option value="jp">Japan</option>
      </Select>
    </div>
  );
}
