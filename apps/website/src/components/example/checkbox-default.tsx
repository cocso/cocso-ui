"use client";

import { Checkbox } from "@cocso-ui/react";
import { useState } from "react";

export default function CheckboxDefault() {
  const [status, setStatus] = useState<"on" | "off" | "intermediate">("off");

  return (
    <div className="flex flex-col gap-4 p-4">
      <Checkbox label="Accept terms and conditions" onChange={setStatus} status={status} />
    </div>
  );
}
