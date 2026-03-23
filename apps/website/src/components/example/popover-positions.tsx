"use client";

import { Button, Popover, Typography } from "@cocso-ui/react";

export default function PopoverPositions() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Popover key={side}>
          <Popover.Trigger render={<Button variant="outline">{side}</Button>} />
          <Popover.Content side={side}>
            <div className="p-3">
              <Typography type="custom" size={13}>Popover on {side}</Typography>
            </div>
            <Popover.Arrow />
          </Popover.Content>
        </Popover>
      ))}
    </div>
  );
}
