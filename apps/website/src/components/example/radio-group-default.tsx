"use client";

import { RadioGroup } from "@cocso-ui/react";

export default function RadioGroupDefault() {
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ] as const;

  return (
    <div className="p-4">
      <RadioGroup defaultValue="option1">
        {options.map((option) => {
          const id = `radio-group-default-${option.value}`;

          return (
            <div className="flex items-center gap-2" key={option.value}>
              <RadioGroup.Item id={id} value={option.value}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <label className="cursor-pointer" htmlFor={id}>
                {option.label}
              </label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
