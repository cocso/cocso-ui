"use client";

import { Button, Tooltip } from "@cocso-ui/react";

export default function TooltipDefault() {
  return (
    <div className="p-4">
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger render={<Button variant="secondary">Hover me</Button>} />
          <Tooltip.Content>
            This is a tooltip
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>
    </div>
  );
}
