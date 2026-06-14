"use client";

import { Checkbox } from "@cocso-ui/react";

export default function CheckboxSizes() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Checkbox label="Large checkbox" size="large" status="on" />
      <Checkbox label="Medium checkbox" size="medium" status="on" />
      <Checkbox label="Small checkbox" size="small" status="on" />
    </div>
  );
}
