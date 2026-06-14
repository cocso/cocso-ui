"use client";

import { Button, Dialog } from "@cocso-ui/react";

export default function DialogDefault() {
  return (
    <div className="p-4">
      <Dialog>
        <Dialog.Trigger render={<Button>Open Dialog</Button>} />
        <Dialog.Content>
          <Dialog.Title>Confirm Action</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to proceed? This action cannot be undone.
          </Dialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close
              render={<Button variant="secondary">Cancel</Button>}
            />
            <Dialog.Close render={<Button variant="primary">Confirm</Button>} />
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
