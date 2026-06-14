"use client";

import { Button, Dialog } from "@cocso-ui/react";

export default function DialogSizes() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Dialog>
        <Dialog.Trigger render={<Button variant="secondary">small</Button>} />
        <Dialog.Content size="small">
          <Dialog.Title>Dialog — small</Dialog.Title>
          <Dialog.Description>This is a small dialog.</Dialog.Description>
          <div className="mt-4 flex justify-end">
            <Dialog.Close render={<Button variant="primary">Close</Button>} />
          </div>
        </Dialog.Content>
      </Dialog>
      <Dialog>
        <Dialog.Trigger render={<Button variant="secondary">medium</Button>} />
        <Dialog.Content size="medium">
          <Dialog.Title>Dialog — medium</Dialog.Title>
          <Dialog.Description>This is a medium dialog.</Dialog.Description>
          <div className="mt-4 flex justify-end">
            <Dialog.Close render={<Button variant="primary">Close</Button>} />
          </div>
        </Dialog.Content>
      </Dialog>
      <Dialog>
        <Dialog.Trigger render={<Button variant="secondary">large</Button>} />
        <Dialog.Content size="large">
          <Dialog.Title>Dialog — large</Dialog.Title>
          <Dialog.Description>This is a large dialog.</Dialog.Description>
          <div className="mt-4 flex justify-end">
            <Dialog.Close render={<Button variant="primary">Close</Button>} />
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
