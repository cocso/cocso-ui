"use client";

import { Switch } from "@cocso-ui/react";
import { useState } from "react";

export default function SwitchDefault() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex w-full max-w-80 flex-col gap-4 p-4 [&_label]:whitespace-nowrap">
      <Switch
        checked={checked}
        label="Enable alerts"
        onCheckedChange={setChecked}
      />
    </div>
  );
}
