"use client";

import { Button, Popover, Typography } from "@cocso-ui/react";

export default function PopoverDefault() {
  return (
    <div className="p-4">
      <Popover>
        <Popover.Trigger render={<Button variant="secondary">Open Popover</Button>} />
        <Popover.Content>
          <div className="flex flex-col gap-2 p-3">
            <Typography type="custom" size={14} weight="semibold">Popover Title</Typography>
            <Typography type="custom" size={13}>This is the popover content. It can contain any elements.</Typography>
          </div>
          <Popover.Arrow />
        </Popover.Content>
      </Popover>
    </div>
  );
}
