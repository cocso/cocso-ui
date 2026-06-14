"use client";

import { Alert } from "@cocso-ui/react";
import { useState } from "react";

export default function AlertVariants() {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const variants = ["info", "success", "warning", "error"] as const;

  return (
    <div className="flex flex-col gap-3 p-4" style={{ width: 480 }}>
      {variants
        .filter((v) => !dismissed.includes(v))
        .map((variant) => (
          <Alert
            key={variant}
            onClose={() => setDismissed((prev) => [...prev, variant])}
            variant={variant}
          >
            This is a <strong>{variant}</strong> alert message.
          </Alert>
        ))}
      {dismissed.length > 0 && (
        <button
          className="text-neutral-500 text-sm underline"
          onClick={() => setDismissed([])}
          type="button"
        >
          Reset
        </button>
      )}
    </div>
  );
}
