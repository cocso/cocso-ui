"use client";

import { Button, Tooltip } from "@cocso-ui/react";

export default function TooltipPositions() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Tooltip.Provider>
        {(["top", "bottom", "left", "right"] as const).map((side) => (
          <Tooltip key={side}>
            <Tooltip.Trigger render={<Button variant="outline">{side}</Button>} />
            <Tooltip.Content side={side}>
              Tooltip on {side}
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip>
        ))}
      </Tooltip.Provider>
    </div>
  );
}
