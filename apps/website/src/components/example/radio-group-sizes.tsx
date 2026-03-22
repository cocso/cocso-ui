"use client";

import { RadioGroup, Typography } from "@cocso-ui/react";

export default function RadioGroupSizes() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {(["large", "medium", "small"] as const).map((size) => (
        <div key={size}>
          <Typography type="custom" className="mb-2 text-neutral-500" size={12} weight="medium">{size}</Typography>
          <RadioGroup defaultValue="a">
            <RadioGroup.Item size={size} value="a">
              <RadioGroup.Indicator />
              Option A
            </RadioGroup.Item>
            <RadioGroup.Item size={size} value="b">
              <RadioGroup.Indicator />
              Option B
            </RadioGroup.Item>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
