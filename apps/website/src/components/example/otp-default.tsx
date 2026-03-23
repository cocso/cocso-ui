"use client";

import { OneTimePasswordField } from "@cocso-ui/react";
import { useState } from "react";

export default function OTPDefault() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white p-6">
      <OneTimePasswordField maxLength={6} onValueChange={setValue} />
      {value && <p className="text-neutral-500 text-sm">Value: {value}</p>}
    </div>
  );
}
