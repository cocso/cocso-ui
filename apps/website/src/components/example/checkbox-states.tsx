"use client";

import { Checkbox } from "@cocso-ui/react";

export default function CheckboxStates() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Checkbox label="Checked" status="on" />
      <Checkbox label="Unchecked" status="off" />
      <Checkbox label="Intermediate" status="intermediate" />
      <Checkbox disabled label="Disabled" status="on" />
    </div>
  );
}
