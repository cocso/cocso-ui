"use client";

import { RadioGroup, Typography } from "@cocso-ui/react";

export default function RadioGroupSizes() {
  const options = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
  ] as const;

  return (
    <div className="flex flex-col gap-6 p-4">
      {(["large", "medium", "small"] as const).map((size) => (
        <div key={size}>
          <Typography
            className="mb-2 text-neutral-500"
            size={12}
            type="custom"
            weight="medium"
          >
            {size}
          </Typography>
          <RadioGroup defaultValue="a">
            {options.map((option) => {
              const id = `radio-group-size-${size}-${option.value}`;

              return (
                <div className="flex items-center gap-2" key={option.value}>
                  <RadioGroup.Item id={id} size={size} value={option.value}>
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
      ))}
    </div>
  );
}
