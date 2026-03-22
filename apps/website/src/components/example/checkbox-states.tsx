"use client";

import { Checkbox } from "@cocso-ui/react";

export default function CheckboxStates() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Checkbox label="Checked" onChange={() => undefined} status="on" />
      <Checkbox label="Unchecked" onChange={() => undefined} status="off" />
      <Checkbox label="Intermediate" onChange={() => undefined} status="intermediate" />
      <Checkbox disabled label="Disabled" onChange={() => undefined} status="on" />
    </div>
  );
}
