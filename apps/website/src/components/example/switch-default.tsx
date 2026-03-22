"use client";

import { Switch } from "@cocso-ui/react";
import { useState } from "react";

export default function SwitchDefault() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Switch checked={checked} label="Enable notifications" onCheckedChange={setChecked} />
    </div>
  );
}
