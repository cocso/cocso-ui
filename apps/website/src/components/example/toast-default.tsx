"use client";

import { Button, toast } from "@cocso-ui/react";

export default function ToastDefault() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      <Button onClick={() => toast("This is a toast message")} variant="primary">
        Show Toast
      </Button>
      <Button onClick={() => toast.success("Operation successful!")} variant="success">
        Success
      </Button>
      <Button onClick={() => toast.error("Something went wrong.")} variant="error">
        Error
      </Button>
    </div>
  );
}
