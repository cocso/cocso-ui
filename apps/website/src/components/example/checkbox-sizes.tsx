"use client";

import { Checkbox } from "@cocso-ui/react";

export default function CheckboxSizes() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Checkbox label="Large checkbox" onChange={() => undefined} size="large" status="on" />
      <Checkbox label="Medium checkbox" onChange={() => undefined} size="medium" status="on" />
      <Checkbox label="Small checkbox" onChange={() => undefined} size="small" status="on" />
    </div>
  );
}
