"use client";

import { RadioGroup } from "@cocso-ui/react";

export default function RadioGroupDefault() {
  return (
    <div className="p-4">
      <RadioGroup defaultValue="option1">
        <RadioGroup.Item value="option1">
          <RadioGroup.Indicator />
          Option 1
        </RadioGroup.Item>
        <RadioGroup.Item value="option2">
          <RadioGroup.Indicator />
          Option 2
        </RadioGroup.Item>
        <RadioGroup.Item value="option3">
          <RadioGroup.Indicator />
          Option 3
        </RadioGroup.Item>
      </RadioGroup>
    </div>
  );
}
