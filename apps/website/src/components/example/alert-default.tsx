import { Alert } from "@cocso-ui/react";

export default function AlertDefault() {
  return (
    <div className="flex flex-col gap-3 p-4" style={{ width: 480 }}>
      <Alert variant="info">Your session will expire in 10 minutes.</Alert>
      <Alert variant="success">Changes saved successfully.</Alert>
      <Alert variant="warning">Your account storage is almost full.</Alert>
      <Alert variant="error">
        Failed to submit the form. Please try again.
      </Alert>
    </div>
  );
}
