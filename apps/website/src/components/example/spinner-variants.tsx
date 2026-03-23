import { Spinner } from "@cocso-ui/react";

export default function SpinnerVariants() {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <Spinner variant="success" />
      <Spinner variant="error" />
      <Spinner variant="warning" />
      <Spinner variant="info" />
      <div className="rounded-lg bg-neutral-900 p-3">
        <Spinner variant="white" />
      </div>
    </div>
  );
}
