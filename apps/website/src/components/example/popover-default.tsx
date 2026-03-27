"use client";

import { Button, Popover, Typography } from "@cocso-ui/react";

export default function PopoverDefault() {
  return (
    <div className="p-4">
      <Popover>
        <Popover.Trigger
          render={<Button variant="secondary">Open Popover</Button>}
        />
        <Popover.Content>
          <div className="flex flex-col gap-2 p-3">
            <Typography size={14} type="custom" weight="semibold">
              Popover Title
            </Typography>
            <Typography size={13} type="custom">
              This is the popover content. It can contain any elements.
            </Typography>
          </div>
          <Popover.Arrow />
        </Popover.Content>
      </Popover>
    </div>
  );
}
